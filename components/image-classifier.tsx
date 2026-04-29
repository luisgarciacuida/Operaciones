"use client";

import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, Sparkles, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Prediction {
  index: number;
  label: string;
  confidence: number;
}

interface ClassificationResult {
  success: boolean;
  predictions: Prediction[];
  totalClasses: number;
  error?: string;
}

export function ImageClassifier() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    []
  );

  const processFile = (file: File) => {
    setImageFile(file);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    setImageFile(null);
    setResult(null);
    setError(null);
  };

  const classify = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Classification failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-border bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {!image ? (
            <label
              htmlFor="image-upload"
              className={`flex flex-col items-center justify-center h-80 cursor-pointer transition-all ${
                isDragging
                  ? "bg-primary/10 border-primary"
                  : "hover:bg-muted/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4 text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-medium text-foreground">
                    Arrastra tu imagen aqui
                  </p>
                  <p className="text-sm text-muted-foreground">
                    o haz clic para seleccionar
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Soporta: JPG, PNG, WebP
                </p>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={image}
                alt="Preview"
                className="w-full h-80 object-contain bg-black/5 rounded-lg"
                crossOrigin="anonymous"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={clearImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Classify Button */}
      {image && (
        <Button
          size="lg"
          onClick={classify}
          disabled={isLoading}
          className="w-full h-14 text-lg font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Clasificando...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Clasificar imagen
            </>
          )}
        </Button>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-4">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && result.success && (
        <Card className="border-primary/20 bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Resultados de clasificacion
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {result.predictions.map((prediction, index) => (
                <div key={prediction.index} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium ${
                        index === 0
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {prediction.label}
                    </span>
                    <span
                      className={`text-sm font-mono ${
                        index === 0 ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {(prediction.confidence * 100).toFixed(2)}%
                    </span>
                  </div>
                  <Progress
                    value={prediction.confidence * 100}
                    className={`h-2 ${index === 0 ? "" : "opacity-60"}`}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
              Total de clases en el modelo: {result.totalClasses}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
