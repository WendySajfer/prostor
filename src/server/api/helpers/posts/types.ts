import { type Post } from '@prisma/client'

export type PostShortInfo = Pick<
  Post,
  'id' | 'title' | 'body' | 'createdAt' | 'likes'
> & {
  createdBy: {
    id: string
    name: string | null
    image: string | null
  }
  likers?: {
    id: string
  }[]
}
