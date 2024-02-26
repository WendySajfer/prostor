import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { type PrismaClient } from '@prisma/client'
import Cookies from 'cookies'
import { randomUUID } from 'crypto'
import { type IncomingMessage, type ServerResponse } from 'http'
import { type GetServerSidePropsContext } from 'next'
import { type User } from 'next-auth'
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type Profile,
} from 'next-auth'
import { type Account } from 'next-auth'
import { type AdapterUser } from 'next-auth/adapters'
import { decode, encode } from 'next-auth/jwt'
import VkProvider from 'next-auth/providers/vk'

import { env } from '~/env'
import { db } from '~/server/db'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string
      // ...other properties
      // role: UserRole;
    }
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

type UserMutable = Pick<User, 'email' | 'image' | 'name'>

const accountParser = {
  getEmail(account: Account) {
    // Если вк пользователь без email, то account.email === null
    // Чтобы не было account.email: string | undefined | null,
    // делаем account.email: string | undefined
    if (account.email === null) {
      return undefined
    }
    return account.email as string | undefined
  },
}
const profileParser = {
  getUserImage(response: Array<unknown>) {
    const responseItem = response[0]

    if (!responseItem || typeof responseItem !== 'object') {
      return undefined
    }

    const [, photo] = Object.entries(responseItem).find(([key]) =>
      key.startsWith('photo'),
    ) as [string, string | null | undefined]

    return photo ?? undefined
  },
  getUserName(response: Array<unknown>) {
    const responseItem = response[0]

    if (!responseItem || typeof responseItem !== 'object') {
      return undefined
    }

    if (!('first_name' in responseItem) || !('last_name' in responseItem)) {
      return undefined
    }

    if (
      typeof responseItem.first_name !== 'string' ||
      typeof responseItem.last_name !== 'string'
    ) {
      return undefined
    }

    return [responseItem.first_name, responseItem.last_name]
      .map((namePart) => namePart.trim())
      .filter((namePart) => namePart)
      .join(' ')
  },
  getVkResponseArray(profile: Profile) {
    if (!('response' in profile)) {
      return undefined
    }

    return profile.response instanceof Array
      ? (profile.response as Array<unknown>)
      : undefined
  },
}

async function getExistingUser(
  prisma: PrismaClient,
  {
    account,
    email,
  }: {
    email: string | undefined
    account: Pick<Account, 'providerAccountId' | 'provider'> | undefined
  },
) {
  if (!email && !account) {
    return undefined
  }

  return await prisma.user.findFirst({
    where: {
      OR: [
        {
          email,
        },
        {
          accounts: account
            ? {
                some: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              }
            : undefined,
        },
      ],
    },
  })
}
const propsPruner = {
  pruneAccount(account: Account): Account {
    return {
      access_token: account.access_token,
      expires_at: account.expires_at,
      id_token: account.id_token,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      refresh_token: account.refresh_token,
      scope: account.scope,
      session_state: account.session_state,
      token_type: account.token_type,
      type: account.type,
    }
  },
  pruneUser(user: User) {
    return {
      email: user.email,
      image: user.image,
      name: user.name,
    }
  },
}
async function createUser(
  prisma: PrismaClient,
  {
    account,
    user,
  }: {
    user: {
      name: string | null
      email: string | null
      image: string | null
    }
    account: Account
  },
) {
  return await prisma.user.create({
    data: {
      ...user,
      accounts: {
        create: account,
      },
    },
  })
}

function userChanged({
  newUser,
  oldUser,
}: {
  oldUser: UserMutable
  newUser: UserMutable
}) {
  return (
    oldUser.email !== newUser.email ||
    oldUser.name !== newUser.name ||
    oldUser.image !== newUser.image
  )
}

async function configureAccount({
  account,
  profile,
  user,
}: {
  user: User | AdapterUser
  profile: Profile | undefined
  account: Account | null
}) {
  if (!account || !profile) {
    return
  }

  const email = accountParser.getEmail(account)

  const profileResponse = profileParser.getVkResponseArray(profile)
  const image = profileResponse
    ? profileParser.getUserImage(profileResponse)
    : undefined
  const name = profileResponse
    ? profileParser.getUserName(profileResponse)
    : user.name

  let existingUser = await getExistingUser(db, { account, email })

  if (
    existingUser &&
    // Для оптимизации
    userChanged({
      newUser: {
        email,
        image,
        name,
      },
      oldUser: existingUser,
    })
  ) {
    existingUser = await db.user.update({
      data: {
        email: email ?? null,
        image: image ?? null,
        name,
      },
      where: { id: existingUser.id },
    })

    return
  } else if (existingUser) {
    return
  }

  existingUser = await createUser(db, {
    account: propsPruner.pruneAccount(account),
    user: {
      email: email ?? null,
      image: image ?? null,
      name: user.name ?? null,
    },
  })
  account.userId = existingUser.id

  const existingAccount = await db.account.findFirst({
    where: { provider: account.provider, userId: existingUser.id },
  })

  if (existingAccount) {
    return
  }

  await db.account.create({
    data: {
      ...propsPruner.pruneAccount(account),
      userId: existingUser.id,
    },
  })
}

export function requestWrapper(
  req: IncomingMessage,
  res: ServerResponse,
  query: NodeJS.Dict<string | string[]>,
): NextAuthOptions {
  const generateSessionToken = () => randomUUID()

  const fromDate = (time: number, date = Date.now()) =>
    new Date(date + time * 1000)

  const adapter = PrismaAdapter(db)

  const authOptions: NextAuthOptions = {
    adapter: adapter,
    callbacks: {
      session({ session, user }) {
        if (!session.user) {
          return session
        }

        session.user.id = user.id

        return session
      },
      async signIn({ account, profile, user }) {
        if (
          query.nextauth?.includes('callback') &&
          query.nextauth?.includes('credentials') &&
          req.method === 'POST'
        ) {
          if (user) {
            const sessionToken = generateSessionToken()
            const sessionMaxAge = 60 * 60 * 24 * 30 //30Daysconst sessionMaxAge = 60 * 60 * 24 * 30; //30Days
            const sessionExpiry = fromDate(sessionMaxAge)

            await adapter.createSession!({
              expires: sessionExpiry,
              sessionToken: sessionToken,
              userId: user.id,
            })

            const cookies = new Cookies(req, res)

            cookies.set('next-auth.session-token', sessionToken, {
              expires: sessionExpiry,
            })
          }
        }

        await configureAccount({ account, profile, user })

        return true
      },
    },
    debug: true,
    jwt: {
      decode: async ({ secret, token }) => {
        if (query.nextauth?.includes('callback') && req.method === 'POST') {
          return null
        }

        // Revert to default behaviour when not in the credentials provider callback flow
        return decode({ secret, token })
      },
      encode: async ({ maxAge, secret, token }) => {
        if (query.nextauth?.includes('callback') && req.method === 'POST') {
          const cookies = new Cookies(req, res)
          const cookie = cookies.get('next-auth.session-token')

          return cookie ?? ''
        }
        // Revert to default behaviour when not in the credentials provider callback flow
        return encode({ maxAge, secret, token })
      },
    },
    providers: [
      VkProvider({
        clientId: env.VK_CLIENT_ID,
        clientSecret: env.VK_CLIENT_SECRET,
      }),
      /**
       * ...add more providers here.
       *
       * Most other providers require a bit more work than the Discord provider. For example, the
       * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
       * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
       *
       * @see https://next-auth.js.org/providers/github
       */
    ],
    secret: env.NEXTAUTH_SECRET,
  }

  return authOptions
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
  query?: GetServerSidePropsContext['query']
}) => {
  return getServerSession(
    ctx.req,
    ctx.res,
    requestWrapper(ctx.req, ctx.res, ctx.query ?? {}),
  )
}
