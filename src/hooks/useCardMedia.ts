import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type MediaType = 'image' | 'video';

type CardMediaRecord = {
  id: string;
  card_id: string;
  media_url: string;
  media_type: MediaType;
};

/**
 * Manages photo/video uploads for fixed card slots (bracelet, dress, scrapbook cards).
 * Media is uploaded to Supabase Storage and its public URL is saved in the `card_media`
 * table, so any visitor to the site sees the same media — not just the uploader's browser.
 * Falls back to LocalStorage if Supabase is unavailable.
 */
export function useCardMedia(cardId: string) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Load media from Supabase on mount; fall back to LocalStorage
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data, error } = await supabase
          .from('card_media')
          .select('id, card_id, media_url, media_type')
          .eq('card_id', cardId)
          .maybeSingle();

        if (!cancelled && !error && data) {
          const record = data as CardMediaRecord;
          setMediaUrl(record.media_url);
          setMediaType(record.media_type as MediaType);
        } else if (!cancelled) {
          // Fallback: check LocalStorage
          try {
            const saved = localStorage.getItem(`angel-photo-${cardId}`);
            if (saved) {
              setMediaUrl(saved);
              setMediaType('image');
            }
          } catch {
            // ignore
          }
        }
      } catch {
        // Fallback: check LocalStorage
        if (!cancelled) {
          try {
            const saved = localStorage.getItem(`angel-photo-${cardId}`);
            if (saved) {
              setMediaUrl(saved);
              setMediaType('image');
            }
          } catch {
            // ignore
          }
        }
      }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [cardId]);

  const uploadToStorage = useCallback(
    async (file: File): Promise<string | null> => {
      const fileExt = file.name.split('.').pop() || (file.type.startsWith('video/') ? 'mp4' : 'jpg');
      const folder = file.type.startsWith('video/') ? 'videos' : 'photos';
      const fileName = `${cardId}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(filePath, file, { upsert: true });

      if (uploadError) return null;

      const { data: urlData } = supabase.storage.from('memories').getPublicUrl(filePath);
      return urlData.publicUrl;
    },
    [cardId]
  );

  const saveToDb = useCallback(
    async (url: string, type: MediaType): Promise<boolean> => {
      const { error } = await supabase
        .from('card_media')
        .upsert({ card_id: cardId, media_url: url, media_type: type }, { onConflict: 'card_id' });

      return !error;
    },
    [cardId]
  );

  const removeFromDb = useCallback(async (): Promise<void> => {
    await supabase.from('card_media').delete().eq('card_id', cardId);
  }, [cardId]);

  const handleFile = useCallback(
    async (file: File): Promise<void> => {
      setUploading(true);
      const type: MediaType = file.type.startsWith('video/') ? 'video' : 'image';

      try {
        const publicUrl = await uploadToStorage(file);
        if (publicUrl) {
          const saved = await saveToDb(publicUrl, type);
          if (saved) {
            setMediaUrl(publicUrl);
            setMediaType(type);
            return;
          }
        }
        // Fallback: Base64 in LocalStorage
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setMediaUrl(dataUrl);
          setMediaType(type);
          try {
            localStorage.setItem(`angel-photo-${cardId}`, dataUrl);
          } catch {
            // ignore
          }
        };
        reader.readAsDataURL(file);
      } finally {
        setUploading(false);
      }
    },
    [cardId, uploadToStorage, saveToDb]
  );

  const onImageInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = '';
    },
    [handleFile]
  );

  const onVideoInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = '';
    },
    [handleFile]
  );

  const pickImage = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const pickVideo = useCallback(() => {
    videoInputRef.current?.click();
  }, []);

  const clearMedia = useCallback(async () => {
    setMediaUrl(null);
    setMediaType('image');
    await removeFromDb();
    try {
      localStorage.removeItem(`angel-photo-${cardId}`);
    } catch {
      // ignore
    }
  }, [cardId, removeFromDb]);

  return {
    mediaUrl,
    mediaType,
    loading,
    uploading,
    imageInputRef,
    videoInputRef,
    pickImage,
    pickVideo,
    onImageInputChange,
    onVideoInputChange,
    clearMedia,
  };
}
