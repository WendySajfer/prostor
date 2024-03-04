/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import defaultAvatar from '~/../public/icons/avatar.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import * as React from 'react'

import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { cn } from '~/lib/utils'

import BurgerMenu from '../burger-menu'

export default function HeaderMenu() {
  const { data: sessionData } = useSession()
  return (
    <nav className={cn('flex h-20 items-center justify-between px-4')}>
      <BurgerMenu />
      <Link href="/" className={cn(`flex items-center gap-4`)}>
        <Logo className={cn('block', `h-12`)} />
        <IconLogo className={cn('block', `aspect-square h-16 w-auto`)} />
      </Link>
      {sessionData ? (
        <UserAvatar avatarSrc={sessionData.user.image} />
      ) : (
        <div className="h-10 w-10" />
      )}
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

export function UserAvatar({ avatarSrc, className }: { avatarSrc?: string | null, className?: string}) {
  return (
    <Link href="/">
      <Avatar
        className={cn(
          `shadow-[0px_4px_4px_rgba(0,0,0,0.10)]`,
          `transition-shadow duration-300 ease-in-out`,
          `hover:shadow-[0px_4px_8px_rgba(0,0,0,0.25)]`,
          `cursor-pointer`,
          className
        )}
      >
        {avatarSrc ? (
          <AvatarImage src={avatarSrc} />
        ) : (
          <Image
            src={defaultAvatar}
            alt="defaultAvatar"
            className={cn(`aspect-square`)}
            width={40}
            height={40}
          />
        )}
      </Avatar>
    </Link>
  )
}
export function AuthorAvatar({ avatarSrc, className }: { avatarSrc?: string | null, className?: string}) {
  return (
      <Avatar
        className={cn(
          `cursor-pointer`,
          `w-[30px] h-[30px]`,
          `border-[2px]`,
          className
        )}
      >
        {avatarSrc ? (
          <AvatarImage src={avatarSrc} />
        ) : (
          <Image
            src={defaultAvatar}
            alt="defaultAvatar"
            className={cn(`aspect-square`)}
            width={30}
            height={30}
          />
        )}
      </Avatar>
  )
}