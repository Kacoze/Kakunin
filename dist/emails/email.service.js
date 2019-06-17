"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_helper_1 = require("../core/config.helper");
const mailtrap_client_1 = require("./adapter/mailtrap.client");
class EmailService {
    constructor(config, defaultAdapters) {
        this.config = config;
        this.availableAdapters = defaultAdapters;
    }
    clearInbox() {
        const adapter = this.getAdapter();
        return adapter.clearInbox();
    }
    getEmails() {
        const adapter = this.getAdapter();
        return adapter.getEmails();
    }
    getAttachments(email) {
        const adapter = this.getAdapter();
        return adapter.getAttachments(email);
    }
    markAsRead(email) {
        const adapter = this.getAdapter();
        return adapter.markAsRead(email);
    }
    addAdapter(adapter) {
        this.availableAdapters.push(adapter);
    }
    getAdapter() {
        const emailAdapter = this.availableAdapters.find(adapter => adapter.isSatisfiedBy(this.config.email));
        if (emailAdapter === undefined) {
            throw new Error('Could not find email adapter for given configuration.');
        }
        return emailAdapter;
    }
}
const mailtrapAdapter = mailtrap_client_1.create();
exports.create = (defaultAdapters = [mailtrapAdapter], config = config_helper_1.default) => {
    return new EmailService(config, defaultAdapters);
};
