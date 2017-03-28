// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as DataActions from '../actions/data';

function mapStateToProps(state) {
  return {
    data: state.data.data
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(DataActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

