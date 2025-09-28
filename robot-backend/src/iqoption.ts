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
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--disable-software-rasterizer'
      ],
      timeout: 60000,
      executablePath
    });
    if (!browser) throw new Error('Falha ao iniciar o navegador');
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36');
    console.log('Acessando página de login IQOption com Stealth...');
    try {
      await page.goto('https://login.iqoption.com/pt/login?redirect_url=traderoom%2F', { waitUntil: 'domcontentloaded', timeout: 60000 });
    } catch (navErr: any) {
      console.error('Erro ao navegar para login:', navErr?.message || navErr);
      await browser.close();
      return { success: false, message: 'Falha ao carregar a página de login. Tente novamente.' };
    }

    await page.waitForSelector('input[name="email"]', { timeout: 20000 });
    await page.type('input[name="email"]', email);
    await page.type('input[name="password"]', password);
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
