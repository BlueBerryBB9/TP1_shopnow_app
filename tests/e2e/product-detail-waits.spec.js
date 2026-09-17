const { By, Builder, Browser, until } = require("selenium-webdriver");
const { expect } = require("chai");

describe("Product - Explicit Waits For Product Detail", function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.manage().setTimeouts({ implicit: 500 });
    await driver.get("http://localhost:3000/products.html");
    await driver.wait(
      until.elementLocated(By.css("[data-testid='products-page']")),
      5000,
    );
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("waits explicitly for product detail name to load and be non-empty", async () => {
    const viewLinks = await driver.findElements(
      By.css("a[data-testid^='view-product-']"),
    );
    expect(viewLinks.length).to.be.greaterThan(0);
    const link = viewLinks[0];
    await link.click();
    const nameEl = await driver.wait(
      until.elementLocated(By.css('[data-testid="product-name"]')),
      5000,
    );
    await driver.wait(async () => (await nameEl.getText()).length > 0, 3000);
    const name = await nameEl.getText();
    expect(name.length).to.be.greaterThan(0);
  });
});
