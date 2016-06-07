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
  fetching: false,
  organizations: {},
  active: null,
  error: null,
  fetchingTcsOfActive: false,
  tcsOfActive: {},
  tcsOfActiveError: null,
  fetchingPcsOfActive: false,
  pcsOfActive: {},
  pcsOfActiveError: null,
  fetchingRcsOfActive: false,
  rcsOfActive: {},
  rcsOfActiveError: null,
}

const organization = (state = standardState, action) => {
  switch (action.type) {
    case ORGANIZATIONS_GET:
      // set everything back
      return {
        ...state,
        fetching: true,
        organizations: {},
        active: null,
        error: null,
        fetchingTcsOfActive: false,
        tcsOfActive: {},
        tcsOfActiveError: null,
        fetchingPcsOfActive: false,
        pcsOfActive: {},
        pcsOfActiveError: null,
        fetchingRcsOfActive: false,
        rcsOfActive: {},
        rcsOfActiveError: null,
      }
    case ORGANIZATIONS_GET_SUCCESS:
      return {
        ...state,
        fetching: false,
        organizations: action.organizations,
      }
    case ORGANIZATIONS_GET_ERROR:
      return {
        ...state,
        fetching: false,
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
        fetchingTcsOfActive: true,
        tcsOfActive: {},
      }
    case ORGANIZATION_GET_TCS_OF_ACTIVE_SUCCESS:
      return {
        ...state,
        fetchingTcsOfActive: false,
        tcsOfActive: keyBy(action.tcsOfActive, 'Name'),
      }
    case ORGANIZATION_GET_TCS_OF_ACTIVE_ERROR:
      return {
        ...state,
        fetchingPcsOfActive: false,
        tcsOfActiveError: action.error,
      }
    case ORGANIZATION_GET_PCS_OF_ACTIVE:
      return {
        ...state,
        fetchingPcsOfActive: true,
        pcsOfActive: {},
      }
    case ORGANIZATION_GET_PCS_OF_ACTIVE_SUCCESS:
      return {
        ...state,
        fetchingPcsOfActive: false,
        pcsOfActive: keyBy(action.pcsOfActive, 'Name'),
      }
    case ORGANIZATION_GET_PCS_OF_ACTIVE_ERROR:
      return {
        ...state,
        fetchingPcsOfActive: false,
        pcsOfActiveError: action.error,
      }
    case ORGANIZATION_GET_RCS_OF_ACTIVE:
      return {
        ...state,
        fetchingRcsOfActive: true,
        rcsOfActive: {},
      }
    case ORGANIZATION_GET_RCS_OF_ACTIVE_SUCCESS:
      return {
        ...state,
        fetchingRcsOfActive: false,
        rcsOfActive: keyBy(action.rcsOfActive, 'Name'),
      }
    case ORGANIZATION_GET_RCS_OF_ACTIVE_ERROR:
      return {
        ...state,
        fetchingRcsOfActive: false,
        rcsOfActiveError: action.error,
      }
    default:
      return state
  }
}

export default organization
