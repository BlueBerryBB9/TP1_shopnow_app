const { By, Builder, Browser, until } = require("selenium-webdriver");
const { expect } = require("chai");
const LoginPage = require("../pages/LoginPage");
const ProductsPage = require("../pages/ProductsPage");
const CartPage = require("../pages/CartPage");

describe("Final Challenge — Client end-to-end journey", function () {
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

  it("logs in, selects a product, adds to cart, sets quantity to 2, verifies total, then removes it", async () => {
    // 1) Connexion
    await login.open();
    await login.login("alice@shopnow.test", "Password123!");
    await driver.wait(
      until.elementLocated(By.css("[data-testid='logged-user']")),
      5000,
    );
    const logged = await login.getLoggedUserText();
    expect(logged).to.be.a("string").and.to.have.length.greaterThan(0); // assertion 1

    // 2) Produits
    await products.open();
    await products.waitForProducts();
    const productCards = await driver.findElements(
      By.css("[data-testid^='product-card-']"),
    );
    expect(productCards.length).to.be.greaterThan(0); // assertion 2

    // 3) Choix d'un produit (prendre le premier)
    const firstCard = productCards[0];
    const cardAttr = await firstCard.getAttribute("data-testid");
    const productId = cardAttr.split("-").pop();

    // 4) Détail
    await products.viewProductById(productId);
    await driver.wait(
      until.elementLocated(
        By.css(`[data-testid='product-detail-${productId}']`),
      ),
      5000,
    );
    const productNameEl = await driver.findElement(
      By.css("[data-testid='product-name']"),
    );
    expect(await productNameEl.getText())
      .to.be.a("string")
      .and.to.have.length.greaterThan(0); // assertion 3

    // read unit price from detail and parse into number
    const priceText = await driver
      .findElement(By.css("[data-testid='product-price']"))
      .getText();
    const unitPrice = parseFloat(
      priceText.replace(/\s|€/g, "").replace(",", "."),
    );
    expect(unitPrice).to.be.a("number").and.to.be.greaterThan(0); // assertion 4

    // 5) Ajout au panier
    const addBtn = await driver.findElement(
      By.css(`[data-testid='add-to-cart-${productId}']`),
    );
    await addBtn.click();
    try {
      await driver.wait(until.alertIsPresent(), 2000);
      const a = await driver.switchTo().alert();
      await a.accept();
    } catch (e) {
      // ignore if no alert
    }

    // 6) Quantité = 2 (augmenter)
    await cart.open();
    let items = await cart.getCartItems();
    expect(items.length).to.be.equal(1); // assertion 5: one item in cart

    // increase quantity to 2
    await cart.increaseQuantity(productId);
    await driver.wait(async () => {
      const q = await driver.findElement(
        By.css(`[data-testid='quantity-${productId}']`),
      );
      const t = await q.getText();
      return Number(t) === 2;
    }, 5000);

    const qtyEl = await driver.findElement(
      By.css(`[data-testid='quantity-${productId}']`),
    );
    const qty = Number(await qtyEl.getText());
    expect(qty).to.equal(2); // assertion 6

    // 7) Vérification du total (unitPrice * 2)
    const totalText = await cart.getTotalText();
    const totalNum = parseFloat(
      totalText.replace(/\s|€/g, "").replace(",", "."),
    );
    expect(totalNum).to.be.closeTo(unitPrice * 2, 0.01); // assertion 7

    // 8) Suppression
    await cart.removeItem(productId);
    await cart.waitForEmpty();

    // 9) Panier vide
    const emptyEl = await driver.findElement(
      By.css("[data-testid='empty-cart']"),
    );
    expect(await emptyEl.isDisplayed()).to.be.true; // assertion 8
  });
});
