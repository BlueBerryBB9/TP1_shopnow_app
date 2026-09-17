const { By, Builder, Browser, until } = require("selenium-webdriver");
const { expect } = require("chai");
const ProductsPage = require("../pages/ProductsPage");
const CartPage = require("../pages/CartPage");

describe("Cart - Add Product From Listing", function () {
  this.timeout(30000);
  let driver, products, cart;

  before(async () => {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.manage().setTimeouts({ implicit: 500 });
    products = new ProductsPage(driver);
    cart = new CartPage(driver);
    await products.open();
    await products.waitForProducts();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("adds a product from the listing to the cart", async () => {
    const id = await products.addFirstProductToCart();
    await cart.open();
    const items = await cart.getCartItems();
    expect(items.length).to.be.greaterThan(0);
    const total = await cart.getTotalText();
    expect(total.length).to.be.greaterThan(0);
  });
});
