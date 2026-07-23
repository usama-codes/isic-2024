import tensorflow as tf

print(f"TensorFlow version: {tf.__version__}")
print("Loading Patched Keras model...")
try:
    model = tf.keras.models.load_model("skin_cancer_model_patched.keras")
    print("Exporting to SavedModel format...")
    if hasattr(model, 'export'):
        model.export("saved_model")
    else:
        tf.saved_model.save(model, "saved_model")
    print("Export successful.")
except Exception as e:
    print(f"Error during export: {e}")
