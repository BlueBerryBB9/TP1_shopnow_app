const { By, Builder, Browser, until } = require("selenium-webdriver");
const { expect } = require("chai");
const CartPage = require("../pages/CartPage");

describe("Cart - Update Quantity", function () {
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

  it("increasing quantity updates the displayed quantity", async () => {
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
    const qtyEl = await first.findElement(
      By.css(`[data-testid='quantity-${id}']`),
    );
    const beforeQty = parseInt(await qtyEl.getText(), 10);
    await cart.increaseQuantity(id);
    await driver.wait(async () => {
      try {
        const currentQtyEl = await driver.findElement(
          By.css(`[data-testid='quantity-${id}']`),
        );
        const q = parseInt(await currentQtyEl.getText(), 10);
        return q === beforeQty + 1;
      } catch (e) {
        return false;
      }
    }, 5000);
    const currentQtyEl = await driver.findElement(
      By.css(`[data-testid='quantity-${id}']`),
    );
    const afterQty = parseInt(await currentQtyEl.getText(), 10);
    expect(afterQty).to.equal(beforeQty + 1);
  });
});
