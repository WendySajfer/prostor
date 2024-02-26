import {type NextApiRequest, type NextApiResponse} from 'next'
import NextAuth from 'next-auth'

import { requestWrapper } from "~/server/auth";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    const options = requestWrapper(req, res, req.query)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await NextAuth(req, res, options)
  }
  
