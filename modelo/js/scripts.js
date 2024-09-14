// Substitua 'your-publishable-key-here' pela sua chave pública do Stripe
const stripe = Stripe('your-publishable-key-here');

// Selecione todos os botões de compra
const buyButtons = document.querySelectorAll('button[id^="buyButton"]');

buyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id');
        
        // Criar uma sessão de checkout com o backend
        fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: productId }),
        })
        .then(response => response.json())
        .then(sessionId => {
            // Redirecionar para o checkout do Stripe
            return stripe.redirectToCheckout({ sessionId: sessionId });
        })
        .then(result => {
            if (result.error) {
                alert(result.error.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
