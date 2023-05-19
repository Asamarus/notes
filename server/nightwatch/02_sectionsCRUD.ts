import setup from './common/setup';

describe('Notes sections CRUD', function () {
  it('Setup', function (browser) {
    setup(browser);
  });

  it('Open sections CRUD modal', function (browser) {
    browser
      .click('/html/body/div[1]/div[1]/div[3]/button[3]')
      .waitForElementVisible('/html/body/div[4]/div/div/div/button[1]')
      .click('/html/body/div[4]/div/div/div/button[1]')
      .waitForElementVisible('/html/body/div[5]/div/div/div[2]/div/div/div[2]/button')
      .assert.textContains(
        '/html/body/div[5]/div/div/div[2]/div/div/div[2]/button/div/span[2]',
        'Add new section'
      );
  });

  it('Add new section', function (browser) {
    browser
      .click('/html/body/div[5]/div/div/div[2]/div/div/div[2]/button')
      .waitForElementVisible(
        '/html/body/div[9]/div/div/div[2]/div/div/div[2]/div/form/div[4]/button/div/span'
      )
      .assert.textContains(
        '/html/body/div[9]/div/div/div[2]/div/div/div[2]/div/form/div[4]/button/div/span',
        'Add'
      )
      .click('/html/body/div[9]/div/div/div[2]/div/div/div[2]/div/form/div[1]/div/input')
      .setValue(
        '/html/body/div[9]/div/div/div[2]/div/div/div[2]/div/form/div[1]/div/input',
        'section_1'
      )
      .perform(function () {
        const actions = this.actions({ async: true });

        return actions.keyDown(this.Keys.TAB);
      })
      .setValue(
        '/html/body/div[9]/div/div/div[2]/div/div/div[2]/div/form/div[2]/div/input',
        'Section 1'
      )
      .perform(function () {
        const actions = this.actions({ async: true });

        return actions.keyDown(this.Keys.TAB);
      })
      .setValue(
        '/html/body/div[9]/div/div/div[2]/div/div/div[2]/div/form/div[3]/div/div/input',
        '#c21f1f'
      )
      .click('/html/body/div[9]/div/div/div[2]/div/div/div[2]/div/form/div[4]/button')
      .waitForElementVisible(
        '/html/body/div[5]/div/div/div[2]/div/div/div[2]/div/div/div/div/div[2]'
      )
      .assert.cssProperty(
        '/html/body/div[5]/div/div/div[2]/div/div/div[2]/div/div/div/div/div[2]',
        'background-color',
        'rgba(194, 31, 31, 1)'
      )
      .click('/html/body/div[9]/div/div/div[2]/div/div/div[1]/button');
  });

  it('Edit section', function (browser) {
    browser
      .click('/html/body/div[5]/div/div/div[2]/div/div/div[2]/div/div/div/div/button[1]')
      .waitForElementVisible(
        '/html/body/div[9]/div/div/div[2]/div/div/div[2]/div/form/div[4]/button/div/span'
      )
      .assert.textContains(
        '/html/body/div[9]/div/div/div[2]/div/div/div[2]/div/form/div[4]/button/div/span',
        'Save'
      )
      .click('/html/body/div[9]/div/div/div[2]/div/div/div[2]/div/form/div[2]/div/input')
      .setValue('/html/body/div[9]/div/div/div[2]/div/div/div[2]/div/form/div[2]/div/input', '2')
      .click('/html/body/div[9]/div/div/div[2]/div/div/div[2]/div/form/div[4]/button')
      .waitUntil(function () {
        return browser.getText(
          '/html/body/div[5]/div/div/div[2]/div/div/div[2]/div/div/div/div/div[3]',
          function (result) {
            return result.value === 'Section 12';
          }
        );
      }, 5000)
      .assert.textContains(
        '/html/body/div[5]/div/div/div[2]/div/div/div[2]/div/div/div/div/div[3]',
        'Section 12'
      )
      .click('/html/body/div[9]/div/div/div[2]/div/div/div[1]/button');
  });

  it('Delete section', function (browser) {
    browser
      .click('/html/body/div[5]/div/div/div[2]/div/div/div[2]/div/div/div/div/button[2]')
      .waitForElementVisible('/html/body/div[9]/div/div/div[2]/div/div[2]/div/div[1]/div')
      .assert.textContains(
        '/html/body/div[9]/div/div/div[2]/div/div[2]/div/div[1]/div',
        'Are you sure you want to delete this section?'
      )
      .click('/html/body/div[9]/div/div/div[2]/div/div[2]/div/div[2]/button[2]')
      .waitForElementNotPresent(
        '/html/body/div[5]/div/div/div[2]/div/div/div[2]/div/div/div/div/div[3]'
      )
      .assert.not.elementPresent(
        '/html/body/div[5]/div/div/div[2]/div/div/div[2]/div/div/div/div/div[3]'
      )
      .end();
  });
});
