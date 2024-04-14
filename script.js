const imgLoader = document.getElementById('img-loader');
const uploadedImg = document.getElementById('uploaded-img');
const canvas = document.getElementById('canvas');
const contexto = canvas.getContext('2d');
const imgLoader2 = document.getElementById('img-loader-2');
const uploadedImg2 = document.getElementById('uploaded-img-2');
const canvas2 = document.getElementById('canvas-2');
const contexto2 = canvas2.getContext('2d');
let flipped = false;
let imageDataArray = [];
let imageDataArray2 = [];

imgLoader.addEventListener('change', carregarImagem, false);
imgLoader2.addEventListener('change', carregarSegundaImagem, false);

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

function carregarSegundaImagem(e) {
    const reader = new FileReader();
    reader.onload = function(event){
        const img = new Image();
        img.onload = function(){
            canvas2.width = img.width;
            canvas2.height = img.height;
            contexto2.drawImage(img, 0, 0);
            imageDataArray2 = getImageData(contexto2.getImageData(0, 0, canvas2.width, canvas2.height));
        }
        img.src = event.target.result;
        uploadedImg2.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
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

function limiarizacao() {
    const limiar = parseInt(document.getElementById('limiar').value);
    const largura = canvas.width;
    const altura = canvas.height;
    const imageData = contexto.getImageData(0, 0, largura, altura);
    const dados = imageData.data;

    if (isNaN(limiar) || limiar < 0 || limiar > 255) {
        alert("Insira um valor válido (0 - 255).");
        return;
    }
    for (let i = 0; i < dados.length; i += 4) {
        const cinza = (dados[i] + dados[i + 1] + dados[i + 2]) / 3;

        if (cinza < limiar) {
            dados[i] = dados[i + 1] = dados[i + 2] = 0; 
        } else {
            dados[i] = dados[i + 1] = dados[i + 2] = 255;
        }
    }
    contexto.putImageData(imageData, 0, 0);
}

function equalizarHistograma() {
    const histograma = calcularHistograma(imageDataArray);
    const novoHistograma = equalizar(histograma, imageDataArray.length * imageDataArray[0].length);

    const novaImagemDataArray = [];
    for (let y = 0; y < imageDataArray.length; y++) {
        const newRow = [];
        for (let x = 0; x < imageDataArray[y].length; x++) {
            const cinza = imageDataArray[y][x][0]; 
            const novoTom = novoHistograma[cinza];
            newRow.push([novoTom, novoTom, novoTom, 255]);
        }
        novaImagemDataArray.push(newRow);
    }
    desenharImagem(novaImagemDataArray);
}

function calcularHistograma(imageDataArray) {
    const histograma = new Array(256).fill(0);
    for (let y = 0; y < imageDataArray.length; y++) {
        for (let x = 0; x < imageDataArray[y].length; x++) {
            const cinza = imageDataArray[y][x][0]; 
            histograma[cinza]++;
        }
    }
    return histograma;
}

function equalizar(histograma, totalPixels) {
    const novoHistograma = new Array(256).fill(0);
    let acumulado = 0;
    for (let i = 0; i < histograma.length; i++) {
        acumulado += histograma[i];
        novoHistograma[i] = Math.round((acumulado * 255) / totalPixels);
    }
    return novoHistograma;
}

function equalizarHistograma() {
    const histogramaOriginal = calcularHistograma(imageDataArray);
    const novoHistograma = equalizar(histogramaOriginal, imageDataArray.length * imageDataArray[0].length);

    plotarHistograma(histogramaOriginal, 'originalHistogram');

    const novaImagemDataArray = [];
    for (let y = 0; y < imageDataArray.length; y++) {
        const newRow = [];
        for (let x = 0; x < imageDataArray[y].length; x++) {
            const cinza = imageDataArray[y][x][0];
            const novoTom = novoHistograma[cinza];
            newRow.push([novoTom, novoTom, novoTom, 255]); 
        }
        novaImagemDataArray.push(newRow);
    }

    desenharImagem(novaImagemDataArray);

    const histogramaModificado = calcularHistograma(novaImagemDataArray);
    plotarHistograma(histogramaModificado, 'equalizedHistogram');
}


function plotarHistograma(histogramaData, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    const labels = Array.from({ length: histogramaData.length }, (_, i) => i.toString());
    const data = {
        labels: labels,
        datasets: [{
            label: 'Histograma',
            backgroundColor: 'rgba(0, 0, 255, 0.5)',
            borderColor: 'rgba(0, 0, 255, 1)',
            borderWidth: 1,
            data: histogramaData,
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
    };

    new Chart(ctx, config);
}

function somarImagens() {
    if (imageDataArray.length === 0 || imageDataArray2.length === 0) {
        alert("Carregue ambas as imagens antes de somar.");
        return;
    }

    if (imageDataArray.length !== imageDataArray2.length || imageDataArray[0].length !== imageDataArray2[0].length) {
        alert("As dimensões das imagens são diferentes. As imagens precisam ter as mesmas dimensões para serem somadas.");
        return;
    }

    const largura = Math.min(imageDataArray[0].length, imageDataArray2[0].length);
    const altura = Math.min(imageDataArray.length, imageDataArray2.length);
    const novaImagemDataArray = [];

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            const novaCor = [];
            for (let i = 0; i < 3; i++) {
                let soma = imageDataArray[y][x][i] + imageDataArray2[y][x][i];
                soma = soma > 255 ? 255 : soma;
                novaCor.push(soma);
            }
            novaCor.push(255);
            newRow.push(novaCor);
        }
        novaImagemDataArray.push(newRow);
    }

    desenharImagem(novaImagemDataArray);
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