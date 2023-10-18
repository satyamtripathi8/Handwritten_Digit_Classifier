# Handwritten Digit Classification with Convolutional Neural Networks

This project implements a Convolutional Neural Network (CNN) to classify handwritten digits (0 to 9) using the popular MNIST dataset. The CNN architecture is built using TensorFlow/Keras and achieves accurate digit recognition through a series of convolutional and pooling layers.

## Features

- **Data Loading:** Utilizes Pandas to load handwritten digit data from CSV files.
- **Data Preprocessing:** Reshapes and normalizes the data, preparing it for CNN input.
- **Convolutional Neural Network (CNN):** Implements a CNN model using TensorFlow/Keras layers.
- **Model Training:** Trains the CNN model on the MNIST dataset for handwritten digit recognition.
- **Model Evaluation:** Evaluates the trained model's accuracy on a validation dataset.
- **Prediction:** Provides a function to make predictions on new handwritten digit images.

## Requirements

- Python 3.x
- Pandas
- TensorFlow/Keras
- scikit-learn

## Project Structure

- **`main.py`**: Main Python file containing the code for data loading, preprocessing, model creation, training, evaluation, and prediction.
- **`data/`**: Directory containing the CSV files with the training and testing data.
- **`models/`**: Directory to store saved trained models.


## Acknowledgements

- **MNIST Dataset:** The MNIST dataset used in this project is publicly available and widely used for handwritten digit recognition tasks. More information can be found [here](http://yann.lecun.com/exdb/mnist/).

