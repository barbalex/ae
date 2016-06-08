import { isArray } from 'lodash'

export default (roles) => {
  // test input
  if (!roles || !isArray(roles)) return false
  // check if user is lrWriter for any org
  const lrWriterRoles = roles.map((role) => role.endsWith(' lr'))
  return lrWriterRoles.length > 0
}
