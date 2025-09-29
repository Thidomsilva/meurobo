import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { executablePath } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

// Configurar o plugin stealth
puppeteer.use(StealthPlugin());

export interface AvalonLoginResult {
  success: boolean;
  message: string;
  sessionData?: any;
  page?: any;
  browser?: any;
}

export interface AvalonBalanceResult {
  success: boolean;
  balance?: number;
  currency?: string;
  message?: string;
}

export interface AvalonPairsResult {
  success: boolean;
  pairs?: string[];
  message?: string;
}

export async function avalonLogin(email: string, password: string): Promise<AvalonLoginResult> {
  console.log('🚀 Iniciando login na Avalon Broker...');
  
  let browser;
  
  try {
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
      executablePath: executablePath(),
      ignoreDefaultArgs: ['--enable-automation', '--enable-blink-features=IdleDetection'],
      ignoreHTTPSErrors: true
    });

    const page = await browser.newPage();
    
    // User agent convincente
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    
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
    
    // Stealth avançado
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

    console.log('🌐 Acessando Avalon Broker...');
    await page.goto('https://trade.avalonbroker.com/pt/login?redirect_url=traderoom%2F', { 
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Aguardar página carregar
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🔍 Procurando campos de login...');
    
    // Aguardar mais tempo para a página carregar completamente
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Capturar screenshot ANTES de procurar campos
    const debugPath = path.join(__dirname, '..', 'debug-avalon-before.png');
    await page.screenshot({ path: debugPath, fullPage: true });
    console.log(`📸 Screenshot inicial salvo em: ${debugPath}`);
    
    // Salvar HTML para análise ANTES
    const htmlBefore = await page.content();
    const htmlBeforePath = path.join(__dirname, '..', 'debug-avalon-before.html');
    fs.writeFileSync(htmlBeforePath, htmlBefore);
    console.log(`📄 HTML inicial salvo em: ${htmlBeforePath}`);
    
    // Selecionar possíveis seletores para email/usuário - EXPANDIDOS
    const emailSelectors = [
      'input[type="email"]',
      'input[name="email"]',
      'input[name="username"]',
      'input[name="user"]',
      'input[name="login"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="E-mail" i]',
      'input[placeholder*="usuário" i]',
      'input[placeholder*="login" i]',
      'input[placeholder*="Email" i]',
      'input[placeholder*="Username" i]',
      '#email',
      '#username',
      '#user',
      '#login',
      '.email-input',
      '.login-input',
      '.username-input',
      '[data-testid*="email"]',
      '[data-testid*="username"]',
      '[data-testid*="login"]',
      'input[id*="email"]',
      'input[id*="username"]',
      'input[id*="login"]',
      'input[class*="email"]',
      'input[class*="username"]',
      'input[class*="login"]'
    ];

    // Selecionar possíveis seletores para senha - EXPANDIDOS
    const passwordSelectors = [
      'input[type="password"]',
      'input[name="password"]',
      'input[name="pass"]',
      'input[placeholder*="senha" i]',
      'input[placeholder*="password" i]',
      'input[placeholder*="Password" i]',
      'input[placeholder*="Senha" i]',
      '#password',
      '#pass',
      '.password-input',
      '[data-testid*="password"]',
      'input[id*="password"]',
      'input[id*="pass"]',
      'input[class*="password"]'
    ];

    let emailInput = null;
    let passwordInput = null;

    // Debug: Listar TODOS os inputs da página
    const allInputs = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      return inputs.map(input => ({
        tagName: input.tagName,
        type: input.type,
        name: input.name,
        id: input.id,
        className: input.className,
        placeholder: input.placeholder,
        outerHTML: input.outerHTML.substring(0, 200) // Primeiros 200 chars
      }));
    });
    
    console.log('🔍 TODOS OS INPUTS ENCONTRADOS:', JSON.stringify(allInputs, null, 2));

    // Tentar encontrar campo de email
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

    // Tentar encontrar campo de senha
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
      // Capturar screenshot para debug APÓS busca
      const debugPathAfter = path.join(__dirname, '..', 'debug-avalon-after.png');
      await page.screenshot({ path: debugPathAfter, fullPage: true });
      console.log(`📸 Screenshot após busca salvo em: ${debugPathAfter}`);
      
      // Salvar HTML para análise APÓS
      const htmlAfter = await page.content();
      const htmlAfterPath = path.join(__dirname, '..', 'debug-avalon-after.html');
      fs.writeFileSync(htmlAfterPath, htmlAfter);
      console.log(`📄 HTML após busca salvo em: ${htmlAfterPath}`);

      await browser.close();
      return { 
        success: false, 
        message: `Campos de login não encontrados. Email: ${emailInput ? 'OK' : 'FALHOU'}, Senha: ${passwordInput ? 'OK' : 'FALHOU'}. Verifique os arquivos debug-avalon-*.png e debug-avalon-*.html. Total de inputs na página: ${allInputs.length}` 
      };
    }

    console.log('✍️ Preenchendo credenciais...');
    
    // Limpar e preencher email com comportamento humano
    await emailInput.click();
    await emailInput.evaluate((el: any) => el.value = '');
    
    for (const char of email) {
      await emailInput.type(char, { delay: Math.random() * 100 + 50 });
    }

    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Limpar e preencher senha
    await passwordInput.click();
    await passwordInput.evaluate((el: any) => el.value = '');
    
    for (const char of password) {
      await passwordInput.type(char, { delay: Math.random() * 100 + 50 });
    }

    console.log('🎯 Procurando botão de login...');
    
    // Selecionar possíveis seletores para botão de login
    const loginButtonSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:contains("Login")',
      'button:contains("Entrar")',
      'button:contains("Sign in")',
      '.login-button',
      '.btn-login',
      '#login-btn',
      '#loginButton',
      '[data-testid="login-button"]'
    ];

    let loginButton = null;

    for (const selector of loginButtonSelectors) {
      try {
        if (selector.includes(':contains')) {
          // Para seletores :contains, usar querySelector com texto
          const buttonText = selector.includes('Login') ? 'Login' : 
                           selector.includes('Entrar') ? 'Entrar' : 'Sign in';
          
          const buttons = await page.$$('button');
          for (const btn of buttons) {
            const text = await page.evaluate(el => el.textContent || '', btn);
            if (text.includes(buttonText)) {
              loginButton = btn;
              console.log(`✅ Botão de login encontrado via texto: ${buttonText}`);
              break;
            }
          }
          if (loginButton) break;
        } else {
          loginButton = await page.$(selector);
          if (loginButton) {
            console.log(`✅ Botão de login encontrado: ${selector}`);
            break;
          }
        }
      } catch (e) {
        console.log(`❌ Seletor de botão não encontrado: ${selector}`);
      }
    }

    if (!loginButton) {
      await browser.close();
      return { 
        success: false, 
        message: 'Botão de login não encontrado na Avalon Broker' 
      };
    }

    // Simular movimento do mouse e clique
    const buttonBox = await loginButton.boundingBox();
    if (buttonBox) {
      await page.mouse.move(
        buttonBox.x + buttonBox.width / 2,
        buttonBox.y + buttonBox.height / 2
      );
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('🚀 Clicando no botão de login...');
    await loginButton.click();

    // Aguardar redirecionamento ou resposta
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Verificar se logou com sucesso
    const currentUrl = page.url();
    console.log('📍 URL atual:', currentUrl);

    if (currentUrl.includes('traderoom') || currentUrl.includes('dashboard') || currentUrl.includes('trading')) {
      console.log('✅ Login realizado com sucesso na Avalon Broker!');
      
      // Capturar dados da sessão se possível
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

      // NÃO fechar o browser - manter para buscar saldo e pares
      console.log('🔄 Mantendo sessão ativa para buscar dados...');
      
      return {
        success: true,
        message: 'Conectado com sucesso à Avalon Broker!',
        sessionData: {
          url: currentUrl,
          cookies,
          localStorage
        },
        page, // Retornamos a página para usar em outras funções
        browser // Retornamos o browser também
      };
    } else {
      // Verificar se há mensagens de erro
      const errorMessages = await page.evaluate(() => {
        const errors: string[] = [];
        const errorSelectors = [
          '.error', '.alert', '.warning', '.danger',
          '[class*="error"]', '[class*="alert"]',
          '[data-testid*="error"]'
        ];
        
        for (const selector of errorSelectors) {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el: any) => {
            if (el.textContent?.trim()) {
              errors.push(el.textContent.trim());
            }
          });
        }
        return errors;
      });

      // Verificar se há a mensagem específica de browser não suportado
      const pageText = await page.evaluate(() => document.body.textContent || '');
      const isBrowserNotSupported = pageText.includes('Your browser is no longer supported') || 
                                   pageText.includes('browser is no longer supported');

      console.log('❌ Login não foi bem-sucedido. Mensagens encontradas:', errorMessages);
      console.log('🔍 Texto da página contém "browser not supported":', isBrowserNotSupported);

      await browser.close(); // IMPORTANTE: Fechar browser sempre
      
      if (isBrowserNotSupported) {
        return {
          success: false,
          message: 'Avalon Broker detectou automação. Navegador não suportado. Tente usar a IQOption como alternativa.'
        };
      }
      
      return {
        success: false,
        message: errorMessages.length > 0 ? 
          `Erro no login: ${errorMessages.join(', ')}` :
          'Login não foi bem-sucedido. Verifique suas credenciais.'
      };
    }

  } catch (error: any) {
    console.error('❌ Erro durante login na Avalon Broker:', error);
    
    if (browser) {
      await browser.close();
    }
    
    return {
      success: false,
      message: `Erro técnico: ${error?.message || 'Erro desconhecido'}`
    };
  }
}

// Função para buscar saldo na Avalon
export async function getAvalonBalance(page: any): Promise<AvalonBalanceResult> {
  try {
    console.log('💰 Buscando saldo na Avalon Broker...');
    
    // Aguardar página carregar completamente
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Possíveis seletores para saldo - EXPANDIDOS
    const balanceSelectors = [
      '.balance',
      '.account-balance',
      '.user-balance',
      '[class*="balance"]',
      '[data-testid*="balance"]',
      '.wallet-balance',
      '.trading-balance',
      '#balance',
      '.balance-amount',
      '.balance-value',
      '[class*="wallet"]',
      '.account-info .balance',
      '.sidebar .balance',
      '.header .balance',
      '.money',
      '.amount',
      '.funds',
      '.capital',
      '[class*="money"]',
      '[class*="amount"]',
      '[class*="funds"]',
      '[id*="balance"]',
      '[id*="money"]',
      '[id*="amount"]',
      'span:contains("$")',
      'div:contains("$")',
      '.currency',
      '[class*="currency"]'
    ];
    
    // Debug: buscar TODOS os elementos que possam conter números/moeda
    const allPossibleBalance = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('*'));
      const candidates = [];
      
      for (const el of elements) {
        const text = el.textContent?.trim() || '';
        // Procurar por padrões de moeda
        if (text.match(/\$[\d,\.]+|[\d,\.]+\s*(USD|BRL|EUR)/i) && text.length < 50) {
          candidates.push({
            text,
            className: (el as any).className,
            id: (el as any).id,
            tagName: el.tagName
          });
        }
      }
      return candidates;
    });
    
    console.log('🔍 CANDIDATOS A SALDO ENCONTRADOS:', JSON.stringify(allPossibleBalance, null, 2));
    
    let balance = null;
    let currency = 'USD';
    
    for (const selector of balanceSelectors) {
      try {
        const balanceElement = await page.$(selector);
        if (balanceElement) {
          const balanceText = await page.evaluate((el: any) => el.textContent?.trim() || '', balanceElement);
          console.log(`🔍 Saldo encontrado com seletor ${selector}: ${balanceText}`);
          
          // Extrair número do texto
          const numberMatch = balanceText.match(/[\d,\.]+/);
          if (numberMatch) {
            balance = parseFloat(numberMatch[0].replace(',', '.'));
            
            // Extrair moeda se possível
            const currencyMatch = balanceText.match(/[A-Z]{3}/);
            if (currencyMatch) {
              currency = currencyMatch[0];
            }
            break;
          }
        }
      } catch (e) {
        console.log(`❌ Erro no seletor ${selector}:`, e);
      }
    }
    
    // Se não encontrou pelos seletores, tentar pelos candidatos encontrados
    if (balance === null && allPossibleBalance.length > 0) {
      const firstCandidate = allPossibleBalance[0];
      const numberMatch = firstCandidate.text.match(/[\d,\.]+/);
      if (numberMatch) {
        balance = parseFloat(numberMatch[0].replace(',', '.'));
        console.log(`✅ Saldo extraído de candidato: ${balance}`);
      }
    }
    
    if (balance !== null) {
      console.log(`✅ Saldo final encontrado: ${balance} ${currency}`);
      return {
        success: true,
        balance,
        currency
      };
    } else {
      // Debug - salvar screenshot para análise
      const debugPath = path.join(__dirname, '..', 'debug-avalon-balance.png');
      await page.screenshot({ path: debugPath, fullPage: true });
      
      return {
        success: false,
        message: `Saldo não encontrado. ${allPossibleBalance.length} candidatos encontrados. Screenshot salvo em debug-avalon-balance.png`
      };
    }
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar saldo na Avalon:', error);
    return {
      success: false,
      message: `Erro ao buscar saldo: ${error?.message || 'Erro desconhecido'}`
    };
  }
}

// Função para buscar pares disponíveis na Avalon
export async function getAvalonPairs(page: any): Promise<AvalonPairsResult> {
  try {
    console.log('📊 Buscando pares disponíveis na Avalon Broker...');
    
    // Aguardar página carregar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Possíveis seletores para lista de pares/ativos
    const pairSelectors = [
      '.asset-list',
      '.pairs-list',
      '.trading-pairs',
      '[class*="asset"]',
      '[class*="pair"]',
      '[data-testid*="asset"]',
      '.instruments',
      '.trading-instruments',
      '.market-list',
      '.symbols-list'
    ];
    
    let pairs: string[] = [];
    
    for (const selector of pairSelectors) {
      try {
        const elements = await page.$$(selector);
        if (elements.length > 0) {
          console.log(`🔍 Lista de pares encontrada com seletor: ${selector}`);
          
          // Extrair texto de cada elemento
          for (const element of elements) {
            const pairText = await page.evaluate((el: any) => el.textContent?.trim() || '', element);
            
            // Procurar por padrões de pares (EUR/USD, EURUSD, etc.)
            const pairMatches = pairText.match(/[A-Z]{3}[\\/]?[A-Z]{3}/g);
            if (pairMatches) {
              pairs.push(...pairMatches);
            }
          }
          
          if (pairs.length > 0) break;
        }
      } catch (e) {
        console.log(`❌ Erro no seletor ${selector}:`, e);
      }
    }
    
    // Se não encontrou pares específicos, tentar buscar por texto na página
    if (pairs.length === 0) {
      const pageText = await page.evaluate(() => document.body.textContent || '');
      const commonPairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF', 'USD/CAD', 'NZD/USD'];
      
      pairs = commonPairs.filter(pair => pageText.includes(pair));
    }
    
    // Remover duplicatas
    pairs = [...new Set(pairs)];
    
    if (pairs.length > 0) {
      console.log(`✅ ${pairs.length} pares encontrados:`, pairs);
      return {
        success: true,
        pairs
      };
    } else {
      // Debug - salvar screenshot
      const debugPath = path.join(__dirname, '..', 'debug-avalon-pairs.png');
      await page.screenshot({ path: debugPath, fullPage: true });
      
      return {
        success: false,
        message: 'Nenhum par encontrado. Screenshot salvo em debug-avalon-pairs.png'
      };
    }
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar pares na Avalon:', error);
    return {
      success: false,
      message: `Erro ao buscar pares: ${error?.message || 'Erro desconhecido'}`
    };
  }
}