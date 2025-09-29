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
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--disable-software-rasterizer',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=VizDisplayCompositor',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        '--disable-web-security',
        '--disable-features=site-per-process',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-default-apps',
        '--disable-popup-blocking',
        '--disable-translate',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-field-trial-config',
        '--disable-back-forward-cache',
        '--disable-ipc-flooding-protection',
        '--allow-running-insecure-content',
        '--disable-component-update',
        '--disable-client-side-phishing-detection'
      ],
      timeout: 90000,
      executablePath,
      ignoreDefaultArgs: ['--enable-automation', '--enable-blink-features=IdleDetection'],
      ignoreHTTPSErrors: true
    });
    if (!browser) throw new Error('Falha ao iniciar o navegador');
    const page = await browser.newPage();
    
    // User agent mais convincente (versão mais atual do Chrome)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    
    // Headers adicionais para parecer mais real
    await page.setExtraHTTPHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      'Cache-Control': 'max-age=0',
      'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1'
    });
    
    // Stealth ultra-avançado
    await page.evaluateOnNewDocument(() => {
      // Remover todas as propriedades de automação
      delete (window as any).webdriver;
      delete (navigator as any).webdriver;
      delete (window as any).__webdriver_script_fn;
      delete (window as any).__driver_evaluate;
      delete (window as any).__webdriver_evaluate;
      delete (window as any).__selenium_evaluate;
      delete (window as any).__fxdriver_evaluate;
      delete (window as any).__driver_unwrapped;
      delete (window as any).__webdriver_unwrapped;
      delete (window as any).__selenium_unwrapped;
      delete (window as any).__fxdriver_unwrapped;
      delete (window as any).__webdriver_script_func;
      delete (window as any).__webdriver_script_function;
      
      // Redefinir navigator completo
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
        configurable: true
      });
      
      // User agent consistente
      Object.defineProperty(navigator, 'userAgent', {
        get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        configurable: true
      });
      
      Object.defineProperty(navigator, 'appVersion', {
        get: () => '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        configurable: true
      });
      
      Object.defineProperty(navigator, 'vendor', {
        get: () => 'Google Inc.',
        configurable: true
      });
      
      Object.defineProperty(navigator, 'platform', {
        get: () => 'Win32',
        configurable: true
      });
      
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        get: () => 8,
        configurable: true
      });
      
      Object.defineProperty(navigator, 'deviceMemory', {
        get: () => 8,
        configurable: true
      });
      
      Object.defineProperty(navigator, 'maxTouchPoints', {
        get: () => 0,
        configurable: true
      });
      
      // Chrome object completo
      (window as any).chrome = {
        app: {
          isInstalled: false,
          InstallState: {
            DISABLED: 'disabled',
            INSTALLED: 'installed',
            NOT_INSTALLED: 'not_installed'
          },
          RunningState: {
            CANNOT_RUN: 'cannot_run',
            READY_TO_RUN: 'ready_to_run',
            RUNNING: 'running'
          }
        },
        runtime: {
          OnInstalledReason: {
            CHROME_UPDATE: 'chrome_update',
            INSTALL: 'install',
            SHARED_MODULE_UPDATE: 'shared_module_update',
            UPDATE: 'update'
          },
          OnRestartRequiredReason: {
            APP_UPDATE: 'app_update',
            OS_UPDATE: 'os_update',
            PERIODIC: 'periodic'
          },
          PlatformArch: {
            ARM: 'arm',
            ARM64: 'arm64',
            MIPS: 'mips',
            MIPS64: 'mips64',
            X86_32: 'x86-32',
            X86_64: 'x86-64'
          },
          PlatformNaclArch: {
            ARM: 'arm',
            MIPS: 'mips',
            MIPS64: 'mips64',
            X86_32: 'x86-32',
            X86_64: 'x86-64'
          },
          PlatformOs: {
            ANDROID: 'android',
            CROS: 'cros',
            LINUX: 'linux',
            MAC: 'mac',
            OPENBSD: 'openbsd',
            WIN: 'win'
          },
          RequestUpdateCheckStatus: {
            NO_UPDATE: 'no_update',
            THROTTLED: 'throttled',
            UPDATE_AVAILABLE: 'update_available'
          }
        }
      };
      
      // Plugins realistas
      const plugins = [
        {
          0: {
            type: "application/x-google-chrome-pdf",
            suffixes: "pdf",
            description: "Portable Document Format",
            enabledPlugin: null,
          },
          description: "Portable Document Format",
          filename: "internal-pdf-viewer",
          length: 1,
          name: "Chrome PDF Plugin",
        },
        {
          0: {
            type: "application/pdf",
            suffixes: "pdf", 
            description: "",
            enabledPlugin: null,
          },
          description: "",
          filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
          length: 1,
          name: "Chrome PDF Viewer",
        },
        {
          0: {
            type: "application/x-nacl",
            suffixes: "",
            description: "Native Client Executable",
            enabledPlugin: null,
          },
          1: {
            type: "application/x-pnacl",
            suffixes: "",
            description: "Portable Native Client Executable",
            enabledPlugin: null,
          },
          description: "",
          filename: "internal-nacl-plugin",
          length: 2,
          name: "Native Client",
        },
      ];
      
      Object.defineProperty(navigator, 'plugins', {
        get: () => plugins,
        configurable: true
      });
      
      Object.defineProperty(navigator, 'mimeTypes', {
        get: () => [
          {
            type: "application/pdf",
            suffixes: "pdf",
            description: "",
            enabledPlugin: plugins[1]
          },
          {
            type: "application/x-google-chrome-pdf",
            suffixes: "pdf",
            description: "Portable Document Format",
            enabledPlugin: plugins[0]
          },
          {
            type: "application/x-nacl",
            suffixes: "",
            description: "Native Client Executable",
            enabledPlugin: plugins[2]
          },
          {
            type: "application/x-pnacl",
            suffixes: "",
            description: "Portable Native Client Executable",
            enabledPlugin: plugins[2]
          }
        ],
        configurable: true
      });
      
      Object.defineProperty(navigator, 'languages', {
        get: () => ['pt-BR', 'pt', 'en-US', 'en'],
        configurable: true
      });
      
      // Remover traces de CDP (Chrome DevTools Protocol)
      if ((window as any).chrome && (window as any).chrome.runtime && (window as any).chrome.runtime.onConnect) {
        delete (window as any).chrome.runtime.onConnect;
      }
      
      // Ocultar automation APIs
      Object.defineProperty(window, 'outerHeight', {
        get: () => window.screen.height,
      });
      Object.defineProperty(window, 'outerWidth', {
        get: () => window.screen.width,
      });
      
      // Simular comportamento de permissões
      const originalQuery = window.navigator.permissions.query;
      (window.navigator.permissions as any).query = (parameters: any) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ 
            state: 'granted',
            name: 'notifications',
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false
          } as any) :
          originalQuery(parameters)
      );
    });
    
    // Viewport humano
    await page.setViewport({
      width: 1366 + Math.floor(Math.random() * 100),
      height: 768 + Math.floor(Math.random() * 100),
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: true,
      isMobile: false,
    });
    console.log('Acessando página de login IQOption com Stealth...');
    try {
      await page.goto('https://login.iqoption.com/pt/login?redirect_url=traderoom%2F', { 
        waitUntil: 'domcontentloaded', // Mudado de networkidle0 para domcontentloaded
        timeout: 60000 // Reduzido timeout
      });
    } catch (navErr: any) {
      console.error('Erro ao navegar para login:', navErr?.message || navErr);
      await browser.close();
      return { success: false, message: 'Falha ao carregar a página de login. Tente novamente.' };
    }

    console.log('Página carregada. Verificando e fechando popups...');
    
    // Tentar fechar popups comuns
    const popupSelectors = [
      '[data-testid="close-button"]',
      '.close-button',
      '.modal-close',
      'button[aria-label="Close"]',
      'button[aria-label="Fechar"]',
      '.cookie-accept',
      '.cookie-banner button',
      '[id*="cookie"] button',
      '.disclaimer button',
      '.modal button:last-child'
    ];
    
    for (const selector of popupSelectors) {
      try {
        const popup = await page.$(selector);
        if (popup) {
          console.log(`Fechando popup com seletor: ${selector}`);
          await popup.click();
          await new Promise(resolve => setTimeout(resolve, 1000)); // Substituído waitForTimeout
        }
      } catch (e) {
        // Ignorar erros de popup
      }
    }
    
    console.log('Aguardando carregamento completo do React...');
    
    // Aguardar o React carregar completamente
    await page.waitForFunction(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    }, { timeout: 20000 }); // Reduzido timeout
    
    console.log('React carregado. Procurando formulário de login...');
    
    // Aguardar um pouco mais para garantir que tudo carregou
    await new Promise(resolve => setTimeout(resolve, 3000)); // Substituído waitForTimeout
    
    // Debug: capturar screenshot e HTML para análise
    await page.screenshot({ path: 'debug-login.png' });
    const html = await page.content();
    console.log('Título da página:', await page.title());
    
    // Tentar diferentes seletores de email baseados na estrutura da IQOption
    const emailSelectors = [
      'input[placeholder*="telefone ou e-mail"]',
      'input[placeholder*="Número de telefone"]',
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
    let emailSelector = null;
    for (const selector of emailSelectors) {
      try {
        emailInput = await page.waitForSelector(selector, { timeout: 5000 });
        if (emailInput) {
          emailSelector = selector;
          console.log(`Campo de email encontrado com seletor: ${selector}`);
          break;
        }
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
    
    let passwordSelector = null;
    for (const selector of passwordSelectors) {
      try {
        const passwordInput = await page.$(selector);
        if (passwordInput) {
          passwordSelector = selector;
          console.log(`Campo de senha encontrado com seletor: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Seletor de senha ${selector} não encontrado`);
      }
    }

    console.log('Preenchendo credenciais...');
    
    // Movimento de mouse mais humano
    await page.mouse.move(
      Math.random() * 200 + 100, 
      Math.random() * 200 + 100
    );
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Simular comportamento humano
    await page.mouse.move(
      Math.random() * 400 + 300,
      Math.random() * 200 + 200
    );
    
    await page.click(emailSelector);
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    
    // Limpar campo primeiro
    await page.click(emailSelector, { clickCount: 3 });
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Digitar email devagar como humano
    await page.type(emailSelector, email, { delay: 150 + Math.random() * 100 });
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
    
    // Mover mouse antes de ir para senha
    await page.mouse.move(
      Math.random() * 100 + 400,
      Math.random() * 100 + 300
    );
    
    if (passwordSelector) {
      await page.click(passwordSelector);
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
      await page.click(passwordSelector, { clickCount: 3 });
      await new Promise(resolve => setTimeout(resolve, 200));
      await page.type(passwordSelector, password, { delay: 170 + Math.random() * 80 });
    } else {
      await page.click('input[type="password"]');
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
      await page.type('input[type="password"]', password, { delay: 170 + Math.random() * 80 });
    }
    
    // Aguardar antes de clicar no botão
    await new Promise(resolve => setTimeout(resolve, 2500 + Math.random() * 1500));
    // Aguardar antes de clicar no botão
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Tentar diferentes seletores para o botão de login
    const buttonSelectors = [
      'button[type="submit"]',
      'button:contains("Entrar")',
      '.login-button',
      'input[type="submit"]',
      'button:contains("Login")',
      '.btn-primary'
    ];
    
    let buttonClicked = false;
    for (const buttonSelector of buttonSelectors) {
      try {
        const button = await page.$(buttonSelector);
        if (button) {
          console.log(`Clicando no botão com seletor: ${buttonSelector}`);
          await button.click();
          buttonClicked = true;
          break;
        }
      } catch (e) {
        console.log(`Botão ${buttonSelector} não encontrado`);
      }
    }
    
    if (!buttonClicked) {
      // Fallback: tentar clicar em qualquer botão na página
      await page.click('button[type="submit"]');
    }
    
    console.log('Formulário de login enviado. Aguardando resposta...');

    await new Promise(resolve => setTimeout(resolve, 8000)); // Aumentado tempo
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
