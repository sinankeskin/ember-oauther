import { isNone, isPresent } from '@ember/utils';
import { reject, resolve } from 'rsvp';

import BaseProvider from './base';
import fetch from 'fetch';
import forge from 'node-forge';
import { inject as service } from '@ember/service';

export default class OAuth2CodeProvider extends BaseProvider {
  @service
  oauther;

  get responseType() {
    return 'code';
  }

  get state() {
    if (isNone(this.getCache('state'))) {
      const bytes = forge.random.getBytesSync(32);

      this.setCache('state', forge.util.encode64(bytes), 5);
    }

    return this.getCache('state');
  }

  get requiredParamsForSignIn() {
    return {
      responseType: 'response_type',
      clientId: 'client_id',
      redirectUri: 'redirect_uri',
      state: 'state',
    };
  }

  get optionalParamsForSignIn() {
    return {
      scope: 'scope',
    };
  }

  get requiredParamsForExchangeAccessToken() {
    return {
      clientId: 'client_id',
      clientSecret: 'client_secret',
      redirectUri: 'redirect_uri',
    };
  }

  get optionalParamsForExchangeAccessToken() {
    return {};
  }

  get requiredParamsForExchangeUserInformation() {
    return {};
  }

  get optionalParamsForExchangeUserInformation() {
    return {};
  }

  get requiredHeadersForExchangeUserInformation() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  getCache(key) {
    const item = localStorage.getItem(key);

    if (item) {
      const data = JSON.parse(item);

      if (new Date(data.expiredAt) >= new Date()) {
        return data.value;
      } else {
        localStorage.removeItem(key);
      }
    }
  }

  setCache(key, value, minutes = 30) {
    var expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + minutes);
    expiredAt = new Date(expiredAt);

    localStorage.setItem(
      key,
      JSON.stringify({
        value: value,
        expiredAt: expiredAt,
      })
    );
  }

  buildQueryString() {
    const queryString = new URLSearchParams();

    Object.keys(this.requiredParamsForSignIn).forEach((parameterName) => {
      queryString.append(
        this.requiredParamsForSignIn[parameterName],
        this.getProviderParameter(parameterName)
      );
    });

    Object.keys(this.optionalParamsForSignIn).forEach((parameterName) => {
      if (isPresent(this.getProviderParameter(parameterName))) {
        queryString.append(
          this.optionalParamsForSignIn[parameterName],
          this.getProviderParameter(parameterName)
        );
      }
    });

    return queryString.toString();
  }

  buildChallengeUrl() {
    const endpoint = this._authorizationEndpoint;
    const queryString = this.buildQueryString();

    return [endpoint, queryString.toString()].join('?');
  }

  async signIn() {
    try {
      await this.validate(this.requiredParamsForSignIn);

      const url = this.buildChallengeUrl();

      if (
        this.getGlobalParameter('popup') ||
        this.getProviderParameter('popup')
      ) {
        const options = this.stringifyOptions(
          this.prepareOptions(
            this.getGlobalParameter('popupOptions') ||
              this.getProviderParameter('popupOptions') ||
              {}
          )
        );

        return this.oauther.popupOpen(url, options);
      } else {
        window.location.replace(url);

        return resolve();
      }
    } catch (e) {
      return reject(e);
    }
  }

  async exchangeAccessToken(code) {
    try {
      await this.validate(this.requiredParamsForExchangeAccessToken);

      var body = new URLSearchParams();

      Object.keys(this.requiredParamsForExchangeAccessToken).forEach(
        (parameterName) => {
          body.append(
            this.requiredParamsForExchangeAccessToken[parameterName],
            this.getProviderParameter(parameterName)
          );
        }
      );

      Object.keys(this.optionalParamsForExchangeAccessToken).forEach(
        (parameterName) => {
          if (isPresent(this.getProviderParameter(parameterName))) {
            body.append(
              this.optionalParamsForExchangeAccessToken[parameterName],
              this.getProviderParameter(parameterName)
            );
          }
        }
      );

      body.append('code', code);
      body.append('grant_type', 'authorization_code');

      return fetch(this.getEndpoint('tokenEndpoint'), {
        method: 'POST',
        body: body,
        headers: {
          Accept: 'application/json',
        },
      });
    } catch (e) {
      return reject(e);
    }
  }

  async exchangeUserInformation(accessToken) {
    this.accessToken = accessToken;

    try {
      await this.validate(this.requiredParamsForExchangeUserInformation);

      const queryString = new URLSearchParams();

      Object.keys(this.requiredParamsForExchangeUserInformation).forEach(
        (parameterName) => {
          queryString.append(
            this.requiredParamsForExchangeUserInformation[parameterName],
            this.getProviderParameter(parameterName)
          );
        }
      );

      Object.keys(this.optionalParamsForExchangeUserInformation).forEach(
        (parameterName) => {
          if (isPresent(this.getProviderParameter(parameterName))) {
            queryString.append(
              this.optionalParamsForExchangeUserInformation[parameterName],
              this.getProviderParameter(parameterName)
            );
          }
        }
      );

      const endpoint = [
        this.getEndpoint('userInformationEndpoint'),
        queryString.toString(),
      ].join('?');

      return fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...this.requiredHeadersForExchangeUserInformation,
        },
      });
    } catch (e) {
      return reject(e);
    }
  }
}
