import { validator, schema } from '@ioc:Adonis/Core/Validator';
import get from 'lodash/get';
import head from 'lodash/head';
import isString from 'lodash/isString';
import keys from 'lodash/keys';

export default class Response {
  /**
   * Validate
   *
   * @param  array params - params to validate
   * @param  array rules - validation rules
   * @return mixed
   */
  public static async validate(data, rules) {
    try {
      await validator.validate({
        schema: rules,
        data: data,
      });
    } catch (error) {
      const field = get(keys(error.messages), '0');

      if (field) {
        let msg = head(get(error.messages, field));
        return { field, msg: `${field}: ${msg}` };
      }

      return false;
    }

    return false;
  }

  /**
   * Return error response
   *
   * @param  mixed response - response
   * @return mixed
   */
  public static error(response) {
    if (isString(response)) {
      response = {
        type: 'error',
        msg: response,
      };
    }
    return { response: { type: 'error', ...response } };
  }

  /**
   * Return success response
   *
   * @param  mixed response - response
   * @return mixed
   */
  public static success(response) {
    if (isString(response)) {
      response = { msg: response };
    }

    return { response: response };
  }

  /**
   * Parse response
   *
   * @param  object request - request
   * @param  array config - response parsing config
   * @return mixed
   */
  public static async parse(request, config) {
    let rules = schema.create({
      action: schema.enum(keys(config)),
    });

    let validate = await this.validate(request.input('action'), {
      action: rules,
    });
    if (validate) return this.error(validate);

    const current = get(config, request.input('action'), null);

    if (current === null) {
      return this.error('Server error!');
    }

    rules = get(current, 'rules', {});

    validate = await this.validate(request.all(), rules);
    if (validate) return this.error(validate);

    return current.action(request);
  }
}
