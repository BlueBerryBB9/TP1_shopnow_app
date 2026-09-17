const { By, Builder, Browser, until } = require("selenium-webdriver");
const { expect } = require("chai");
const ProductsPage = require("../pages/ProductsPage");
const CartPage = require("../pages/CartPage");

describe("Cart - Clear Cart Shows Empty State", function () {
  this.timeout(30000);
  let driver, products, cart;

  before(async () => {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.manage().setTimeouts({ implicit: 500 });
    products = new ProductsPage(driver);
    cart = new CartPage(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("clears the cart and shows the empty state", async () => {
    await products.open();
    await products.waitForProducts();
    await products.addFirstProductToCart();
    await cart.open();
    await cart.clearCart();
    await cart.waitForEmpty();
    const empty = await driver.findElement(
      By.css("[data-testid='empty-cart']"),
    );
    expect(await empty.isDisplayed()).to.be.true;
  });
});
