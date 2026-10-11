/**
 * ARJ Career AI - Selenium WebDriver Factory
 * Provides robust Chrome WebDriver instances with optimized flags for CI/CD and Headless execution.
 */

const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../config/environment');

class DriverFactory {
  /**
   * Builds and configures a Selenium Chrome WebDriver instance.
   * @returns {Promise<import('selenium-webdriver').WebDriver>}
   */
  static async createDriver() {
    const options = new chrome.Options();

    if (config.isHeadless) {
      options.addArguments('--headless=new');
    }

    options.addArguments(
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      `--window-size=${config.browserWidth},${config.browserHeight}`,
      `--user-agent=${config.userAgent}`,
      '--ignore-certificate-errors',
      '--allow-running-insecure-content',
      '--disable-notifications',
      '--remote-debugging-port=9222'
    );

    // Logging preferences
    const prefs = {
      'profile.default_content_setting_values.notifications': 2,
      'credentials_enable_service': false,
      'profile.password_manager_enabled': false
    };
    options.setUserPreferences(prefs);

    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.manage().setTimeouts({
      implicit: 5000,
      pageLoad: config.pageLoadTimeout,
      script: config.defaultTimeout
    });

    return driver;
  }
}

module.exports = DriverFactory;
