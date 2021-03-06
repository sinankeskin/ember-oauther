import FacebookProvider from 'ember-oauther/providers/facebook';
import GithubProvider from 'ember-oauther/providers/github';
import GoogleProvider from 'ember-oauther/providers/google';
import InstagramProvider from 'ember-oauther/providers/instagram';
import LinkedinProvider from 'ember-oauther/providers/linkedin';
import MicrosoftProvider from 'ember-oauther/providers/microsoft';
import StackexchangeProvider from 'ember-oauther/providers/stackexchange';
import TwitchProvider from 'ember-oauther/providers/twitch';
import TwitterProvider from 'ember-oauther/providers/twitter';
import YandexProvider from 'ember-oauther/providers/yandex';

export function initialize(application) {
  application.register('oauther-provider:facebook', FacebookProvider);
  application.register('oauther-provider:github', GithubProvider);
  application.register('oauther-provider:google', GoogleProvider);
  application.register('oauther-provider:instagram', InstagramProvider);
  application.register('oauther-provider:linkedin', LinkedinProvider);
  application.register('oauther-provider:microsoft', MicrosoftProvider);
  application.register('oauther-provider:stackexchange', StackexchangeProvider);
  application.register('oauther-provider:twitch', TwitchProvider);
  application.register('oauther-provider:twitter', TwitterProvider);
  application.register('oauther-provider:yandex', YandexProvider);
}

export default {
  initialize,
};
