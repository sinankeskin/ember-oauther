import { reject, resolve } from 'rsvp';

import Route from '@ember/routing/route';
import { assert } from '@ember/debug';
import { isBadRequestResponse } from 'ember-fetch/errors';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';

export default class Oauth1SignInRoute extends Route {
  @service
  oauther;

  queryParams = {
    oauth_token: '',
    oauth_verifier: '',
    provider: '',
  };

  getAccessToken(params) {
    assert(
      'Please set a provider name in params.provider.',
      isPresent(params.provider)
    );

    return this.oauther
      .exchangeAccessToken(
        params.provider,
        params.oauth_token,
        params.oauth_verifier
      )
      .then((response) => {
        if (response.ok) {
          if (this.oauther.remote && !this.oauther.remote.closed) {
            this.oauther.remote.close();
          }

          return response.text().then((data) => {
            const query = new URLSearchParams(data);

            const tokenData = {
              userId: query.get('user_id'),
              screenName: query.get('screen_name'),
              accessToken: query.get('oauth_token'),
              accessTokenSecret: query.get('oauth_token_secret'),
            };

            return resolve(tokenData);
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
      .then((tokenData) => {
        return this.oauther
          .exchangeUserInformation(
            params.provider,
            tokenData.accessToken,
            tokenData.accessTokenSecret
          )
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
