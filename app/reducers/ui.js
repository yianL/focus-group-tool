// @flow
import {
  SET_ACTIVE_GROUP,
  LOAD_STATE,
} from '../actions/ui';
import {
  CREATE_GROUP,
} from '../actions/focusGroup';

const InitialState = {
  activeGroup: undefined,
};

export default function candidates(state = InitialState, action) {
  switch (action.type) {
    case SET_ACTIVE_GROUP: {
      const { groupId } = action.payload;

      return {
        ...state,
        activeGroup: groupId,
      };
    }

    case CREATE_GROUP: {
      // set newly created group to active
      const { session } = action.payload;

      return {
        ...state,
        activeGroup: session,
      };
    }

    case LOAD_STATE: {
      const { appState } = action.payload;
      return appState.ui;
    }

    default:
      return state;
  }
}
