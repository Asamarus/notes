import { useState, useCallback, useRef } from 'react';
import remoteRequest, { options } from 'utils/remoteRequest';
import { FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { Alert } from '@mantine/core';
import type { AlertProps } from '@mantine/core';
import useIsMounted from 'hooks/use-is-mounted';

import get from 'lodash/get';

interface useRequestParams {
  alertProps?: AlertProps;
  requestFunction?: (options: options) => void;
}

interface requestParams {
  url: string;
  data?: any;
  onSuccess?: ({ response, isMounted }: { response: any; isMounted: boolean }) => void;
  onError?: ({ response, isMounted }: { response: any; isMounted: boolean }) => void;
  onFail?: ({ isMounted }: { isMounted: boolean }) => void;
}

function useRequest(params: useRequestParams = {}) {
  const { alertProps, requestFunction = remoteRequest } = params;
  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState(['type', 'msg']);
  const successTimeout = useRef(null);

  const request = useCallback(
    ({ url, data, onSuccess, onError, onFail }: requestParams) => {
      setLoading(true);

      requestFunction({
        url: url,
        data: data,
        onSuccess: (response) => {
          const mounted = isMounted();

          if (mounted) {
            setLoading(false);
            if (typeof get(response, 'msg') === 'string') {
              setAlertData(['success', get(response, 'msg')]);

              if (successTimeout.current) {
                window.clearTimeout(successTimeout.current);
                successTimeout.current = null;
              }
              successTimeout.current = setTimeout(() => {
                setAlertData(['', '']);
              }, 4000);
            }
          }

          if (typeof onSuccess === 'function') {
            onSuccess({ response, isMounted: mounted });
          }
        },
        onError: (response) => {
          const mounted = isMounted();

          if (mounted) {
            setLoading(false);
            if (typeof get(response, 'msg') === 'string') {
              setAlertData(['error', get(response, 'msg')]);
            }
          }

          if (typeof onError === 'function') {
            onError({ response, isMounted: mounted });
          }
        },
        onFail: () => {
          const mounted = isMounted();

          if (mounted) {
            setLoading(false);
          }

          if (typeof onFail === 'function') {
            onFail({ isMounted: isMounted() });
          }
        },
      });
    },
    [isMounted, requestFunction],
  );

  const [alertType, alertMessage] = alertData;

  let alert = null;

  if (alertType === 'success') {
    alert = (
      <Alert
        color="green"
        icon={<FaCheck size={20} />}
        variant="filled"
        withCloseButton
        onClose={() => {
          setAlertData(['', '']);
        }}
        mb={20}
        styles={{ closeButton: { color: 'white', top: '3px' } }}
        {...alertProps}>
        {alertMessage}
      </Alert>
    );
  } else if (alertType === 'error') {
    alert = (
      <Alert
        color="red"
        icon={<FaExclamationTriangle size={20} />}
        variant="filled"
        withCloseButton
        onClose={() => {
          setAlertData(['', '']);
        }}
        mb={20}
        styles={{ closeButton: { color: 'white', top: '3px' } }}
        {...alertProps}>
        {alertMessage}
      </Alert>
    );
  }

  return { loading, request, alert };
}

export default useRequest;
