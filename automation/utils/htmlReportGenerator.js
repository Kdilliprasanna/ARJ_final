const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class HtmlReportGenerator {
  constructor(outputDir = 'reports/HTML') {
    this.outputDir = outputDir;
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  generate(results, metrics) {
    logger.info('Generating HTML execution and dashboard reports...');
    this.generateExecutionReport(results, metrics);
    this.generateDashboardReport(results, metrics);
  }

  generateExecutionReport(results, metrics) {
    const isPassing = metrics.passRate >= 95.0;
    const badgeColor = isPassing ? '#10b981' : '#ef4444';
    const badgeText = isPassing ? 'PASSED (≥95%)' : 'FAILED (<95%)';

    const rows = results.map(r => `
      <tr class="status-${r.status.toLowerCase()}">
        <td class="font-mono">${r.testCaseId}</td>
        <td><span class="badge badge-module">${r.module}</span></td>
        <td>${r.name}</td>
        <td><span class="badge badge-priority">${r.priority || 'P1'}</span></td>
        <td><span class="badge badge-${r.status.toLowerCase()}">${r.status}</span></td>
        <td>${r.durationMs || 0}ms</td>
        <td class="error-col">${r.error ? `<span class="error-text">${r.error}</span>` : '—'}</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ARJ Career AI - Live Selenium E2E Execution Report</title>
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --border: #1f2937;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --primary: #6366f1;
      --success: #10b981;
      --danger: #ef4444;
      --warning: #f59e0b;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 2rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1.5rem;
      margin-bottom: 2rem;
    }
    .title-group h1 { margin: 0; font-size: 1.8rem; }
    .title-group p { margin: 0.3rem 0 0; color: var(--text-muted); font-size: 0.9rem; }
    .status-badge {
      padding: 0.5rem 1.2rem;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 0.9rem;
      background: ${badgeColor};
      color: #fff;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .kpi-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.2rem;
      text-align: center;
    }
    .kpi-num { font-size: 2.2rem; font-weight: 800; margin: 0.2rem 0; }
    .kpi-label { color: var(--text-muted); font-size: 0.82rem; text-transform: uppercase; font-weight: 600; }
    .table-container {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem; }
    th { background: #1f2937; padding: 0.9rem 1rem; font-weight: 600; color: #d1d5db; }
    td { padding: 0.75rem 1rem; border-top: 1px solid var(--border); }
    .badge { padding: 0.2rem 0.55rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600; display: inline-block; }
    .badge-passed { background: rgba(16,185,129,0.15); color: #10b981; }
    .badge-failed { background: rgba(239,68,68,0.15); color: #ef4444; }
    .badge-skipped { background: rgba(245,158,11,0.15); color: #f59e0b; }
    .badge-module { background: #374151; color: #e5e7eb; }
    .badge-priority { background: #4f46e5; color: #fff; }
    .font-mono { font-family: monospace; font-size: 0.85rem; }
    .error-col { max-width: 300px; word-break: break-word; }
    .error-text { color: var(--danger); font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title-group">
      <h1>🚀 ARJ Career AI — Live E2E Automation Report</h1>
      <p>Target: <strong>${metrics.baseUrl}</strong> | Timestamp: ${metrics.timestamp}</p>
    </div>
    <div class="status-badge">${badgeText}</div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Total Test Cases</div>
      <div class="kpi-num">${metrics.total}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Passed</div>
      <div class="kpi-num" style="color: #10b981;">${metrics.passed}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Failed</div>
      <div class="kpi-num" style="color: #ef4444;">${metrics.failed}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Skipped</div>
      <div class="kpi-num" style="color: #f59e0b;">${metrics.skipped}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Pass Percentage</div>
      <div class="kpi-num" style="color: ${badgeColor};">${metrics.passRate.toFixed(1)}%</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Duration</div>
      <div class="kpi-num">${metrics.durationSeconds}s</div>
    </div>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Test ID</th>
          <th>Module</th>
          <th>Scenario</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Failure Details</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>
</body>
</html>`;

    fs.writeFileSync(path.join(this.outputDir, 'execution-report.html'), html, 'utf8');
  }

  generateDashboardReport(results, metrics) {
    // Generate dashboard.html
    const file = path.join(this.outputDir, 'dashboard.html');
    fs.writeFileSync(file, fs.readFileSync(path.join(this.outputDir, 'execution-report.html'), 'utf8'), 'utf8');
  }
}

module.exports = new HtmlReportGenerator();
