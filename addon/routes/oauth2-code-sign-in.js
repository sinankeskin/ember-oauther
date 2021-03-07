import { reject, resolve } from 'rsvp';

import Route from '@ember/routing/route';
import { assert } from '@ember/debug';
import { isBadRequestResponse } from 'ember-fetch/errors';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';

export default class Oauth2CodeSignInRoute extends Route {
  @service
  oauther;

  queryParams = {
    code: '',
    state: '',
    scope: '',
    provider: '',
  };

  getAccessToken(params) {
    assert(
      'Please set a provider name in params.provider.',
      isPresent(params.provider)
    );

    return this.oauther
      .exchangeAccessToken(params.provider, params.code)
      .then((response) => {
        if (response.ok) {
          return response.json().then((data) => {
            return resolve(data.access_token);
          });
        } else if (isBadRequestResponse(response)) {
          return reject(response);
        }
      })
      .catch((e) => {
        return reject(e);
      });
  }

  getUserInformation(params) {
    assert(
      'Please set a provider name in params.provider.',
      isPresent(params.provider)
    );

    return this.getAccessToken(params)
      .then((accessToken) => {
        return this.oauther
          .exchangeUserInformation(params.provider, accessToken)
          .then((response) => {
            if (response.ok) {
              return response.json().then((data) => {
                return resolve(data);
              });
            } else if (isBadRequestResponse(response)) {
              return reject(response);
            }
          })
          .catch((e) => {
            return reject(e);
          });
      })
      .catch((e) => {
        return reject(e);
      });
  }
}
