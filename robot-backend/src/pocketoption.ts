import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

// Configurar o plugin stealth
puppeteer.use(StealthPlugin());

export interface PocketOptionLoginResult {
  success: boolean;
  message: string;
  sessionData?: any;
  page?: any;
  browser?: any;
}

export async function pocketOptionLogin(email: string, password: string): Promise<PocketOptionLoginResult> {
  console.log('🚀 Iniciando login na Pocket Option...');
  
  let browser;
  
  try {
    // Array de User Agents diferentes para rotacionar
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    ];
    
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    console.log(`🎭 Usando User Agent: ${randomUserAgent.substring(0, 50)}...`);

    browser = await puppeteer.launch({
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
        `--user-agent=${randomUserAgent}`,
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
      timeout: 300000, // 5 minutos para evitar fechar sozinho
      executablePath: executablePath(),
      ignoreDefaultArgs: ['--enable-automation', '--enable-blink-features=IdleDetection'],
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();
    
    // Configurar timeouts da página
    page.setDefaultTimeout(300000); // 5 minutos
    page.setDefaultNavigationTimeout(300000); // 5 minutos
    
    // User agent convincente (usando o mesmo aleatório)
    await page.setUserAgent(randomUserAgent);
    
    // Headers realistas
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
    
    // Stealth ultra avançado
    await page.evaluateOnNewDocument(() => {
      // Remover propriedades de automação
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
      
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
        configurable: true
      });
      
      Object.defineProperty(navigator, 'userAgent', {
        get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        configurable: true
      });
      
      Object.defineProperty(navigator, 'platform', {
        get: () => 'Win32',
        configurable: true
      });
      
      Object.defineProperty(navigator, 'languages', {
        get: () => ['pt-BR', 'pt', 'en-US', 'en'],
        configurable: true
      });
      
      Object.defineProperty(navigator, 'plugins', {
        get: () => [
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
          }
        ],
        configurable: true
      });
      
      // Chrome object
      (window as any).chrome = {
        runtime: {
          onConnect: null,
          onMessage: null,
        },
        app: {
          isInstalled: false,
        }
      };
    });

    // Viewport realista
    const randomWidth = 1366 + Math.floor(Math.random() * 554);
    const randomHeight = 768 + Math.floor(Math.random() * 312);
    
    await page.setViewport({
      width: randomWidth,
      height: randomHeight,
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: true,
      isMobile: false,
    });

    console.log('🌐 Acessando Pocket Option...');
    await page.goto('https://pocketoption.com/pt/login', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Aguardar página carregar
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('🔍 Procurando campos de login na Pocket Option...');
    
    // Selecionar possíveis seletores para email/usuário
    const emailSelectors = [
      'input[type="email"]',
      'input[name="email"]',
      'input[name="username"]',
      'input[name="login"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="e-mail" i]',
      'input[placeholder*="login" i]',
      '#email',
      '#username',
      '#login',
      '.email-input',
      '.login-input'
    ];

    const passwordSelectors = [
      'input[type="password"]',
      'input[name="password"]',
      'input[placeholder*="senha" i]',
      'input[placeholder*="password" i]',
      '#password',
      '.password-input'
    ];

    let emailInput = null;
    let passwordInput = null;

    // Tentar encontrar campos
    for (const selector of emailSelectors) {
      try {
        emailInput = await page.$(selector);
        if (emailInput) {
          console.log(`✅ Campo de email encontrado: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`❌ Seletor email não encontrado: ${selector}`);
      }
    }

    for (const selector of passwordSelectors) {
      try {
        passwordInput = await page.$(selector);
        if (passwordInput) {
          console.log(`✅ Campo de senha encontrado: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`❌ Seletor senha não encontrado: ${selector}`);
      }
    }

    if (!emailInput || !passwordInput) {
      const debugPath = path.join(__dirname, '..', 'debug-pocketoption.png');
      await page.screenshot({ path: debugPath, fullPage: true });
      console.log(`📸 Screenshot salvo em: ${debugPath}`);

      await browser.close();
      return { 
        success: false, 
        message: 'Campos de login não encontrados na Pocket Option. Verifique debug-pocketoption.png' 
      };
    }

    console.log('✍️ Preenchendo credenciais na Pocket Option...');
    
    // Preencher com comportamento humano
    await emailInput.click();
    await emailInput.evaluate((el: any) => el.value = '');
    for (const char of email) {
      await emailInput.type(char, { delay: Math.random() * 100 + 50 });
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    await passwordInput.click();
    await passwordInput.evaluate((el: any) => el.value = '');
    for (const char of password) {
      await passwordInput.type(char, { delay: Math.random() * 100 + 50 });
    }

    console.log('🤖 Procurando captcha/verificação "Não sou um robô"...');
    
    // Detectar QUALQUER captcha na página
    let captchaDetected = false;
    
    // Aguardar mais tempo para captcha aparecer completamente
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    console.log('📸 Tirando screenshot para debug do captcha...');
    await page.screenshot({ path: 'debug-captcha-step1.png', fullPage: true });
    
    // Primeiro, vamos procurar especificamente pelo reCAPTCHA
    console.log('🔍 Procurando reCAPTCHA iframe...');
    
    try {
      // Aguardar iframe aparecer
      const recaptchaIframe = await page.waitForSelector(
        'iframe[src*="recaptcha"], iframe[title*="reCAPTCHA"], iframe[title*="recaptcha"]',
        { timeout: 15000, visible: true }
      );
      
      if (recaptchaIframe) {
        console.log('✅ reCAPTCHA iframe encontrado!');
        
        // Obter posição do iframe
        const iframeBox = await recaptchaIframe.boundingBox();
        if (iframeBox) {
          console.log(`📍 Iframe posição: x=${iframeBox.x}, y=${iframeBox.y}, w=${iframeBox.width}, h=${iframeBox.height}`);
          
          // Calcular posição do checkbox (geralmente no canto esquerdo)
          const checkboxX = iframeBox.x + 25; // 25px da borda esquerda
          const checkboxY = iframeBox.y + iframeBox.height / 2; // Centro vertical
          
          console.log(`🎯 Tentando clicar no checkbox em: x=${checkboxX}, y=${checkboxY}`);
          
          // Movimento natural do mouse
          await page.mouse.move(checkboxX - 50, checkboxY - 50, { steps: 10 });
          await new Promise(resolve => setTimeout(resolve, 500));
          
          await page.mouse.move(checkboxX, checkboxY, { steps: 15 });
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Clicar no checkbox
          await page.mouse.click(checkboxX, checkboxY);
          console.log('✅ reCAPTCHA clicado!');
          
          // Aguardar verificação
          console.log('⏳ Aguardando verificação automática...');
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          // Screenshot após clicar
          await page.screenshot({ path: 'debug-captcha-clicked.png', fullPage: true });
          
          captchaDetected = true;
        }
      }
    } catch (e: any) {
      console.log('❌ reCAPTCHA iframe não encontrado:', e.message);
      
      // Fallback: procurar outros elementos de captcha
      console.log('🔍 Procurando outros elementos de captcha...');
      
      const fallbackSelectors = [
        '.g-recaptcha',
        '.recaptcha-checkbox',
        'div[role="checkbox"]',
        '[class*="captcha"]',
        '[data-testid*="captcha"]'
      ];
      
      for (const selector of fallbackSelectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            const isVisible = await page.evaluate((el: any) => {
              const rect = el.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0;
            }, element);
            
            if (isVisible) {
              console.log(`✅ Captcha alternativo encontrado: ${selector}`);
              await element.click();
              await new Promise(resolve => setTimeout(resolve, 5000));
              captchaDetected = true;
              break;
            }
          }
        } catch (e: any) {
          console.log(`Tentativa ${selector} falhou:`, e.message);
        }
      }
    }

    // Se captcha foi detectado, aguardar resolução
    if (captchaDetected) {
      console.log('🎯 CAPTCHA DETECTADO! Aguardando resolução...');
      console.log('👆 Resolva o captcha manualmente se necessário!');
      
      // Aguardar até 3 minutos para resolução
      for (let i = 0; i < 18; i++) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10 segundos
        console.log(`⏳ Aguardando resolução... ${(i + 1) * 10}/180 segundos`);
        
        // Verificar se resolveu
        try {
          const solved = await page.evaluate(() => {
            // Verificar se checkbox está marcado
            const checkbox = document.querySelector('.recaptcha-checkbox-checked');
            if (checkbox) return true;
            
            // Verificar se botão login está ativo
            const loginBtn = document.querySelector('button[type="submit"]');
            if (loginBtn && !loginBtn.hasAttribute('disabled')) return true;
            
            return false;
          });
          
          if (solved) {
            console.log('✅ CAPTCHA resolvido! Continuando...');
            break;
          }
        } catch (e) {
          console.log('Verificando status do captcha...');
        }
      }
      
      // Screenshot final
      await page.screenshot({ path: 'debug-captcha-final.png', fullPage: true });
    } else {
      console.log('ℹ️ Nenhum captcha detectado - prosseguindo...');
    }

    // Procurar botão de login
    const loginButtonSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      '.login-button',
      '.btn-login',
      '#login-btn',
      '[data-testid="login-button"]'
    ];

    let loginButton = null;
    for (const selector of loginButtonSelectors) {
      try {
        loginButton = await page.$(selector);
        if (loginButton) {
          console.log(`✅ Botão de login encontrado: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`❌ Seletor botão não encontrado: ${selector}`);
      }
    }

    if (!loginButton) {
      // Tentar encontrar por texto
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent || '', btn);
        if (text.toLowerCase().includes('login') || text.toLowerCase().includes('entrar')) {
          loginButton = btn;
          console.log(`✅ Botão de login encontrado por texto: ${text}`);
          break;
        }
      }
    }

    if (!loginButton) {
      await browser.close();
      return { 
        success: false, 
        message: 'Botão de login não encontrado na Pocket Option' 
      };
    }

    console.log('🚀 Clicando no botão de login...');
    await loginButton.click();

    console.log('⏳ Aguardando processamento do login (pode incluir verificação captcha)...');
    
    // Aguardar mais tempo para possível processamento de captcha
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Verificar se precisa resolver captcha adicional
    const hasAdditionalCaptcha = await page.evaluate(() => {
      const captchaElements = document.querySelectorAll('[class*="captcha"], [class*="recaptcha"], .challenge');
      return captchaElements.length > 0;
    });

    if (hasAdditionalCaptcha) {
      console.log('⚠️ Captcha adicional detectado - aguardando resolução manual...');
      
      // Aguardar até 60 segundos para o usuário resolver manualmente
      let attempts = 0;
      const maxAttempts = 60; // 60 segundos
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
        
        // Verificar se o captcha foi resolvido (mudança de URL ou elemento)
        const currentUrlCheck = page.url();
        if (currentUrlCheck.includes('trade') || currentUrlCheck.includes('trading') || currentUrlCheck.includes('cabinet')) {
          console.log('✅ Captcha resolvido! Login bem-sucedido!');
          break;
        }
        
        // A cada 10 segundos, informar o status
        if (attempts % 10 === 0) {
          console.log(`⏳ Aguardando resolução do captcha... ${attempts}/${maxAttempts}s`);
        }
      }
      
      if (attempts >= maxAttempts) {
        await browser.close();
        return {
          success: false,
          message: 'Timeout aguardando resolução do captcha. Tente novamente ou resolva manualmente.'
        };
      }
    }

    const currentUrl = page.url();
    console.log('📍 URL atual:', currentUrl);

    // Verificar sucesso do login - URLs possíveis da Pocket Option
    const successUrls = ['trade', 'trading', 'cabinet', 'platform', 'dashboard'];
    const isLoginSuccess = successUrls.some(url => currentUrl.includes(url));

    if (isLoginSuccess) {
      console.log('✅ Login realizado com sucesso na Pocket Option!');
      
      const cookies = await page.cookies();
      const localStorage = await page.evaluate(() => {
        const data: any = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            data[key] = localStorage.getItem(key);
          }
        }
        return data;
      });

      // Não fechar browser - manter para operações futuras
      console.log('🔄 Mantendo sessão ativa da Pocket Option...');

      return {
        success: true,
        message: 'Conectado com sucesso à Pocket Option!',
        sessionData: {
          url: currentUrl,
          cookies,
          localStorage
        },
        page,
        browser
      };
    } else {
      // Verificar erros específicos
      const pageText = await page.evaluate(() => document.body.textContent || '');
      console.log('🔍 Verificando erros na página...');
      
      const isBrowserNotSupported = pageText.includes('Your browser is no longer supported') || 
                                   pageText.includes('browser is no longer supported');
      
      const isInvalidCredentials = pageText.includes('Invalid credentials') ||
                                  pageText.includes('Wrong email') ||
                                  pageText.includes('Wrong password') ||
                                  pageText.includes('Incorrect') ||
                                  pageText.includes('Login failed');
      
      const isCaptchaRequired = pageText.includes('captcha') || 
                               pageText.includes('verification') ||
                               pageText.includes('robot');

      // Salvar screenshot para debug
      const debugPath = path.join(__dirname, '..', 'debug-pocketoption-error.png');
      await page.screenshot({ path: debugPath, fullPage: true });
      console.log(`📸 Screenshot de erro salvo em: ${debugPath}`);

      await browser.close();
      
      if (isBrowserNotSupported) {
        return {
          success: false,
          message: 'Pocket Option detectou automação. Navegador não suportado.'
        };
      } else if (isInvalidCredentials) {
        return {
          success: false,
          message: 'Credenciais inválidas na Pocket Option. Verifique email e senha.'
        };
      } else if (isCaptchaRequired) {
        return {
          success: false,
          message: 'Captcha não resolvido na Pocket Option. Tente novamente ou resolva manualmente.'
        };
      } else {
        return {
          success: false,
          message: `Login não foi bem-sucedido na Pocket Option. URL atual: ${currentUrl}. Verifique debug-pocketoption-error.png`
        };
      }
    }

  } catch (error: any) {
    console.error('❌ Erro durante login na Pocket Option:', error);
    
    if (browser) {
      await browser.close();
    }
    
    return {
      success: false,
      message: `Erro técnico: ${error?.message || 'Erro desconhecido'}`
    };
  }
}