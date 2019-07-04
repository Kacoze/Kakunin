"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hookHandler = require("./index");
class HookHandlers {
    constructor(availableHandlers = [
        hookHandler.takeScreenshotHook,
        hookHandler.reloadFixturesHook,
        hookHandler.clearDownloadHook,
        hookHandler.reloadUserHook,
        hookHandler.clearVariablesHook,
    ]) {
        this.availableHandlers = availableHandlers;
    }
    addHook(handler) {
        this.availableHandlers.push(handler);
    }
    initializeHook() {
        const handlers = this.getHooks();
        for (const handler of handlers) {
            handler.initializeHook();
        }
    }
    getHooks() {
        return this.availableHandlers.sort((handler, otherHandler) => handler.getPriority() - otherHandler.getPriority());
    }
}
exports.hookHandlers = new HookHandlers();
