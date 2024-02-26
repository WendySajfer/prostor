import * as React from 'react'

import {cn} from '~/lib/utils'

const scrollSpeedThreshold = 10

const HeaderStickContainer: React.FC<
  React.PropsWithChildren<
    React.HTMLAttributes<HTMLDivElement> & {
      hiddenClassName: string
      minScrollHeight: number
    }
  >
> = ({children, className, hiddenClassName, minScrollHeight, ...props}) => {
  const [hidden, setHidden] = React.useState(false)

  React.useEffect(() => {
    let oldScroll = window.scrollY

    const headerScrollBehavior = () => {
      // Если находимся в пределах хедера, не даём его скрыть или показываем
      if (window.scrollY < minScrollHeight) {
        setHidden(false)
      }
      // Если свайпнул вниз слишком быстро, скрыть хедер
      else if (window.scrollY - oldScroll > scrollSpeedThreshold) {
        setHidden(true)
      }
      // Если свайпнул вверх слишком быстро, отобразить хедер
      else if (oldScroll - window.scrollY > scrollSpeedThreshold) {
        setHidden(false)
      }

      oldScroll = window.scrollY
    }

    window.addEventListener('scroll', headerScrollBehavior)

    return () => window.removeEventListener('scroll', headerScrollBehavior)
  }, [minScrollHeight])

  return (
    <div
      {...props}
      className={cn(
        'sticky top-0 duration-100',
        className,
        hidden ? hiddenClassName : undefined,
      )}
    >
      {children}
    </div>
  )
}

export default HeaderStickContainer
