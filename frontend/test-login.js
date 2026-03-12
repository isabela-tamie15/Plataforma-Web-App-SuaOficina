import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    let logs = [];
    page.on('console', msg => {
        logs.push(`[CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
    });
    page.on('pageerror', error => {
        logs.push(`[ERROR] ${error.message}`);
    });
    page.on('response', response => {
        if(response.url().includes('supabase.co')) {
            logs.push(`[NETWORK] ${response.status()} ${response.url()}`);
        }
    });
    page.on('requestfailed', request => {
        logs.push(`[NETWORK_FAIL] ${request.url()} - ${request.failure()?.errorText}`);
    });

    try {
        console.log('Navigating to http://localhost:5173/oficina/login...');
        await page.goto('http://localhost:5173/oficina/login', { waitUntil: 'networkidle0' });

        console.log('Filling form...');
        await page.type('#oficina-email', 'oficina@suaoficina.com');
        await page.type('#oficina-password', 'Oficina@123');

        console.log('Clicking login...');
        const loginPromise = page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(() => null);
        await page.click('button[type="submit"]');

        console.log('Waiting 5s...');
        await new Promise(r => setTimeout(r, 5000));
        
        console.log('Current URL after 5s:', page.url());

    } catch (e) {
        console.error('Script Error:', e);
    } finally {
        console.log('\n--- BROWSER LOGS ---');
        logs.forEach(l => console.log(l));
        await browser.close();
    }
})();
