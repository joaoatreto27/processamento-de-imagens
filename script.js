const imgLoader = document.getElementById('img-loader');
const uploadedImg = document.getElementById('uploaded-img');
const canvas = document.getElementById('canvas');
const contexto = canvas.getContext('2d');

imgLoader.addEventListener('change', carregarImagem, false);

function carregarImagem(e) {
    const reader = new FileReader();
    reader.onload = function(event){
        const img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            contexto.drawImage(img,0,0);
        }
        img.src = event.target.result;
        uploadedImg.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

function aumentarBrilho() {
    const imageData = contexto.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] += 20;
        data[i + 1] += 20;
        data[i + 2] += 20;
    }

    contexto.putImageData(imageData, 0, 0);
}

function diminuirBrilho() {
    const imageData = contexto.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] -= 20;
        data[i + 1] -= 20;
        data[i + 2] -= 20;
    }
    contexto.putImageData(imageData, 0, 0);
}

function aplicarNegativo() {
    const imageData = contexto.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
    contexto.putImageData(imageData, 0, 0);
}

function flipVertical() {
    const imageData = contexto.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data.length);
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const verticalIndex = ((canvas.height - 1 - y) * canvas.width + x) * 4;
            const verticalOffset = (y * canvas.width + x) * 4;
            newData[verticalOffset] = data[verticalIndex];
            newData[verticalOffset + 1] = data[verticalIndex + 1];
            newData[verticalOffset + 2] = data[verticalIndex + 2];
            newData[verticalOffset + 3] = data[verticalIndex + 3];
        }
    }
    contexto.putImageData(new ImageData(newData, canvas.width, canvas.height), 0, 0);
}

function flipHorizontal() {
    const imageData = contexto.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const newData = new Uint8ClampedArray(data.length);
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const horizontalIndex = (y * canvas.width + (canvas.width - 1 - x)) * 4;
            const horizontalOffset = (y * canvas.width + x) * 4;
            newData[horizontalOffset] = data[horizontalIndex];
            newData[horizontalOffset + 1] = data[horizontalIndex + 1];
            newData[horizontalOffset + 2] = data[horizontalIndex + 2];
            newData[horizontalOffset + 3] = data[horizontalIndex + 3];
        }
    }
    contexto.putImageData(new ImageData(newData, canvas.width, canvas.height), 0, 0);
}