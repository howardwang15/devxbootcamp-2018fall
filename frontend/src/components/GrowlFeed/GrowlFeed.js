import React from 'react';
import {connect} from 'react-redux';

import {getGrowls} from 'actions';
import Growl from '../Growl';

import './GrowlFeed.scss';

export class GrowlFeed extends React.Component {
  static defaultProps = {
    growls: [],
    growlFilter: (growl) => true,
  };

  constructor(props) {
    super(props);
    // TODO: Implement
  }

  render() {
    // TODO: Implement using filter, map, and the Growl component imported above
    return null;
  }
}

export const mapStateToProps = (state) => ({
  // TODO: Implement
});

export default connect(
  mapStateToProps,
  {getGrowls},
)(GrowlFeed);
