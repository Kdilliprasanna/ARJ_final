const { By, until } = require('selenium-webdriver');
const config = require('../config/environment');
const logger = require('../utils/logger');

class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.baseUrl = config.baseUrl;
  }

  async navigate(path = '') {
    const url = `${this.baseUrl}${path.replace(/^\//, '')}`;
    logger.debug(`Navigating to: ${url}`);
    await this.driver.get(url);
    await this.waitForReady();
  }

  async waitForReady() {
    await this.driver.wait(async () => {
      const state = await this.driver.executeScript('return document.readyState');
      return state === 'complete';
    }, config.pageLoadTimeout);
  }

  async find(selector, timeout = config.explicitWaitTimeout) {
    const locator = typeof selector === 'string' ? By.css(selector) : selector;
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async isVisible(selector, timeout = 3000) {
    try {
      const el = await this.find(selector, timeout);
      return await el.isDisplayed();
    } catch {
      return false;
    }
  }

  async click(selector) {
    const el = await this.find(selector);
    await this.driver.wait(until.elementIsVisible(el), 5000);
    await el.click();
  }

  async type(selector, text) {
    const el = await this.find(selector);
    await el.clear();
    await el.sendKeys(text);
  }

  async getText(selector) {
    const el = await this.find(selector);
    return await el.getText();
  }

  async getTitle() {
    return await this.driver.getTitle();
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }

  async evaluate(script, ...args) {
    return await this.driver.executeScript(script, ...args);
  }
}

module.exports = BasePage;
