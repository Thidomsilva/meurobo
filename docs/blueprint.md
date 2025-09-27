# **App Name**: TradeAlchemistAI

## Core Features:

- IQOption Account Connection: Securely connect to IQOption account using encrypted credentials stored in Secret Manager.
- Strategy Builder: Define trading strategies with parameters such as stake, expiration, gales, stop loss, and stop win, including probability thresholds for AI decision-making.
- AI-Powered Prediction: Call the ML service to predict next move (up/down and probability) based on market data.
- Automated Trading Execution: Automatically execute trades on IQOption using a Worker service (Puppeteer/Playwright) based on AI predictions and defined strategy rules.
- Real-time Performance Dashboard: Display real-time equity curve, win rate, drawdown, and logs of trading activity.
- AI Feedback Loop: Submit trade results to the ML service for continuous learning and model improvement via /feedback.
- Automated Model Retraining: Automatically retrain the ML model on a schedule to improve prediction accuracy and adapt to changing market conditions using a tool. Trigger the retraining with /train.

## Style Guidelines:

- Primary color: Deep Indigo (#4B0082) for a sophisticated and trustworthy feel.
- Background color: Dark Charcoal (#222222) to provide high contrast and reduce eye strain.
- Accent color: Electric Purple (#BF00FF) to highlight key actions and AI-related information.
- Body and headline font: 'Inter' sans-serif, for a modern and objective feel, providing excellent readability across the dashboard.
- Code font: 'Source Code Pro' for displaying code snippets and technical logs.
- Use minimalist icons to represent different trading parameters and AI indicators, ensuring clarity and ease of understanding.
- Subtle transitions and animations for trade executions and AI prediction updates, providing a smooth and engaging user experience.