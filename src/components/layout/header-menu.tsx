import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { cn } from '~/lib/utils'

export default function HeaderMenu() {
  return (
    <nav className={cn('flex h-20 items-center justify-center px-4')}>
      <Link href="/" className={cn(`flex gap-4 items-center`)}>
        <Logo className={cn('block', `h-12`)} />
        <IconLogo className={cn('block', `h-16 w-auto aspect-square`)} />
      </Link>
    </nav>
  )
}
const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Image
      src="/logo.svg"
      alt="logo"
      width={230}
      height={48}
      className={className}
    />
  )
}
const IconLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Image
      src="/icon-logo-1024.svg"
      alt="Icon-logo"
      width={100}
      height={100}
      className={className}
    />
  )
}
