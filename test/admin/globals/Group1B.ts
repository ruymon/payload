import type { GlobalConfig } from '../../../packages/payload/src/globals/config/types.js'

import { group2GlobalSlug } from '../slugs.js'

export const GlobalGroup1B: GlobalConfig = {
  slug: group2GlobalSlug,
  admin: {
    group: 'Group',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
  ],
}
