import zipfile
import json
import os
import shutil

keras_file = 'skin_cancer_model.keras'
patched_keras_file = 'skin_cancer_model_patched.keras'

os.makedirs('temp_keras', exist_ok=True)
with zipfile.ZipFile(keras_file, 'r') as z:
    z.extractall('temp_keras')

config_path = os.path.join('temp_keras', 'config.json')
with open(config_path, 'r') as f:
    config_str = f.read()

config = json.loads(config_str)

def patch_dict(d):
    if not isinstance(d, dict):
        return
    
    # Fix dtype dictionaries to strings
    if 'dtype' in d and isinstance(d['dtype'], dict):
        if d['dtype'].get('class_name') == 'DTypePolicy':
            d['dtype'] = d['dtype']['config']['name']
    
    if d.get('class_name') == 'InputLayer' and 'config' in d:
        c = d['config']
        if 'batch_shape' in c:
            c['batch_input_shape'] = c.pop('batch_shape')
        if 'optional' in c:
            del c['optional']

    if d.get('class_name') == 'Dense' and 'config' in d:
        c = d['config']
        if 'quantization_config' in c:
            del c['quantization_config']

    for k, v in list(d.items()):
        if isinstance(v, dict):
            patch_dict(v)
        elif isinstance(v, list):
            for item in v:
                patch_dict(item)

patch_dict(config)

with open(config_path, 'w') as f:
    json.dump(config, f)

with zipfile.ZipFile(patched_keras_file, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk('temp_keras'):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, 'temp_keras')
            z.write(file_path, arcname)

shutil.rmtree('temp_keras')
print("Patched .keras file created.")
