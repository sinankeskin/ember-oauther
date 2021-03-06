import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | oauth1-sign-in', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:oauth1-sign-in');
    assert.ok(route);
  });
});
