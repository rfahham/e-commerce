const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Substitua 'your-secret-key-here' pela sua chave secreta do Stripe
const stripe = Stripe('your-secret-key-here');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Para servir arquivos estáticos

app.post('/create-checkout-session', async (req, res) => {
    const { productId } = req.body;

    // Lógica para determinar o preço com base no productId
    let priceData;
    switch (productId) {
        case '1':
            priceData = { currency: 'brl', product_data: { name: 'Produto Exemplo 1' }, unit_amount: 9999 };
            break;
        case '2':
            priceData = { currency: 'brl', product_data: { name: 'Produto Exemplo 2' }, unit_amount: 19999 };
            break;
        case '3':
            priceData = { currency: 'brl', product_data: { name: 'Produto Exemplo 3' }, unit_amount: 29999 };
            break;
        default:
            return res.status(400).send('Produto inválido.');
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: priceData,
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:3000/success.html',
            cancel_url: 'http://localhost:3000/cancel.html',
        });
        res.json({ sessionId: session.id });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
