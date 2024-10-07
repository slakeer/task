import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());

const drumItems = [
    { id: 1, value: 'iPhone' },
    { id: 2, value: 'MacBook' },
    { id: 3, value: 'iPad' },
    { id: 4, value: 'Watch' },
    { id: 5, value: 'AirPods' },
    { id: 6, value: 'TV' },
    { id: 7, value: 'Tron' },
    { id: 8, value: 'Gift Card' },
];

app.get('/drum-items', (req, res) => {
    res.json(drumItems);
});

app.post('/spin-result', (req, res) => {
    const randomIndex = Math.floor(Math.random() * drumItems.length);
    res.json(drumItems[randomIndex]);
    console.log(randomIndex)
});

app.use(express.json());
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
