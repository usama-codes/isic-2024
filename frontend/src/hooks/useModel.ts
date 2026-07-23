"use client";
import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

export function useModel() {
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        // Ensure tfjs is ready and try to use WebGL for hardware acceleration
        await tf.ready();
        if (tf.findBackend('webgl')) {
          await tf.setBackend('webgl');
        }
        
        // Load the graph model from public folder
        const loadedModel = await tf.loadGraphModel("/models/model_v1/model.json");
        setModel(loadedModel);
        setError(null);
      } catch (err: unknown) {
        console.error("Failed to load model", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load model";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    loadModel();
  }, []);

  const predict = async (imageElement: HTMLImageElement): Promise<number | null> => {
    if (!model) return null;

    try {
      // In config_v1.json, size is 224
      const size = 224;

      // Yield to the browser so the CSS loader animation can render and paint
      // before we block the main thread with TFJS synchronous tensor operations
      await new Promise(resolve => setTimeout(resolve, 50));

      const tensor = tf.tidy(() => {
        const imgTensor = tf.browser.fromPixels(imageElement);
        const resized = tf.image.resizeBilinear(imgTensor, [size, size]);
        // Convert RGB to BGR (in case the model was trained with cv2 in Python)
        const rgb = tf.split(resized, 3, -1);
        const bgr = tf.concat([rgb[2], rgb[1], rgb[0]], -1);
        const normalized = bgr.div(tf.scalar(255.0));
        return normalized.expandDims(0);
      });

      const prediction = await model.predict(tensor) as tf.Tensor;
      const data = await prediction.data();
      const probability = data[0];
      
      tensor.dispose();
      prediction.dispose();

      return probability;
    } catch (err) {
      console.error("Prediction error:", err);
      return null;
    }
  };

  return { model, loading, error, predict };
}
