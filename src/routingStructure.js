/*
 * with this object any path can be switched to the right group
 */
'use strict'

export default function () {
  let s = {}

  s.Fauna = {}
  s.Fauna.s1 = 'gruppe'
  s.Fauna.s2 = 'klasse'
  s.Fauna.s3 = 'ordnung'
  s.Fauna.s4 = 'familie'
  s.Fauna.s5 = 'objekt'
  s.Flora = {}
  s.Flora.s1 = 'gruppe'
  s.Flora.s2 = 'familie'
  s.Flora.s3 = 'objekt'
  s.Moose = {}
  s.Moose.s1 = 'gruppe'
  s.Moose.s2 = 'klasse'
  s.Moose.s3 = 'familie'
  s.Moose.s4 = 'gattung'
  s.Moose.s5 = 'objekt'
  s.Pilze = {}
  s.Pilze.s1 = 'gruppe'
  s.Pilze.s2 = 'gattung'
  s.Pilze.s3 = 'objekt'

  return s
}