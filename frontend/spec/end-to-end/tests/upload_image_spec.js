module.exports = {
  beforeEach: browser => {
    browser.page.index().navigate();
  },

  // Just a page load test. Should be replaced with actual tests.
  loads: browser => {
    const index = browser.page.index(),
      upload = index.section.upload;
    index.waitForIndexPage();
    upload.expect.element("@form").to.be.visible;
  },
};
