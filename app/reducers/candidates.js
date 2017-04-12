// @flow
import {
  LOAD_DATASET,
  ADD_TO_GROUP,
  REMOVE_FROM_GROUP,
  MARK_AS_UNAVAILABLE,
  MARK_AS_AVAILABLE,
  ADD_FILTER,
  REMOVE_FILTER,
} from '../actions/candidates';
import { COLUMNS, STATES } from '../utils/constants';

const InitialState = {
  data: [],
  filters: [],
  filterOptions: {},
};

export default function candidates(state = InitialState, action) {
  switch (action.type) {
    case LOAD_DATASET: {
      const filterOptions = {};
      const data = action.payload.data.slice(1).map((datum, index) => {
        const candidate = {
          id: index,
          state: STATES.DEFAULT,
        };

        datum.forEach((d, idx) => {
          if (idx === 0) { return; }
          const column = COLUMNS[idx + 1];
          candidate[column.name] = d;

          if (column.filter === true) {
            const options = filterOptions[column.name] || [];
            if (!options.includes(d)) {
              options.push(d);
              filterOptions[column.name] = options.sort();
            }
          }
        });

        return candidate;
      });

      // push all the boolean filter options
      COLUMNS.filter(col => col.filter === 'BOOLEAN')
        .forEach(col => {
          filterOptions[col.name] = ['yes', 'no'];
        });

      return {
        ...state,
        data,
        filterOptions,
      };
    }

    case ADD_TO_GROUP: {
      const data = [...state.data];
      const { id, session } = action.payload;
      
      data[id] = {
        ...state.data[id],
        state: `${STATES.CHOSEN}-${session}`,
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

    case ADD_FILTER: {
      const { name, value } = action.payload;
      const { filters } = state;

      return {
        ...state,
        filters: [...filters.filter(f => f.name !== name), { name, value }],
      };
    }

    case REMOVE_FILTER: {
      const { name } = action.payload;
            
      return {
        ...state,
        filters: state.filters.filter(f => f.name !== name),
      };
    }

    default:
      return state;
  }
}
