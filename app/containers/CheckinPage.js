// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Checkin from '../components/Checkin';
import { STATES } from '../utils/constants';
import * as FocusGroupActions from '../actions/focusGroup';

const getFocusGroup = (state) => {
  const { activeGroup } = state.ui;
  const chosen = `${STATES.CHOSEN}-${activeGroup}`;
  return state.candidates.data.filter((c) => c.state === chosen);
};

const getCheckinStatus = (state) => {
  const { activeGroup } = state.ui;
  const groupName = `__${activeGroup}`;
  return state.focusGroup[groupName].checkedIn;
};

const getFocusGroupMeta = (state) => {
  const { activeGroup } = state.ui;
  const chosen = `__${activeGroup}`;
  return activeGroup ? state.focusGroup[chosen] : {};
};

const mapStateToProps = (state) => ({
  focusGroup: getFocusGroup(state),
  focusGroupMeta: getFocusGroupMeta(state),
  activeGroup: state.ui.activeGroup,
  checkInStatus: getCheckinStatus(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators(FocusGroupActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Checkin);
