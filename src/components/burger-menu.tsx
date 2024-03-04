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
  const { data: sessionData } = useSession()
  return (
    <Sheet key="burger">
      <SheetTrigger asChild>
        <Image
          src={burger}
          alt="burger"
          className={cn(
            `h-10 w-10`,
            `cursor-pointer`,
            `shadow-none`,
            `transition-shadow duration-300 ease-in-out`,
            `hover:shadow-[0px_4px_8px_rgba(0,0,0,0.10)]`,
          )}
        />
      </SheetTrigger>
      <SheetContent side="left" className={cn(`min-w-[320px] max-w-sm py-16`)}>
        <div className={cn(`grid items-center gap-4`)}>
          <SheetClose asChild>
            <Link
              href={{ pathname: '/' }}
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
          </SheetClose>
          {sessionData && (
            <SheetClose asChild>
              <Link
                href={{ pathname: '/post/create' }}
                className={cn(
                  `text-lg font-medium tracking-wider text-white`,
                  `burger-menu_animate rounded-lg`,
                  `h-14 w-[80%]`,
                  `cursor-pointer`,
                  `flex items-center p-3`,
                )}
              >
                Опубликовать
              </Link>
            </SheetClose>
          )}
          <SheetClose asChild>
            <AuthShowcase />
          </SheetClose>
        </div>
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
