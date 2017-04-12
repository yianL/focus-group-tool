// @flow
export const SET_ACTIVE_GROUP = 'SET_ACTIVE_GROUP';

export const setActiveGroup = (groupId) => ({
  type: SET_ACTIVE_GROUP,
  payload: { groupId },
});

