from flask import Flask, render_template, request, jsonify, send_from_directory
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import os
from datetime import datetime
import json
import io
import base64

app = Flask(__name__)

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = 'static/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Load the model
try:
    model = load_model('models/best_model.h5')
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

def preprocess_input(image):
    """Preprocess the input image for the model"""
    try:
        print("Starting image preprocessing...")
        if isinstance(image, str):
            print("Processing image from file path")
            # Handle file path
            original_image = Image.open(image).convert("L")
        else:
            print("Processing image from bytes")
            # Handle file object or bytes
            original_image = Image.open(io.BytesIO(image)).convert("L")
        
        print(f"Original image size: {original_image.size}")
        
        # Resize and normalize
        resized_image = original_image.resize((28, 28))
        print("Image resized to 28x28")
        
        processed_image = np.array(resized_image) / 255.0
        print(f"Processed image shape: {processed_image.shape}")
        print(f"Processed image min/max: {processed_image.min()}/{processed_image.max()}")
        
        processed_image = processed_image.reshape(1, 28, 28, 1)
        print(f"Final image shape: {processed_image.shape}")
        
        return processed_image
    except Exception as e:
        print(f"Error in preprocessing: {str(e)}")
        return None

def save_uploaded_file(file):
    """Save the uploaded file with a unique name"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"digit_{timestamp}.png"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    return filename

def predict_digit(image):
    """Make prediction on the input image"""
    try:
        processed_image = preprocess_input(image)
        if processed_image is None:
            return None, None
        
        predictions = model.predict(processed_image)
        predicted_label = np.argmax(predictions)
        confidence = float(np.max(predictions))
        return predicted_label, confidence
    except Exception as e:
        print(f"Error making prediction: {e}")
        return None, None

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'image' not in request.files and 'image' not in request.form:
            return render_template('index.html', error="No image provided")
        
        try:
            if 'image' in request.files:
                # Handle file upload
                file = request.files['image']
                if file.filename == '':
                    return render_template('index.html', error="No file selected")
                
                filename = save_uploaded_file(file)
                image_path = os.path.join(UPLOAD_FOLDER, filename)
            else:
                # Handle canvas drawing
                image_data = request.form['image']
                image_data = image_data.split(',')[1]  # Remove data URL prefix
                image_bytes = io.BytesIO(base64.b64decode(image_data))
                filename = f"drawing_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
                image_path = os.path.join(UPLOAD_FOLDER, filename)
                
                # Save the drawing
                with open(image_path, 'wb') as f:
                    f.write(image_bytes.getvalue())
            
            predicted_label, confidence = predict_digit(image_path)
            
            if predicted_label is not None:
                return render_template('index.html', 
                                    predicted_label=predicted_label,
                                    confidence=confidence,
                                    image_path=filename)
            else:
                return render_template('index.html', error="Error processing image")
        except Exception as e:
            return render_template('index.html', error=f"Error: {str(e)}")
    
    return render_template('index.html')

@app.route('/api/predict', methods=['POST'])
def api_predict():
    """API endpoint for predictions"""
    print("Received prediction request")
    
    if 'image' not in request.files and 'image' not in request.form:
        print("No image provided in request")
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        if 'image' in request.files:
            print("Processing file upload")
            # Handle file upload
            file = request.files['image']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            image = file.read()
        else:
            print("Processing canvas drawing")
            # Handle canvas drawing
            image_data = request.form['image']
            print(f"Received image data length: {len(image_data)}")
            image_data = image_data.split(',')[1]  # Remove data URL prefix
            image = base64.b64decode(image_data)
            print(f"Decoded image size: {len(image)} bytes")
        
        print("Making prediction...")
        predicted_label, confidence = predict_digit(image)
        
        if predicted_label is not None:
            print(f"Prediction successful: {predicted_label} with confidence {confidence}")
            return jsonify({
                'prediction': int(predicted_label),
                'confidence': confidence
            })
        else:
            print("Prediction failed - no result returned")
            return jsonify({'error': 'Error processing image'}), 400
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)