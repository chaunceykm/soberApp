import { fetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

export const login = ({ credential, password }) => async (dispatch) => {
  const res = await fetch("/api/session", {
    method: "POST",
    body: JSON.stringify({ credential, password }),
  });
  dispatch(setUser(res.data.user));
  return res;
};

export const restoreUser = () => async (dispatch) => {
  const res = await fetch("/api/session");
  dispatch(setUser(res.data.user));
  return res;
};

export const signup = (user) => async (dispatch) => {
  const { username, email, password, lastUsed } = user;
  const response = await fetch("/aip/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
      lastUsed,
    }),
  });
  dispatch(setUser(response.data.user));
  return response;
};

export const logout = () => async (dispatch) => {
    const response = await fetch('/api/session', {
        method: 'DELETE',
    })
    dispatch(removeUser())
    return response;
}

const initialState = {user: null}

function reducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case SET_USER:
            newState = Object.assign({}, state, { user: action.payload })
            return newState;
        case REMOVE_USER:
            newState = Object.assign({}, state, { user: null })
            return newState;
        default:
            return state;
    }
}

export default reducer;