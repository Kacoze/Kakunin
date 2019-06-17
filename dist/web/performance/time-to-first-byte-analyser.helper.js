"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSON_performance_report_parser_helper_1 = require("./JSON-performance-report-parser.helper");
class TimeToFirstByteAnalyser {
    constructor(jsonPerformanceReportParser) {
        this.reader = jsonPerformanceReportParser;
    }
    checkTiming(fileName, maxTiming) {
        const parsedReport = this.reader.parse(fileName);
        return parsedReport.filter(report => report.ttfb > maxTiming);
    }
}
exports.create = (reportParser = new JSON_performance_report_parser_helper_1.default()) => new TimeToFirstByteAnalyser(reportParser);
