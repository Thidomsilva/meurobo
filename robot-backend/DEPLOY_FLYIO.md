# Exemplo de uso do backend no Fly.io

1. Faça build e deploy:
   ```bash
   cd robot-backend
   flyctl deploy
   ```

2. Defina a variável de ambiente do domínio do frontend (ajuste para o domínio real do seu Vercel):
   ```bash
   flyctl secrets set FRONTEND_ORIGIN=https://seu-frontend.vercel.app
   ```

3. Após o deploy, pegue a URL do backend (ex: https://robot-backend.fly.dev) e use no frontend.

4. No frontend, ajuste as chamadas para:
   ```js
   fetch('https://robot-backend.fly.dev/login', ...)
   ```
   Ou use uma variável de ambiente:
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://robot-backend.fly.dev
   ```

5. Se der erro de CORS, confira se o domínio do frontend está correto na variável FRONTEND_ORIGIN no Fly.io.

6. O backend já aceita requisições do frontend Vercel e bloqueia outros domínios.
