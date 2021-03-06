import OAuth2CodeProvider from './oauth2-code';

export default class LinkedinProvider extends OAuth2CodeProvider {
  get name() {
    return 'linkedin';
  }

  get displayName() {
    return 'LinkedIn';
  }

  get _authorizationEndpoint() {
    return 'https://www.linkedin.com/oauth/v2/authorization';
  }

  get _tokenEndpoint() {
    return 'https://www.linkedin.com/oauth/v2/accessToken';
  }

  get _userInformationEndpoint() {
    return 'https://api.linkedin.com/v2/me';
  }

  get requiredParamsForSignIn() {
    return { ...super.requiredParamsForSignIn, ...{ scope: 'scope' } };
  }

  get optionalParamsForSignIn() {
    return {};
  }
}
