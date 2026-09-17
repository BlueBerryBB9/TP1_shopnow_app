const { By, until } = require("selenium-webdriver");

class LoginPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get("http://localhost:3000/login.html");
    await this.driver.wait(
      until.elementLocated(By.css("[data-testid='login-form']")),
      5000,
    );
  }

  async login(email, password) {
    const e = await this.driver.findElement(
      By.css("[data-testid='login-email']"),
    );
    const p = await this.driver.findElement(
      By.css("[data-testid='login-password']"),
    );
    const btn = await this.driver.findElement(
      By.css("[data-testid='login-submit']"),
    );
    await e.clear();
    await e.sendKeys(email);
    await p.clear();
    await p.sendKeys(password);
    await btn.click();
  }

  async getMessageElement() {
    return await this.driver.findElement(
      By.css("[data-testid='login-message']"),
    );
  }

  async getLoggedUserText() {
    const el = await this.driver.findElement(
      By.css("[data-testid='logged-user']"),
    );
    return await el.getText();
  }
}

module.exports = LoginPage;
