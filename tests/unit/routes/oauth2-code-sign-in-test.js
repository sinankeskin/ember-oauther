import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | oauth2-code-sign-in', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:oauth2-code-sign-in');
    assert.ok(route);
  });
});
