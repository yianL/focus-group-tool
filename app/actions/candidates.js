// @flow
export const LOAD_DATASET = 'LOAD_DATASET';

export const loadDataSet = (data) => ({
  type: LOAD_DATASET,
  payload: data,
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
