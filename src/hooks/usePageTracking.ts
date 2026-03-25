import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return;

    const sessionId = getOrCreateSessionId();
    const referrer = document.referrer || null;

    supabase.from('page_views').insert({
      page_path: path,
      session_id: sessionId,
      referrer,
    });
  }, [location.pathname]);
}
