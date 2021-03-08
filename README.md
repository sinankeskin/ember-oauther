# ember-oauther

OAuther is a set of providers and routers to connect OAuth 1.0a and OAuth 2.0 services like facebook, google etc.

Very similar to Torii but no session manager and no adapter.

## Compatibility

- Ember.js v3.16 or above
- Ember CLI v2.13 or above
- Node.js v10 or above

## Installation

```
ember install ember-oauther
```

## Usage

OAuth 1.0a is a 4 step process. Some steps in some providers are not allowed to use in clients (CORS).
Which this is understandable because client secret must be secret. Clients is not a good place.

| Provider | Request Token (requestTokenEndpoint) | Authentication (authenticationEndpoint) | Access Token(accessTokenEndpoint) | User Information (userInformationEndpoint) |
| -------- | ------------------------------------ | --------------------------------------- | --------------------------------- | ------------------------------------------ |
| Twitter  | :x:                                  | :heavy_check_mark:                      | :x:                               | :x:                                        |

Oauth 2.0 is a 3 step process. Some steps in some providers are not allowed to use in clients (CORS).
Which this is understandable because client secret must be secret. Clients is not a good place.

| Provider      | Authorization (authorizationEndpoint) | Access Token (tokenEndpoint) | User Information (userInformationEndpoint) |
| ------------- | ------------------------------------- | ---------------------------- | ------------------------------------------ |
| Google        | :heavy_check_mark:                    | :heavy_check_mark:           | :heavy_check_mark:                         |
| Microsoft     | :heavy_check_mark:                    | :heavy_check_mark:           | :heavy_check_mark:                         |
| Facebook      | :heavy_check_mark:                    | :heavy_check_mark:           | :heavy_check_mark:                         |
| Instagram     | :heavy_check_mark:                    | :x:                          | :x:                                        |
| GitHub        | :heavy_check_mark:                    | :x:                          | :heavy_check_mark:                         |
| LinkedIn      | :heavy_check_mark:                    | :x:                          | :x:                                        |
| Yandex        | :heavy_check_mark:                    | :heavy_check_mark:           | :x:                                        |
| Twitch        | :heavy_check_mark:                    | :heavy_check_mark:           | :heavy_check_mark:                         |
| StackExchange | :heavy_check_mark:                    | :x:                          | :x:                                        |

All required parameters should be in environment with a name 'ember-oauther'.

If you are seeing :x: in the provider line that you want to use and it's ok to send client secret in plain text.
You have 3 options;

1. Set your own endpoint url. For example:

```javascript
ENV['ember-oauther'] = {
  instagram: {
    clientId: '...',
    clientSecret: '....',
    redirectUri: 'https://localhost:4200/instagram-sign-in',
    scope: 'user_profile',
    fields: 'id,username',
    tokenEndpoint: {
      url: 'your token endpoint url',
    }
  }
```

2. Use useCorsProxy parameter without corsProxyEndpoint parameter. For example:

```javascript
ENV['ember-oauther'] = {
  instagram: {
    clientId: '...',
    clientSecret: '....',
    redirectUri: 'https://localhost:4200/instagram-sign-in',
    scope: 'user_profile',
    fields: 'id,username',
    tokenEndpoint: {
      useCorsProxy: true,
    }
  }
```

By default it will use `https://cors-anywhere.herokuapp.com` by default.

3. Use useCorsProxy parameter with corsProxyEndpoint parameter. For example:

```javascript
ENV['ember-oauther'] = {
  instagram: {
    clientId: '...',
    clientSecret: '....',
    redirectUri: 'https://localhost:4200/instagram-sign-in',
    scope: 'user_profile',
    fields: 'id,username',
    tokenEndpoint: {
      useCorsProxy: true,
      corsProxyEndpoint: "your cors proxy endpoint"
    }
  }
```

ember-oauther also provides 2 routes for redirection routes. Oauth1SignInRoute (twitter) and Oauth2CodeSignInRoute.

Routes has 2 helper functions. getAccessToken and getUserInformation. Both functions takes params which also inherited from super.

OAuth 1.0a params

```javascript
queryParams = {
  oauth_token: '',
  oauth_verifier: '',
  provider: '',
};
```

OAuth 2.0 params:

```javascript
queryParams = {
  code: '',
  state: '',
  scope: '',
  provider: '',
};
```

Simply extend your redirection route from the right route.

```javascript
import Oauth2CodeSignInRoute from 'ember-oauther/routes/oauth2-code-sign-in';

export default class GoogleSignInRoute extends Oauth2CodeSignInRoute {
  model(params) {
    this.getAccessToken(params).then((accessToken) => {
      console.log(accessToken);
    });

    this.getUserInformation(params).then((data) => {
      console.log(data);
    });
  }
}
```

Also if you are using ember-simple-auth addon there is a complementary addon for called [ember-simple-auth-oauther](https://github.com/sinankeskin/ember-simple-auth-oauther).

It has 3 authenticators.

1. oauther: For whatever you returned.
2. oauther-token: For same token logic with [ember-simple-auth-token](https://github.com/jpadilla/ember-simple-auth-token)
3. oauther-jwt: For same jwt logic with [ember-simple-auth-token](https://github.com/jpadilla/ember-simple-auth-token)

Of course you should set all required parameters in environment like;

```javascript
ENV['ember-simple-auth-oauther'] = {
  tokenPropertyName: 'access_token',
  serverTokenEndpoint: `${ENV.apiURL}/oauth/login`,
  tokenExpirationInvalidateSession: false,
  refreshAccessTokens: true,
  refreshTokenPropertyName: 'refresh_token',
  serverTokenRefreshEndpoint: `${ENV.apiURL}/users/refresh_token`,
  refreshLeeway: 300,
};
```

For example; you want to use your own backend and you are providing jwt access and refresh token then simply use,

```javascript
import Oauth2CodeSignInRoute from 'ember-oauther/routes/oauth2-code-sign-in';
import { inject as service } from '@ember/service';

export default class Oauth2SignInRoute extends Oauth2CodeSignInRoute {
  @service
  session;

  model(params) {
    this.session
      .authenticate('authenticator:oauther-jwt', params)
      .then(() => {
        console.log('Logged in');
      })
      .catch((e) => {
        console.error('error', e);
      });
  }
}
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
