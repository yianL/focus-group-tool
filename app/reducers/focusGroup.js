// @flow
import {
  SET_GROUP_SIZE,
  SET_SESSION,
  SET_CONSTRAINT,
  SET_MISMATCHES,
  CREATE_GROUP,
} from '../actions/focusGroup';
import {
  DEMOGRAPHIC_METRICS,
} from '../utils/constants';

const InitialState = {
  groupSize: 15,
  session: null,
  constraints: {},
  mismatches: [],
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

    case SET_SESSION: {
      const { session } = action.payload;

      return {
        ...state,
        session,
      };
    }

    case CREATE_GROUP: {
      const { session } = action.payload;

      return {
        ...state,
        [`__${session}`]: {
          groupSize: state.groupSize,
          session: state.session,
          constraints: state.constraints,
          mismatches: state.mismatches,
        },
      };
    }

    case SET_CONSTRAINT: {
      const { name, index, amount } = action.payload;
      const newConstraints = { ...state.constraints };

      if (!newConstraints[name]) {
        newConstraints[name] = new Array(DEMOGRAPHIC_METRICS[name].columns.length);
        newConstraints[name].fill(undefined);
      }

      newConstraints[name][index] = amount;

      return {
        ...state,
        constraints: newConstraints,
      };
    }

    case SET_MISMATCHES: {
      const { mismatches } = action.payload;

      return {
        ...state,
        mismatches,
      };
    }

    default:
      return state;
  }
}
