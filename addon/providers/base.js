import { reject, resolve } from 'rsvp';

import EmberObject from '@ember/object';
import { assert } from '@ember/debug';
import { cached } from '@glimmer/tracking';
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

  getParameter(parameterName, subParameterName) {
    const config = this._config[this.name];

    assert(`${this.displayName} config not found.`, isPresent(config));

    if (subParameterName) {
      return config[parameterName][subParameterName];
    }

    return config[parameterName] || this[parameterName];
  }

  getEndpoint(parameterName) {
    if (this.getParameter(parameterName)) {
      if (this.getParameter(parameterName, 'url')) {
        return this.getParameter(parameterName, 'url');
      } else {
        if (this.getParameter(parameterName, 'useCorsProxy')) {
          if (this.getParameter(parameterName, 'corsProxyEndpoint')) {
            return `${this.getParameter(parameterName, 'corsProxyEndpoint')}${
              this[`_${parameterName}`]
            }`;
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
      if (isPresent(this.getParameter(parameter))) {
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
}
