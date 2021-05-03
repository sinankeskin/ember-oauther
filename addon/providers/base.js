import { reject, resolve } from 'rsvp';

import EmberObject from '@ember/object';
import { assert } from '@ember/debug';
import { assign } from '@ember/polyfills';
import { cached } from 'tracked-toolbox';
import { getOwner } from '@ember/application';
import { isPresent } from '@ember/utils';

export default class BaseProvider extends EmberObject {
  get owner() {
    return getOwner(this);
  }

  @cached
  get _config() {
    const config = this.owner.resolveRegistration('config:environment') || {};

    assert(
      "ENV['ember-oauther'] config not found.",
      isPresent(config['ember-oauther'])
    );

    return config['ember-oauther'];
  }

  signIn() {
    return resolve();
  }

  getGlobalParameter(parameterName) {
    return this._config[parameterName];
  }

  getProviderParameter(parameterName, subParameterName) {
    const config = this._config[this.name];

    assert(`${this.displayName} config not found.`, isPresent(config));

    if (subParameterName) {
      return config[parameterName][subParameterName];
    }

    return config[parameterName] || this[parameterName];
  }

  getEndpoint(parameterName) {
    if (this.getProviderParameter(parameterName)) {
      if (this.getProviderParameter(parameterName, 'url')) {
        return this.getProviderParameter(parameterName, 'url');
      } else {
        if (this.getProviderParameter(parameterName, 'useCorsProxy')) {
          if (this.getProviderParameter(parameterName, 'corsProxyEndpoint')) {
            return `${this.getProviderParameter(
              parameterName,
              'corsProxyEndpoint'
            )}${this[`_${parameterName}`]}`;
          } else {
            return `https://cors-anywhere.herokuapp.com/${
              this[`_${parameterName}`]
            }`;
          }
        } else {
          return this[`_${parameterName}`];
        }
      }
    } else {
      return this[`_${parameterName}`];
    }
  }

  validate(parameters) {
    let notFound = '';

    const isValid = Object.keys(parameters).every((parameter) => {
      if (isPresent(this.getProviderParameter(parameter))) {
        return true;
      }

      notFound = parameter;
      return false;
    });

    if (isValid) {
      return resolve();
    } else {
      return reject(`Required ${notFound} parameter not found.`);
    }
  }

  stringifyOptions(options) {
    const optionsStrings = [];

    Object.keys(options).forEach((key) => {
      let value;

      switch (options[key]) {
        case true:
          value = '1';
          break;
        case false:
          value = '0';
          break;
        default:
          value = options[key];
          break;
      }

      optionsStrings.push(key + '=' + value);
    });

    return optionsStrings.join(',');
  }

  prepareOptions(options) {
    const width = options.width || 640;
    const height = options.height || 480;

    return assign(
      {
        left: screen.width / 2 - width / 2,
        top: screen.height / 2 - height / 2,
        width: width,
        height: height,
      },
      options
    );
  }
}
