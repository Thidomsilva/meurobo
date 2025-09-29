// Exemplo de como usar proxy rotativo no Puppeteer
// Adicionar no pocketoption.ts

const proxies = [
  { host: 'proxy1.example.com', port: 8080 },
  { host: 'proxy2.example.com', port: 8080 },
  // Adicionar mais proxies aqui
];

const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];

const browser = await puppeteer.launch({
  headless: false,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    `--proxy-server=${randomProxy.host}:${randomProxy.port}`,
    // ... outros args
  ]
});