import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type CardTextRecord = {
  id: string;
  card_id: string;
  date_label: string;
  title: string;
  message: string;
  tag: string;
};

export type CardText = {
  date: string;
  title: string;
  message: string;
  tag: string;
};

/**
 * Loads editable text (date, title, message, tag) for a scrapbook card from Supabase.
 * Falls back to provided defaults if no saved record exists.
 * `saveText` upserts the text to the `card_text` table.
 */
export function useCardText(cardId: string, defaults: CardText) {
  const [text, setText] = useState<CardText>(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data, error } = await supabase
          .from('card_text')
          .select('id, card_id, date_label, title, message, tag')
          .eq('card_id', cardId)
          .maybeSingle();

        if (!cancelled && !error && data) {
          const record = data as CardTextRecord;
          setText({
            date: record.date_label || defaults.date,
            title: record.title || defaults.title,
            message: record.message || defaults.message,
            tag: record.tag || defaults.tag,
          });
        } else if (!cancelled) {
          // Fallback to LocalStorage
          try {
            const saved = localStorage.getItem(`angel-text-${cardId}`);
            if (saved) {
              const parsed = JSON.parse(saved) as CardText;
              setText(parsed);
            }
          } catch {
            // use defaults
          }
        }
      } catch {
        if (!cancelled) {
          try {
            const saved = localStorage.getItem(`angel-text-${cardId}`);
            if (saved) {
              const parsed = JSON.parse(saved) as CardText;
              setText(parsed);
            }
          } catch {
            // use defaults
          }
        }
      }
      if (!cancelled) setLoaded(true);
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId]);

  const saveText = useCallback(
    async (newText: CardText): Promise<void> => {
      setText(newText);
      try {
        const { error } = await supabase
          .from('card_text')
          .upsert(
            {
              card_id: cardId,
              date_label: newText.date,
              title: newText.title,
              message: newText.message,
              tag: newText.tag,
            },
            { onConflict: 'card_id' }
          );
        if (error) {
          // Fallback to LocalStorage
          localStorage.setItem(`angel-text-${cardId}`, JSON.stringify(newText));
        }
      } catch {
        try {
          localStorage.setItem(`angel-text-${cardId}`, JSON.stringify(newText));
        } catch {
          // ignore
        }
      }
    },
    [cardId]
  );

  const deleteText = useCallback(async (): Promise<void> => {
    try {
      await supabase.from('card_text').delete().eq('card_id', cardId);
    } catch {
      // ignore
    }
    try {
      localStorage.removeItem(`angel-text-${cardId}`);
    } catch {
      // ignore
    }
  }, [cardId]);

  return { text, setText, saveText, deleteText, loaded };
}
