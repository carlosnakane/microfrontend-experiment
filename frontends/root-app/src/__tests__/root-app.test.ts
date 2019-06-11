import { launch, Page, Browser } from 'puppeteer';

describe('Root app navigation and lifecycle', () => {

  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await launch();
    page = await browser.newPage();
  });

  test('blank page', async () => {
    await page.goto('http://localhost:18080');
    await page.waitForSelector('root-menu');
    let html = await page.$eval('body', e => e.innerHTML);
    expect(html).toContain('App A');
    expect(html).toContain('App B');
  }, 3000)

  test('navigate to app-a and render it', async () => {
    const appALinkHandle = await page.evaluateHandle(`document.querySelector("body > root-menu").shadowRoot.querySelector("div > ul > li:nth-child(1) > a")`);
    // @ts-ignore
    appALinkHandle.click();
    await page.waitForSelector('div.App');
    const html = await page.$eval('body', e => e.innerHTML);
    expect(html).toContain('Learn React');
  }, 3000)

  test('navigate to app-b and render it', async () => {
    const appBLinkHandle = await page.evaluateHandle(`document.querySelector("body > root-menu").shadowRoot.querySelector("div > ul > li:nth-child(2) > a")`);
    // @ts-ignore
    appBLinkHandle.click();
    await page.waitForSelector('h1');
    const html = await page.$eval('body', e => e.innerHTML);
    expect(html).toContain('Welcome to app-b!');
  }, 3000);

  afterAll(async () => {
    await page.close();
  });


});
