// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { STATES } from '../utils/constants';
import * as CandidateActions from '../actions/candidates';
import * as UIActions from '../actions/ui';

const getFilteredCandidates = (state) => {
  const { data, filters } = state.candidates;
  return filters.reduce((prev, current) => {
    const { name, value } = current;
   
    if (Array.isArray(value)) {
      return prev.filter(person => value.includes(person[name]));
    } 

    const valueToCompare = value.toLowerCase();
    return prev.filter(person => person[name].toLowerCase().includes(valueToCompare));
  }, data);
};

const getFocusGroups = (state) =>
  Object.keys(state.focusGroup)
    .filter(key => key.startsWith('__'))
    .map(key => key.substr(2));

const getFocusGroup = (state) => {
  const { activeGroup } = state.ui;
  const chosen = `${STATES.CHOSEN}-${activeGroup}`;
  return activeGroup ? state.candidates.data.filter((c) => c.state === chosen) : [];
};

const getConstraints = (state) => {
  const { activeGroup } = state.ui;
  const chosen = `__${activeGroup}`;
  return activeGroup ? state.focusGroup[chosen].constraints : {};
};

const getMismatches = (state) => {
  const { activeGroup } = state.ui;
  const chosen = `__${activeGroup}`;
  return activeGroup ? state.focusGroup[chosen].mismatches : [];
};

const mapStateToProps = (state) => ({
  data: getFilteredCandidates(state),
  focusGroups: getFocusGroups(state),
  focusGroup: getFocusGroup(state),
  activeGroup: state.ui.activeGroup,
  constraints: getConstraints(state),
  mismatches: getMismatches(state),
  filters: state.candidates.filters,
  filterOptions: state.candidates.filterOptions,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(CandidateActions, dispatch),
  ...bindActionCreators(UIActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
