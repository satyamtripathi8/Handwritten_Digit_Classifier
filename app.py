from flask import Flask, render_template, request
import numpy as np
import joblib
from PIL import Image

app = Flask(__name__)

# Load the model from the.pkl file
model = joblib.load('model.pkl')

def preprocess_input(image_path):
    original_image = Image.open(image_path).convert("L")  # Converting to grayscale
    resized_image = original_image.resize((28, 28))  # Resizing the image into (28, 28)
    processed_image = np.array(resized_image) / 255.0
    processed_image = processed_image.reshape(1, 28, 28, 1)  # Add batch dimension
    return processed_image

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        image_path = request.files['image']
        processed_image = preprocess_input(image_path)
        predictions = model.predict(processed_image)
        predicted_label = np.argmax(predictions)
        return render_template('index.html', predicted_label=predicted_label)
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)