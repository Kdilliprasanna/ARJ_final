/**
 * ARJ Career AI - Environment & Configuration
 * Ensures BASE_URL is strictly parameterized and never hardcoded to localhost.
 */

const rawBaseUrl = process.env.BASE_URL || 'https://kdilliprasanna.github.io/ARJ_final/';
const BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;

const config = {
  baseUrl: BASE_URL,
  isHeadless: process.env.HEADLESS !== 'false', // Defaults to true in CI
  defaultTimeout: parseInt(process.env.TIMEOUT_MS || '15000', 10),
  pageLoadTimeout: parseInt(process.env.PAGE_LOAD_TIMEOUT_MS || '30000', 10),
  explicitWaitTimeout: parseInt(process.env.EXPLICIT_WAIT_MS || '10000', 10),
  retryAttempts: parseInt(process.env.RETRY_ATTEMPTS || '2', 10),
  browserWidth: 1920,
  browserHeight: 1080,
  userAgent: 'ARJ-Selenium-Automation-Runner/1.0 (Headless Chrome; Live E2E)',
  passThresholdPercent: 95.0,
  paths: {
    reports: 'reports',
    excel: 'reports/Excel',
    html: 'reports/HTML',
    screenshots: 'reports/Screenshots',
    logs: 'reports/Logs',
    json: 'reports/JSON',
    summary: 'reports/Summary'
  }
};

module.exports = config;
