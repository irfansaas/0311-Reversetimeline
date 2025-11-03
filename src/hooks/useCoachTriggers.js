import { useEffect, useRef, useState } from 'react';

export default function useCoachTriggers({ idleMs = 3500 } = {}) {
  const [hint, setHint] = useState(null);
  const focusAt = useRef(null);
  const edits = useRef({});

  const onFocus = (id) => { 
    focusAt.current = { id, ts: Date.now() }; 
  };
  
  const onBlur = () => { 
    focusAt.current = null; 
    setHint(null); 
  };
  
  const onEdit = (id) => { 
    edits.current[id] = (edits.current[id] || 0) + 1; 
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const f = focusAt.current;
      if (f && Date.now() - f.ts >= idleMs) {
        setHint({ id: f.id, type: 'idle' });
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [idleMs]);

  const shouldNudge = (id) => (edits.current[id] || 0) >= 2;

  return { hint, onFocus, onBlur, onEdit, shouldNudge };
}
