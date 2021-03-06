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
    state: '',
    code: '',
    scope: '',
  };

  getAccessToken(params) {
    assert('Please set a providerName.', isPresent(this.providerName));

    return this.oauther
      .exchangeAccessToken(this.providerName, params.code)
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
    assert('Please set a providerName.', isPresent(this.providerName));

    return this.getAccessToken(params)
      .then((accessToken) => {
        return this.oauther
          .exchangeUserInformation(this.providerName, accessToken)
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
