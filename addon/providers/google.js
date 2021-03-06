import OAuth2CodeProvider from './oauth2-code';
import { capitalize } from '@ember/string';
export default class GoogleProvider extends OAuth2CodeProvider {
  get name() {
    return 'google';
  }

  get displayName() {
    return capitalize(this.name);
  }

  get _authorizationEndpoint() {
    return 'https://accounts.google.com/o/oauth2/v2/auth';
  }

  get _tokenEndpoint() {
    return 'https://oauth2.googleapis.com/token';
  }

  get _userInformationEndpoint() {
    return 'https://www.googleapis.com/oauth2/v2/userinfo';
  }

  get requiredParamsForSignIn() {
    return { ...super.requiredParamsForSignIn, ...{ scope: 'scope' } };
  }

  get optionalParamsForSignIn() {
    return {};
  }
}
