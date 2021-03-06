import OAuth2CodeProvider from './oauth2-code';

export default class StackexchangeProvider extends OAuth2CodeProvider {
  get name() {
    return 'stackexchange';
  }

  get displayName() {
    return 'StackExchange';
  }

  get _authorizationEndpoint() {
    return 'https://stackexchange.com/oauth';
  }

  get _tokenEndpoint() {
    return 'https://stackoverflow.com/oauth/access_token/json';
  }

  get _userInformationEndpoint() {
    return 'https://api.stackexchange.com/2.2/me';
  }

  get requiredParamsForExchangeUserInformation() {
    return {
      accessToken: 'access_token',
      site: 'site',
      key: 'key',
    };
  }

  get requiredHeadersForExchangeUserInformation() {
    return {};
  }
}
