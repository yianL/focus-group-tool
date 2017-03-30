// @flow
import { 
  LOAD_DATASET, 
  ADD_TO_GROUP,
  REMOVE_FROM_GROUP,
  MARK_AS_UNAVAILABLE,
  MARK_AS_AVAILABLE,
} from '../actions/candidates';
import { COLUMNS, STATES } from '../utils/constants';

const InitialState = {
  data: [],
};

export default function candidates(state = InitialState, action) {
  switch (action.type) {
    case LOAD_DATASET: {
      const data = action.payload.data.slice(1).map((datum, index) => {
        const candidate = {
          id: index,
          state: STATES.DEFAULT,
        };

        datum.forEach((d, idx) => {
          if (idx === 0) { return; }
          const columnName = COLUMNS[idx + 1].name;
          candidate[columnName] = d;
        });

        return candidate;
      });

      return {
        ...state,
        data,
      };
    }

    case ADD_TO_GROUP: {
      const data = [...state.data];
      const { id } = action.payload;
      
      data[id] = {
        ...state.data[id],
        state: STATES.CHOSEN,
      };
      
      return {
        ...state,
        data,
      };
    }
    
    case MARK_AS_AVAILABLE:
    case REMOVE_FROM_GROUP: {
      const data = [...state.data];
      const { id } = action.payload;
      
      data[id] = {
        ...state.data[id],
        state: STATES.DEFAULT,
      };
      
      return {
        ...state,
        data,
      };
    }
    
    case MARK_AS_UNAVAILABLE: {
      const data = [...state.data];
      const { id } = action.payload;
      
      data[id] = {
        ...state.data[id],
        state: STATES.UNAVAILABLE,
      };
      
      return {
        ...state,
        data,
      };
    }

    default:
      return state;
  }
}
