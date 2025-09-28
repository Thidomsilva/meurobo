# Como migrar frontend Next.js para o Fly.io

1. No diretório raiz do projeto, rode:
   ```bash
   flyctl launch
   ```
   - Escolha um nome para o app (ex: meurobo-frontend)
   - Região sugerida: gru (Brasil)
   - NÃO criar banco de dados

2. Faça o deploy:
   ```bash
   flyctl deploy
   ```

3. O frontend estará disponível em https://meurobo-frontend.fly.dev

4. Para consumir o backend, use a URL do backend Fly.io (ex: https://robot-backend.fly.dev) nas chamadas fetch do frontend.
   - Recomendo criar uma variável de ambiente `.env`:
     ```env
     NEXT_PUBLIC_BACKEND_URL=https://robot-backend.fly.dev
     ```

5. Ajuste as chamadas no frontend para usar `process.env.NEXT_PUBLIC_BACKEND_URL`.

6. Pronto! Agora tudo roda no Fly.io, sem CORS e sem limitações de ambiente.
