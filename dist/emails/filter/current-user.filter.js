"use strict";
// TODO: stop injecting world here and use some kind of a user provider
Object.defineProperty(exports, "__esModule", { value: true });
class CurrentUserFilter {
    isSatisfiedBy(type) {
        return type === 'currentUser';
    }
    filter(emails, type, value, world) {
        return emails.filter(email => email.to_email === world.currentUser.account.email);
    }
}
exports.currentUserFilter = new CurrentUserFilter();
