document.addEventListener('DOMContentLoaded', function() {
    // Canvas drawing functionality
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const clearCanvas = document.getElementById('clearCanvas');
    const predictDrawing = document.getElementById('predictDrawing');
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('image');
    const resultDiv = document.querySelector('.result');

    // Canvas setup
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Drawing event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
    }

    function draw(e) {
        if (!isDrawing) return;
        const [x, y] = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x, y];
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }

    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return [x, y];
    }

    clearCanvas.addEventListener('click', function() {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (resultDiv) {
            resultDiv.innerHTML = '';
        }
    });

    predictDrawing.addEventListener('click', function() {
        // Convert canvas to base64 image
        const imageData = canvas.toDataURL('image/png');
        console.log("Canvas data prepared:", imageData.substring(0, 50) + "...");
        
        // Show loading state
        const resultDiv = document.querySelector('.result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="alert alert-info">
                    <h4 class="alert-heading">Processing...</h4>
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `;
        }

        // Send prediction request
        fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `image=${encodeURIComponent(imageData)}`
        })
        .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Received prediction data:", data);
            if (data.error) {
                throw new Error(data.error);
            }
            if (resultDiv) {
                resultDiv.innerHTML = `
                    <div class="alert alert-success">
                        <h4 class="alert-heading">Prediction Result</h4>
                        <p>Predicted Digit: <strong>${data.prediction}</strong></p>
                        <p>Confidence: <strong>${(data.confidence * 100).toFixed(2)}%</strong></p>
                    </div>
                `;
                resultDiv.classList.add('fade-in');
                setTimeout(() => {
                    resultDiv.classList.remove('fade-in');
                }, 500);
            }
        })
        .catch(error => {
            console.error("Error details:", error);
            if (resultDiv) {
                resultDiv.innerHTML = `
                    <div class="alert alert-danger">
                        <h4 class="alert-heading">Error</h4>
                        <p>${error.message || 'An error occurred while processing your request. Please try again.'}</p>
                    </div>
                `;
            }
        });
    });

    // File upload functionality
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (resultDiv) {
                    resultDiv.innerHTML = `
                        <div class="alert alert-info">
                            <h4 class="alert-heading">Preview</h4>
                            <img src="${e.target.result}" 
                                 alt="Preview" 
                                 class="img-fluid mt-3"
                                 style="max-height: 200px;">
                        </div>
                    `;
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(uploadForm);
        
        // Show loading state
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="alert alert-info">
                    <h4 class="alert-heading">Processing...</h4>
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `;
        }

        // Submit form
        fetch('/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(html => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const newResult = tempDiv.querySelector('.result');
            if (newResult && resultDiv) {
                resultDiv.innerHTML = newResult.innerHTML;
                resultDiv.classList.add('fade-in');
                setTimeout(() => {
                    resultDiv.classList.remove('fade-in');
                }, 500);
            }
        })
        .catch(error => {
            if (resultDiv) {
                resultDiv.innerHTML = `
                    <div class="alert alert-danger">
                        <h4 class="alert-heading">Error</h4>
                        <p>An error occurred while processing your request. Please try again.</p>
                    </div>
                `;
            }
            console.error('Error:', error);
        });
    });

    // Add drag and drop functionality
    const dropZone = document.querySelector('.card-body');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('highlight');
    }

    function unhighlight(e) {
        dropZone.classList.remove('highlight');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        fileInput.files = files;
        
        // Trigger the change event to show preview
        const event = new Event('change');
        fileInput.dispatchEvent(event);
    }
});