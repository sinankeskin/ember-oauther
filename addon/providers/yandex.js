import OAuth2CodeProvider from './oauth2-code';
import { capitalize } from '@ember/string';

export default class YandexProvider extends OAuth2CodeProvider {
  get name() {
    return 'yandex';
  }

  get displayName() {
    return capitalize(this.name);
  }

  get _authorizationEndpoint() {
    return 'https://oauth.yandex.com/authorize';
  }

  get _tokenEndpoint() {
    return 'https://oauth.yandex.com/token';
  }

  get _userInformationEndpoint() {
    return 'https://login.yandex.ru/info';
  }

  get requiredParamsForSignIn() {
    return {
      ...super.requiredParamsForSignIn,
      ...{ scope: 'scope' },
    };
  }

  get optionalParamsForSignIn() {
    return {};
  }
}
