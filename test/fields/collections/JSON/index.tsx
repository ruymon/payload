import type { CollectionConfig } from 'payload'

import { jsonFieldsSlug } from '../../slugs.js'

const JSON: CollectionConfig = {
  slug: jsonFieldsSlug,
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'json',
      type: 'json',
      admin: {
        maxHeight: 542,
      },
      jsonSchema: {
        fileMatch: ['a://b/foo.json'],
        schema: {
          type: 'object',
          properties: {
            foo: {
              enum: ['bar', 'foobar'],
            },
            number: {
              enum: [10, 5],
            },
          },
        },
        uri: 'a://b/foo.json',
      },
    },
    {
      name: 'group',
      type: 'group',
      fields: [
        {
          name: 'jsonWithinGroup',
          type: 'json',
        },
      ],
    },
  ],
  versions: {
    maxPerDoc: 1,
  },
}

export default JSON
