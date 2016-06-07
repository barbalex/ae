'use strict'

import {
  GROUPS_GET,
  GROUPS_GET_SUCCESS,
  GROUPS_GET_ERROR,
  GROUP_TOGGLE_ACTIVATED
} from '../actions/groups'

const standardState = {
  fetching: false,
  groups: {},
  activated: null,
  error: null
}