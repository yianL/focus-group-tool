// @flow
export const SET_GROUP_SIZE = 'SET_GROUP_SIZE';
export const SET_CONSTRAINT = 'SET_CONSTRAINT';
export const SET_MISMATCHES = 'SET_MISMATCHES';

export const setGroupSize = (size) => ({
  type: SET_GROUP_SIZE,
  payload: { size },
});

export const setConstraint = (name, index, amount) => ({
  type: SET_CONSTRAINT,
  payload: { name, index, amount },
});

export const setMismatches = (mismatches) => ({
  type: SET_MISMATCHES,
  payload: { mismatches },
});
