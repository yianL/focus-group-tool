// @flow
import {
  SET_ACTIVE_GROUP,
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

    default:
      return state;
  }
}
