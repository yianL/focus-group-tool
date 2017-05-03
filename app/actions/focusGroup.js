// @flow
export const SET_GROUP_SIZE = 'SET_GROUP_SIZE';
export const SET_CONSTRAINT = 'SET_CONSTRAINT';
export const SET_AVAILABILITY = 'SET_AVAILABILITY';
export const CREATE_GROUP = 'CREATE_GROUP';
export const CHECK_PERSON_IN = 'CHECK_PERSON_IN';
export const UNCHECK_PERSON_IN = 'UNCHECK_PERSON_IN';

export const setGroupSize = (size) => ({
  type: SET_GROUP_SIZE,
  payload: { size },
});

export const setAvailability = (availability) => ({
  type: SET_AVAILABILITY,
  payload: { availability },
});

export const createGroup = (groupName, availability, constraintObject) => ({
  type: CREATE_GROUP,
  payload: { groupName, availability, constraintObject },
});

export const setConstraint = (name, index, amount) => ({
  type: SET_CONSTRAINT,
  payload: { name, index, amount },
});

export const checkPersonIn = (id, groupName) => ({
  type: CHECK_PERSON_IN,
  payload: { id, groupName },
});

export const uncheckPersonIn = (id, groupName) => ({
  type: UNCHECK_PERSON_IN,
  payload: { id, groupName },
});
