// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CreateGroup from '../components/CreateGroup';
import * as FocusGroupActions from '../actions/focusGroup';

const mapStateToProps = (state) => ({
  data: state.candidates.data,
  groupSize: state.focusGroup.groupSize,
  constraints: state.focusGroup.constraints,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(FocusGroupActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup);
