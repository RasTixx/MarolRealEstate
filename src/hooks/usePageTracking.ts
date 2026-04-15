import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const MIN_DWELL_MS = 2000;

function getOrCreateSessionId(): string {
  const key = 'mr_session_id';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

export function usePageTracking() {
  const location = useLocation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const sessionId = getOrCreateSessionId();
      const referrer = document.referrer || null;

      supabase.from('page_views').insert({
        page_path: path,
        session_id: sessionId,
        referrer,
      });
    }, MIN_DWELL_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname]);
}
