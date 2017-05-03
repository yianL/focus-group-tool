// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CreateGroup from '../components/CreateGroup';
import * as FocusGroupActions from '../actions/focusGroup';
import * as CandidateActions from '../actions/candidates';
import { STATES } from '../utils/constants';

const availableCandidates = (state) =>
  state.candidates.data.filter(candidate => candidate.state === STATES.DEFAULT);

const getAvailabilities = (state) => {
  const { filterOptions = {} } = state.candidates;
  const { availability = ['The only session'] } = filterOptions;
  return availability.filter(a => !a.includes(','));
};

const mapStateToProps = (state) => ({
  data: availableCandidates(state),
  availabilities: getAvailabilities(state),
  availability: state.focusGroup.availability,
  groupSize: state.focusGroup.groupSize,
  constraints: state.focusGroup.constraints,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(FocusGroupActions, dispatch),
  addToGroup: (id, session) => dispatch(CandidateActions.addToGroup(id, session)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup);
