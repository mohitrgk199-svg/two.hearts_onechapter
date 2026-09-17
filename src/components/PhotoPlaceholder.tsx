import { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { useCardPhoto } from '@/hooks/useCardPhoto';

type PhotoPlaceholderProps = {
  cardId: string;
  // Styling props — passed through verbatim so existing look is preserved
  className: string;
  containerStyle: React.CSSProperties;
  emptyIcon: string;
  emptyIconClass?: string;
  emptyText: string;
  emptyTextClass?: string;
  roundedClass?: string;
  hoverScaleClass?: string;
};

/**
 * Renders the exact same placeholder box as before, but makes it interactive:
 * click to upload, hover to change/remove once a photo is set.
 * Photos persist in LocalStorage keyed by cardId.
 */
export default function PhotoPlaceholder({
  cardId,
  className,
  containerStyle,
  emptyIcon,
  emptyIconClass = 'text-3xl mb-2 opacity-50',
  emptyText,
  emptyTextClass = 'font-sans text-[11px] text-blush-300/50',
  roundedClass = 'rounded',
  hoverScaleClass,
}: PhotoPlaceholderProps) {
  const { photo, inputRef, pickFile, onInputChange, clearPhoto } = useCardPhoto(cardId);
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapperRef}
      className={`group/photo relative cursor-pointer ${className} ${hoverScaleClass ?? ''}`}
      style={containerStyle}
      onClick={(e) => {
        // Only trigger file picker if clicking the box itself (not the remove button)
        if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.placeholder === 'true') {
          pickFile();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />

      {photo ? (
        <>
          <img
            src={photo}
            alt="Our memory"
            className={`h-full w-full object-cover ${roundedClass}`}
          />
          {/* Hover overlay with change + remove buttons */}
          <div
            className={`absolute inset-0 flex items-center justify-center gap-3 ${roundedClass} opacity-0 transition-opacity duration-300 group-hover/photo:opacity-100`}
            style={{ background: 'rgba(26,19,37,0.55)' }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                pickFile();
              }}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-sans text-white transition-colors"
              style={{ background: 'rgba(255,122,166,0.3)', border: '1px solid rgba(255,169,192,0.3)' }}
              aria-label="Change photo"
            >
              <Camera className="h-3.5 w-3.5" />
              Change
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearPhoto();
              }}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-sans text-white transition-colors"
              style={{ background: 'rgba(244,63,94,0.3)', border: '1px solid rgba(244,63,94,0.3)' }}
              aria-label="Remove photo"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </>
      ) : (
        <div
          className="flex h-full items-center justify-center"
          data-placeholder="true"
          onClick={(e) => {
            e.stopPropagation();
            pickFile();
          }}
        >
          <div className="text-center" data-placeholder="true">
            <div className={emptyIconClass}>{emptyIcon}</div>
            <p className={emptyTextClass}>{emptyText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
