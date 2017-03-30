// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CreateGroup from '../components/CreateGroup';
import * as CandidateActions from '../actions/candidates';

const mapStateToProps = (state) => ({
  data: state.candidates.data,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(CandidateActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup);
