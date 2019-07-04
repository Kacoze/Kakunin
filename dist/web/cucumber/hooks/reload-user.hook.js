"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("cucumber");
class ReloadUserHook {
    initializeHook() {
        cucumber_1.After('@reloadUsers', function (scenario, callback) {
            if (this.currentUser !== null) {
                this.userProvider.lockUser(this.currentUser.account, this.currentUser.type);
            }
            callback();
        });
    }
    getPriority() {
        return 1;
    }
}
exports.reloadUserHook = new ReloadUserHook();
