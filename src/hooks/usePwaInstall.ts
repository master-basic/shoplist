import { useState, useEffect, useRef, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePwaInstall(): {
  isInstalled: boolean;
  shouldShowPrompt: boolean;
  promptInstall: () => Promise<void>;
  dismissPrompt: () => void;
} {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const dismissCountRef = useRef(0);
  const lastDismissedRef = useRef<number>(0);

  const checkStandalone = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return true;
    }
    if (typeof window !== 'undefined' && (window as any).standalone) {
      setIsInstalled(true);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    checkStandalone();
  }, [checkStandalone]);

  useEffect(() => {
    const storedDismissed = localStorage.getItem('pwa_install_prompt_dismissed');
    const dismissedCount = parseInt(storedDismissed || '0', 10);
    dismissCountRef.current = dismissedCount;

    const dismissedAt = parseInt(localStorage.getItem('pwa_install_prompt_dismissed_at') || '0', 10);
    lastDismissedRef.current = dismissedAt;

    const now = Date.now();
    if (now - dismissedAt < 7 * 24 * 60 * 60 * 1000) {
      setShouldShowPrompt(false);
    }
  }, []);

  useEffect(() => {
    const handleInstalled = () => {
      setIsInstalled(true);
      setShouldShowPrompt(false);
    };

    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true);
      setShouldShowPrompt(false);
    }

    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    const now = Date.now();
    const newCount = dismissCountRef.current + 1;
    localStorage.setItem('pwa_install_prompt_dismissed', String(newCount));
    localStorage.setItem('pwa_install_prompt_dismissed_at', String(now));
    dismissCountRef.current = newCount;
    lastDismissedRef.current = now;
    setShouldShowPrompt(false);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      const storedDismissed = localStorage.getItem('pwa_install_prompt_dismissed');
      const dismissedCount = parseInt(storedDismissed || '0', 10);

      if (dismissedCount < 3) {
        setShouldShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  return {
    isInstalled,
    shouldShowPrompt,
    promptInstall,
    dismissPrompt,
  };
}
