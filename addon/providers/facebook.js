import OAuth2CodeProvider from './oauth2-code';
import { capitalize } from '@ember/string';

export default class FacebookProvider extends OAuth2CodeProvider {
  get name() {
    return 'facebook';
  }

  get displayName() {
    return capitalize(this.name);
  }

  get _authorizationEndpoint() {
    return `https://www.facebook.com${this._apiVersion}/dialog/oauth`;
  }

  get _tokenEndpoint() {
    return `https://graph.facebook.com${this._apiVersion}/oauth/access_token`;
  }

  get _userInformationEndpoint() {
    return `https://graph.facebook.com${this._apiVersion}/me`;
  }

  get _apiVersion() {
    if (this.getProviderParameter('apiVersion')) {
      return `/${this.getProviderParameter('apiVersion')}`;
    }

    return '';
  }

  get requiredParamsForSignIn() {
    return { ...super.requiredParamsForSignIn, ...{ scope: 'scope' } };
  }

  get optionalParamsForSignIn() {
    return {};
  }

  get optionalParamsForExchangeUserInformation() {
    return {
      fields: 'fields',
    };
  }
}
