import { isArray, isString } from 'lodash'

export default (roles, org) => {
  // test input
  if (!roles || !isArray(roles)) return false
  if (!org || !isString(org)) return false
  // check if user is lrWriter for org
  const lrWriterRole = `${org} lr`
  return roles.includes(lrWriterRole)
}
