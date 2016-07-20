/*
 * reads parameter values from url
 * gets passed a parameter name and resturs it's value
 * usage: const guid = getParameterByName('guid')
 * origin: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 */

export default (name, search) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  const regex = new RegExp(`[\\?&]${name}=([^&#]*)`)
  const results = regex.exec(search)
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '))
}
