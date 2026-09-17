const { By, until } = require("selenium-webdriver");

class ProductsPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get("http://localhost:3000/products.html");
    await this.driver.wait(
      until.elementLocated(By.css("[data-testid='products-page']")),
      5000,
    );
  }

  async waitForProducts() {
    await this.driver.wait(
      until.elementLocated(By.css("[data-testid^='product-card-']")),
      5000,
    );
  }

  async addFirstProductToCart() {
    const buttons = await this.driver.findElements(
      By.css("button[data-testid^='add-to-cart-']"),
    );
    if (buttons.length === 0) throw new Error("No add-to-cart buttons found");
    const btn = buttons[0];
    await btn.click();
    // handle potential alert shown by the app (eg. "... ajouté au panier")
    try {
      await this.driver.wait(until.alertIsPresent(), 2000);
      const alert = await this.driver.switchTo().alert();
      await alert.accept();
    } catch (e) {
      // ignore if no alert appeared
    }
    const idAttr = await btn.getAttribute("data-testid");
    // data-testid is like add-to-cart-101
    const id = idAttr.split("-").pop();
    return id;
  }

  async viewProductById(id) {
    const link = await this.driver.findElement(
      By.css(`a[data-testid='view-product-${id}']`),
    );
    await link.click();
  }
}

module.exports = ProductsPage;
