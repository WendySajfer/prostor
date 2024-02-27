/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import burger from '~/../public/icons/burger.svg'
import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '~/components/ui/sheet'
import useProviders from '~/domain/authentication/use-providers'
import {
  useVkAuthentication,
  useVkProvider,
} from '~/domain/authentication/use-vk-authentication'
import { cn } from '~/lib/utils'

import { Button } from './ui/button'

export default function BurgerMenu() {
  return (
    <Sheet key="burger">
      <SheetTrigger asChild>
        <Image
          src={burger}
          alt="burger"
          className={cn(`h-10 w-10`, `cursor-pointer`, `hover:shadow-xl`)}
        />
      </SheetTrigger>
      <SheetContent side="left" className={cn(`py-16 min-w-[320px] max-w-sm`)}>
        <SheetClose asChild>
          <div className={cn(`grid items-center gap-4`)}>
            <Link href="/"
              className={cn(
                `text-lg font-medium tracking-wider text-white`,
                `burger-menu_animate rounded-lg`,
                `h-14 w-[80%]`,
                `cursor-pointer`,
                `flex items-center p-3`,
              )}
            >
              Главная
            </Link>
            <AuthShowcase/>
          </div>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}

function AuthShowcase() {
  const { data: sessionData } = useSession()
  const { providers } = useProviders({ onError: console.error })
  const { provider: vkProvider } = useVkProvider({
    providers: providers ?? null,
  })

  const { signIn } = useVkAuthentication({ provider: vkProvider })

  return (
    <Button
    className={cn(
      `text-lg font-medium tracking-wider text-white`,
      `burger-menu_animate rounded-lg`,
      `h-14 w-[80%]`,
      `cursor-pointer`,
      `flex items-center justify-start p-3`,
    )}
      onClick={sessionData ? () => void signOut() : () => void signIn()}
    >
      {sessionData ? 'Выйти' : 'Войти через вк'}
    </Button>
  )
}
