import { isArray } from 'lodash'

export default (roles) => {
  // test input
  if (!roles || !isArray(roles)) return false
  // check if user is esWriter for any org
  const esWriterRoles = roles.map((role) => role.endsWith(' es'))
  return esWriterRoles.length > 0
}
