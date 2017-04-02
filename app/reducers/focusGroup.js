// @flow
import {
  SET_GROUP_SIZE,
  SET_CONSTRAINT,
} from '../actions/focusGroup';
import {
  DEMOGRAPHIC_METRICS,
} from '../utils/constants';

const InitialState = {
  groupSize: 15,
  constraints: {},
};

export default function candidates(state = InitialState, action) {
  switch (action.type) {
    case SET_GROUP_SIZE: {
      const { size } = action.payload;

      return {
        ...state,
        groupSize: size,
      };
    }

    case SET_CONSTRAINT: {
      const { name, index, amount } = action.payload;
      const newConstraints = { ...state.constraints };

      if (!newConstraints[name]) {
        newConstraints[name] = new Array(DEMOGRAPHIC_METRICS[name].columns.length);
        newConstraints[name].fill(0);
      }

      newConstraints[name][index] = amount;

      return {
        ...state,
        constraints: newConstraints,
      };
    }

    default:
      return state;
  }
}
