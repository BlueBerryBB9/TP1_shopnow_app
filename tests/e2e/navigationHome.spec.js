const { By, Builder, Browser } = require("selenium-webdriver");
const { assert, expect } = require("chai");

describe("E2E - Home page", function () {
  this.timeout(20000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
      await driver.get("http://localhost:3000");
      await driver.manage().setTimeouts({ implicit: 500 });
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("loads the home page", async () => {
    let homePage = await driver.findElements(
      By.css("[data-testid='home-page']"),
    );
    expect(homePage.length).to.be.equal(1);
  });

  it("has the correct title", async () => {
    let title = await driver.getTitle();
    expect(title).to.equal("ShopNow — Accueil");
  });
});
