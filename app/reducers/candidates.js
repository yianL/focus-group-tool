// @flow
import { LOAD_DATASET } from '../actions/candidates';
import { COLUMNS, STATES } from '../utils/constants';

const InitialState = {
  data: [],
};

export default function candidates(state = InitialState, action) {
  switch (action.type) {
    case LOAD_DATASET:
      const data = action.payload.slice(1).map((datum, index) => {
        const candidate = {
          id: index,
          state: STATES.DEFAULT,
        };

        datum.forEach((d, idx) => {
          if (idx === 0) { return; }
          const columnName = COLUMNS[idx].name;
          candidate[columnName] = d;
        });

        return candidate;
      });

      return {
        ...state,
        data,
      };

    default:
      return state;
  }
}
