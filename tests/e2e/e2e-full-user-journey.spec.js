const { By, Builder, Browser, until } = require("selenium-webdriver");
const { expect } = require("chai");
const LoginPage = require("../pages/LoginPage");
const ProductsPage = require("../pages/ProductsPage");
const CartPage = require("../pages/CartPage");

describe("E2E - Full User Journey", function () {
  this.timeout(60000);
  let driver, login, products, cart;

  before(async () => {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    await driver.manage().setTimeouts({ implicit: 500 });
    login = new LoginPage(driver);
    products = new ProductsPage(driver);
    cart = new CartPage(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("registers, logs in, buys, modifies quantity and empties cart", async () => {
    const unique = `journey${Date.now()}@shopnow.test`;
    await driver.get("http://localhost:3000/register.html");
    await driver
      .findElement(By.css("[data-testid='register-firstname']"))
      .sendKeys("Journey");
    await driver
      .findElement(By.css("[data-testid='register-lastname']"))
      .sendKeys("User");
    await driver
      .findElement(By.css("[data-testid='register-email']"))
      .sendKeys(unique);
    await driver
      .findElement(By.css("[data-testid='register-password']"))
      .sendKeys("Password123!");
    await driver.findElement(By.css("[data-testid='register-submit']")).click();
    await driver.wait(
      until.elementLocated(By.css("[data-testid='login-form']")),
      5000,
    );
    await login.login(unique, "Password123!");
    await driver.wait(
      until.elementLocated(By.css("[data-testid='logged-user']")),
      5000,
    );
    const greeting = await login.getLoggedUserText();
    expect(greeting.length).to.be.greaterThan(0);
    await products.open();
    await products.waitForProducts();
    await products.addFirstProductToCart();
    await products.addFirstProductToCart();
    await cart.open();
    const items = await cart.getCartItems();
    expect(items.length).to.be.greaterThan(0);
    const first = items[0];
    const strong = await first.findElement(
      By.css('[data-testid^="cart-product-"]'),
    );
    const pidAttr = await strong.getAttribute("data-testid");
    const id = pidAttr.split("-").pop();
    await cart.increaseQuantity(id);
    const total = await cart.getTotalText();
    expect(total.length).to.be.greaterThan(0);
    const checkout = await driver.findElements(
      By.css("[data-testid='checkout-button']"),
    );
    expect(checkout.length).to.be.greaterThan(0);
    await cart.clearCart();
    await cart.waitForEmpty();
    const empty = await driver.findElement(
      By.css("[data-testid='empty-cart']"),
    );
    expect(await empty.isDisplayed()).to.be.true;
  });
});
