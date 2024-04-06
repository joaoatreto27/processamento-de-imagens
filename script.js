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
            imageDataArray = getImageData(contexto.getImageData(0, 0, canvas.width, canvas.height));
        }
        img.src = event.target.result;
        uploadedImg.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
    flipped = false;      
}

function getImageData(imageData) {
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
    const maisBrilho = document.getElementById('mais-brilho');
    let aumentar = parseInt(maisBrilho.value);

    if (isNaN(aumentar)) {
        aumentar = 20;
    }

    for (let y = 0; y < imageDataArray.length; y++) {
        for (let x = 0; x < imageDataArray[y].length; x++) {
            for (let i = 0; i < 3; i++) {
                imageDataArray[y][x][i] += aumentar;
                if (imageDataArray[y][x][i] > 255) {
                    imageDataArray[y][x][i] = 255;
                }
            }
        }
    }
    desenharImagem(imageDataArray);
}

function diminuirBrilho() {
    const menosBrilho = document.getElementById('menos-brilho');
    let diminuir = parseInt(menosBrilho.value);

    if (isNaN(diminuir)) {
        diminuir = 20;
    }

    for (let y = 0; y < imageDataArray.length; y++) {
        for (let x = 0; x < imageDataArray[y].length; x++) {
            for (let i = 0; i < 3; i++) {
                imageDataArray[y][x][i] -= diminuir;
                if (imageDataArray[y][x][i] < 0) {
                    imageDataArray[y][x][i] = 0;
                }
            }
        }
    }
    desenharImagem(imageDataArray);
}

function aplicarNegativo() {
    for (let y = 0; y < imageDataArray.length; y++) {
        for (let x = 0; x < imageDataArray[y].length; x++) {
            for (let i = 0; i < 3; i++) {
                imageDataArray[y][x][i] = 255 - imageDataArray[y][x][i];
            }
        }
    }
    desenharImagem(imageDataArray);
}

function flipVertical() {
    if(!flipped){
        flipped = true;
        const newData = [];
        for (let y = 0; y < imageDataArray.length; y++) {
            newData.push(imageDataArray[imageDataArray.length - 1 - y]);
        }
        imageDataArray = newData;
        desenharImagem(imageDataArray);
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
        desenharImagem(imageDataArray);
    }
}

function realizarCorte() {
    const startRow = parseInt(document.getElementById('start-row').value);
    const endRow = parseInt(document.getElementById('end-row').value);
    const startCol = parseInt(document.getElementById('start-col').value);
    const endCol = parseInt(document.getElementById('end-col').value);

    if (isNaN(startRow) || isNaN(endRow) || isNaN(startCol) || isNaN(endCol)) {
        alert("Valores inválidos.");
        return;
    }

    if (startRow < 0 || startRow >= imageDataArray.length || endRow < 0 || endRow >= imageDataArray.length ||
        startCol < 0 || startCol >= imageDataArray[0].length || endCol < 0 || endCol >= imageDataArray[0].length) {
        alert("Valores estão fora do intervalo.");
        return;
    }

    const newImageDataArray = [];
    for (let y = startRow; y <= endRow; y++) {
        const newRow = [];
        for (let x = startCol; x <= endCol; x++) {
            newRow.push(imageDataArray[y][x]);
        }
        newImageDataArray.push(newRow);
    }

    imageDataArray = newImageDataArray;
    desenharImagem(imageDataArray);
}

function desenharImagem(array) {
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
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    contexto.putImageData(newImageData, 0, 0);
}