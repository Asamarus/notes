describe('Notes login, logout', function () {
  it('test login and logout', function (browser) {
    browser
      .windowRect({ width: 1915, height: 937 })
      .useXpath()
      .navigateTo('http://127.0.0.2:3333/login')
      .click('/html/body/div[1]/div/div/form/div[1]/div/input')
      .setValue('/html/body/div[1]/div/div/form/div[1]/div/input', 'user@mail.com')
      .perform(function () {
        const actions = this.actions({ async: true });

        return actions.keyDown(this.Keys.TAB);
      })
      .setValue('/html/body/div[1]/div/div/form/div[2]/div/div[1]/input', '123456')
      .perform(function () {
        const actions = this.actions({ async: true });

        return actions.keyDown(this.Keys.ENTER);
      })
      .waitForElementVisible('/html/body/div[1]/div[3]/div[2]/div/div/div/div[1]/span')
      .assert.textContains('/html/body/div[1]/div[3]/div[2]/div/div/div/div[1]/span', 'Notes')
      .click('/html/body/div[1]/div[1]/div[3]/button[3]')
      .waitForElementVisible('/html/body/div[4]/div/div/div/button[3]')
      .click('/html/body/div[4]/div/div/div/button[3]')
      .waitForElementVisible('/html/body/div[1]/div/div/form/button/div/span[2]')
      .assert.textContains('/html/body/div[1]/div/div/form/button/div/span[2]', 'Login')
      .end();
  });
});
