// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { STATES } from '../utils/constants';
import * as CandidateActions from '../actions/candidates';

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

const getFocusGroup = (state) =>
  state.candidates.data.filter((c) => c.state === STATES.CHOSEN);

const mapStateToProps = (state) => ({
  data: getFilteredCandidates(state),
  focusGroup: getFocusGroup(state),
  filters: state.candidates.filters,
  filterOptions: state.candidates.filterOptions,
  constraints: state.focusGroup.constraints,
  mismatches: state.focusGroup.mismatches,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(CandidateActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
