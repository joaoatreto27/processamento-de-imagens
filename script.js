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
        data[i] += 50;
        data[i + 1] += 50;
        data[i + 2] += 50;
    }

    contexto.putImageData(imageData, 0, 0);
}