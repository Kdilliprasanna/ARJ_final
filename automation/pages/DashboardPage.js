const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.sidebar = '.sidebar, nav';
    this.navItems = 'nav button, .sidebar-nav button, .nav-item';
    this.readinessScore = '.readiness-ring, .readiness-score, [data-testid="readiness"]';
    this.header = 'header, .topbar, .app-header';
  }

  async isDashboardLoaded() {
    return await this.evaluate(`
      return !!(document.querySelector('header, .app-header, nav, .sidebar') || document.body.innerText.includes('ARJ'));
    `);
  }

  async navigateToTab(tabName) {
    return await this.evaluate((name) => {
      const btn = Array.from(document.querySelectorAll('button, a')).find(el => new RegExp(name, 'i').test(el.innerText));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    }, tabName);
  }

  async getPageHeading() {
    return await this.evaluate(`
      const h = document.querySelector('h1, h2, .page-title');
      return h ? h.innerText.trim() : '';
    `);
  }
}

module.exports = DashboardPage;
