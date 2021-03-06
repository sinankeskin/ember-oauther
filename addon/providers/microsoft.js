import OAuth2CodeProvider from './oauth2-code';
import { capitalize } from '@ember/string';
import forge from 'node-forge';
import { isNone } from '@ember/utils';

export default class MicrosoftProvider extends OAuth2CodeProvider {
  get name() {
    return 'microsoft';
  }

  get displayName() {
    return capitalize(this.name);
  }

  get _authorizationEndpoint() {
    return `https://login.microsoftonline.com/${this._tenantId}/oauth2/v2.0/authorize`;
  }

  get _tokenEndpoint() {
    return `https://login.microsoftonline.com/${this._tenantId}/oauth2/v2.0/token`;
  }

  get _userInformationEndpoint() {
    return 'https://graph.microsoft.com/v1.0/me';
  }

  get _tenantId() {
    if (this.getParameter('tenantId')) {
      return this.getParameter('tenantId');
    }

    return 'common';
  }

  get responseMode() {
    return 'query';
  }

  get codeVerifier() {
    if (isNone(this.getCache('code_verifier'))) {
      let bytes = '';

      for (let index = 0; index < 32; index++) {
        bytes += Math.floor(Math.random() * 9) + 1;
      }

      this.setCache('code_verifier', forge.util.encode64(bytes));
    }

    return this.getCache('code_verifier');
  }

  get codeChallenge() {
    var md = forge.md.sha256.create();
    md.update(this.codeVerifier);

    const code = forge.util.encode64(md.digest().getBytes());

    return this.base64EncodeUrl(code);
  }

  get codeChallengeMethod() {
    return 'S256';
  }

  get requiredParamsForSignIn() {
    return {
      ...super.requiredParamsForSignIn,
      ...{
        scope: 'scope',
        responseMode: 'response_mode',
        codeChallenge: 'code_challenge',
        codeChallengeMethod: 'code_challenge_method',
      },
    };
  }

  get optionalParamsForSignIn() {
    return {};
  }

  get requiredParamsForExchangeAccessToken() {
    return {
      clientId: 'client_id',
      codeVerifier: 'code_verifier',
      redirectUri: 'redirect_uri',
    };
  }

  base64EncodeUrl(str) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
