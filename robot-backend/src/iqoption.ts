import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

function resolveChromiumPath(): string | undefined {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
  ].filter(Boolean) as string[];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {/* ignore */}
  }
  return undefined;
}

// Faz login e retorna browser e page para reuso
export async function iqOptionLogin(email: string, password: string): Promise<{ success: boolean; message: string; browser?: any; page?: any }> {
  puppeteerExtra.use(StealthPlugin());
  let browser: any;
  try {
    const executablePath = resolveChromiumPath();
    console.log('Launching Chromium with path:', executablePath || '(default bundled)');
    browser = await puppeteerExtra.launch({
      headless: false, // Mudado para false para debug
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--disable-software-rasterizer'
      ],
      timeout: 90000, // Aumentado timeout
      executablePath
    });
    if (!browser) throw new Error('Falha ao iniciar o navegador');
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36');
    console.log('Acessando página de login IQOption com Stealth...');
    try {
      await page.goto('https://login.iqoption.com/pt/login?redirect_url=traderoom%2F', { 
        waitUntil: 'networkidle0', // Aguarda até não haver requests por 500ms
        timeout: 90000 
      });
    } catch (navErr: any) {
      console.error('Erro ao navegar para login:', navErr?.message || navErr);
      await browser.close();
      return { success: false, message: 'Falha ao carregar a página de login. Tente novamente.' };
    }

    console.log('Página carregada. Aguardando carregamento completo do React...');
    
    // Aguardar o React carregar completamente
    await page.waitForFunction(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    }, { timeout: 30000 });
    
    console.log('React carregado. Aguardando campo de email...');
    
    // Debug: capturar screenshot e HTML para análise
    await page.screenshot({ path: 'debug-login.png' });
    const html = await page.content();
    console.log('Título da página:', await page.title());
    
    // Tentar diferentes seletores de email baseados na estrutura da IQOption
    const emailSelectors = [
      'input[name="email"]',
      'input[type="email"]',
      'input[data-test="email"]',
      'input[placeholder*="mail"]',
      'input[placeholder*="Mail"]',
      'input[autocomplete="email"]',
      '.email input',
      '[data-testid="email"] input',
      'form input[type="text"]',
      'form input:first-of-type'
    ];
    
    let emailInput = null;
    for (const selector of emailSelectors) {
      try {
        emailInput = await page.waitForSelector(selector, { timeout: 5000 });
        console.log(`Campo de email encontrado com seletor: ${selector}`);
        break;
      } catch (e) {
        console.log(`Seletor ${selector} não encontrado`);
      }
    }
    
    if (!emailInput) {
      console.log('Nenhum campo de email encontrado. Salvando HTML para debug...');
      const html = await page.content();
      require('fs').writeFileSync('debug-page.html', html);
      await browser.close();
      return { success: false, message: 'Campo de email não encontrado na página de login.' };
    }

    // Buscar campo de senha
    const passwordSelectors = [
      'input[name="password"]',
      'input[type="password"]',
      'input[data-test="password"]',
      '.password input',
      '[data-testid="password"] input'
    ];
    
    let passwordInput = null;
    for (const selector of passwordSelectors) {
      try {
        passwordInput = await page.$(selector);
        if (passwordInput) {
          console.log(`Campo de senha encontrado com seletor: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Seletor de senha ${selector} não encontrado`);
      }
    }

    console.log('Preenchendo credenciais...');
    await page.type(emailInput, email);
    if (passwordInput) {
      await page.type(passwordInput, password);
    } else {
      await page.type('input[type="password"]', password); // fallback
    }
    await page.click('button[type="submit"]');
    console.log('Formulário de login enviado. Aguardando resposta...');

    await new Promise(resolve => setTimeout(resolve, 6000));
    const url = page.url();
    console.log('URL após login:', url);
    if (url.includes('login')) {
      if (browser) await browser.close();
      return { success: false, message: 'Falha no login: credenciais inválidas ou bloqueio de automação.' };
    }
    return { success: true, message: 'Login realizado com sucesso!', browser, page };
  } catch (error) {
    if (browser) await browser.close();
    console.error('Erro no fluxo de login:', (error as any)?.stack || error);
    return { success: false, message: 'Erro ao tentar logar: ' + (error as Error).message };
  }
}

// Busca saldo da conta (real)
export async function getIqOptionBalance(page: any): Promise<{ real: number; demo: number }> {
  // Aguarda o elemento de saldo aparecer (ajuste o seletor conforme necessário)
  await page.waitForSelector('.balance .balance-value', { timeout: 15000 });
  // Extrai os saldos real e demo
  const balances = await page.evaluate(() => {
    // Ajuste os seletores conforme a estrutura real da página
    const realEl = document.querySelector('.balance .balance-value[data-type="real"]');
    const demoEl = document.querySelector('.balance .balance-value[data-type="practice"]');
    const real = realEl ? parseFloat(realEl.textContent?.replace(/[^\d,.]/g, '').replace(',', '.') || '0') : 0;
    const demo = demoEl ? parseFloat(demoEl.textContent?.replace(/[^\d,.]/g, '').replace(',', '.') || '0') : 0;
    return { real, demo };
  });
  return balances;
}

// Busca pares disponíveis para negociação (real)
export async function getIqOptionPairs(page: any): Promise<string[]> {
  // Aguarda o seletor de lista de ativos aparecer (ajuste conforme necessário)
  await page.waitForSelector('.instruments-list, .active-list', { timeout: 15000 });
  // Extrai os nomes dos pares/ativos
  const pairs = await page.evaluate(() => {
    // Ajuste os seletores conforme a estrutura real da página
    const items = Array.from(document.querySelectorAll('.instruments-list .instrument-name, .active-list .active-item__name'));
    return items.map(el => el.textContent?.trim() || '').filter(Boolean);
  });
  return pairs;
}
