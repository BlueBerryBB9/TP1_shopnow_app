const { By, until } = require("selenium-webdriver");

class CartPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get("http://localhost:3000/cart.html");
    // tolerate any unexpected alert that may be present from prior actions
    try {
      await this.driver.wait(until.alertIsPresent(), 1000);
      const a = await this.driver.switchTo().alert();
      await a.accept();
    } catch (e) {
      // no alert — continue
    }
    await this.driver.wait(
      until.elementLocated(By.css("[data-testid='cart-page']")),
      5000,
    );
  }

  async getCartItems() {
    return await this.driver.findElements(By.css(".cart-item"));
  }

  async getTotalText() {
    const el = await this.driver.findElement(
      By.css("[data-testid='cart-total']"),
    );
    return await el.getText();
  }

  async increaseQuantity(id) {
    const btn = await this.driver.findElement(
      By.css(`button[data-action='increase'][data-id='${id}']`),
    );
    await btn.click();
  }

  async decreaseQuantity(id) {
    const btn = await this.driver.findElement(
      By.css(`button[data-action='decrease'][data-id='${id}']`),
    );
    await btn.click();
  }

  async removeItem(id) {
    const btn = await this.driver.findElement(
      By.css(`[data-testid='remove-item-${id}']`),
    );
    await btn.click();
  }

  async clearCart() {
    const btn = await this.driver.findElement(By.css("#clear-cart"));
    await btn.click();
  }

  async waitForEmpty() {
    await this.driver.wait(
      until.elementLocated(By.css("[data-testid='empty-cart']")),
      5000,
    );
  }
}

module.exports = CartPage;
