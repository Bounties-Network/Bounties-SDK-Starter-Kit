import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './App.css';
import Logo from './logo';
import Login from '../LoginWalkthrough';
import { actions as handleActions } from '../modules/Handle';

import { actions as loginActions } from '../LoginWalkthrough/reducer';
import { Button, Loader, Text, TextInput } from '@bounties-network/components';
import { actions, selectors } from '@bounties-network/modules';


const LoginComponent = props => {
  const { loading, currentUser, showLogin } = props;

  return (
    <div>
      <p className="logo"><Logo /></p>
      <Text>
        Welcome to the authentication demo
      </Text>
      <Button
        type="primary"
        onClick={() => showLogin(true)}
        loading={loading}
      >
        Login
      </Button>
    </div>
  );
}

class ProtectedComponent extends React.Component {
  state = { onchain: null, offchain: null };
  onTextChange = (key, value) => { this.setState({ [key]: value }) }

  render() {
    const { currentUser, logout, saveOnChain } = this.props;
    const { onchain, offchain } = this.state;

    return (
      <div className="group">
        <p className="logo"><Logo /></p>
        <Text>
          Welcome, <code>{currentUser.public_address}</code>.
        </Text>

        <div className="form">
          <div className="text-input">
            <TextInput
              placeholder="@ethBounties"
              value={offchain}
              onChange={value => this.onTextChange('offchain', value)}
            />
          </div>
          <Button className="button" type="action" onClick={logout}>
            Save (off-chain)
          </Button>
        </div>

        <div className="form">
          <div className="text-input">
            <TextInput
              placeholder="@ethBounties"
              value={onchain}
              onChange={value => this.onTextChange('onchain', value)}
            />
          </div>
          <Button className="button" type="primary" onClick={() => saveOnChain(onchain)}>
            Save (on-chain)
          </Button>
        </div>

        <Button
          type="destructive"
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    );
  }
}


class AppComponent extends Component {
  render() {
    const {
      loginState,
      clientInitialized,
      currentUser,
      currentUserState
    } = this.props;

    let content = '';

    if (currentUser) {
      content = (
        <ProtectedComponent
          currentUser={currentUser}
          loadOnChain={this.props.loadOnChain}
          saveOnChain={this.props.saveOnChain}
          logout={this.props.logout}
        />
      )
    }

    if (!currentUser) {
      content = (
        <LoginComponent
          loading={loginState.loading}
          currentUser={currentUser}
          showLogin={this.props.showLogin}
        />
      );
    }

    const isPageLoading = currentUserState.loading || !currentUserState.loaded || !clientInitialized
    if (isPageLoading) {
      content = (
        <div className="center">
          <Loader color="white" size="medium" />
        </div>
      );
    }

    return (
      <React.Fragment>
        <div className="center">
          {content}
        </div>
        <Login/>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const loginState = selectors.authentication.loginStateSelector(state);
  const currentUser = selectors.authentication.getCurrentUserSelector(state);
  const currentUserState = selectors.authentication.getCurrentUserStateSelector(state);


  return {
    loginState,
    currentUser,
    currentUserState,
    clientInitialized: selectors.client.initializedSelector(state)
  };
};

const App = compose(
  connect(
    mapStateToProps,
    {
      showLogin: loginActions.showLogin,
      login: actions.authentication.login,
      logout: actions.authentication.logout,
      loadOnChain: handleActions.loadOnChainHandle,
      saveOnChain: handleActions.saveOnChainHandle
    }
  )
)(AppComponent);

export default App;
