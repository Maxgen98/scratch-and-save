document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Charger l'image cachée sous le grattage
    const hiddenImage = new Image();
    hiddenImage.src = 'prize.png'; // Image qui sera révélée sous le grattage
    hiddenImage.onload = function() {
        ctx.drawImage(hiddenImage, 0, 0, canvas.width, canvas.height);
        applyScratchLayer();
    };

    // Ajouter la couche grattable (grise) par-dessus l’image
    function applyScratchLayer() {
        ctx.fillStyle = '#CCCCCC'; // Couleur grise à gratter
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function startScratching(e) {
        isDrawing = true;
        scratch(e);
    }

    function stopScratching() {
        isDrawing = false;
    }

    function scratch(e) {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.globalCompositeOperation = 'destination-out'; // Effet de grattage
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        checkScratchCompletion();
    }

    function checkScratchCompletion() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let cleared = 0;

        for (let i = 3; i < imageData.data.length; i += 4) {
            if (imageData.data[i] === 0) {
                cleared++;
            }
        }

        if (cleared > (canvas.width * canvas.height) * 0.5) {
            revealDiscount();
        }
    }

    function revealDiscount() {
        const discounts = ['5% de rabais', '10% de rabais', '15% de rabais'];
        const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];
        document.getElementById('discount').innerText = 'Votre rabais: ' + randomDiscount;
        document.getElementById('discount').classList.remove('hidden');
        document.getElementById('email-form').classList.remove('hidden');
    }

    // Événements souris et tactile
    canvas.addEventListener('mousedown', startScratching);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', stopScratching);
    canvas.addEventListener('touchstart', startScratching);
    canvas.addEventListener('touchmove', scratch);
    canvas.addEventListener('touchend', stopScratching);

    // Formulaire e-mail
    document.getElementById('email-form').addEventListener('submit', function(event) {
        event.preventDefault();
        document.getElementById('email-form').classList.add('hidden');
        document.getElementById('confirmation').classList.remove('hidden');
    });
});