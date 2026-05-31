import express from 'express';
import cors from 'cors';
import scheduleRouter from './routes/schedule';
import standingsRouter from './routes/standings';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use('/api/schedule', scheduleRouter);
app.use('/api/standings', standingsRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`KBO API server running on http://localhost:${PORT}`);
});
