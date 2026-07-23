import sys
import os
# Insert current directory at the front of sys.path to prioritize the local mock 'tensorflow_decision_forests'
sys.path.insert(0, os.path.abspath('.'))

import tensorflowjs as tfjs

print("Starting conversion...")
try:
    tfjs.converters.convert_tf_saved_model(
        "saved_model",
        "public/models/model_v1"
    )
    print("Conversion successful!")
except Exception as e:
    print(f"Error during conversion: {e}")
