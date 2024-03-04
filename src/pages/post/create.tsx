import * as React from 'react'

import { Page } from '~/components/layout/page'
import { Section } from '~/components/layout/section'
import { ButtonSubmit, InputBody, InputTitle } from '~/domain/post/post-input'
import StandardLayout from '~/layouts/standard-layout'
import { cn } from '~/lib/utils'
import { api } from '~/utils/api'
export { getServerSideAuthRedirect as getServerSideProps } from '~/domain/user/server-side-auth-check'

export default function PageCreatePost() {
  return (
    <Page>
      <SectionCreatePost />
    </Page>
  )
}

PageCreatePost.getLayout = function (page: React.ReactNode) {
  return <StandardLayout>{page}</StandardLayout>
}

const SectionCreatePost: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <Section {...props} className={cn(className)}>
      <BlockCreatePost />
    </Section>
  )
}

const BlockCreatePost: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const { mutate: createPost } = api.posts.create.useMutation()

  const [title, setTitle] = React.useState('')
  const [body, setBody] = React.useState('')

  const publishPost = React.useCallback(() => {
    try {
      const inputData = { title: title, body: body }
      createPost(inputData, {
        onError(error) {
          console.log(error)
        },
        onSuccess(post) {
          const postId = post.id
          console.log('Ok, post is ' + postId)
        },
      })
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }, [body, title, createPost])

  return (
    <div
      {...props}
      className={cn(`flex w-full flex-col items-center`, className)}
    >
      <div
        className={cn(
          `text-3xl font-bold`,
          `pb-3`,
          `bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent`,
        )}
      >
        Новая публикация
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()

          publishPost()
        }}
        className={cn(
          `w-full max-w-[500px]`,
          `grid gap-2`,
          `form-border-gradient rounded-xl bg-white`,
          `px-8 py-10`,
        )}
      >
        <InputTitle setTitle={setTitle} />
        <InputBody setBody={setBody} />
        <ButtonSubmit />
      </form>
    </div>
  )
}
