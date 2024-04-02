const imgLoader = document.getElementById('img-loader');
const uploadedImg = document.getElementById('uploaded-img');
const canvas = document.getElementById('canvas');
const contexto = canvas.getContext('2d');
let flipped = false;
let imageDataArray = [];

imgLoader.addEventListener('change', carregarImagem, false);

function carregarImagem(e) {
    const reader = new FileReader();
    reader.onload = function(event){
        const img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            contexto.drawImage(img,0,0);
            imageDataArray = getImageDataAsArray(contexto.getImageData(0, 0, canvas.width, canvas.height));
        }
        img.src = event.target.result;
        uploadedImg.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
    flipped = false;      
}

function getImageDataAsArray(imageData) {
    const data = imageData.data;
    const array = [];
    for (let y = 0; y < imageData.height; y++) {
        const row = [];
        for (let x = 0; x < imageData.width; x++) {
            const offset = (y * imageData.width + x) * 4;
            row.push([data[offset], data[offset + 1], data[offset + 2], data[offset + 3]]);
        }
        array.push(row);
    }
    return array;
}

function aumentarBrilho() {
    for (let y = 0; y < imageDataArray.length; y++) {
        for (let x = 0; x < imageDataArray[y].length; x++) {
            for (let i = 0; i < 3; i++) {
                imageDataArray[y][x][i] += 20;
                if (imageDataArray[y][x][i] > 255) {
                    imageDataArray[y][x][i] = 255;
                }
            }
        }
    }
    desenharImagemFromArray(imageDataArray);
}

function diminuirBrilho() {
    for (let y = 0; y < imageDataArray.length; y++) {
        for (let x = 0; x < imageDataArray[y].length; x++) {
            for (let i = 0; i < 3; i++) {
                imageDataArray[y][x][i] -= 20;
                if (imageDataArray[y][x][i] < 0) {
                    imageDataArray[y][x][i] = 0;
                }
            }
        }
    }
    desenharImagemFromArray(imageDataArray);
}

function aplicarNegativo() {
    for (let y = 0; y < imageDataArray.length; y++) {
        for (let x = 0; x < imageDataArray[y].length; x++) {
            for (let i = 0; i < 3; i++) {
                imageDataArray[y][x][i] = 255 - imageDataArray[y][x][i];
            }
        }
    }
    desenharImagemFromArray(imageDataArray);
}

function flipVertical() {
    if(!flipped){
        flipped = true;
        const newData = [];
        for (let y = 0; y < imageDataArray.length; y++) {
            newData.push(imageDataArray[imageDataArray.length - 1 - y]);
        }
        imageDataArray = newData;
        desenharImagemFromArray(imageDataArray);
    }
}

function flipHorizontal() {
    if(!flipped) {
        flipped = true;
        const newData = [];
        for (let y = 0; y < imageDataArray.length; y++) {
            const newRow = [];
            for (let x = 0; x < imageDataArray[y].length; x++) {
                newRow.unshift(imageDataArray[y][x]);
            }
            newData.push(newRow);
        }
        imageDataArray = newData;
        desenharImagemFromArray(imageDataArray);
    }
}

function desenharImagemFromArray(array) {
    const newImageData = contexto.createImageData(array[0].length, array.length);
    for (let y = 0; y < array.length; y++) {
        for (let x = 0; x < array[y].length; x++) {
            const offset = (y * array[y].length + x) * 4;
            newImageData.data[offset] = array[y][x][0];
            newImageData.data[offset + 1] = array[y][x][1];
            newImageData.data[offset + 2] = array[y][x][2];
            newImageData.data[offset + 3] = array[y][x][3];
        }
    }
    contexto.putImageData(newImageData, 0, 0);
}