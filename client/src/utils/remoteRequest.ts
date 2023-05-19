import axios from 'axios';
import trimStart from 'lodash/trimStart';
import isFunction from 'lodash/isFunction';
import extend from 'lodash/extend';
import has from 'lodash/has';
import get from 'lodash/get';

import type { ResponseType, AxiosHeaders } from 'axios';

const instance = axios.create({
  headers: {
    'X-CSRF-TOKEN': (
      document.querySelector('meta[name="csrf-token"]') as HTMLElement
    )?.getAttribute('content'),
    Accept: 'application/json',
  },
});

export interface options {
  url: string;
  params?: Record<string, unknown>;
  data?: any;
  method?: string;
  baseURL?: string;
  headers?: AxiosHeaders;
  responseType?: ResponseType;
  onSuccess?: (any) => void;
  onError?: (any) => void;
  onFail?: (any) => void;
}

const noop = () => false;

function getOptions(options: options = { url: '' }) {
  const defaults = {
    url: null,
    params: {},
    data: {},
    method: 'post',
    baseURL: '/api/',
    headers: {
      Locale: 'en',
    },
    responseType: 'json',
  };

  const { url, onSuccess, onError, onFail } = options;

  if (url) {
    options.url = trimStart(url, '/');
  }

  if (!isFunction(onSuccess)) {
    options.onSuccess = noop;
  }

  if (!isFunction(onError)) {
    options.onError = (response) => {
      console.error(response);
    };
  }

  if (!isFunction(onFail)) {
    options.onFail = noop;
  }

  return extend({}, defaults, options);
}

function remoteRequest(options: options) {
  options = getOptions(options);

  const { onSuccess, onError, onFail } = options;

  instance
    .request(options)
    .then((response) => {
      remoteRequest.parse({
        response: response.data,
        onSuccess,
        onError,
        onFail,
      });
    })
    .catch((error) => {
      onFail(error);
    });
}

remoteRequest.parse = ({ response, onSuccess, onError, onFail }) => {
  const responseType = get(response, 'response.type');

  if (responseType === 'error') {
    if (isFunction(onError)) {
      onError(response.response);
    }
  } else if (has(response, 'response')) {
    if (isFunction(onSuccess)) {
      onSuccess(response.response);
    }
  } else {
    console.error({ parseResponseFailed: response });

    if (isFunction(onFail)) {
      onFail(response);
    }
  }
};

remoteRequest.promise = (options) => {
  options = getOptions(options);

  return instance.request(options);
};

remoteRequest.getCancelToken = () => {
  return axios.CancelToken.source();
};

remoteRequest.all = axios.all;
remoteRequest.spread = axios.spread;

remoteRequest.getCancelToken = () => {
  return axios.CancelToken.source();
};

export default remoteRequest;
