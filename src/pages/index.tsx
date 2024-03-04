import React from 'react'

import { Page } from '~/components/layout/page'
import { Section } from '~/components/layout/section'
import { PostCard, PostCardTest } from '~/domain/post/post-card'
import StandardLayout from '~/layouts/standard-layout'
import { cn } from '~/lib/utils'
import { api } from '~/utils/api'
export default function Home() {
  return (
    <Page>
      <SectionFeed />
    </Page>
  )
}

const SectionFeed: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <Section {...props} className={cn(className)}>
      <BlockFeed />
    </Section>
  )
}
const BlockFeed: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const { data: feed, isLoading } = api.posts.getFeed.useQuery()

  if (isLoading || !feed) return <div>Loading...</div>
  return (
    <div
      {...props}
      className={cn(`flex w-full flex-col items-center`, `gap-3`, className)}
    >
      {feed.map((post) => (
        <PostCard key={`post` + post.id} post={post} />
      ))}
      <PostCardTest />
      <PostCardTest />
    </div>
  )
}

Home.getLayout = function (page: React.ReactNode) {
  return <StandardLayout>{page}</StandardLayout>
}
