import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.datasets import mnist
import matplotlib.pyplot as plt

def test_model():
    # Load the model
    try:
        model = load_model('models/best_model.h5')
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    # Load MNIST test data
    (_, _), (X_test, y_test) = mnist.load_data()
    
    # Preprocess the test data
    X_test = X_test.reshape(-1, 28, 28, 1).astype('float32') / 255.0
    
    # Make predictions on the first 10 test images
    predictions = model.predict(X_test[:10])
    predicted_labels = np.argmax(predictions, axis=1)
    
    # Display the results
    plt.figure(figsize=(15, 5))
    for i in range(10):
        plt.subplot(2, 5, i+1)
        plt.imshow(X_test[i].reshape(28, 28), cmap='gray')
        plt.title(f'True: {y_test[i]}\nPred: {predicted_labels[i]}')
        plt.axis('off')
    
    plt.tight_layout()
    plt.savefig('model_test_results.png')
    print("Test results saved to 'model_test_results.png'")
    
    # Calculate and print accuracy
    test_accuracy = np.mean(predicted_labels == y_test[:10])
    print(f"\nTest accuracy on 10 samples: {test_accuracy:.2%}")

if __name__ == '__main__':
    test_model() 