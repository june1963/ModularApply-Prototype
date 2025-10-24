import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      console.log(`[${type.toUpperCase()}] ${msg.text()}`);
    }
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('[PAGE ERROR]', error.message);
  });
  
  // Listen for network errors
  page.on('requestfailed', request => {
    console.log('[NETWORK ERROR]', request.url(), request.failure().errorText);
  });
  
  console.log('Opening http://localhost:5173...');
  
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    console.log('\n✓ Page loaded successfully!');
    
    // Wait a bit to see if any errors occur
    await page.waitForTimeout(2000);
    
    // Take a screenshot
    await page.screenshot({ path: 'app-screenshot.png', fullPage: true });
    console.log('✓ Screenshot saved as app-screenshot.png');
    
    // Check page title
    const title = await page.title();
    console.log(`✓ Page title: ${title}`);
    
    // Keep browser open for inspection
    console.log('\nBrowser is open for inspection. Press Ctrl+C to close.');
    
  } catch (error) {
    console.error('Error loading page:', error.message);
    await browser.close();
  }
})();
