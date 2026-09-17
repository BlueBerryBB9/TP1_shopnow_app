const { By, Builder, Browser, until } = require("selenium-webdriver");
const { expect } = require("chai");
const CartPage = require("../pages/CartPage");

describe("Cart - Persistence", function () {
  this.timeout(30000);
  let driver, cart;

  before(async () => {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.manage().setTimeouts({ implicit: 500 });
    cart = new CartPage(driver);
    await cart.open();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("retains cart items after page reload", async () => {
    let before = await cart.getCartItems();
    if (before.length === 0) {
      // ensure at least one product is added
      const ProductsPage = require("../pages/ProductsPage");
      const products = new ProductsPage(driver);
      await products.open();
      await products.waitForProducts();
      await products.addFirstProductToCart();
      await cart.open();
      before = await cart.getCartItems();
    }
    expect(before.length).to.be.greaterThan(0);
    await driver.navigate().refresh();
    await cart.open();
    const after = await cart.getCartItems();
    expect(after.length).to.equal(before.length);
  });
});
