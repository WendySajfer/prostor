import React from 'react'

import { cn } from '~/lib/utils'
import { api } from '~/utils/api'

export const HeartSVG: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className,
  ...props
}) => {
  return (
    <svg
      className={cn(`heart__icon`, className)}
      width="100"
      height="100"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="var(--secondary)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
      </defs>
      <path d="M99.1713 22.5917C96.3855 12.0078 88.5987 3.83913 78.7161 0.967393L78.5097 0.916655C76.2784 0.334867 73.7183 0 71.0808 0C62.7104 0 55.088 3.37573 49.3906 8.89934L49.4132 8.87904C44.2349 4.11649 37.4057 1.20755 29.9284 1.20755C27.3264 1.20755 24.8049 1.55933 22.3996 2.21892L22.6059 2.17156C12.0429 5.32066 3.89179 13.8682 0.944735 24.7193L0.889921 24.9493C0.325659 27.2426 0 29.8776 0 32.5903C0 41.8042 3.74347 50.1049 9.72142 55.9024L9.74076 55.9227L46.4371 98.6064C47.1787 99.4656 48.246 100 49.4325 100C50.6191 100 51.6863 99.4622 52.4247 98.6098L52.4279 98.6064L89.0501 56.0005C95.7825 49.6516 100 40.485 100 30.2868C100 27.5572 99.6969 24.9019 99.1262 22.3549L99.1713 22.5883V22.5917Z" />
    </svg>
  )
}
export function HeartCheck({
  checked,
  className,
  invalidateFeed,
  postId,
  size,
}: {
  checked?: boolean
  className?: string
  invalidateFeed: () => void
  postId: string
  size?: string
}) {
  const heartSize = size ?? '50px'
  const style: React.CSSProperties = {
    '--heart-size': heartSize,
  } as React.CSSProperties & { '--heart-size'?: string }
  const { mutate: postLike } = api.posts.postLike.useMutation()
  const liked = React.useCallback(() => {
    try {
      postLike(
        { id: postId },
        {
          onError(error) {
            console.log(error)
            return false
          },
          onSuccess() {
            invalidateFeed()
          },
        },
      )
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }, [invalidateFeed, postId, postLike])

  return (
    <label className={cn(`heart`, className)} style={style}>
      <input
        type="checkbox"
        className="heart__checkbox"
        checked={checked}
        onChange={liked}
      />
      <HeartSVG />
    </label>
  )
}
