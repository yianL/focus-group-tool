// @flow
export const SET_GROUP_SIZE = 'SET_GROUP_SIZE';
export const SET_CONSTRAINT = 'SET_CONSTRAINT';
export const SET_SESSION = 'SET_SESSION';
export const CREATE_GROUP = 'CREATE_GROUP';
export const CHECK_PERSON_IN = 'CHECK_PERSON_IN';
export const UNCHECK_PERSON_IN = 'UNCHECK_PERSON_IN';

export const setGroupSize = (size) => ({
  type: SET_GROUP_SIZE,
  payload: { size },
});

export const setSession = (session) => ({
  type: SET_SESSION,
  payload: { session },
});

export const createGroup = (session, constraintObject) => ({
  type: CREATE_GROUP,
  payload: { session, constraintObject },
});

export const setConstraint = (name, index, amount) => ({
  type: SET_CONSTRAINT,
  payload: { name, index, amount },
});

export const checkPersonIn = (id, session) => ({
  type: CHECK_PERSON_IN,
  payload: { id, session },
});

export const uncheckPersonIn = (id, session) => ({
  type: UNCHECK_PERSON_IN,
  payload: { id, session },
});
