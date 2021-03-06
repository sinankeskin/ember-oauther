import OAuth2CodeProvider from './oauth2-code';
import { capitalize } from '@ember/string';

export default class InstagramProvider extends OAuth2CodeProvider {
  get name() {
    return 'instagram';
  }

  get displayName() {
    return capitalize(this.name);
  }

  get _authorizationEndpoint() {
    return 'https://api.instagram.com/oauth/authorize';
  }

  get _tokenEndpoint() {
    return 'https://api.instagram.com/oauth/access_token';
  }

  get _userInformationEndpoint() {
    return 'https://graph.instagram.com/me';
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
