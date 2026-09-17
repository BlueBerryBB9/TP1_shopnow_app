const { By, Builder, Browser } = require("selenium-webdriver");
const { expect } = require("chai");

describe("E2E - Products details", function () {
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
    const productsLink = await driver.findElement(
      By.css("[data-testid='products-link']"),
    );
    await productsLink.click();
    await driver.sleep(500);

    const productsPage = await driver.findElements(
      By.css("[data-testid='products-page']"),
    );
    expect(productsPage.length).to.be.equal(1);
  });

  it("opens product details page", async () => {

    const productLink = await driver.findElement(
      By.css("[data-testid='view-product-101']"),
    );
    await productLink.click();
    await driver.sleep(1000);

    const productPage = await driver.findElements(
      By.css("[data-testid='product-page']"),
    );
    expect(productPage.length).to.be.greaterThan(0);
  });

  it("shows product name and price on details page", async () => {
    const productName = await driver.findElements(
      By.css("[data-testid='product-name']"),
    );
    expect(productName.length).to.be.greaterThan(0);

    const productPrice = await driver.findElements(
      By.css("[data-testid='product-price']"),
    );
    expect(productPrice.length).to.be.greaterThan(0);
  });
});
