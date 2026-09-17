const { By, Builder, Browser, until } = require("selenium-webdriver");
const { expect } = require("chai");
const ProductsPage = require("../pages/ProductsPage");
const CartPage = require("../pages/CartPage");

describe("Cart - Add Product From Detail Page", function () {
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

  it("views a product detail and adds it to the cart", async () => {
    const viewLinks = await driver.findElements(
      By.css("a[data-testid^='view-product-']"),
    );
    expect(viewLinks.length).to.be.greaterThan(0);
    const link = viewLinks[0];
    const data = await link.getAttribute("data-testid");
    const id = data.split("-").pop();
    await link.click();
    await driver.wait(
      until.elementLocated(By.css("[data-testid='product-name']")),
      5000,
    );
    const addBtn = await driver.findElement(
      By.css(`[data-testid='add-to-cart-${id}']`),
    );
    await addBtn.click();
    // dismiss the app alert if present (e.g., "... ajouté au panier")
    try {
      await driver.wait(until.alertIsPresent(), 2000);
      const a = await driver.switchTo().alert();
      await a.accept();
    } catch (e) {
      // no alert — continue
    }
    await cart.open();
    const items = await cart.getCartItems();
    expect(items.length).to.be.greaterThan(0);
  });
});
