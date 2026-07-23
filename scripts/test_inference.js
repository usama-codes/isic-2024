const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

async function testModel() {
    console.log("Loading model...");
    const modelUrl = 'file://' + __dirname + '/public/models/model_v1/model.json';
    const model = await tf.loadGraphModel(modelUrl);
    console.log("Model loaded successfully.");

    // Create a dummy tensor of shape [1, 224, 224, 3] with values in [0, 255]
    // 1. All zeros
    const tensorZeros = tf.zeros([1, 224, 224, 3]);
    let predZeros = await model.predict(tensorZeros).data();
    console.log("Prediction for all 0s:", predZeros);

    // 2. All 255s
    const tensor255 = tf.fill([1, 224, 224, 3], 255.0);
    let pred255 = await model.predict(tensor255).data();
    console.log("Prediction for all 255s:", pred255);

    // 3. Random [0, 255]
    const tensorRandom = tf.randomUniform([1, 224, 224, 3], 0, 255);
    let predRandom = await model.predict(tensorRandom).data();
    console.log("Prediction for random [0, 255]:", predRandom);

    // 4. Normalized [0, 1]
    const tensorNorm = tf.randomUniform([1, 224, 224, 3], 0, 1);
    let predNorm = await model.predict(tensorNorm).data();
    console.log("Prediction for random [0, 1]:", predNorm);
}

testModel().catch(console.error);
