"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MinimalEmailSizeFilter {
    isSatisfiedBy(type) {
        return type === 'minimalEmailSize';
    }
    filter(emails, type, value) {
        return emails.filter(email => email.email_size >= parseInt(value));
    }
}
exports.minimalEmailSizeFilter = new MinimalEmailSizeFilter();
