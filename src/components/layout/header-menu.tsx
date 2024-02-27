import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { cn } from '~/lib/utils'

import BurgerMenu from '../burger-menu'

export default function HeaderMenu() {
  return (
    <nav className={cn('flex h-20 items-center justify-between px-4')}>
      <BurgerMenu/>
      <Link href="/" className={cn(`flex gap-4 items-center`)}>
        <Logo className={cn('block', `h-12`)} />
        <IconLogo className={cn('block', `h-16 w-auto aspect-square`)} />
      </Link>
      <div className='w-10 h-10'>
      </div>
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