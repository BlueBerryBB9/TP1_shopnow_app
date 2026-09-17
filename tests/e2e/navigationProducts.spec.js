const { By, Builder, Browser, until } = require("selenium-webdriver");
const { expect } = require("chai");

describe("E2E - Navigation to Products", function () {
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

  it("navigates to products page", async () => {
    const productLink = await driver.findElement(
      By.css("[data-testid='products-link']"),
    );
    await productLink.click();

    await driver.wait(
      until.elementLocated(By.css("[data-testid='products-page']")),
      5000,
    );

    const productsPage = await driver.findElements(
      By.css("[data-testid='products-page']"),
    );
    expect(productsPage.length).to.equal(1);
  });

  it("lists products on the products page", async () => {
    await driver.wait(
      until.elementLocated(By.css("[data-testid='products-page']")),
      5000,
    );

    const products = await driver.findElements(
      By.css("[data-testid='product-101']"),
    );
    expect(products.length).to.be.greaterThan(0);
  });
});
