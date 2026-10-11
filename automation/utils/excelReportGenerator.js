const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

class ExcelReportGenerator {
  constructor(outputDir = 'reports/Excel') {
    this.outputDir = outputDir;
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  styleHeaders(sheet) {
    const row = sheet.getRow(1);
    row.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    row.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' } // Slate 800
    };
    row.alignment = { vertical: 'middle', horizontal: 'center' };
    row.height = 24;
  }

  applyBordersAndAlignment(sheet) {
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
        // Status highlighting
        if (cell.value === 'PASSED') {
          cell.font = { bold: true, color: { argb: 'FF10B981' } };
        } else if (cell.value === 'FAILED') {
          cell.font = { bold: true, color: { argb: 'FFEF4444' } };
        } else if (cell.value === 'SKIPPED') {
          cell.font = { bold: true, color: { argb: 'FFF59E0B' } };
        }
      });
    });
  }

  async generateAllReports(results, metrics) {
    logger.info('Generating enterprise Excel reports...');

    await this.generateMasterReport(results, metrics);
    await this.generatePassedReport(results.filter(r => r.status === 'PASSED'));
    await this.generateFailedReport(results.filter(r => r.status === 'FAILED'));
    await this.generateSummaryReport(metrics);

    logger.info('All 4 Excel reports generated successfully in ' + this.outputDir);
  }

  async generateMasterReport(results, metrics) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ARJ Automated Test System';
    workbook.created = new Date();

    // Sheet 1: Executed Test Cases
    const s1 = workbook.addWorksheet('Executed Test Cases');
    s1.columns = [
      { header: 'Test ID', key: 'testId', width: 16 },
      { header: 'Module', key: 'module', width: 22 },
      { header: 'Test Name', key: 'name', width: 45 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Execution Time', key: 'duration', width: 18 },
      { header: 'Priority', key: 'priority', width: 12 }
    ];
    this.styleHeaders(s1);
    results.forEach(r => {
      s1.addRow({
        testId: r.testCaseId,
        module: r.module,
        name: r.name,
        status: r.status,
        duration: `${r.durationMs || 0}ms`,
        priority: r.priority || 'P1'
      });
    });
    this.applyBordersAndAlignment(s1);

    // Sheet 2: Passed Tests
    const s2 = workbook.addWorksheet('Passed Tests');
    s2.columns = [
      { header: 'Test ID', key: 'testId', width: 16 },
      { header: 'Module', key: 'module', width: 22 },
      { header: 'Test Name', key: 'name', width: 45 },
      { header: 'Execution Time', key: 'duration', width: 18 },
      { header: 'Priority', key: 'priority', width: 12 }
    ];
    this.styleHeaders(s2);
    results.filter(r => r.status === 'PASSED').forEach(r => {
      s2.addRow({
        testId: r.testCaseId,
        module: r.module,
        name: r.name,
        duration: `${r.durationMs || 0}ms`,
        priority: r.priority || 'P1'
      });
    });
    this.applyBordersAndAlignment(s2);

    // Sheet 3: Failed Tests
    const s3 = workbook.addWorksheet('Failed Tests');
    s3.columns = [
      { header: 'Test ID', key: 'testId', width: 16 },
      { header: 'Module', key: 'module', width: 22 },
      { header: 'Test Name', key: 'name', width: 40 },
      { header: 'Failure Reason', key: 'error', width: 45 },
      { header: 'Screenshot', key: 'screenshot', width: 30 }
    ];
    this.styleHeaders(s3);
    results.filter(r => r.status === 'FAILED').forEach(r => {
      s3.addRow({
        testId: r.testCaseId,
        module: r.module,
        name: r.name,
        error: r.error || 'Assertion mismatch',
        screenshot: r.screenshot || 'N/A'
      });
    });
    this.applyBordersAndAlignment(s3);

    // Sheet 4: Skipped Tests
    const s4 = workbook.addWorksheet('Skipped Tests');
    s4.columns = [
      { header: 'Test ID', key: 'testId', width: 16 },
      { header: 'Module', key: 'module', width: 22 },
      { header: 'Test Name', key: 'name', width: 45 },
      { header: 'Skip Reason', key: 'reason', width: 35 }
    ];
    this.styleHeaders(s4);
    results.filter(r => r.status === 'SKIPPED').forEach(r => {
      s4.addRow({
        testId: r.testCaseId,
        module: r.module,
        name: r.name,
        reason: r.error || 'Condition skipped'
      });
    });
    this.applyBordersAndAlignment(s4);

    // Sheet 5: Execution Metrics
    const s5 = workbook.addWorksheet('Execution Metrics');
    s5.columns = [
      { header: 'Metric Name', key: 'metric', width: 30 },
      { header: 'Value', key: 'val', width: 25 }
    ];
    this.styleHeaders(s5);
    s5.addRow({ metric: 'Total Test Cases', val: metrics.total });
    s5.addRow({ metric: 'Passed Tests', val: metrics.passed });
    s5.addRow({ metric: 'Failed Tests', val: metrics.failed });
    s5.addRow({ metric: 'Skipped Tests', val: metrics.skipped });
    s5.addRow({ metric: 'Pass Percentage', val: `${metrics.passRate.toFixed(2)}%` });
    s5.addRow({ metric: 'Execution Duration', val: `${metrics.durationSeconds}s` });
    s5.addRow({ metric: 'Live Base URL', val: metrics.baseUrl });
    s5.addRow({ metric: 'Execution Date', val: metrics.timestamp });
    this.applyBordersAndAlignment(s5);

    // Sheet 6: Defect Summary
    const s6 = workbook.addWorksheet('Defect Summary');
    s6.columns = [
      { header: 'Defect ID', key: 'id', width: 15 },
      { header: 'Associated Test', key: 'test', width: 20 },
      { header: 'Severity', key: 'severity', width: 15 },
      { header: 'Summary', key: 'summary', width: 50 }
    ];
    this.styleHeaders(s6);
    results.filter(r => r.status === 'FAILED').forEach((r, idx) => {
      s6.addRow({
        id: `DEF-${idx + 1}`,
        test: r.testCaseId,
        severity: r.priority === 'P0' ? 'Critical' : 'High',
        summary: r.error || 'Test failure observed during execution'
      });
    });
    this.applyBordersAndAlignment(s6);

    const file = path.join(this.outputDir, 'Automation_Test_Report.xlsx');
    await workbook.xlsx.writeFile(file);
  }

  async generatePassedReport(passed) {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Passed Test Cases');
    ws.columns = [
      { header: 'Test ID', key: 'testId', width: 16 },
      { header: 'Module', key: 'module', width: 22 },
      { header: 'Test Name', key: 'name', width: 45 },
      { header: 'Status', key: 'status', width: 14 }
    ];
    this.styleHeaders(ws);
    passed.forEach(r => ws.addRow({ testId: r.testCaseId, module: r.module, name: r.name, status: 'PASSED' }));
    this.applyBordersAndAlignment(ws);
    await wb.xlsx.writeFile(path.join(this.outputDir, 'Passed_Test_Cases.xlsx'));
  }

  async generateFailedReport(failed) {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Failed Test Cases');
    ws.columns = [
      { header: 'Test ID', key: 'testId', width: 16 },
      { header: 'Module', key: 'module', width: 22 },
      { header: 'Test Name', key: 'name', width: 45 },
      { header: 'Error Details', key: 'error', width: 50 }
    ];
    this.styleHeaders(ws);
    failed.forEach(r => ws.addRow({ testId: r.testCaseId, module: r.module, name: r.name, error: r.error }));
    this.applyBordersAndAlignment(ws);
    await wb.xlsx.writeFile(path.join(this.outputDir, 'Failed_Test_Cases.xlsx'));
  }

  async generateSummaryReport(metrics) {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Summary');
    ws.columns = [
      { header: 'Key Metric', key: 'key', width: 30 },
      { header: 'Execution Result', key: 'val', width: 30 }
    ];
    this.styleHeaders(ws);
    ws.addRow({ key: 'Total Cases', val: metrics.total });
    ws.addRow({ key: 'Passed', val: metrics.passed });
    ws.addRow({ key: 'Failed', val: metrics.failed });
    ws.addRow({ key: 'Skipped', val: metrics.skipped });
    ws.addRow({ key: 'Pass Rate', val: `${metrics.passRate.toFixed(2)}%` });
    ws.addRow({ key: 'Status', val: metrics.passRate >= 95 ? 'PASSED (≥95%)' : 'FAILED (<95%)' });
    this.applyBordersAndAlignment(ws);
    await wb.xlsx.writeFile(path.join(this.outputDir, 'Summary_Report.xlsx'));
  }
}

module.exports = new ExcelReportGenerator();
