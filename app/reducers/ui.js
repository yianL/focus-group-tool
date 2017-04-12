// @flow
import {
  SET_ACTIVE_GROUP,
} from '../actions/ui';

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

    default:
      return state;
  }
}
