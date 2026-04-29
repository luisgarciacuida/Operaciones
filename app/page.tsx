import { ImageClassifier } from "@/components/image-classifier";
import { Brain, Cpu, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">
              ONNX Classifier
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Cpu className="w-4 h-4" />
            <span>Server-side inference</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
            Clasificacion de imagenes con ONNX
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Sube una imagen para clasificarla usando tu modelo ONNX. La
            inferencia se ejecuta en el servidor para mayor velocidad y
            precision.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">
                Inferencia rapida
              </p>
              <p className="text-xs text-muted-foreground">
                Procesamiento en servidor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">
                Modelo ONNX
              </p>
              <p className="text-xs text-muted-foreground">
                Compatible con cualquier modelo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Top 5</p>
              <p className="text-xs text-muted-foreground">
                Predicciones ordenadas
              </p>
            </div>
          </div>
        </div>

        {/* Classifier Component */}
        <ImageClassifier />

        {/* Instructions */}
        <div className="mt-12 p-6 rounded-xl bg-muted/50 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Como usar
          </h2>
          <ol className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">
                1
              </span>
              <span>
                Coloca tu archivo <code className="text-foreground bg-muted px-1.5 py-0.5 rounded">model.onnx</code> en la carpeta <code className="text-foreground bg-muted px-1.5 py-0.5 rounded">/models</code>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">
                2
              </span>
              <span>
                Opcionalmente, agrega un archivo <code className="text-foreground bg-muted px-1.5 py-0.5 rounded">labels.txt</code> con las etiquetas de clase (una por linea)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">
                3
              </span>
              <span>
                Sube una imagen y haz clic en &quot;Clasificar imagen&quot;
              </span>
            </li>
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Powered by ONNX Runtime
        </div>
      </footer>
    </main>
  );
}
