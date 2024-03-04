import { cn } from '~/lib/utils'

export const Page: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <div
      role="main"
      className={cn(
        `flex min-h-[calc(100vh-5rem)] w-full max-w-xl justify-center shadow-xl`,
        className,
      )}
    >
      {children}
    </div>
  )
}
