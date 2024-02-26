import {
  type SignInOptions,
  type ClientSafeProvider,
  type getProviders,
  signIn,
} from 'next-auth/react'
import * as React from 'react'

export function useVkProvider({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>
}) {
  const provider = React.useMemo(() => {
    if (!providers) {
      return undefined
    }

    const providerValues = Object.values(providers)
    return providerValues.find((provider) => provider.name === 'VK')
  }, [providers])

  return React.useMemo(
    () => ({
      provider,
    }),
    [provider],
  )
}

export function useVkAuthentication({
  provider,
}: {
  provider: ClientSafeProvider | undefined
}) {
  const authenticate = React.useCallback(
    async (options?: SignInOptions) => {
      if (!provider) {
        return
      }

      await signIn(provider.id, options)
    },
    [provider],
  )

  return React.useMemo(
    () => ({
      signIn: authenticate,
    }),
    [authenticate],
  )
}
