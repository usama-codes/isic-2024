import tensorflowjs as tfjs
from tensorflow import keras
import os

print("Loading Patched Keras model...")
try:
    model = keras.models.load_model("skin_cancer_model_patched.keras")
    
    output_dir = "public/models/model_v1"
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Converting model to {output_dir}...")
    tfjs.converters.save_keras_model(model, output_dir)
    print("Conversion successful.")
except Exception as e:
    print(f"Error during conversion: {e}")
