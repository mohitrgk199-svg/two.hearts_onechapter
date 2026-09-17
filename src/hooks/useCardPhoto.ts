import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Manages Base64 photo data persisted in LocalStorage, keyed by a unique card ID.
 * Returns the current photo (if any), a hidden file input, and handlers to
 * pick / change / clear the photo — all without touching any surrounding styling.
 */
export function useCardPhoto(cardId: string) {
  const storageKey = `angel-photo-${cardId}`;
  const [photo, setPhoto] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setPhoto(saved);
    } catch {
      // LocalStorage unavailable — silently ignore
    }
  }, [storageKey]);

  const persist = useCallback(
    (dataUrl: string | null) => {
      try {
        if (dataUrl) {
          localStorage.setItem(storageKey, dataUrl);
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch {
        // Storage full or unavailable — ignore
      }
    },
    [storageKey]
  );

  const pickFile = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setPhoto(dataUrl);
        persist(dataUrl);
      };
      reader.readAsDataURL(file);
    },
    [persist]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset so selecting the same file again still fires onChange
      e.target.value = '';
    },
    [handleFile]
  );

  const clearPhoto = useCallback(() => {
    setPhoto(null);
    persist(null);
  }, [persist]);

  return { photo, inputRef, pickFile, onInputChange, clearPhoto };
}
