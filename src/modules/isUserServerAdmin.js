import { isArray } from 'lodash'

export default (roles) => {
  // test input
  if (!roles || !isArray(roles)) return false
  // check if user is server admin
  return roles.includes('_admin')
}
