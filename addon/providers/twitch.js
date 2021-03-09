import OAuth2CodeProvider from './oauth2-code';
import { capitalize } from '@ember/string';

export default class TwitchProvider extends OAuth2CodeProvider {
  get name() {
    return 'twitch';
  }

  get displayName() {
    return capitalize(this.name);
  }

  get _authorizationEndpoint() {
    return 'https://id.twitch.tv/oauth2/authorize';
  }

  get _tokenEndpoint() {
    return 'https://id.twitch.tv/oauth2/token';
  }

  get _userInformationEndpoint() {
    return 'https://api.twitch.tv/helix/users';
  }

  get requiredParamsForSignIn() {
    return {
      ...super.requiredParamsForSignIn,
      ...{ scope: 'scope', forceVerify: 'force_verify' },
    };
  }

  get optionalParamsForSignIn() {
    return {};
  }

  get requiredHeadersForExchangeUserInformation() {
    return {
      ...super.requiredHeadersForExchangeUserInformation,
      ...{ 'Client-ID': this.getProviderParameter('clientId') },
    };
  }
}
