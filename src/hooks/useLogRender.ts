import { useEffect, useRef } from 'react';
import log from '@/utils/debug';

export function useLogRender(name: string, props?: Record<string, unknown>) {
  const renderCount = useRef(0);
  renderCount.current++;
  const mounted = useRef(false);

  useEffect(() => {
    log.info(`${name} mounted`, props);
    mounted.current = true;
    return () => log.info(`${name} unmounted`);
  }, []);

  useEffect(() => {
    if (mounted.current) {
      log.info(`${name} re-rendered (#${renderCount.current})`, props);
    }
  });

  return { renderCount: renderCount.current };
}
