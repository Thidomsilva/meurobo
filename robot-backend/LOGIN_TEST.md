# Teste de login IQOption

Faça uma requisição POST para testar o login real:

```
curl -X POST http://localhost:4000/login \
  -H 'Content-Type: application/json' \
  -d '{"email": "admin@tradealchemist.ai", "password": "admin"}'
```

A resposta será:
- `{ success: true, message: 'Login realizado com sucesso!' }` se o login funcionar
- `{ success: false, message: 'Falha no login...' }` caso contrário

> O login pode falhar se a IQOption bloquear automações ou mudar o fluxo de autenticação. Ajustes podem ser necessários.
