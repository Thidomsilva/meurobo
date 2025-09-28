# Backend do Robô de Trading

Este serviço é responsável por automatizar operações na IQOption, coletar dados de mercado e servir como ponte entre o frontend e a lógica de IA.

## Como rodar localmente

```bash
cd robot-backend
npm install
npm run dev
```

- O serviço sobe na porta 4000 por padrão.
- Endpoint de teste: http://localhost:4000/health

## Estrutura inicial
- `src/index.ts`: API Express com endpoint de health check e login simulado.
- `.env`: variáveis de ambiente.
- Dependências: express, puppeteer, dotenv, typescript, ts-node-dev.

Próximos passos: implementar login real na IQOption, coleta de dados e execução de ordens.
