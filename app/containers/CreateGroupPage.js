// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CreateGroup from '../components/CreateGroup';
import * as FocusGroupActions from '../actions/focusGroup';
import * as CandidateActions from '../actions/candidates';
import { STATES } from '../utils/constants';

const availableCandidates = (state) =>
  state.candidates.data.filter(candidate => candidate.state === STATES.DEFAULT);

const mapStateToProps = (state) => ({
  data: availableCandidates(state),
  filterOptions: state.candidates.filterOptions,
  session: state.focusGroup.session,
  groupSize: state.focusGroup.groupSize,
  constraints: state.focusGroup.constraints,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(FocusGroupActions, dispatch),
  addToGroup: (id, session) => dispatch(CandidateActions.addToGroup(id, session)),
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup);
