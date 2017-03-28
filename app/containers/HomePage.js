// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as CandidateActions from '../actions/candidates';

function mapStateToProps(state) {
  return {
    data: state.candidates.data
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CandidateActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

