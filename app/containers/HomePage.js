// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { STATES } from '../utils/constants';
import * as CandidateActions from '../actions/candidates';

const getFocusGroup = (state) =>
  state.candidates.data.filter((c) => c.state === STATES.CHOSEN);

const mapStateToProps = (state) => ({
  data: state.candidates.data,
  focusGroup: getFocusGroup(state),
  constraints: state.focusGroup.constraints,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(CandidateActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
