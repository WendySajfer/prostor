//import Head from 'next/head'
//import Link from 'next/link'
import React from 'react'

import StandardLayout from '~/layouts/standard-layout'

export default function Home() {
  //const hello = api.post.hello.useQuery({ text: 'from tRPC' })

  return (
    <>
      <main>
        <section>
          <div className=" h-full w-full bg-primary">
            yes
          </div>
        </section>
      </main>
    </>
  )
}

Home.getLayout = function (page: React.ReactNode) {
  return <StandardLayout>{page}</StandardLayout>
}

