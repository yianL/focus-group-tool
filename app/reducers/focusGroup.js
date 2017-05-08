// @flow
import {
  SET_GROUP_SIZE,
  SET_AVAILABILITY,
  SET_CONSTRAINT,
  SET_CONSTRAINT_PRESET,
  CREATE_GROUP,
  CHECK_PERSON_IN,
  UNCHECK_PERSON_IN,
} from '../actions/focusGroup';
import { LOAD_STATE } from '../actions/ui';
import {
  DEMOGRAPHIC_METRICS,
} from '../utils/constants';

const InitialState = {
  groupSize: 15,
  availability: [],
  zipCodes: undefined,
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

    case SET_AVAILABILITY: {
      const { availability } = action.payload;

      return {
        ...state,
        availability,
      };
    }

    case CREATE_GROUP: {
      const { groupName, availability, constraintObject } = action.payload;

      return {
        ...state,
        constraints: {},
        zipCodes: undefined,
        [`__${groupName}`]: {
          name: groupName,
          availability,
          constraintObject,
          constraints: state.constraints,
          groupSize: state.groupSize,
          zipCodes: state.zipCodes,
          checkedIn: [],
        },
      };
    }

    case CHECK_PERSON_IN: {
      const { id } = action.payload;
      const groupName = `__${action.payload.groupName}`;
      const focusGroup = state[groupName];
      return {
        ...state,
        [groupName]: {
          ...focusGroup,
          checkedIn: focusGroup.checkedIn.concat(id),
        },
      };
    }

    case UNCHECK_PERSON_IN: {
      const { id } = action.payload;
      const groupName = `__${action.payload.groupName}`;
      const focusGroup = state[groupName];
      return {
        ...state,
        [groupName]: {
          ...focusGroup,
          checkedIn: focusGroup.checkedIn.filter(p => p !== id),
        },
      };
    }

    case SET_CONSTRAINT: {
      const { name, index, amount } = action.payload;
      const newConstraints = { ...state.constraints };

      if (!newConstraints[name]) {
        newConstraints[name] = new Array(DEMOGRAPHIC_METRICS[name].columns.length);
        newConstraints[name].fill('');
      }

      newConstraints[name][index] = amount;

      return {
        ...state,
        constraints: newConstraints,
      };
    }

    case SET_CONSTRAINT_PRESET: {
      const { preset } = action.payload;

      return {
        ...state,
        zipCodes: preset.zipCodes,
        constraints: { ...preset.constraints },
      };
    }

    case LOAD_STATE: {
      const { appState } = action.payload;
      return appState.focusGroup;
    }

    default:
      return state;
  }
}
