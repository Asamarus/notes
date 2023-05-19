import { useCallback, useEffect } from 'react';

export function dispatch(eventName: string, payload?: any) {
  const event = new CustomEvent(eventName, { detail: payload });

  document.dispatchEvent(event);
}

function useCustomEventListener(eventName: string, listener: (payload: any) => void) {
  const handleEvent = useCallback(
    (event: Event) => {
      listener?.(event['detail']);
    },
    [listener],
  );

  useEffect(() => {
    document.addEventListener(eventName, handleEvent);
    return () => document.removeEventListener(eventName, handleEvent);
  }, [eventName, listener, handleEvent]);
}

export default useCustomEventListener;
