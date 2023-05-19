import setup from './common/setup';

describe('Notes CRUD', function () {
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
      .click('/html/body/div[9]/div/div/div[2]/div/div/div[1]/button')
      .click('/html/body/div[5]/div/div/div[2]/div/div/div[1]/button');
  });

  it('Select section', function (browser) {
    browser
      .click('//*[@id="app"]/div[3]/div[2]/div/div/div/div[1]')
      .waitForElementVisible('//*[@id="app"]/div[3]/div[2]/div/div/div/div[2]/div/a')
      .assert.textContains('//*[@id="app"]/div[3]/div[2]/div/div/div/div[2]/div/a', 'Section 1')
      .click('//*[@id="app"]/div[3]/div[2]/div/div/div/div[2]/div/a')
      .waitForElementVisible('//*[@id="app"]/div[3]/div[2]/div/div/div/div[3]/button')
      .assert.textContains('//*[@id="app"]/div[3]/div[2]/div/div/div/div[3]/button', 'Add');
  });

  it('Add new note', function (browser) {
    browser
      .click('//*[@id="app"]/div[3]/div[2]/div/div/div/div[3]/button')
      .waitForElementVisible(`//span[text()='Save']`)
      .execute(function () {
        window['setAncestorId'](`//span[text()='Save']`, 'note-modal');
      })
      .click('//*[@id="note-modal"]/div[3]/form/div[1]/div/input')
      .setValue('//*[@id="note-modal"]/div[3]/form/div[1]/div/input', 'New note title')
      .click('//*[@id="note-modal"]/div[3]/form/div[2]/div[2]/div[2]/div/p')
      .setValue('//*[@id="note-modal"]/div[3]/form/div[2]/div[2]/div[2]/div/p', 'New note content')
      .click('//*[@id="note-modal"]/div[3]/form/div[3]/button')
      .pause(1000)
      .click('//*[@id="note-modal"]/div[1]/button[1]')
      .waitForElementVisible(`//div[text()='View']`)
      .click(`//div[text()='View']`)
      .waitForElementVisible('//*[@id="note-modal"]/div[3]/div[1]')
      .assert.textContains('//*[@id="note-modal"]/div[3]/div[1]', 'New note title')
      .assert.textContains('//*[@id="note-modal"]/div[3]/div[2]/p[1]', 'New note content');
  });

  it('Add book', function (browser) {
    browser
      .click('//*[@id="note-modal"]/div[2]/div[2]/button')
      .waitForElementVisible(`//div[text()='Apply']`)
      .execute(function () {
        window['setAncestorId'](`//div[text()='Apply']`, 'book-modal');
      })
      .click('//*[@id="book-modal"]/div[1]/div/div/input')
      .setValue('//*[@id="book-modal"]/div[1]/div/div/input', 'New book')
      .click('//*[@id="book-modal"]/div[3]/div[2]')
      .assert.textContains('//*[@id="note-modal"]/div[2]/div[2]/span', 'New book');
  });

  it('Add tags', function (browser) {
    browser
      .click('//*[@id="note-modal"]/div[4]/button')
      .waitForElementVisible(`//div[text()='Apply']`)
      .execute(function () {
        window['setAncestorId'](`//div[text()='Apply']`, 'tags-modal');
      })
      .setValue('//*[@id="tags-modal"]/div[1]/div/div/div/div/input', 'Tag 1')
      .sendKeys('//*[@id="tags-modal"]/div[1]/div/div/div/div/input', browser.Keys.ENTER)
      .setValue('//*[@id="tags-modal"]/div[1]/div/div/div/div/input', 'Tag 2')
      .sendKeys('//*[@id="tags-modal"]/div[1]/div/div/div/div/input', browser.Keys.ENTER)
      .click('//*[@id="tags-modal"]/div[3]/div[2]')
      .assert.textContains('//*[@id="note-modal"]/div[4]/span[1]', 'Tag 1');
  });

  it('Add source', function (browser) {
    browser
      .click('//*[@id="note-modal"]/div[1]/button[1]')
      .waitForElementVisible(`//div[text()='Sources']`)
      .click(`//div[text()='Sources']`)
      .waitForElementVisible(`//span[text()='Add new source']`)
      .execute(function () {
        window['setAncestorId'](`//span[text()='Add new source']`, 'sources-modal');
      })
      .click(`//*[@id="sources-modal"]/button`)
      .waitForElementVisible(`(//span[text()="Add"])[2]`)
      .execute(function () {
        window['setAncestorId'](`(//span[text()="Add"])[2]`, 'add-source-modal');
      })
      .setValue(
        '//*[@id="add-source-modal"]/div/form/div[1]/div/input',
        'https://stackoverflow.com/questions/34665151/how-to-send-keypress-in-nightwatch'
      )
      .click('//*[@id="add-source-modal"]/div/form/div[2]/button')
      .waitForElementVisible('//*[@id="note-modal"]/div[3]/span')
      .assert.textContains('//*[@id="note-modal"]/div[3]/span', '1')
      .pause(1000)
      .click('//*[@id="add-source-modal-container"]/div[2]/div/div/div[1]/button')
      .pause(1000)
      .click('//*[@id="sources-modal-container"]/div[2]/div/div/div[1]/button');
  });

  it('Delete note', function (browser) {
    browser
      .click('//*[@id="note-modal"]/div[1]/button[1]')
      .waitForElementVisible(`//div[text()='Delete']`)
      .click(`//div[text()='Delete']`)
      .waitForElementVisible(`//span[text()='Delete']`)
      .click(`//span[text()='Delete']`)
      .waitForElementVisible(`//span[text()='Confirm']`)
      .click(`//span[text()='Confirm']`)
      .waitForElementNotPresent('//*[@id="note-modal"]');
  });

  it('Delete section', function (browser) {
    browser
      .click('/html/body/div[1]/div[1]/div[3]/button[3]')
      .waitForElementVisible('/html/body/div[4]/div/div/div/button[1]')
      .click('/html/body/div[4]/div/div/div/button[1]')
      .waitForElementVisible('/html/body/div[5]/div/div/div[2]/div/div/div[2]/button')
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
