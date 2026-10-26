import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

type PhotoProps = {
  src?: string
  alt?: string
  fallback?: string
  aspect?: string
  className?: string
  radius?: string
}

export function Photo({
  src,
  alt = '',
  fallback = 'Foto',
  aspect = '4/5',
  className,
  radius = '22px',
}: PhotoProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  const showImg = Boolean(src) && !failed

  return (
    <div
      className={cn('ph', className)}
      style={{ aspectRatio: aspect, borderRadius: radius }}
    >
      {showImg ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="fb">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            aria-hidden
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
          </svg>
          {fallback}
        </div>
      )}
    </div>
  )
}
