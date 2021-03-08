/* eslint-disable node/no-extraneous-require */
'use strict';

const version = require('./package.json').version;
const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: require('./package').name,

  included(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/ember-oauther/register-version.js');
  },

  treeForVendor() {
    const content = `Ember.libraries.register('Ember OAuther', '${version}');`;
    const registerVersionTree = writeFile(
      'ember-oauther/register-version.js',
      content
    );

    return mergeTrees([registerVersionTree]);
  },
};
