import OAuth2CodeProvider from './oauth2-code';

export default class GithubProvider extends OAuth2CodeProvider {
  get name() {
    return 'github';
  }

  get displayName() {
    return 'GitHub';
  }

  get _authorizationEndpoint() {
    return 'https://github.com/login/oauth/authorize';
  }

  get _tokenEndpoint() {
    return 'https://github.com/login/oauth/access_token';
  }

  get _userInformationEndpoint() {
    return 'https://api.github.com/user';
  }

  get requiredParamsForSignIn() {
    return { ...super.requiredParamsForSignIn, ...{ scope: 'scope' } };
  }

  get optionalParamsForSignIn() {
    return {};
  }

  get requiredParamsForExchangeAccessToken() {
    return {
      ...super.requiredParamsForExchangeAccessToken,
      ...{ state: 'state' },
    };
  }
}
