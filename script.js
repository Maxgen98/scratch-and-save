document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('scratch-canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Générer un rabais aléatoire sous l'image
    const discounts = ['5%', '10%', '15%'];
    const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];
    document.getElementById('discount').innerText = randomDiscount;

    // Charger l’image qui sera la couche grattable
    const scratchImage = new Image();
    scratchImage.src = 'prize.png'; 
    scratchImage.onload = function() {
        ctx.drawImage(scratchImage, 0, 0, canvas.width, canvas.height);
    };

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

        ctx.globalCompositeOperation = 'destination-out'; // Enlève l’image progressivement
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
        document.getElementById('email-form').classList.remove('hidden');
    }

    // Gestion de la soumission de l'e-mail
    document.getElementById('email-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();

        if (!validateEmail(email)) {
            alert("Veuillez entrer un e-mail valide.");
            return;
        }

        // Générer un code promo
        const promoCode = "SAVE-" + Math.floor(1000 + Math.random() * 9000);
        
        // Simuler l'envoi (à remplacer par un appel API si nécessaire)
        console.log(`E-mail envoyé à ${email} avec le code promo : ${promoCode}`);
        
        // Afficher un message de confirmation
        document.getElementById('confirmation').innerText = `Merci ! Votre code promo est : ${promoCode}`;
        document.getElementById('confirmation').classList.remove('hidden');

        // Masquer le formulaire après soumission
        document.getElementById('email-form').classList.add('hidden');
    });

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Événements souris et tactile
    canvas.addEventListener('mousedown', startScratching);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', stopScratching);
    canvas.addEventListener('touchstart', startScratching);
    canvas.addEventListener('touchmove', scratch);
    canvas.addEventListener('touchend', stopScratching);
});
