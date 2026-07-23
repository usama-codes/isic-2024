import tensorflow as tf
import numpy as np

print("Loading Keras model...")
model = tf.keras.models.load_model("skin_cancer_model_patched.keras")

# Test 1: Zeros
x_zeros = np.zeros((1, 224, 224, 3), dtype=np.float32)
pred_zeros = model.predict(x_zeros)
print("Zeros [0,0,0]:", pred_zeros)

# Test 2: 255s
x_255 = np.ones((1, 224, 224, 3), dtype=np.float32) * 255.0
pred_255 = model.predict(x_255)
print("255s [255,255,255]:", pred_255)

# Test 3: Normalized
x_norm = np.ones((1, 224, 224, 3), dtype=np.float32) * 1.0
pred_norm = model.predict(x_norm)
print("Normalized [1,1,1]:", pred_norm)

# Test 4: Random [0, 255]
x_rand = np.random.uniform(0, 255, size=(1, 224, 224, 3)).astype(np.float32)
pred_rand = model.predict(x_rand)
print("Random [0, 255]:", pred_rand)

# Test 5: Random [0, 1]
x_rand_norm = np.random.uniform(0, 1, size=(1, 224, 224, 3)).astype(np.float32)
pred_rand_norm = model.predict(x_rand_norm)
print("Random [0, 1]:", pred_rand_norm)
