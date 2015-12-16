'use strict'

import { isArray, isString } from 'lodash'

export default (roles, org) => {
  // test input
  if (!roles || !isArray(roles)) return false
  if (!org || !isString(org)) return false
  // check if user is esWriter for org
  const esWriterRole = `${org} es`
  return roles.includes(esWriterRole)
}
