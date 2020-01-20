// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ManageAttendees from '../components/ManageAttendees';
import * as FocusGroupActions from '../actions/focusGroup';


const mapStateToProps = (state) => ({
  activeGroup: state.ui.activeGroup,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(FocusGroupActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ManageAttendees);
