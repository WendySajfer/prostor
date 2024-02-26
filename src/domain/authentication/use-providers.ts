import { getProviders } from 'next-auth/react'
import * as React from 'react'

export default function useProviders(callbacks?: {
  onError: (error: unknown) => void
}) {
  const [providers, setProviders] = React.useState<
    Awaited<ReturnType<typeof getProviders>> | undefined
  >(undefined)

  React.useEffect(() => {
    async function initializeProviders() {
      const providers = await getProviders()
      setProviders(providers)
    }

    initializeProviders().catch(() => (callbacks?.onError))
  }, [callbacks?.onError])

  return React.useMemo(
    () => ({
      providers,
    }),
    [providers],
  )
}
