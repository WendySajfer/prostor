import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

import { api } from '~/utils/api'

import '~/styles/globals.css'

function getLayoutDefault(page: React.ReactNode) {
  return page
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const pageWithLayout = Component as typeof Component & {
    getLayout?: (page: React.ReactNode) => React.ReactNode
  }
  const getLayout: (page: React.ReactNode) => React.ReactNode =
    pageWithLayout.getLayout ?? getLayoutDefault

  return (
    <>
      <style jsx global>{`
        a,
        button {
          --webkit-tap-highlight-color: transparent;
        }
      `}</style>
      <SessionProvider session={session}>
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </>
  )
}

export default api.withTRPC(MyApp)

/*
  pnpm prisma init
  pnpm prisma generate
  pnpm prisma studio
  pnpm prisma db push
  pnpm run build
  pnpm run dev
*/
