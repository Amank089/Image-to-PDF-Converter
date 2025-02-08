let cropper;

document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('imagePreview');
            img.src = e.target.result;
            img.style.display = 'block';

            // Initialize Cropper
            if (cropper) {
                cropper.destroy();
            }
            cropper = new Cropper(img, {
                aspectRatio: NaN,
                viewMode: 1,
            });

            document.getElementById('cropBtn').disabled = false;
            document.getElementById('convertBtn').disabled = false;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('cropBtn').addEventListener('click', function() {
    if (cropper) {
        const canvas = cropper.getCroppedCanvas();
        const img = document.getElementById('imagePreview');
        img.src = canvas.toDataURL();
        cropper.destroy();
    }
});

document.getElementById('convertBtn').addEventListener('click', function() {
    const img = document.getElementById('imagePreview');
    const compressOption = document.getElementById('compressOption').value;

    let quality = 1.0;
    if (compressOption === 'kbToMb') {
        quality = 0.5; // Reduce quality for KB to MB compression
    } else if (compressOption === 'mbToKb') {
        quality = 0.1; // Reduce quality further for MB to KB compression
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const pdf = new jspdf.jsPDF();
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (img.naturalHeight * imgWidth) / img.naturalWidth;

        pdf.addImage(url, 'JPEG', 0, 0, imgWidth, imgHeight);
        pdf.save('converted-image.pdf');
    }, 'image/jpeg', quality);
});