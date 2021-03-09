import BaseProvider from './base';
import OAuth from 'oauth-1.0a';
import forge from 'node-forge';
import { isPresent } from '@ember/utils';
import { inject as service } from '@ember/service';

export default class OAuth1Provider extends BaseProvider {
  @service
  oauther;

  get requiredParamsForSignIn() {
    return {
      consumerKey: 'consumer_key',
      consumerSecret: 'consumer_secret',
      redirectUri: 'redirect_uri',
    };
  }

  get oauth() {
    return OAuth({
      consumer: {
        key: this.getProviderParameter('consumerKey'),
        secret: this.getProviderParameter('consumerSecret'),
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        var hmac = forge.hmac.create();
        hmac.start('sha1', key);
        hmac.update(base_string);

        return forge.util.encode64(hmac.digest().getBytes());
      },
    });
  }

  async signIn() {
    try {
      await this.validate(this.requiredParamsForSignIn);

      const request = {
        url: this._requestTokenEndpoint,
        method: 'POST',
        data: { oauth_callback: this.getProviderParameter('redirectUri') },
      };

      fetch(this.getEndpoint('requestTokenEndpoint'), {
        method: 'POST',
        headers: this.oauth.toHeader(this.oauth.authorize(request)),
      })
        .then((response) => {
          if (response.ok) {
            response.text().then((data) => {
              const query = new URLSearchParams(data);

              if (query.get('oauth_callback_confirmed')) {
                if (
                  this.getGlobalParameter('popup') ||
                  this.getProviderParameter('popup')
                ) {
                  this.oauther.popupOpen(
                    `${this.getEndpoint('authenticationEndpoint')}${query.get(
                      'oauth_token'
                    )}`,
                    this.stringifyOptions(
                      this.prepareOptions(
                        this.getGlobalParameter('popupOptions') ||
                          this.getProviderParameter('popupOptions') ||
                          {}
                      )
                    )
                  );
                } else {
                  window.location.replace(
                    `${this.getEndpoint('authenticationEndpoint')}${query.get(
                      'oauth_token'
                    )}`
                  );
                }
              } else {
                console.error('OAuth callback not confirmed');
              }
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } catch (e) {
      console.error(e);
    }
  }

  exchangeAccessToken(token, verifier) {
    var body = new URLSearchParams();

    body.append('oauth_token', token);
    body.append('oauth_verifier', verifier);

    return fetch(this.getEndpoint('accessTokenEndpoint'), {
      method: 'POST',
      body: body,
    });
  }

  exchangeUserInformation(accessToken, accessTokenSecret) {
    const queryString = new URLSearchParams();

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

    const request = {
      url: [this._userInformationEndpoint, queryString.toString()].join('?'),
      method: 'GET',
    };

    const token = {
      key: accessToken,
      secret: accessTokenSecret,
    };

    const endpoint = [
      this.getEndpoint('userInformationEndpoint'),
      queryString.toString(),
    ].join('?');

    return fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...this.oauth.toHeader(this.oauth.authorize(request, token)),
      },
    });
  }
}
