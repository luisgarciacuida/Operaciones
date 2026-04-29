import { NextRequest, NextResponse } from "next/server";
import * as ort from "onnxruntime-node";
import sharp from "sharp";
import path from "path";
import fs from "fs";

let session: ort.InferenceSession | null = null;
let labels: string[] = [];

async function getSession() {
  if (session) return session;

  const modelPath = path.join(process.cwd(), "models", "model.onnx");

  if (!fs.existsSync(modelPath)) {
    throw new Error(
      `Model not found at ${modelPath}. Please upload your .onnx file to the /models folder.`
    );
  }

  session = await ort.InferenceSession.create(modelPath);
  return session;
}

function getLabels(): string[] {
  if (labels.length > 0) return labels;

  const labelsPath = path.join(process.cwd(), "models", "labels.txt");

  if (fs.existsSync(labelsPath)) {
    const content = fs.readFileSync(labelsPath, "utf-8");
    labels = content
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
  }

  return labels;
}

async function preprocessImage(
  buffer: Buffer,
  width: number = 224,
  height: number = 224
): Promise<Float32Array> {
  const { data } = await sharp(buffer)
    .resize(width, height)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const float32Data = new Float32Array(3 * width * height);

  // Normalize to [0, 1] and convert to CHW format (channels first)
  for (let c = 0; c < 3; c++) {
    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
        const pixelIndex = (h * width + w) * 3 + c;
        const tensorIndex = c * width * height + h * width + w;
        // Normalize using ImageNet mean and std
        const mean = [0.485, 0.456, 0.406][c];
        const std = [0.229, 0.224, 0.225][c];
        float32Data[tensorIndex] = (data[pixelIndex] / 255 - mean) / std;
      }
    }
  }

  return float32Data;
}

function softmax(arr: Float32Array | number[]): number[] {
  const max = Math.max(...arr);
  const exp = Array.from(arr).map((x) => Math.exp(x - max));
  const sum = exp.reduce((a, b) => a + b, 0);
  return exp.map((x) => x / sum);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Get or create session
    const inferenceSession = await getSession();
    const modelLabels = getLabels();

    // Get input metadata
    const inputName = inferenceSession.inputNames[0];
    const inputMeta = inferenceSession.inputNames;
    console.log("[v0] Model input names:", inputMeta);

    // Preprocess image (default 224x224 for most classification models)
    const imageData = await preprocessImage(buffer);

    // Create input tensor
    const inputTensor = new ort.Tensor("float32", imageData, [1, 3, 224, 224]);

    // Run inference
    const feeds: Record<string, ort.Tensor> = { [inputName]: inputTensor };
    const results = await inferenceSession.run(feeds);

    // Get output
    const outputName = inferenceSession.outputNames[0];
    const outputData = results[outputName].data as Float32Array;

    // Apply softmax to get probabilities
    const probabilities = softmax(outputData);

    // Get top 5 predictions
    const predictions = probabilities
      .map((prob, index) => ({
        index,
        label: modelLabels[index] || `Class ${index}`,
        confidence: prob,
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      predictions,
      totalClasses: probabilities.length,
    });
  } catch (error) {
    console.error("[v0] Classification error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Classification failed",
      },
      { status: 500 }
    );
  }
}
