"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const cucumber_1 = require("cucumber");
const comparators_1 = require("../comparators");
const config_helper_1 = require("../core/config.helper");
const matchers_1 = require("../matchers");
const wait_for_condition_helper_1 = require("../web/cucumber/wait-for-condition.helper");
const variable_store_helper_1 = require("../web/variable-store.helper");
const timeout = parseInt(config_helper_1.default.elementsVisibilityTimeout) * 1000;
const handlePromises = (hashedData, onSuccess, onReject) => resolvedPromises => {
    for (let i = 0; i < resolvedPromises.length; i += hashedData.length) {
        let allFieldsMatching = true;
        for (let j = i; j < i + hashedData.length; j++) {
            if (resolvedPromises[j] === false) {
                allFieldsMatching = false;
                break;
            }
        }
        if (allFieldsMatching) {
            return onSuccess();
        }
    }
    return onReject();
};
function checkNumberOfElements(numberExpression, element) {
    const self = this;
    const numberPattern = /\d+/g;
    const numbers = numberExpression.match(numberPattern).map(item => parseInt(item));
    const expectFunction = async (words, num) => {
        const numberOfElements = await self.currentPage.getNumberOfElements(element);
        return chai.expect(numberOfElements).to.be[words.pop()](...num);
    };
    return expectFunction(numberExpression.substr(0, numberExpression.indexOf(numbers[0]) - 1).split(' '), numbers);
}
cucumber_1.When(/^I wait for "([^"]*)" of the "([^"]*)" element$/, function (condition, elementName) {
    if (this.currentPage.getElement(elementName) instanceof protractor.ElementArrayFinder) {
        return wait_for_condition_helper_1.waitForCondition(condition, timeout)(this.currentPage.getElement(elementName).first());
    }
    return wait_for_condition_helper_1.waitForCondition(condition, timeout)(this.currentPage.getElement(elementName));
});
cucumber_1.When(/^I scroll to the "([^"]*)" element$/, function (elementName) {
    return this.currentPage.scrollIntoElement(elementName);
});
cucumber_1.When(/^I click the "([^"]*)" element$/, function (elementName) {
    return this.currentPage
        .scrollIntoElement(elementName)
        .catch(() => Promise.resolve())
        .then(() => this.currentPage.waitForVisibilityOf(elementName))
        .then(() => this.currentPage.scrollIntoElement(elementName))
        .then(() => this.currentPage.click(elementName))
        .catch(() => {
        return wait_for_condition_helper_1.waitForCondition('elementToBeClickable', timeout)(this.currentPage.getElement(elementName)).then(() => {
            return this.currentPage.click(elementName);
        });
    })
        .catch(() => {
        console.warn('Warning! Element was not clickable. We need to scroll it down.');
        return browser
            .executeScript('window.scrollBy(0,50);')
            .then(() => this.currentPage.waitForVisibilityOf(elementName))
            .then(() => this.currentPage.click(elementName));
    })
        .catch(() => {
        console.warn('Warning! Element was not clickable. We need use the WebDriver method to perform the click action.');
        return browser
            .actions()
            .mouseMove(this.currentPage.getElement(elementName))
            .mouseMove({ x: 5, y: 0 })
            .click()
            .perform();
    })
        .catch(() => {
        return Promise.reject(`Error, after scrolling the element "${elementName}" is still not clickable.`);
    });
});
cucumber_1.When(/^I store the "([^"]*)" element text as "([^"]*)" variable$/, function (elementName, variable) {
    return this.currentPage.waitForVisibilityOf(elementName).then(async () => {
        const elementTag = await this.currentPage[elementName].getTagName(tag => tag);
        if (elementTag === 'input' || elementTag === 'textarea') {
            return this.currentPage
                .getElement(elementName)
                .getAttribute('value')
                .then(value => {
                variable_store_helper_1.default.storeVariable(variable, value);
            });
        }
        return this.currentPage
            .getElement(elementName)
            .getText()
            .then(text => {
            variable_store_helper_1.default.storeVariable(variable, text);
        });
    });
});
cucumber_1.When(/^I update the "([^"]*)" element text as "([^"]*)" variable$/, function (elementName, variable) {
    return this.currentPage.waitForVisibilityOf(elementName).then(() => {
        this.currentPage
            .getElement(elementName)
            .getText()
            .then(text => {
            variable_store_helper_1.default.updateVariable(variable, text);
        });
    });
});
cucumber_1.When(/^I store the "([^"]*)" element text matched by "([^"]*)" as "([^"]*)" variable$/, function (elementName, matcher, variable) {
    const regex = matchers_1.regexBuilder.buildRegex(matcher);
    return this.currentPage.waitForVisibilityOf(elementName).then(() => {
        return this.currentPage
            .getElement(elementName)
            .getText()
            .then(text => {
            const matchedText = text.match(regex);
            if (matchedText === null) {
                return Promise.reject(`Could not match text ${text} with matcher ${matcher}`);
            }
            if (matchedText.length <= 1) {
                return Promise.reject(`Matcher ${matcher} does not contain capturing brackets`);
            }
            variable_store_helper_1.default.storeVariable(variable, matchedText[1]);
        });
    });
});
cucumber_1.When(/^I wait for the "([^"]*)" element to disappear$/, function (elementName, sync) {
    const self = this;
    let maxRepeats = 10;
    const interval = setInterval(() => {
        console.log('Waiting for element to disappear...');
        return self.currentPage.isPresent(elementName).then(isPresent => {
            if (!isPresent) {
                clearInterval(interval);
                sync();
                return;
            }
            maxRepeats--;
            if (maxRepeats === 0) {
                clearInterval(interval);
                sync('Element is still visible');
            }
        });
    }, 1500);
});
cucumber_1.Then(/^the "([^"]*)" element is visible$/, function (elementName) {
    return this.currentPage.isVisible(elementName);
});
cucumber_1.Then(/^the "([^"]*)" element is not visible$/, function (elementName) {
    return this.currentPage
        .isVisible(elementName)
        .then(isVisible => Promise.reject(isVisible))
        .catch(isVisible => {
        if (isVisible === true) {
            return Promise.reject(`Element '${elementName}' should not be visible.`);
        }
        return Promise.resolve();
    });
});
cucumber_1.Then(/^the "([^"]*)" element is disabled$/, async function (elementName) {
    return await expect(this.currentPage.isDisabled(elementName)).resolves.toBe(true);
});
cucumber_1.When(/^I store table "([^"]*)" rows as "([^"]*)" with columns:$/, function (table, variableName, data) {
    const self = this;
    const columns = data.raw().map(element => element[0]);
    const promises = [];
    return this.currentPage.waitForVisibilityOf(table).then(() => {
        return this.currentPage
            .getElement(table)
            .each(element => {
            const rowPromises = [];
            for (const columnIndex in columns) {
                if (columns.hasOwnProperty(columnIndex)) {
                    rowPromises.push(element.element(self.currentPage.getElement(columns[columnIndex]).locator()).getText());
                }
            }
            promises.push(Promise.all(rowPromises));
        })
            .then(() => Promise.all(promises).then(resolvedPromises => {
            variable_store_helper_1.default.storeVariable(variableName, resolvedPromises);
        }));
    });
});
cucumber_1.Then(/^there are following elements in table "([^"]*)":$/, function (table, data) {
    const self = this;
    const allElements = this.currentPage.getElements(table);
    const hashes = data.hashes();
    return this.currentPage.waitForVisibilityOf(table).then(() => {
        return checkNumberOfElements.call(this, `equal ${hashes.length}`, table).then(() => {
            const promises = [];
            return allElements
                .each((element, index) => {
                const hash = hashes[index];
                for (const prop in hash) {
                    if (hash.hasOwnProperty(prop)) {
                        const propValue = hash[prop];
                        promises.push(matchers_1.matchers.match(element.element(self.currentPage.getElement(prop).locator()), variable_store_helper_1.default.replaceTextVariables(propValue)));
                    }
                }
            })
                .then(() => Promise.all(promises));
        });
    });
});
cucumber_1.Then(/^there are "([^"]*)" following elements for element "([^"]*)":$/, function (numberExpression, elementName, data) {
    const self = this;
    const allElements = this.currentPage.getElements(elementName);
    const hashedData = data.raw();
    if (hashedData.length === 0) {
        return Promise.reject('Missing table under the step.');
    }
    return this.currentPage.waitForVisibilityOf(elementName).then(() => {
        return checkNumberOfElements.call(this, numberExpression, elementName).then(() => {
            const promises = [];
            return allElements
                .each(element => {
                hashedData.forEach(hash => {
                    promises.push(matchers_1.matchers.match(element.element(self.currentPage.getElement(hash[0]).locator()), variable_store_helper_1.default.replaceTextVariables(hash[1])));
                });
            })
                .then(() => Promise.all(promises));
        });
    });
});
cucumber_1.Then(/^there are "([^"]*)" dropdown list elements with following options:$/, function (elementName, data) {
    const allOptionElements = this.currentPage.getElement(elementName);
    const hashedData = data.raw();
    if (hashedData.length === 0) {
        return Promise.reject('Missing table under the step.');
    }
    return this.currentPage.waitForVisibilityOf(elementName).then(() => {
        allOptionElements.getText().then(textArray => {
            if (textArray.length === hashedData.length) {
                hashedData.forEach(hash => {
                    textArray.splice(textArray.indexOf(hash), 1);
                });
            }
            else {
                return Promise.reject("Number of options doesn't match the number of asked");
            }
            expect(textArray.length).toEqual(0);
        });
    });
});
cucumber_1.Then(/^there is element "([^"]*)" with value "([^"]*)"$/, function (elementName, value) {
    const pageElement = this.currentPage.getElement(elementName);
    return this.currentPage.waitForVisibilityOf(elementName).then(() => {
        return matchers_1.matchers
            .match(pageElement, variable_store_helper_1.default.replaceTextVariables(value))
            .then(matcherResult => expect(matcherResult).toBe(true));
    });
});
cucumber_1.Then(/^there is no element "([^"]*)" with value "([^"]*)"$/, function (elementName, value) {
    const pageElement = this.currentPage.getElement(elementName);
    return matchers_1.matchers
        .match(pageElement, variable_store_helper_1.default.replaceTextVariables(value))
        .catch(() => Promise.resolve(false))
        .then(result => (result ? Promise.reject() : Promise.resolve()));
});
cucumber_1.Then(/^there is element "([^"]*)" containing "([^"]*)" text$/, function (elementName, value) {
    const pageElement = this.currentPage.getElement(elementName);
    return this.currentPage.waitForVisibilityOf(elementName).then(() => {
        return matchers_1.matchers.match(pageElement, variable_store_helper_1.default.replaceTextVariables(`t:${value}`));
    });
});
cucumber_1.Then(/^there is no element "([^"]*)" containing "([^"]*)" text$/, function (elementName, value) {
    const pageElement = this.currentPage.getElement(elementName);
    return matchers_1.matchers
        .match(pageElement, variable_store_helper_1.default.replaceTextVariables(`t:${value}`))
        .catch(() => Promise.resolve(false))
        .then(result => (result ? Promise.reject() : Promise.resolve()));
});
cucumber_1.Then(/^there is element "([^"]*)" matching "([^"]*)" matcher$/, function (elementName, matcher) {
    const pageElement = this.currentPage.getElement(elementName);
    return this.currentPage.waitForVisibilityOf(elementName).then(() => {
        return matchers_1.matchers
            .match(pageElement, variable_store_helper_1.default.replaceTextVariables(`f:${matcher}`))
            .then(matcherResult => expect(matcherResult).toBe(true));
    });
});
cucumber_1.Then(/^there is no element "([^"]*)" matching "([^"]*)" matcher$/, function (elementName, matcher) {
    const pageElement = this.currentPage.getElement(elementName);
    return this.currentPage.waitForVisibilityOf(elementName).then(() => {
        return matchers_1.matchers
            .match(pageElement, variable_store_helper_1.default.replaceTextVariables(`f:${matcher}`))
            .catch(() => Promise.resolve(false))
            .then(result => (result ? Promise.reject() : Promise.resolve()));
    });
});
cucumber_1.Then(/^there is element "([^"]*)" with "([^"]*)" regex$/, function (elementName, matcher) {
    const pageElement = this.currentPage.getElement(elementName);
    return this.currentPage.waitForVisibilityOf(elementName).then(() => {
        return matchers_1.matchers
            .match(pageElement, variable_store_helper_1.default.replaceTextVariables(`r:${matcher}`))
            .then(matcherResult => expect(matcherResult).toBe(true));
    });
});
cucumber_1.Then(/^there is no element "([^"]*)" with "([^"]*)" regex$/, function (elementName, matcher) {
    const pageElement = this.currentPage.getElement(elementName);
    return this.currentPage.waitForVisibilityOf(elementName).then(() => {
        return matchers_1.matchers
            .match(pageElement, variable_store_helper_1.default.replaceTextVariables(`r:${matcher}`))
            .catch(() => Promise.resolve(false))
            .then(result => (result ? Promise.reject() : Promise.resolve()));
    });
});
cucumber_1.Then(/^there are "([^"]*)" "([^"]*)" elements$/, checkNumberOfElements);
cucumber_1.Then(/^every "([^"]*)" element should have the same value for element "([^"]*)"$/, function (containerName, elementName) {
    const self = this;
    return this.currentPage.waitForVisibilityOf(containerName).then(() => {
        return this.currentPage
            .getElements(containerName)
            .first()
            .element(self.currentPage.getElement(elementName).locator())
            .getText()
            .then(firstElementText => {
            return self.currentPage.getElements(containerName).each(containerElement => {
                containerElement
                    .element(self.currentPage.getElement(elementName).locator())
                    .getText()
                    .then(elementText => {
                    expect(elementText).toEqual(firstElementText);
                });
            });
        });
    });
});
cucumber_1.Then(/^the element "([^"]*)" should have an item with values:$/, function (elementName, data) {
    const self = this;
    const allElements = this.currentPage.getElements(elementName);
    const hashedData = data.raw();
    if (hashedData.length === 0) {
        return Promise.reject('Missing table under the step.');
    }
    const promises = [];
    return this.currentPage
        .waitForVisibilityOf(elementName)
        .then(() => allElements.each(element => {
        hashedData.forEach(hash => {
            promises.push(matchers_1.matchers
                .match(element.element(self.currentPage.getElement(hash[0]).locator()), variable_store_helper_1.default.replaceTextVariables(hash[1]))
                .catch(() => false));
        });
    }))
        .then(() => Promise.all(promises).then(handlePromises(hashedData, () => Promise.resolve(), () => Promise.reject('No matching element has been found.'))));
});
cucumber_1.Then(/^the element "([^"]*)" should not have an item with values:$/, function (elementName, data) {
    const self = this;
    const allElements = this.currentPage.getElements(elementName);
    const hashedData = data.raw();
    if (hashedData.length === 0) {
        return Promise.reject('Missing table under the step.');
    }
    const promises = [];
    return allElements
        .each(element => {
        hashedData.forEach(hash => {
            promises.push(matchers_1.matchers
                .match(element.element(self.currentPage.getElement(hash[0]).locator()), variable_store_helper_1.default.replaceTextVariables(hash[1]))
                .catch(() => false));
        });
    })
        .then(() => Promise.all(promises).then(handlePromises(hashedData, () => Promise.reject('Matching element has been found'), () => Promise.resolve())));
});
cucumber_1.Then(/^"([^"]*)" value on the "([^"]*)" list is sorted in "([^"]*)" order$/, function (elementValue, elementList, dependency) {
    const self = this;
    const promise = [];
    return this.currentPage.waitForVisibilityOf(elementList).then(() => {
        return self.currentPage
            .getElements(elementList)
            .each(singleElement => {
            promise.push(singleElement.element(self.currentPage.getElement(elementValue).locator()).getText());
        })
            .then(() => Promise.all(promise))
            .then(elementsValues => comparators_1.comparators.compare(elementsValues, dependency));
    });
});
cucumber_1.When(/^I infinitely scroll to the "([^"]*)" element$/, function (elementName) {
    const self = this;
    const scrollToLoader = () => {
        return self.currentPage
            .isPresent(elementName)
            .then(isPresent => {
            if (isPresent) {
                return self.currentPage.scrollIntoElement(elementName);
            }
            return Promise.resolve();
        })
            .then(() => self.currentPage.isPresent(elementName))
            .then(isPresent => {
            if (isPresent) {
                return browser.sleep(1000).then(() => scrollToLoader());
            }
            return Promise.resolve();
        });
    };
    return scrollToLoader();
});
cucumber_1.When(/^I press the "([^"]*)" key$/, key => {
    const keyTransformed = key.toUpperCase();
    return Promise.resolve(browser
        .actions()
        .sendKeys(protractor.Key[keyTransformed])
        .perform());
});
cucumber_1.When(/^I drag "([^"]*)" element and drop over "([^"]*)" element$/, async function (elementDrag, elementDrop) {
    const wait = timeToWait => browser.sleep(timeToWait);
    await this.currentPage.waitForVisibilityOf(elementDrag);
    await browser
        .actions()
        .mouseMove(this.currentPage.getElement(elementDrag))
        .perform();
    await wait(200);
    await browser
        .actions()
        .mouseDown()
        .perform();
    await wait(200);
    await browser
        .actions()
        .mouseMove(this.currentPage.getElement(elementDrop))
        .perform();
    await wait(200);
    await browser
        .actions()
        .mouseUp()
        .perform();
});
