"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("cucumber");
const sugar = require("sugar-date/index");
const config_helper_1 = require("../core/config.helper");
const filters_1 = require("../emails/filters");
const matchers_1 = require("../matchers");
const emails_1 = require("../emails");
function stopInterval(interval, callback) {
    clearInterval(interval);
    callback();
}
function checkAttachmentsInEmail(email, filesExtensions, attachments) {
    let fileAttachments = attachments.filter(attachment => attachment.attachment_type === 'attachment');
    const missingFiles = filesExtensions.reduce((previous, current) => {
        const expectedFile = fileAttachments.find(attachment => {
            return (matchers_1.regexBuilder.buildRegex(current.name).test(attachment.filename) &&
                matchers_1.regexBuilder.buildRegex(current.type).test(attachment.content_type) &&
                attachment.attachment_size >= current.minimalSize);
        });
        if (typeof expectedFile === 'undefined') {
            previous.push(current);
            return previous;
        }
        fileAttachments = fileAttachments.filter(attachment => attachment.id !== expectedFile.id);
        return previous;
    }, []);
    if (missingFiles.length === 0) {
        return emails_1.emailService.markAsRead(email);
    }
    return Promise.reject('Some attachments not found: ' + missingFiles.map(file => file.name).join(', '));
}
function filterEmails(emails, data) {
    let originalEmails = emails;
    const checks = data.raw().filter(elem => elem[0] !== 'file');
    for (const check of checks) {
        const checkType = check[0];
        const checkValue = check[1];
        originalEmails = filters_1.filters.filter(originalEmails, checkType, checkValue, this);
    }
    return originalEmails;
}
function getFilesExtensions(data) {
    return data
        .raw()
        .filter(elem => elem[0] === 'file')
        .map(elem => {
        return { name: elem[1], type: elem[2], minimalSize: elem[3] };
    });
}
function rejectIfMaxRepeatsReached(filteredEmails, maxRepeats) {
    if (filteredEmails.length === 0 && maxRepeats === 0) {
        return Promise.reject('No emails found and maximum repeats reached');
    }
    return filteredEmails;
}
function rejectIfMoreThanOneEmailFound(filteredEmails) {
    if (filteredEmails.length > 1) {
        return Promise.reject('More than one email found');
    }
    return filteredEmails;
}
function rejectIfEmailFound(filteredEmails) {
    if (filteredEmails.length > 0) {
        return Promise.reject('Email has been found!');
    }
    return filteredEmails;
}
function validateEmailDate(filteredEmails) {
    if (filteredEmails.length === 1 && sugar.Date.minutesFromNow(sugar.Date.create(filteredEmails[0].created_at)) < -10) {
        return Promise.reject('Email was sent more than 10 minutes ago. This is probably not what you are looking for.');
    }
    return filteredEmails;
}
function validateEmailContentAndAttachments(filteredEmails, data, interval, sync) {
    if (filteredEmails.length === 1) {
        const filesExtensions = getFilesExtensions(data);
        if (filesExtensions.length > 0) {
            return emails_1.emailService
                .getAttachments(filteredEmails[0])
                .then(checkAttachmentsInEmail.bind(null, filteredEmails[0], filesExtensions))
                .then(stopInterval.bind(null, interval, sync));
        }
        return emails_1.emailService.markAsRead(filteredEmails[0]).then(stopInterval.bind(null, interval, sync));
    }
}
cucumber_1.Then(/^the email has been sent and contains:$/, function (data, sync) {
    const self = this;
    const timeout = parseInt(config_helper_1.default.intervalEmail) * 1000;
    let maxRepeats = config_helper_1.default.maxEmailRepeats === undefined ? 5 : parseInt(config_helper_1.default.maxEmailRepeats);
    const interval = setInterval(() => {
        console.log('Checking mailbox for email...');
        emails_1.emailService
            .getEmails()
            .then(emails => filterEmails.call(self, emails, data))
            .then(filteredEmails => rejectIfMaxRepeatsReached(filteredEmails, maxRepeats))
            .then(filteredEmails => rejectIfMoreThanOneEmailFound(filteredEmails))
            .then(filteredEmails => validateEmailDate(filteredEmails))
            .then(filteredEmails => validateEmailContentAndAttachments(filteredEmails, data, interval, sync))
            .then(() => maxRepeats--)
            .catch(err => stopInterval(interval, sync.bind(null, err)));
    }, timeout);
});
cucumber_1.Then(/^the email with the following data has not been sent:$/, function (data, sync) {
    const self = this;
    const timeout = parseInt(config_helper_1.default.intervalEmail) * 1000;
    let maxRepeats = 5;
    const interval = setInterval(() => {
        console.log('Checking mailbox for email...');
        emails_1.emailService
            .getEmails()
            .then(emails => filterEmails.call(self, emails, data))
            .then(filteredEmails => rejectIfEmailFound(filteredEmails))
            .then(filteredEmails => rejectIfMaxRepeatsReached(filteredEmails, maxRepeats))
            .then(() => maxRepeats--)
            .catch(err => {
            err === 'No emails found and maximum repeats reached'
                ? stopInterval(interval, sync)
                : stopInterval(interval, sync.bind(null, err));
        });
    }, timeout);
});
