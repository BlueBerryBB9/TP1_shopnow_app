const { By, Builder, Browser, until } = require("selenium-webdriver");
const { expect } = require("chai");

describe("E2E - Login", function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.get("http://localhost:3000");
    await driver.manage().setTimeouts({ implicit: 500 });
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("opens the login form", async () => {
    let loginLink = await driver.findElement(
      By.css("[data-testid='login-link']"),
    );
    await loginLink.click();

    await driver.wait(
      until.elementLocated(By.css("[data-testid='login-form']")),
      5000,
    );

    const emailInput = await driver.findElements(
      By.css("[data-testid='login-form']"),
    );
    expect(emailInput.length).to.be.greaterThan(0);
  });

  it("logs in a user and shows greeting", async () => {
    let usernameTextBox = await driver.findElement(
      By.css("[data-testid='login-email']"),
    );
    let passwordTextBox = await driver.findElement(
      By.css("[data-testid='login-password']"),
    );
    let submitButton = await driver.findElement(
      By.css("[data-testid='login-submit']"),
    );

    await usernameTextBox.sendKeys("alice@shopnow.test");
    await passwordTextBox.sendKeys("Password123!");
    await submitButton.click();
  });

  it("check on user insterface", async () => {
    const username = await driver.findElement(
    By.css("[data-testid='logged-user']"),
    );
    expect(await username.getText()).to.equal("Bonjour Alice");
  });
});
