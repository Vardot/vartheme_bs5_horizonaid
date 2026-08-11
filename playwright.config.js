// Playwright launch/context options for the theme functional testing suite.
// Plain CommonJS so cucumber-js needs no TypeScript loader.
const headless = (process.env.HEADLESS || 'true') !== 'false';

module.exports = {
  browser: process.env.BROWSER || 'chromium',
  launchOptions: {
    headless,
    slowMo: Number(process.env.SLOW_MO || 0),
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--ignore-certificate-errors',
      '--window-size=1920,1080',
    ],
  },
  contextOptions: {
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
  },
};
