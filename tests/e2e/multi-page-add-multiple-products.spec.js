const { By, Builder, Browser, until } = require("selenium-webdriver");
const { expect } = require("chai");
const ProductsPage = require("../pages/ProductsPage");
const CartPage = require("../pages/CartPage");

describe("Multi-page flow — Add multiple products and verify cart", function () {
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

  it("navigates, adds two different products, and updates the cart", async () => {
    // Add first product via listing (uses page object which handles alerts)
    const firstId = await products.addFirstProductToCart();

    // Find second add-to-cart button and click it to add another product
    const addButtons = await driver.findElements(
      By.css("button[data-testid^='add-to-cart-']"),
    );
    expect(addButtons.length).to.be.at.least(
      2,
      "expected at least two products to be available",
    );

    // Determine second product id from its data-testid attribute
    const secondBtn = addButtons[1];
    const secondAttr = await secondBtn.getAttribute("data-testid");
    const secondId = secondAttr.split("-").pop();
    await secondBtn.click();
    // tolerate in-page alert
    try {
      await driver.wait(until.alertIsPresent(), 2000);
      const a = await driver.switchTo().alert();
      await a.accept();
    } catch (e) {
      // ignore
    }

    // Navigate to second product detail page to exercise navigation
    await products.viewProductById(secondId);
    // explicit wait for product page to load
    await driver.wait(
      until.elementLocated(By.css("[data-testid='product-page']")),
      5000,
    );

    // Now open cart and assert two items are present
    await cart.open();
    let items = await cart.getCartItems();
    expect(items.length).to.be.at.least(2);

    // Assert total text looks like a number / non-empty
    const totalText = await cart.getTotalText();
    expect(totalText).to.be.a("string").and.to.match(/\d+/);

    // Remove the first product and wait for cart to update (explicit wait)
    await cart.removeItem(firstId);
    await driver.wait(async () => {
      const remaining = await driver.findElements(By.css(".cart-item"));
      return remaining.length === 1;
    }, 5000);

    items = await cart.getCartItems();
    expect(items.length).to.equal(1);
  });
});
