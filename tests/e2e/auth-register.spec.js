const { By, Builder, Browser, until } = require("selenium-webdriver");
const { expect } = require("chai");

describe("Auth - Register New User", function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.manage().setTimeouts({ implicit: 500 });
    await driver.get("http://localhost:3000/register.html");
    await driver.wait(
      until.elementLocated(By.css("[data-testid='register-form']")),
      5000,
    );
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("registers a new unique user and lands on login", async () => {
    const unique = `user${Date.now()}@shopnow.test`;
    await driver
      .findElement(By.css("[data-testid='register-firstname']"))
      .sendKeys("Test");
    await driver
      .findElement(By.css("[data-testid='register-lastname']"))
      .sendKeys("User");
    await driver
      .findElement(By.css("[data-testid='register-email']"))
      .sendKeys(unique);
    await driver
      .findElement(By.css("[data-testid='register-password']"))
      .sendKeys("Password123!");
    await driver.findElement(By.css("[data-testid='register-submit']")).click();
    await driver.wait(
      until.elementLocated(By.css("[data-testid='login-form']")),
      5000,
    );
    const inputs = await driver.findElements(
      By.css("[data-testid='login-email']"),
    );
    expect(inputs.length).to.equal(1);
  });
});
