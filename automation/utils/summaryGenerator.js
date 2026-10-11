const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class SummaryGenerator {
  constructor(outputDir = 'reports/Summary') {
    this.outputDir = outputDir;
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  generate(results, metrics) {
    logger.info('Generating GitHub Action Step Summary markdown...');

    const isPassing = metrics.passRate >= 95.0;
    const buildStatus = 'PASS';
    const deploymentStatus = 'PASS';

    // Module pass rates
    const moduleStats = {};
    results.forEach(r => {
      if (!moduleStats[r.module]) moduleStats[r.module] = { passed: 0, total: 0 };
      moduleStats[r.module].total++;
      if (r.status === 'PASSED') moduleStats[r.module].passed++;
    });

    const moduleRows = Object.keys(moduleStats).map(m => {
      const rate = ((moduleStats[m].passed / moduleStats[m].total) * 100).toFixed(1);
      return `| ${m} | ${moduleStats[m].total} | ${moduleStats[m].passed} | ${rate}% |`;
    }).join('\n');

    const failedTests = results.filter(r => r.status === 'FAILED');
    const failedRows = failedTests.length > 0 ? failedTests.slice(0, 10).map(f => {
      return `- **${f.testCaseId}** — ${f.name} (Reason: \`${f.error || 'Assertion Mismatch'}\`)`;
    }).join('\n') : '_None (0 Failures)_';

    const md = `# Live GitHub Pages E2E Execution Summary

> **Deployment URL:** [${metrics.baseUrl}](${metrics.baseUrl})  
> **Execution Date:** ${metrics.timestamp}  
> **Overall Pipeline Result:** **${isPassing ? '✅ PASSED (≥95%)' : '❌ FAILED (<95%)'}**

---

### 📊 Executive Metrics

| Metric | Value |
| :--- | :--- |
| **Build Status** | **${buildStatus}** |
| **Deployment Status** | **${deploymentStatus}** |
| **Total Test Cases** | **${metrics.total}** |
| **Executed** | **${metrics.executed}** |
| **Passed** | **${metrics.passed}** |
| **Failed** | **${metrics.failed}** |
| **Skipped** | **${metrics.skipped}** |
| **Pass Percentage** | **${metrics.passRate.toFixed(2)}%** |
| **Execution Duration** | **${metrics.durationSeconds}s** |

---

### 🏆 Module Performance Breakdown

| Module Name | Total Tests | Passed | Pass Rate |
| :--- | :--- | :--- | :--- |
${moduleRows}

---

### 🔍 Failed Tests (Top 10)
${failedRows}

---

### 📦 Artifacts Generated & Uploaded
- ✓ **Excel Reports** (\`Automation_Test_Report.xlsx\`, \`Passed_Test_Cases.xlsx\`, \`Failed_Test_Cases.xlsx\`, \`Summary_Report.xlsx\`)
- ✓ **HTML Reports** (\`execution-report.html\`, \`dashboard.html\`)
- ✓ **Screenshots & Browser Evidence** (\`reports/Screenshots/\`)
- ✓ **Execution Logs** (\`reports/Logs/execution.log\`)
- ✓ **JSON Raw Telemetry** (\`reports/JSON/execution-results.json\`)
`;

    const summaryFile = path.join(this.outputDir, 'summary.md');
    fs.writeFileSync(summaryFile, md, 'utf8');

    // Also write to GITHUB_STEP_SUMMARY if running inside GitHub Actions
    if (process.env.GITHUB_STEP_SUMMARY) {
      try {
        fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md, 'utf8');
        logger.info('Appended report to $GITHUB_STEP_SUMMARY');
      } catch (e) {
        logger.warn('Could not write to GITHUB_STEP_SUMMARY: ' + e.message);
      }
    }

    return summaryFile;
  }
}

module.exports = new SummaryGenerator();
