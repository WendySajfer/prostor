import {type GetServerSidePropsContext} from 'next'

import {getServerAuthSession} from '~/server/auth'

export const createGetServerSideAuthCheck = <T,>(authFailedResult: T) => {
  const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const session = await getServerAuthSession({
      query: ctx.query,
      req: ctx.req,
      res: ctx.res,
    })

    if (!session?.user) {
      return authFailedResult
    }

    return {props: {}}
  }

  return getServerSideProps
}

export const getServerSideAuthRedirect = createGetServerSideAuthCheck({
    redirect: {
      destination: '/',
      permanent: false,
    },
  })
  
  export const getServerSideAuthNotFound = createGetServerSideAuthCheck({
    notFound: true,
  })
  