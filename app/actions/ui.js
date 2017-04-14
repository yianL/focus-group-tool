// @flow
export const SET_ACTIVE_GROUP = 'SET_ACTIVE_GROUP';
export const LOAD_STATE = 'LOAD_STATE';

export const setActiveGroup = (groupId) => ({
  type: SET_ACTIVE_GROUP,
  payload: { groupId },
});

export const loadState = (appState) => ({
  type: LOAD_STATE,
  payload: { appState },
});

