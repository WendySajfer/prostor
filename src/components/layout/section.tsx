import { cn } from '~/lib/utils'

export const Section: React.FC<{children: React.ReactNode, className?: string}> = ({children, className}) => {
  return <div className={cn(`px-4 py-8 w-full`, className)}>{children}</div>
}