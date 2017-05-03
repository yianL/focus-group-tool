// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { STATES, COLUMNSBYID } from '../utils/constants';
import * as CandidateActions from '../actions/candidates';
import * as UIActions from '../actions/ui';

const getFilteredCandidates = (state) => {
  const { data, filters } = state.candidates;
  return filters.reduce((prev, current) => {
    const { name, value } = current;

    if (Array.isArray(value)) {
      return COLUMNSBYID[name].multipleChoice
        ? prev.filter(person => value.some(v => person[name].includes(v)))
        : prev.filter(person => value.includes(person[name]));
    }

    return current.caseSensitive
      ? prev.filter(person => person[name].includes(value))
      : prev.filter(person => person[name].toLowerCase().includes(value.toLowerCase()));
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

const getFocusGroupMeta = (state) => {
  const { activeGroup } = state.ui;
  const chosen = `__${activeGroup}`;
  return activeGroup ? state.focusGroup[chosen] : {};
};

const mapStateToProps = (state) => ({
  data: getFilteredCandidates(state),
  focusGroups: getFocusGroups(state),
  focusGroup: getFocusGroup(state),
  focusGroupMeta: getFocusGroupMeta(state),
  activeGroup: state.ui.activeGroup,
  filters: state.candidates.filters,
  filterOptions: state.candidates.filterOptions,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(CandidateActions, dispatch),
  ...bindActionCreators(UIActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
