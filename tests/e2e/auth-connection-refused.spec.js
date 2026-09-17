const { By, Builder, Browser, until } = require("selenium-webdriver");
const { expect } = require("chai");
const LoginPage = require("../pages/LoginPage");

describe("Auth - Connection Refused (Login)", function () {
  this.timeout(30000);
  let driver, login;

  before(async () => {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.manage().setTimeouts({ implicit: 500 });
    login = new LoginPage(driver);
    await login.open();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("shows an error message when credentials are invalid", async () => {
    await login.login("nouser@example.test", "wrongpass");
    const msg = await login.getMessageElement();
    await driver.wait(until.elementIsVisible(msg), 3000);
    const cls = await msg.getAttribute("class");
    const text = await msg.getText();
    expect(cls).to.include("error");
    expect(text.length).to.be.greaterThan(0);
  });
});
