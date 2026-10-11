const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.emailInput = 'input[type="email"], input[placeholder*="email" i]';
    this.passwordInput = 'input[type="password"], input[placeholder*="password" i]';
    this.submitButton = 'button[type="submit"], button.btn-primary, button:contains("Sign In")';
    this.toastNotification = '.toast, .notification, [role="alert"]';
    this.forgotPasswordButton = 'button:contains("Forgot"), a:contains("Forgot")';
  }

  async open() {
    await this.navigate('');
  }

  async login(email, password) {
    if (await this.isVisible(this.emailInput)) {
      await this.type(this.emailInput, email);
    }
    if (await this.isVisible(this.passwordInput)) {
      await this.type(this.passwordInput, password);
    }
    // Attempt form submit or click button
    await this.evaluate(`
      const btn = document.querySelector('button[type="submit"]') || Array.from(document.querySelectorAll('button')).find(b => /sign in|login/i.test(b.innerText));
      if (btn) btn.click();
    `);
  }

  async getToastMessage() {
    return await this.evaluate(`
      const t = document.querySelector('.toast, .notification, [role="alert"]') || Array.from(document.querySelectorAll('div')).find(d => /welcome|register|password|invalid/i.test(d.innerText));
      return t ? t.innerText.trim() : '';
    `);
  }
}

module.exports = LoginPage;
