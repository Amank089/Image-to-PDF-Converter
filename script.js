let cropper;
let currentImage;

// Drag & Drop Functionality
const dropArea = document.getElementById('dropArea');
const imageUpload = document.getElementById('imageUpload');
const imageGrid = document.getElementById('imageGrid');

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.style.borderColor = '#007bff';
});

dropArea.addEventListener('dragleave', () => {
    dropArea.style.borderColor = '#dddddd';
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.style.borderColor = '#dddddd';
    const files = e.dataTransfer.files;
    handleFiles(files);
});

imageUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    handleFiles(files);
});

function handleFiles(files) {
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.addEventListener('click', () => editImage(img));
            imageGrid.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}

// Image Editing Functions
function editImage(img) {
    currentImage = img;
    if (cropper) cropper.destroy();
    cropper = new Cropper(img, {
        aspectRatio: NaN,
        viewMode: 1,
    });
    document.getElementById('cropBtn').disabled = false;
    document.getElementById('rotateBtn').disabled = false;
}

document.getElementById('cropBtn').addEventListener('click', () => {
    if (cropper) {
        const canvas = cropper.getCroppedCanvas();
        currentImage.src = canvas.toDataURL();
        cropper.destroy();
    }
});

document.getElementById('rotateBtn').addEventListener('click', () => {
    if (cropper) {
        cropper.rotate(90);
    }
});

// Convert to PDF
document.getElementById('convertBtn').addEventListener('click', () => {
    const images = document.querySelectorAll('#imageGrid img');
    const pdf = new jspdf.jsPDF({
        orientation: document.getElementById('pageOrientation').value,
        unit: 'mm',
        format: document.getElementById('pageSize').value,
    });

    images.forEach((img, index) => {
        if (index > 0) pdf.addPage();
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (img.naturalHeight * imgWidth) / img.naturalWidth;
        pdf.addImage(img.src, 'JPEG', 0, 0, imgWidth, imgHeight);
    });

    pdf.save('converted-images.pdf');
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkMode');
darkModeToggle.addEventListener('change', () => {
    document.body.setAttribute('data-theme', darkModeToggle.checked ? 'dark' : 'light');
});
