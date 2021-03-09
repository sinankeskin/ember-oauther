import Service from '@ember/service';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import { isPresent } from '@ember/utils';
import { tracked } from '@glimmer/tracking';

export default class OautherService extends Service {
  @tracked
  remote;

  get owner() {
    return getOwner(this);
  }

  signIn(providerName) {
    return this._getProvider(providerName).signIn();
  }

  exchangeAccessToken(providerName, codeOrToken, verifier) {
    return this._getProvider(providerName).exchangeAccessToken(
      codeOrToken,
      verifier
    );
  }

  exchangeUserInformation(providerName, accessToken, accessTokenSecret) {
    return this._getProvider(providerName).exchangeUserInformation(
      accessToken,
      accessTokenSecret
    );
  }

  _getProvider(providerName) {
    const provider = this.owner.lookup(`oauther-provider:${providerName}`);

    assert(`${providerName} provider not found.`, isPresent(provider));

    return provider;
  }
}
