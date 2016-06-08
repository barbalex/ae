import keyBy from 'lodash/keyBy'
import {
  ORGANIZATIONS_GET,
  ORGANIZATIONS_GET_SUCCESS,
  ORGANIZATIONS_GET_ERROR,
  ORGANIZATION_TOGGLE_ACTIVE,
  ORGANIZATION_GET_TCS_OF_ACTIVE,
  ORGANIZATION_GET_TCS_OF_ACTIVE_SUCCESS,
  ORGANIZATION_GET_TCS_OF_ACTIVE_ERROR,
  ORGANIZATION_GET_PCS_OF_ACTIVE,
  ORGANIZATION_GET_PCS_OF_ACTIVE_SUCCESS,
  ORGANIZATION_GET_PCS_OF_ACTIVE_ERROR,
  ORGANIZATION_GET_RCS_OF_ACTIVE,
  ORGANIZATION_GET_RCS_OF_ACTIVE_SUCCESS,
  ORGANIZATION_GET_RCS_OF_ACTIVE_ERROR
} from '../actions/organizations'

const standardState = {
  getting: false,
  organizations: {},
  active: null,
  error: null,
  gettingTcsOfActive: false,
  tcsOfActive: {},
  tcsOfActiveError: null,
  gettingPcsOfActive: false,
  pcsOfActive: {},
  pcsOfActiveError: null,
  gettingRcsOfActive: false,
  rcsOfActive: {},
  rcsOfActiveError: null,
}

const organization = (state = standardState, action) => {
  switch (action.type) {
    case ORGANIZATIONS_GET:
      // set everything back
      return {
        ...state,
        getting: true,
        organizations: {},
        active: null,
        error: null,
        gettingTcsOfActive: false,
        tcsOfActive: {},
        tcsOfActiveError: null,
        gettingPcsOfActive: false,
        pcsOfActive: {},
        pcsOfActiveError: null,
        gettingRcsOfActive: false,
        rcsOfActive: {},
        rcsOfActiveError: null,
      }
    case ORGANIZATIONS_GET_SUCCESS:
      return {
        ...state,
        getting: false,
        organizations: action.organizations,
      }
    case ORGANIZATIONS_GET_ERROR:
      return {
        ...state,
        getting: false,
        error: action.error
      }
    case ORGANIZATION_TOGGLE_ACTIVE:
      return {
        ...state,
        active: action.active,
        tcsOfActive: {},
        pcsOfActive: {},
        rcsOfActive: {},
      }
    case ORGANIZATION_GET_TCS_OF_ACTIVE:
      return {
        ...state,
        gettingTcsOfActive: true,
        tcsOfActive: {},
      }
    case ORGANIZATION_GET_TCS_OF_ACTIVE_SUCCESS:
      return {
        ...state,
        gettingTcsOfActive: false,
        tcsOfActive: keyBy(action.tcsOfActive, 'Name'),
      }
    case ORGANIZATION_GET_TCS_OF_ACTIVE_ERROR:
      return {
        ...state,
        gettingPcsOfActive: false,
        tcsOfActiveError: action.error,
      }
    case ORGANIZATION_GET_PCS_OF_ACTIVE:
      return {
        ...state,
        gettingPcsOfActive: true,
        pcsOfActive: {},
      }
    case ORGANIZATION_GET_PCS_OF_ACTIVE_SUCCESS:
      return {
        ...state,
        gettingPcsOfActive: false,
        pcsOfActive: keyBy(action.pcsOfActive, 'Name'),
      }
    case ORGANIZATION_GET_PCS_OF_ACTIVE_ERROR:
      return {
        ...state,
        gettingPcsOfActive: false,
        pcsOfActiveError: action.error,
      }
    case ORGANIZATION_GET_RCS_OF_ACTIVE:
      return {
        ...state,
        gettingRcsOfActive: true,
        rcsOfActive: {},
      }
    case ORGANIZATION_GET_RCS_OF_ACTIVE_SUCCESS:
      return {
        ...state,
        gettingRcsOfActive: false,
        rcsOfActive: keyBy(action.rcsOfActive, 'Name'),
      }
    case ORGANIZATION_GET_RCS_OF_ACTIVE_ERROR:
      return {
        ...state,
        gettingRcsOfActive: false,
        rcsOfActiveError: action.error,
      }
    default:
      return state
  }
}

export default organization
