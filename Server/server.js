const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cors());

//staking simulating route
app.post('/stake', (req, res) => {
    const { amount } = req.body;
    if (!amount) {
        return res.status(400).send('Amount is required');
    }
    if (isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).send('Amount must be a positive number');
    }
    res.status(200).send({ message: `You have staked ${amount} tokens` });
});

//unstaking route
app.post('/unstake', (req, res) => {
    const { amount } = req.body;
    if (!amount) {
        return res.status(400).send('Amount is required');
    }
    if (isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).send('Amount must be a positive number');
    }
    res.status(200).send({ message: `You have unstaked ${amount} tokens` });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

