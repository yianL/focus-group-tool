// @flow
import { LOAD_DATASET } from '../actions/data';

const InitialState = {
  data: [],
};

export default function data(state = InitialState, action) {
  switch (action.type) {
    case LOAD_DATASET:

      return {
        ...state,
        data: action.payload,
      };

    default:
      return state;
  }
}
