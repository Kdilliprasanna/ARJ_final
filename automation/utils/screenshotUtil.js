const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class ScreenshotUtil {
  constructor(screenshotDir = 'reports/Screenshots') {
    this.screenshotDir = screenshotDir;
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async capture(driver, testId, label = 'failure') {
    try {
      const sanitizedTestId = testId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `${sanitizedTestId}_${label}_${Date.now()}.png`;
      const filepath = path.join(this.screenshotDir, filename);

      const imageBase64 = await driver.takeScreenshot();
      fs.writeFileSync(filepath, imageBase64, 'base64');
      logger.info(`Screenshot captured: ${filepath}`);
      return filepath;
    } catch (err) {
      logger.warn(`Failed to capture screenshot for ${testId}: ${err.message}`);
      return null;
    }
  }
}

module.exports = new ScreenshotUtil();
