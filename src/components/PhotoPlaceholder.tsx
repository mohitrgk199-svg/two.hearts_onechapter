import { useRef, useState } from 'react';
import { Camera, X, Video, Image as ImageIcon } from 'lucide-react';
import { useCardMedia } from '@/hooks/useCardMedia';

type PhotoPlaceholderProps = {
  cardId: string;
  className: string;
  containerStyle: React.CSSProperties;
  emptyIcon: string;
  emptyIconClass?: string;
  emptyText: string;
  emptyTextClass?: string;
  roundedClass?: string;
  hoverScaleClass?: string;
  allowVideo?: boolean;
};

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
  allowVideo = false,
}: PhotoPlaceholderProps) {
  const {
    mediaUrl,
    mediaType,
    uploading,
    imageInputRef,
    videoInputRef,
    pickImage,
    pickVideo,
    onImageInputChange,
    onVideoInputChange,
    clearMedia,
  } = useCardMedia(cardId);

  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleBoxClick = () => {
    if (mediaUrl) return; // don't open picker when media already exists
    if (allowVideo) {
      setShowMediaMenu((v) => !v);
    } else {
      pickImage();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`group/photo relative cursor-pointer ${className} ${hoverScaleClass ?? ''}`}
      style={containerStyle}
      onClick={handleBoxClick}
    >
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageInputChange}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/webm"
        className="hidden"
        onChange={onVideoInputChange}
      />

      {uploading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ background: 'rgba(26,19,37,0.7)' }}>
          <div className="flex flex-col items-center gap-2">
            <div
              className="h-6 w-6 rounded-full border-2 border-blush-300/30 border-t-blush-300"
              style={{ animation: 'spin 1s linear infinite' }}
            />
            <p className="font-sans text-[10px] text-blush-300/70">Uploading…</p>
          </div>
        </div>
      )}

      {/* Media type selector menu (when allowVideo and no media yet) */}
      {showMediaMenu && !mediaUrl && allowVideo && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3"
          style={{ background: 'rgba(26,19,37,0.85)' }}
          onClick={(e) => {
            e.stopPropagation();
            setShowMediaMenu(false);
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMediaMenu(false);
              pickImage();
            }}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-sans text-white transition-colors"
            style={{ background: 'rgba(255,122,166,0.25)', border: '1px solid rgba(255,169,192,0.3)' }}
          >
            <ImageIcon className="h-4 w-4" />
            Upload Photo
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMediaMenu(false);
              pickVideo();
            }}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-sans text-white transition-colors"
            style={{ background: 'rgba(255,122,166,0.25)', border: '1px solid rgba(255,169,192,0.3)' }}
          >
            <Video className="h-4 w-4" />
            Upload Video
          </button>
        </div>
      )}

      {mediaUrl ? (
        <>
          {mediaType === 'video' ? (
            <video
              src={mediaUrl}
              controls
              playsInline
              preload="metadata"
              className={`h-full w-full object-contain ${roundedClass}`}
              style={{ background: 'rgba(26,19,37,0.4)' }}
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Our memory"
              className={`h-full w-full object-contain ${roundedClass}`}
            />
          )}
          {/* Hover overlay with change + remove buttons */}
          {/* pointer-events: none on wrapper so clicks pass through to video controls;
              buttons re-enable pointer-events: auto so they still work on hover */}
          <div
            className={`absolute inset-0 flex items-center justify-center gap-3 ${roundedClass} opacity-0 transition-opacity duration-300 group-hover/photo:opacity-100`}
            style={{ background: mediaType === 'video' ? 'rgba(26,19,37,0.55)' : 'rgba(26,19,37,0.55)', pointerEvents: 'none' }}
          >
            <button
              type="button"
              style={{ background: 'rgba(255,122,166,0.3)', border: '1px solid rgba(255,169,192,0.3)', pointerEvents: 'auto' }}
              onClick={(e) => {
                e.stopPropagation();
                if (allowVideo) {
                  setShowMediaMenu(true);
                } else {
                  pickImage();
                }
              }}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-sans text-white transition-colors"
              aria-label="Change media"
            >
              <Camera className="h-3.5 w-3.5" />
              Change
            </button>
            <button
              type="button"
              style={{ background: 'rgba(244,63,94,0.3)', border: '1px solid rgba(244,63,94,0.3)', pointerEvents: 'auto' }}
              onClick={(e) => {
                e.stopPropagation();
                clearMedia();
              }}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-sans text-white transition-colors"
              aria-label="Remove media"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </>
      ) : (
        !showMediaMenu && (
          <div
            className="flex h-full items-center justify-center"
            data-placeholder="true"
            onClick={(e) => {
              e.stopPropagation();
              if (allowVideo) {
                setShowMediaMenu(true);
              } else {
                pickImage();
              }
            }}
          >
            <div className="text-center" data-placeholder="true">
              <div className={emptyIconClass}>{emptyIcon}</div>
              <p className={emptyTextClass}>{emptyText}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
