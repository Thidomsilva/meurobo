# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
# TradeAlchemistAI

## O que é a ferramenta?

TradeAlchemistAI é uma plataforma de trading automatizado projetada para se conectar à corretora IQOption. A ferramenta utiliza um modelo de Inteligência Artificial para prever os movimentos do mercado e executa operações (compra/venda) com base em estratégias e parâmetros de risco definidos pelo usuário. O objetivo é automatizar o processo de trading, otimizar a tomada de decisões e melhorar continuamente o desempenho do modelo de IA.

## O que já temos? (Funcionalidades Implementadas)

Atualmente, a aplicação possui uma interface de usuário (frontend) completa e funcional, com a lógica de backend simulada ("mockada").

- **Interface Completa (Frontend):** Uma interface de usuário moderna e responsiva construída com Next.js, React e ShadCN, permitindo a navegação por todas as seções principais da aplicação.
- **Simulação de Conexão:** Na página de **Configurações**, é possível simular a conexão com uma conta IQOption usando as credenciais `admin@tradealchemist.ai` e `admin`. O status da conexão e os saldos (real/demo) são gerenciados globalmente e refletidos em toda a interface.
- **Visualização de Dados:** O **Painel** exibe estatísticas de desempenho (saldo, P/L diário, winrate), um gráfico de evolução de patrimônio e um log de trades recentes, tudo com dados de exemplo (estáticos) para demonstrar a funcionalidade.
- **Gerenciamento de Estratégias:** A página **Estratégias** permite visualizar uma lista de estratégias e abrir um formulário detalhado para criar novas, configurando parâmetros de risco (stake, stop loss/win, martingale) e do modelo de IA (limites de confiança).
- **Páginas Funcionais:** Todas as seções, como **Operar** (com gráfico de velas), **Modelos de IA** e **Histórico**, estão estruturadas e prontas para serem conectadas à lógica de backend real.
- **Estrutura de IA (Genkit):** Os fluxos de backend para predição (`ai-powered-prediction`), execução de trades (`automated-trading-execution`) e retreinamento (`automated-model-retraining`) já estão definidos com Genkit. Atualmente, eles retornam dados simulados, mas estão prontos para se conectar a um serviço de Machine Learning e ao robô de automação.

## O que falta? (Próximos Passos)

A fundação da interface está pronta. Os próximos passos envolvem construir a lógica de backend e conectar os serviços reais.

- **Backend Real (Worker/Robô):** Este é o componente mais crucial. É necessário desenvolver um serviço de backend (usando ferramentas como **Puppeteer** ou **Playwright**) que será responsável por:
    1.  Realizar o login na conta IQOption com as credenciais fornecidas.
    2.  Coletar dados de mercado em tempo real do ativo selecionado.
    3.  Executar as ordens de compra e venda quando comandado pelo fluxo de IA.
    4.  Extrair o resultado das operações (vitória/derrota) após a expiração.
- **Integração com Serviço de Machine Learning (ML):** Conectar os fluxos Genkit existentes a um serviço de ML real para:
    1.  Enviar os dados de mercado coletados pelo robô para o endpoint `/predict` e receber previsões reais.
    2.  Enviar os resultados das operações para o endpoint `/feedback` para o aprendizado contínuo do modelo.
    3.  Disparar o processo de retreinamento do modelo através do endpoint `/train`.
- **Armazenamento de Dados (Banco de Dados):** Implementar um banco de dados (como o **Firestore**) para armazenar de forma persistente o histórico de trades, as estratégias criadas pelos usuários e outras configurações.
- **Fluxo de Dados em Tempo Real:** Substituir todos os dados de exemplo (estáticos) por dados dinâmicos vindos do robô e do banco de dados. Isso fará com que a interface reflita a atividade de trading em tempo real (atualização de saldo, novos trades no histórico, etc.).
