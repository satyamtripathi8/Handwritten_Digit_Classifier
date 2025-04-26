# Handwritten Digit Classifier

A modern web application for classifying handwritten digits using a Convolutional Neural Network (CNN). This project provides both a user-friendly web interface and a REST API for digit classification.

## Features

- **Modern Web Interface**
  - Responsive design with Bootstrap 5
  - Drag and drop image upload
  - Real-time image preview
  - Animated results display
  - Mobile-friendly interface

- **Advanced Model**
  - CNN architecture with Batch Normalization
  - Data augmentation for better generalization
  - Early stopping and learning rate reduction
  - High accuracy on MNIST dataset

- **API Support**
  - RESTful API endpoint for predictions
  - JSON response format
  - Error handling and status codes

## Requirements

- Python 3.8+
- TensorFlow 2.x
- Flask
- NumPy
- Pillow
- scikit-learn
- joblib

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/handwritten-digit-classifier.git
cd handwritten-digit-classifier
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install the required packages:
```bash
pip install -r requirements.txt
```

## Usage

1. Train the model:
```bash
python Model2.0.py
```

2. Start the web application:
```bash
python app.py
```

3. Open your browser and navigate to `http://localhost:5000`

## API Usage

The application provides a REST API endpoint for predictions:

```bash
curl -X POST -F "image=@path/to/image.png" http://localhost:5000/api/predict
```

Example response:
```json
{
    "prediction": 7,
    "confidence": 0.987654321
}
```

## Project Structure

```
handwritten-digit-classifier/
├── app.py                 # Flask application
├── Model2.0.py           # Model training script
├── model.pkl             # Trained model
├── static/
│   ├── style.css         # Custom styles
│   ├── script.js         # Client-side JavaScript
│   └── uploads/          # Uploaded images
├── templates/
│   └── index.html        # Web interface template
└── README.md             # Project documentation
```

## Model Architecture

The CNN model consists of:
- Two convolutional layers with Batch Normalization
- Max pooling layers
- Dropout for regularization
- Dense layers with ReLU activation
- Softmax output layer

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- MNIST dataset
- TensorFlow and Keras
- Flask web framework
- Bootstrap 5

