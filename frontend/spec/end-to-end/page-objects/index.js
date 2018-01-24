module.exports = {
  url: function() {
    return this.api.launchUrl;
  },
  sections: {
    upload: {
      selector: ".qa-uscis-upload-page",
      elements: {
        form: ".qa-uscis-upload-form",
      },
    },
  },
  commands: [
    {
      waitForIndexPage: function() {
        this.waitForElementVisible(this.section.upload.selector);
        return this;
      },
    },
  ],
};
