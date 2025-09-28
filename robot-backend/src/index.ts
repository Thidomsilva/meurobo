import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { iqOptionLogin, getIqOptionBalance, getIqOptionPairs } from './iqoption';

const app = express();
// CORS deve ser o primeiro middleware
app.use(cors({ origin: true, credentials: true, methods: ['GET', 'POST', 'OPTIONS'] }));
// Log para depuração de preflight
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('Preflight OPTIONS recebido para:', req.path);
  }
  next();
});
app.options('*', cors()); // Garante CORS para preflight/OPTIONS
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Mensagem amigável para a rota raiz
app.get('/', (_req, res) => {
  res.send('🚀 Backend do robô de trading está rodando! Use /health para checar o status.');
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Robot backend is running!' });
});

// Endpoint real de login na IQOption
app.post('/login', async (req, res) => {
  console.log('POST /login recebido:', req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
  }
  const result = await iqOptionLogin(email, password);
  res.json({ success: result.success, message: result.message });
});

// Endpoint para buscar saldo após login
app.post('/balance', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
  }
  const login = await iqOptionLogin(email, password);
  if (!login.success || !login.page) {
    return res.status(401).json({ success: false, message: login.message });
  }
  const balance = await getIqOptionBalance(login.page);
  await login.browser?.close();
  res.json({ success: true, balance });
});

// Endpoint para buscar pares disponíveis após login
app.post('/pairs', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
  }
  const login = await iqOptionLogin(email, password);
  if (!login.success || !login.page) {
    return res.status(401).json({ success: false, message: login.message });
  }
  const pairs = await getIqOptionPairs(login.page);
  await login.browser?.close();
  res.json({ success: true, pairs });
});

app.listen(PORT, () => {
  console.log(`Robot backend running on port ${PORT}`);
});
