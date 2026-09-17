const { By, Builder, Browser, until } = require("selenium-webdriver");
const { expect } = require("chai");
const CartPage = require("../pages/CartPage");

describe("Cart - Remove Item", function () {
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

  it("removes an item and updates the cart", async () => {
    let items = await cart.getCartItems();
    if (items.length === 0) {
      const ProductsPage = require("../pages/ProductsPage");
      const products = new ProductsPage(driver);
      await products.open();
      await products.waitForProducts();
      await products.addFirstProductToCart();
      await cart.open();
      items = await cart.getCartItems();
    }
    expect(items.length).to.be.greaterThan(0);
    const first = items[0];
    const strong = await first.findElement(
      By.css('[data-testid^="cart-product-"]'),
    );
    const pidAttr = await strong.getAttribute("data-testid");
    const id = pidAttr.split("-").pop();
    await cart.removeItem(id);
    await driver.wait(async () => {
      const now = await cart.getCartItems();
      return now.length === items.length - 1 || now.length === 0;
    }, 3000);
    const now = await cart.getCartItems();
    expect(now.length).to.be.lessThan(items.length);
  });
});
