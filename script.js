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
    desenharImagem(imageDataArray, contexto, canvas);
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
    desenharImagem(imageDataArray, contexto, canvas);
}

function aplicarNegativo() {
    for (let y = 0; y < imageDataArray.length; y++) {
        for (let x = 0; x < imageDataArray[y].length; x++) {
            for (let i = 0; i < 3; i++) {
                imageDataArray[y][x][i] = 255 - imageDataArray[y][x][i];
            }
        }
    }
    desenharImagem(imageDataArray, contexto, canvas);
}

function flipVertical() {
    if(!flipped){
        flipped = true;
        const newData = [];
        for (let y = 0; y < imageDataArray.length; y++) {
            newData.push(imageDataArray[imageDataArray.length - 1 - y]);
        }
        imageDataArray = newData;
        desenharImagem(imageDataArray, contexto, canvas);
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
        desenharImagem(imageDataArray, contexto, canvas);
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
    desenharImagem(imageDataArray, contexto, canvas);
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
    desenharImagem(novaImagemDataArray, contexto, canvas);
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

    desenharImagem(novaImagemDataArray, contexto, canvas);

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

    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function aplicarOperacaoLogica(operacao) {
    const height = imageDataArray.length;
    const width = imageDataArray[0].length;

    if (height !== imageDataArray2.length || width !== imageDataArray2[0].length) {
        alert("As imagens precisam ter as mesmas dimensões para a operação lógica!");
        return;
    }

    const isBinaryImage = imageDataArray.every(row => row.every(pixel => pixel.every(value => value === 0 || value === 255)));
    const isBinaryImage2 = imageDataArray2.every(row => row.every(pixel => pixel.every(value => value === 0 || value === 255)));

    if (!isBinaryImage || !isBinaryImage2) {
        alert("As imagens devem ser binárias para aplicar operações lógicas.");
        return;
    }

    const resultData = [];
    for (let y = 0; y < height; y++) {
        const newRow = [];
        for (let x = 0; x < width; x++) {
            const newPixel = [];
            for (let i = 0; i < 3; i++) {
                let value;
                switch (operacao) {
                    case 'and':
                        value = imageDataArray[y][x][i] & imageDataArray2[y][x][i];
                        break;
                    case 'or':
                        value = imageDataArray[y][x][i] | imageDataArray2[y][x][i];
                        break;
                    case 'not':
                        value = 255 - imageDataArray[y][x][i]; 
                        break;
                    case 'xor':
                        value = imageDataArray[y][x][i] ^ imageDataArray2[y][x][i];
                        break;
                }
                newPixel.push(value);
            }
            newRow.push(newPixel);
        }
        resultData.push(newRow);
    }

    desenharImagem(resultData, contexto, canvas);
}

function combinacaoLinear() {
    if (imageDataArray.length === 0 || imageDataArray2.length === 0) {
        alert("Carregue ambas as imagens antes de combinar.");
        return;
    }

    if (imageDataArray.length !== imageDataArray2.length || imageDataArray[0].length !== imageDataArray2[0].length) {
        alert("As dimensões das imagens são diferentes. As imagens precisam ter as mesmas dimensões para serem combinadas.");
        return;
    }

    const largura = Math.min(imageDataArray[0].length, imageDataArray2[0].length);
    const altura = Math.min(imageDataArray.length, imageDataArray2.length);
    const novaImagemDataArray = [];

    const alpha = parseFloat(prompt("Insira o valor:"));

    if (isNaN(alpha) || alpha < 0 || alpha > 1) {
        alert("Insira um valor válido (entre 0 e 1).");
        return;
    }

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            const novaCor = [];
            for (let i = 0; i < 3; i++) {
                let valor = Math.round(alpha * imageDataArray[y][x][i] + (1 - alpha) * imageDataArray2[y][x][i]);
                valor = valor > 255 ? 255 : valor;
                novaCor.push(valor);
            }
            novaCor.push(255);
            newRow.push(novaCor);
        }
        novaImagemDataArray.push(newRow);
    }

    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function concatenarImagens() {
    if (imageDataArray.length === 0 || imageDataArray2.length === 0) {
        alert("Carregue ambas as imagens antes de concatenar.");
        return;
    }

    if (imageDataArray.length !== imageDataArray2.length || imageDataArray[0].length !== imageDataArray2[0].length) {
        alert("As dimensões das imagens são diferentes. As imagens precisam ter as mesmas dimensões para serem combinadas.");
        return;
    }

    const linhas = parseInt(prompt("Digite o número de linhas para a concatenação:"));
    const colunas = parseInt(prompt("Digite o número de colunas para a concatenação:"));

    if (isNaN(linhas) || isNaN(colunas) || linhas <= 0 || colunas <= 0) {
        alert("Por favor, insira um número válido de linhas e colunas.");
        return;
    }

    const alturaMaxima = Math.max(imageDataArray.length, imageDataArray2.length);
    const larguraMaxima = imageDataArray[0].length + imageDataArray2[0].length;

    const alturaResultado = alturaMaxima * linhas;
    const larguraResultado = larguraMaxima * colunas;

    canvas.width = larguraResultado;
    canvas.height = alturaResultado;

    const novaImagemDataArray = [];

    for (let y = 0; y < alturaResultado; y++) {
        const newRow = [];
        for (let x = 0; x < larguraResultado; x++) {
            newRow.push([0, 0, 0, 0]);
        }
        novaImagemDataArray.push(newRow);
    }

    for (let y = 0; y < imageDataArray.length; y++) {
        for (let x = 0; x < imageDataArray[y].length; x++) {
            for (let linha = 0; linha < linhas; linha++) {
                for (let coluna = 0; coluna < colunas; coluna++) {
                    novaImagemDataArray[y + (linha * alturaMaxima)][x + (coluna * larguraMaxima)] = imageDataArray[y][x];
                }
            }
        }
    }

    for (let y = 0; y < imageDataArray2.length; y++) {
        for (let x = 0; x < imageDataArray2[y].length; x++) {
            for (let linha = 0; linha < linhas; linha++) {
                for (let coluna = 0; coluna < colunas; coluna++) {
                    novaImagemDataArray[y + (linha * alturaMaxima)][x + (coluna * larguraMaxima) + imageDataArray[0].length] = imageDataArray2[y][x];
                }
            }
        }
    }

    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function filtragemMinima() {
    const altura = imageDataArray.length;
    const largura = imageDataArray[0].length;
    const novaImagemDataArray = [];

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            let minimo = imageDataArray[y][x].slice(0, 3);
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const pixelX = x + j;
                    const pixelY = y + i;
                    if (pixelX >= 0 && pixelX < largura && pixelY >= 0 && pixelY < altura) {
                        for (let k = 0; k < 3; k++) {
                            minimo[k] = Math.min(minimo[k], imageDataArray[pixelY][pixelX][k]);
                        }
                    }
                }
            }
            newRow.push([...minimo, 255]);
        }
        novaImagemDataArray.push(newRow);
    }
    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function filtragemMaxima() {
    const altura = imageDataArray.length;
    const largura = imageDataArray[0].length;
    const novaImagemDataArray = [];

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            let maximo = imageDataArray[y][x].slice(0, 3);
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const pixelX = x + j;
                    const pixelY = y + i;
                    if (pixelX >= 0 && pixelX < largura && pixelY >= 0 && pixelY < altura) {
                        for (let k = 0; k < 3; k++) {
                            maximo[k] = Math.max(maximo[k], imageDataArray[pixelY][pixelX][k]);
                        }
                    }
                }
            }
            newRow.push([...maximo, 255]);
        }
        novaImagemDataArray.push(newRow);
    }

    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function filtragemMedia() {
    const altura = imageDataArray.length;
    const largura = imageDataArray[0].length;
    const novaImagemDataArray = [];

    const filtro = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    const filtroSoma = 9;

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            let soma = [0, 0, 0];

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const pixelX = x + j;
                    const pixelY = y + i;
                    if (pixelX >= 0 && pixelX < largura && pixelY >= 0 && pixelY < altura) {
                        for (let k = 0; k < 3; k++) {
                            soma[k] += imageDataArray[pixelY][pixelX][k] * filtro[i + 1][j + 1];
                        }
                    }
                }
            }
            const media = soma.map(v => v / filtroSoma);
            newRow.push([...media, 255]);
        }
        novaImagemDataArray.push(newRow);
    }

    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function filtragemMediana() {
    const altura = imageDataArray.length;
    const largura = imageDataArray[0].length;
    const novaImagemDataArray = [];

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            const vizinhos = [[], [], []]; 

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const pixelX = x + j;
                    const pixelY = y + i;
                    if (pixelX >= 0 && pixelX < largura && pixelY >= 0 && pixelY < altura) {
                        for (let k = 0; k < 3; k++) {
                            vizinhos[k].push(imageDataArray[pixelY][pixelX][k]);
                        }
                    }
                }
            }
            const medianas = vizinhos.map(channel => {
                channel.sort((a, b) => a - b);
                return channel[Math.floor(channel.length / 2)];
            });
            newRow.push([...medianas, 255]);
        }
        novaImagemDataArray.push(newRow);
    }
    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function aplicarFiltragemPorOrdem() {
    const ordemInput = document.getElementById("ordemInput").value;
    const ordem = parseInt(ordemInput, 10);

    if (isNaN(ordem) || ordem < 0 || ordem > 8) {
        alert("Insira um valor válido para a ordem (entre 0 e 8).");
        return;
    }
    filtragemPorOrdem(ordem);
}

function filtragemPorOrdem(ordem) {
    const altura = imageDataArray.length;
    const largura = imageDataArray[0].length;
    const novaImagemDataArray = [];

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            const vizinhos = [[], [], []];
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const pixelX = x + j;
                    const pixelY = y + i;
                    if (pixelX >= 0 && pixelX < largura && pixelY >= 0 && pixelY < altura) {
                        for (let k = 0; k < 3; k++) {
                            vizinhos[k].push(imageDataArray[pixelY][pixelX][k]);
                        }
                    }
                }
            }
            const resultado = vizinhos.map(channel => {
                channel.sort((a, b) => a - b);
                return channel[Math.max(0, Math.min(ordem, channel.length - 1))];
            });

            newRow.push([...resultado, 255]);
        }
        novaImagemDataArray.push(newRow);
    }
    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function suavizacaoConservativa() {
    const altura = imageDataArray.length;
    const largura = imageDataArray[0].length;
    const novaImagemDataArray = [];

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            const vizinhos = [[], [], []];

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const pixelX = x + j;
                    const pixelY = y + i;
                    if (pixelX >= 0 && pixelX < largura && pixelY >= 0 && pixelY < altura) {
                        for (let k = 0; k < 3; k++) {
                            vizinhos[k].push(imageDataArray[pixelY][pixelX][k]);
                        }
                    }
                }
            }
            const minValores = vizinhos.map(channel => Math.min(...channel));
            const maxValores = vizinhos.map(channel => Math.max(...channel));

            const novoPixel = [];
            for (let k = 0; k < 3; k++) {
                const valorAtual = imageDataArray[y][x][k];
                const novoValor = Math.min(Math.max(valorAtual, minValores[k]), maxValores[k]);
                novoPixel.push(novoValor);
            }
            newRow.push([...novoPixel, 255]);
        }
        novaImagemDataArray.push(newRow);
    }

    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function criarKernelGaussiano(tamanho, sigma) {
    const kernel = [];
    const meio = Math.floor(tamanho / 2);
    const fator = 1 / (2 * Math.PI * sigma * sigma);
    let soma = 0;

    for (let y = -meio; y <= meio; y++) {
        const linha = [];
        for (let x = -meio; x <= meio; x++) {
            const valor = fator * Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
            linha.push(valor);
            soma += valor;
        }
        kernel.push(linha);
    }
    for (let y = 0; y < tamanho; y++) {
        for (let x = 0; x < tamanho; x++) {
            kernel[y][x] /= soma;
        }
    }
    return kernel;
}

function filtroGaussiano() {
    const tamanhoKernel = 5;
    const sigma = 1.0;
    const kernel = criarKernelGaussiano(tamanhoKernel, sigma);
    const meio = Math.floor(tamanhoKernel / 2);
    const altura = imageDataArray.length;
    const largura = imageDataArray[0].length;
    const novaImagemDataArray = [];

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            const somaPixel = [0, 0, 0];

            for (let ky = -meio; ky <= meio; ky++) {
                for (let kx = -meio; kx <= meio; kx++) {
                    const pixelY = y + ky;
                    const pixelX = x + kx;

                    if (pixelX >= 0 && pixelX < largura && pixelY >= 0 && pixelY < altura) {
                        const peso = kernel[ky + meio][kx + meio];
                        const pixel = imageDataArray[pixelY][pixelX];

                        somaPixel[0] += pixel[0] * peso;
                        somaPixel[1] += pixel[1] * peso;
                        somaPixel[2] += pixel[2] * peso;
                    }
                }
            }
            const novoPixel = [
                Math.min(255, Math.max(0, Math.round(somaPixel[0]))),
                Math.min(255, Math.max(0, Math.round(somaPixel[1]))),
                Math.min(255, Math.max(0, Math.round(somaPixel[2]))),
                255
            ];

            newRow.push(novoPixel);
        }
        novaImagemDataArray.push(newRow);
    }
    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function filtroPrewitt() {
    const altura = imageDataArray.length;
    const largura = imageDataArray[0].length;
    const novaImagemDataArray = [];

    const mascaraPrewittX = [
        [1, 0, -1],
        [1, 0, -1],
        [1, 0, -1]
    ];

    const mascaraPrewittY = [
        [1, 1, 1],
        [0, 0, 0],
        [-1, -1, -1]
    ];

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            let somaX = 0;
            let somaY = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixelY = y + ky;
                    const pixelX = x + kx;

                    if (pixelX >= 0 && pixelX < largura && pixelY >= 0 && pixelY < altura) {
                        const pixel = imageDataArray[pixelY][pixelX];
                        const intensidade = (pixel[0] + pixel[1] + pixel[2]) / 3;

                        somaX += intensidade * mascaraPrewittX[ky + 1][kx + 1];
                        somaY += intensidade * mascaraPrewittY[ky + 1][kx + 1];
                    }
                }
            }
            const magnitude = Math.sqrt(somaX * somaX + somaY * somaY);
            const novoPixel = [
                Math.min(255, Math.max(0, Math.round(magnitude))),
                Math.min(255, Math.max(0, Math.round(magnitude))),
                Math.min(255, Math.max(0, Math.round(magnitude))),
                255
            ];

            newRow.push(novoPixel);
        }
        novaImagemDataArray.push(newRow);
    }
    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function filtroSobel() {
    const altura = imageDataArray.length;
    const largura = imageDataArray[0].length;
    const novaImagemDataArray = [];

    const mascaraSobelX = [
        [1, 0, -1],
        [2, 0, -2],
        [1, 0, -1]
    ];

    const mascaraSobelY = [
        [1, 2, 1],
        [0, 0, 0],
        [-1, -2, -1]
    ];

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            let somaX = 0;
            let somaY = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixelY = y + ky;
                    const pixelX = x + kx;

                    if (pixelX >= 0 && pixelX < largura && pixelY >= 0 && pixelY < altura) {
                        const pixel = imageDataArray[pixelY][pixelX];
                        const intensidade = (pixel[0] + pixel[1] + pixel[2]) / 3;

                        somaX += intensidade * mascaraSobelX[ky + 1][kx + 1];
                        somaY += intensidade * mascaraSobelY[ky + 1][kx + 1];
                    }
                }
            }

            const magnitude = Math.sqrt(somaX * somaX + somaY * somaY);
            const novoPixel = [
                Math.min(255, Math.max(0, Math.round(magnitude))),
                Math.min(255, Math.max(0, Math.round(magnitude))),
                Math.min(255, Math.max(0, Math.round(magnitude))),
                255
            ];

            newRow.push(novoPixel);
        }
        novaImagemDataArray.push(newRow);
    }
    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function filtroLaplaciano() {
    const altura = imageDataArray.length;
    const largura = imageDataArray[0].length;
    const novaImagemDataArray = [];

    const mascaraLaplaciana = [
        [0, -1, 0],
        [-1, 4, -1],
        [0, -1, 0]
    ];

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            let soma = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixelY = y + ky;
                    const pixelX = x + kx;

                    if (pixelX >= 0 && pixelX < largura && pixelY >= 0 && pixelY < altura) {
                        const pixel = imageDataArray[pixelY][pixelX];
                        const intensidade = (pixel[0] + pixel[1] + pixel[2]) / 3;

                        soma += intensidade * mascaraLaplaciana[ky + 1][kx + 1];
                    }
                }
            }
            const intensidadeNormalizada = Math.min(255, Math.max(0, Math.round((soma + 255) / 2)));
            const novoPixel = [
                intensidadeNormalizada,
                intensidadeNormalizada,
                intensidadeNormalizada,
                255
            ];

            newRow.push(novoPixel);
        }
        novaImagemDataArray.push(newRow);
    }
    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function dilatacao() {
    const altura = imageDataArray.length;
    const largura = imageDataArray[0].length;
    const novaImagemDataArray = [];

    const elementoEstruturante = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    const tamanhoMascara = elementoEstruturante.length;
    const offset = Math.floor(tamanhoMascara / 2);

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            let maxValor = 0;

            for (let ky = -offset; ky <= offset; ky++) {
                for (let kx = -offset; kx <= offset; kx++) {
                    const pixelY = y + ky;
                    const pixelX = x + kx;

                    if (pixelX >= 0 && pixelX < largura && pixelY >= 0 && pixelY < altura) {
                        const pixel = imageDataArray[pixelY][pixelX];
                        const intensidade = (pixel[0] + pixel[1] + pixel[2]) / 3;

                        if (elementoEstruturante[ky + offset][kx + offset] === 1) {
                            maxValor = Math.max(maxValor, intensidade);
                        }
                    }
                }
            }

            const novoPixel = [
                maxValor,
                maxValor,
                maxValor,
                255
            ];

            newRow.push(novoPixel);
        }
        novaImagemDataArray.push(newRow);
    }
    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function erosao() {
    const altura = imageDataArray.length;
    const largura = imageDataArray[0].length;
    const novaImagemDataArray = [];

    const elementoEstruturante = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    const tamanhoMascara = elementoEstruturante.length;
    const offset = Math.floor(tamanhoMascara / 2);

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            let minValor = 255;

            for (let ky = -offset; ky <= offset; ky++) {
                for (let kx = -offset; kx <= offset; kx++) {
                    const pixelY = y + ky;
                    const pixelX = x + kx;

                    if (pixelX >= 0 && pixelX < largura && pixelY >= 0 && pixelY < altura) {
                        const pixel = imageDataArray[pixelY][pixelX];
                        const intensidade = (pixel[0] + pixel[1] + pixel[2]) / 3;

                        if (elementoEstruturante[ky + offset][kx + offset] === 1) {
                            minValor = Math.min(minValor, intensidade);
                        }
                    }
                }
            }

            const novoPixel = [
                minValor,
                minValor,
                minValor,
                255
            ];

            newRow.push(novoPixel);
        }
        novaImagemDataArray.push(newRow);
    }
    desenharImagem(novaImagemDataArray, contexto, canvas);
}

function abertura() {
    const imagemErosao = aplicarErosao(imageDataArray);
    const imagemAbertura = aplicarDilatacao(imagemErosao);

    desenharImagem(imagemAbertura, contexto, canvas);
}

function aplicarErosao(dataArray) {
    const altura = dataArray.length;
    const largura = dataArray[0].length;
    const novaImagemDataArray = [];

    const elementoEstruturante = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    const tamanhoMascara = elementoEstruturante.length;
    const offset = Math.floor(tamanhoMascara / 2);

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            let minValor = 255;

            for (let ky = -offset; ky <= offset; ky++) {
                for (let kx = -offset; kx <= offset; kx++) {
                    const pixelY = y + ky;
                    const pixelX = x + kx;

                    if (pixelX >= 0 && pixelX < largura && pixelY >= 0 && pixelY < altura) {
                        const pixel = dataArray[pixelY][pixelX];
                        const intensidade = (pixel[0] + pixel[1] + pixel[2]) / 3;

                        if (elementoEstruturante[ky + offset][kx + offset] === 1) {
                            minValor = Math.min(minValor, intensidade);
                        }
                    }
                }
            }

            const novoPixel = [
                minValor,
                minValor,
                minValor,
                255
            ];

            newRow.push(novoPixel);
        }
        novaImagemDataArray.push(newRow);
    }

    return novaImagemDataArray;
}

function aplicarDilatacao(dataArray) {
    const altura = dataArray.length;
    const largura = dataArray[0].length;
    const novaImagemDataArray = [];

    const elementoEstruturante = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    const tamanhoMascara = elementoEstruturante.length;
    const offset = Math.floor(tamanhoMascara / 2);

    for (let y = 0; y < altura; y++) {
        const newRow = [];
        for (let x = 0; x < largura; x++) {
            let maxValor = 0;

            for (let ky = -offset; ky <= offset; ky++) {
                for (let kx = -offset; kx <= offset; kx++) {
                    const pixelY = y + ky;
                    const pixelX = x + kx;

                    if (pixelX >= 0 && pixelX < largura && pixelY >= 0 && pixelY < altura) {
                        const pixel = dataArray[pixelY][pixelX];
                        const intensidade = (pixel[0] + pixel[1] + pixel[2]) / 3;

                        if (elementoEstruturante[ky + offset][kx + offset] === 1) {
                            maxValor = Math.max(maxValor, intensidade);
                        }
                    }
                }
            }

            const novoPixel = [
                maxValor,
                maxValor,
                maxValor,
                255
            ];

            newRow.push(novoPixel);
        }
        novaImagemDataArray.push(newRow);
    }

    return novaImagemDataArray;
}

function desenharImagem(array, contexto, canvas) {
    const newImageData = contexto.createImageData(array[0].length, array.length);
    for (let y = 0; y < array.length; y++) {
        for (let x = 0; x < array[y].length; x++) {
            const offset = (y * array[y].length + x) * 4;
            newImageData.data[offset] = array[y][x][0];
            newImageData.data[offset + 1] = array[y][x][1];
            newImageData.data[offset + 2] = array[y][x][2];
            newImageData.data[offset + 3] = 255;
        }
    }
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    contexto.putImageData(newImageData, 0, 0);
}