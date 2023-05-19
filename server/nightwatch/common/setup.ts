export default (browser) => {
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
    .waitForElementVisible('/html/body/div[1]/div[3]/div[2]/div/div/div/div[1]/span');

  browser.execute(function () {
    window['setAncestorId'] = function (xpath, id) {
      const element = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue as HTMLElement;
      if (element) {
        const condition = (el: HTMLElement) => {
          return el.hasAttribute('id') && el.getAttribute('id') !== '';
        };

        let ancestor = element.parentElement;
        while (ancestor && !condition(ancestor)) {
          ancestor = ancestor.parentElement;
        }
        if (ancestor) {
          ancestor.setAttribute('id', id);
        }

        ancestor = ancestor.parentElement;
        while (ancestor && !condition(ancestor)) {
          ancestor = ancestor.parentElement;
        }

        if (ancestor) {
          ancestor.setAttribute('id', `${id}-container`);
        }
      }
    };
  });
};
