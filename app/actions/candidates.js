// @flow
export const LOAD_DATASET = 'LOAD_DATASET';
export const ADD_TO_GROUP = 'ADD_TO_GROUP';
export const REMOVE_FROM_GROUP = 'REMOVE_FROM_GROUP';
export const MARK_AS_UNAVAILABLE = 'MARK_AS_UNAVAILABLE';
export const MARK_AS_AVAILABLE = 'MARK_AS_AVAILABLE';
export const ADD_FILTER = 'ADD_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';

export const loadDataSet = (data) => ({
  type: LOAD_DATASET,
  payload: { data },
});

export const addToGroup = (id) => ({
  type: ADD_TO_GROUP,
  payload: { id },
});

export const markAsUnavailable = (id) => ({
  type: MARK_AS_UNAVAILABLE,
  payload: { id },
});

export const markAsAvailable = (id) => ({
  type: MARK_AS_AVAILABLE,
  payload: { id },
});

export const removeFromGroup = (id) => ({
  type: REMOVE_FROM_GROUP,
  payload: { id },
});

export const addFilter = (name, value) => ({
  type: ADD_FILTER,
  payload: { name, value },
});

export const removeFilter = (name) => ({
  type: REMOVE_FILTER,
  payload: { name },
});

// export function incrementIfOdd() {
//   return (dispatch: () => void, getState: () => counterStateType) => {
//     const { counter } = getState();

//     if (counter % 2 === 0) {
//       return;
//     }

//     dispatch(increment());
//   };
// }
