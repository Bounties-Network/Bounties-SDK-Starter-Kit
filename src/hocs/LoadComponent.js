import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { curry } from 'lodash';

function LoadComponent(propName, WrappedComponent) {
  return class Load extends Component {
    componentWillMount() { const fn = this.props[propName]; fn(); }
    render() { return <WrappedComponent {...this.props} /> }
  };
}

export default curry(LoadComponent);