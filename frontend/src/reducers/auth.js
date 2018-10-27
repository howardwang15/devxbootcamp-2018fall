import * as ACTIONS from '../actions/types';
import {getCookies} from '../utils/cookie';

export const DEFAULT_AUTH_STATE = {
  loggedIn: false,
  userId: null,
};

const initState = () => {
  const cookies = getCookies();
  const userId = cookies['auth-login-as'];
  const tokenExists = !!cookies['auth-token'];
  if (tokenExists && userId) {
    return {...DEFAULT_AUTH_STATE, loggedIn: tokenExists, userId};
  }
  return DEFAULT_AUTH_STATE;
};

const authReducer = (state = initState(), {type, payload}) => {
  switch (type) {
    case ACTIONS.LOGIN_SUCCESS:
      return {...state, loggedIn: true, userId: payload.userId};
    case ACTIONS.LOGOUT:
      return {...state, ...DEFAULT_AUTH_STATE};
    default:
      return state;
  }
};

export default authReducer;
