import Link from 'next/link'
import React from 'react'

import { HeartCheck } from '~/components/heart-svg'
import { AuthorAvatar } from '~/components/layout/header-menu'
import { formatDate } from '~/lib/date'
import { cn } from '~/lib/utils'
import { type PostShortInfo } from '~/server/api/helpers/posts/types'
import { api } from '~/utils/api'

export function PostCard({ post }: { post: PostShortInfo }) {
  const utils = api.useUtils()

  const invalidateFeed = () => {
    utils.posts.getFeed.invalidate().catch(console.warn)
  }
  return (
    <section
      className={cn(
        `w-full max-w-[500px]`,
        `grid gap-2`,
        `form-border-gradient rounded-xl bg-white`,
        `px-3 py-3`,
      )}
    >
      <div
        className={cn(
          `w-full`,
          `grid gap-2`,
          `form-border-gradient !border-0 !border-b-[1px]`,
          `pb-2`,
        )}
      >
        <PostTitle title={post.title} />
        <PostBody body={post.body} />
      </div>
      <div
        className={cn(`w-full`, `py-2`, `flex items-center justify-between`)}
      >
        <Author image={post.createdBy.image} name={post.createdBy.name} />
        <DateCreated date={post.createdAt} />
      </div>
      <div className={cn(`flex w-full justify-center`, `gap-2`)}>
        <HeartCheck
          invalidateFeed={invalidateFeed}
          postId={post.id}
          checked={post.likers?.length == 1}
          size={`20px`}
        />
        {post.likes}
      </div>
    </section>
  )
}
export function PostCardTest() {
  return (
    <section
      className={cn(
        `w-full max-w-[500px]`,
        `grid gap-2`,
        `form-border-gradient rounded-xl bg-white`,
        `px-3 py-3`,
      )}
    >
      <div
        className={cn(
          `w-full`,
          `grid gap-2`,
          `form-border-gradient !border-0 !border-b-[1px]`,
          `pb-2`,
        )}
      >
        <PostTitle title={'Hey'} />
        <PostBody body={'Yes'} />
      </div>
      <div
        className={cn(`w-full`, `py-2`, `flex items-center justify-between`)}
      >
        <Author image={null} name={'Bro'} />
        <DateCreated date={new Date('02.03.2024')} />
      </div>
      <div className={cn(`flex w-full justify-center`, `gap-2`)}>
        <HeartCheck
          invalidateFeed={()=>{console.log(`test`)}}
          postId={'001'}
          checked={false}
          size={`20px`}
        />
        123
      </div>
    </section>
  )
}
export function PostTitle({ title }: { title: string }) {
  return (
    <Link
      href="/"
      className={cn(
        `w-full pl-3`,
        `font-medium`,
        `overflow-hidden overflow-ellipsis whitespace-nowrap`,
      )}
    >
      {title}
    </Link>
  )
}

export function PostBody({ body }: { body: string }) {
  return (
    <Link
      href="/"
      className={cn(
        `w-full pl-1`,
        `text-sm`,
        `line-clamp-[10] whitespace-pre-wrap break-words`,
      )}
    >
      {body}
    </Link>
  )
}

export function Author({
  name,
  image,
}: {
  image: string | null
  name: string | null
}) {
  return (
    <Link href="/">
      <div className={cn(`flex items-center gap-2`)}>
        <AuthorAvatar avatarSrc={image} />
        <div
          className={cn(
            `max-w-[260px]`,
            `text-sm leading-4`,
            `overflow-hidden overflow-ellipsis whitespace-nowrap`,
          )}
        >
          {name}
        </div>
      </div>
    </Link>
  )
}
export function DateCreated({ date }: { date: Date }) {
  return <p className={cn(`text-sm leading-4`)}>{formatDate(date)}</p>
}
