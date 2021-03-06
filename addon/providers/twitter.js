import OAuth1Provider from './oauth1';

export default class TwitterProvider extends OAuth1Provider {
  get name() {
    return 'twitter';
  }

  get displayName() {
    return 'Twitter';
  }

  get _requestTokenEndpoint() {
    return 'https://api.twitter.com/oauth/request_token';
  }

  get _authenticationEndpoint() {
    return 'https://api.twitter.com/oauth/authenticate?oauth_token=';
  }

  get _accessTokenEndpoint() {
    return 'https://api.twitter.com/oauth/access_token';
  }

  get _userInformationEndpoint() {
    return `https://api.twitter.com/1.1/account/verify_credentials.json`;
  }

  get optionalParamsForExchangeUserInformation() {
    return {
      includeEntities: 'include_entities',
      includeEmail: 'include_email',
    };
  }
}
