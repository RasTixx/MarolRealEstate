import { useEffect, useState } from 'react';

export function useFormChangeDetection(isFormDirty: boolean) {
  const [shouldWarn, setShouldWarn] = useState(false);

  useEffect(() => {
    setShouldWarn(isFormDirty);
  }, [isFormDirty]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldWarn) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldWarn]);

  const clearDirtyFlag = () => setShouldWarn(false);

  return { setShouldWarn, clearDirtyFlag };
}
