import type { NextFunction, Response } from 'express'

import { URL } from 'url'

import type { SanitizedCollectionConfig } from '../collections/config/types'
import type { PayloadRequest } from '../types'
import type { Where } from '../types'

import { Forbidden } from '../errors'
import executeAccess from './executeAccess'

const getExecuteStaticAccess =
  (config: SanitizedCollectionConfig) =>
  async (req: PayloadRequest, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }

    try {
      const { pathname } = new URL(req.url)
      if (pathname) {
        const accessResult = await executeAccess({ req }, config.access.read)

        if (typeof accessResult === 'object') {
          const filename = decodeURI(pathname).replace(/^\/|\/$/g, '')

          const queryToBuild: Where = {
            and: [
              {
                or: [
                  {
                    filename: {
                      equals: filename,
                    },
                  },
                ],
              },
              accessResult,
            ],
          }

          if (config.upload.imageSizes) {
            config.upload.imageSizes.forEach(({ name }) => {
              queryToBuild.and[0].or.push({
                [`sizes.${name}.filename`]: {
                  equals: filename,
                },
              })
            })
          }

          const doc = await req.payload.db.findOne({
            collection: config.slug,
            req,
            where: queryToBuild,
          })

          if (!doc) {
            throw new Forbidden(req.t)
          }
        }
      }

      return next()
    } catch (error) {
      return next(error)
    }
  }

export default getExecuteStaticAccess
