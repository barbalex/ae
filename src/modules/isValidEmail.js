/*
 * tests, if a value is a correct email
 * from: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
 */
export default (value) =>
  new RegExp(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).test(value)
