import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './App.css';
import Logo from './logo';
import LoginWalkthrough from '../LoginWalkthrough';
import { actions as handleActions } from '../modules/Handle';
import { handleOnChainSelector } from '../modules/Handle/selectors';

import TransactionWalkthrough from '../TransactionWalkthrough/hocs/TransactionWalkthrough';
import FunctionalLoginLock from '../LoginWalkthrough/hocs/FunctionalLoginLock';
import RequireLogin from '../LoginWalkthrough/hocs/RequireLoginComponent';
import { actions as loginActions } from '../LoginWalkthrough/reducer';
import { Button, Loader, Network, Text, ToastContainer, TextInput } from '@bounties-network/components';
import { actions, selectors } from '@bounties-network/modules';


const LoginComponent = props => {
  const { loading, currentUser, showLogin, initiateLoginProtection } = props;

  return (
    <div className="group">
      <h1 className="logo"><Logo /></h1>

      <Text>Welcome to the authentication demo</Text>
      <Button
        type="primary"
        onClick={() => initiateLoginProtection(() => showLogin(true))}
        loading={loading}
      >
        Login
      </Button>
    </div>
  );
}

const Login = compose()(LoginComponent)

class ProtectedComponent extends React.Component {
  state = { onchain: this.props.onChainHandleState.handle, offchain: null };
  onTextChange = (key, value) => { this.setState({ [key]: value }) }

  render() {
    const { currentUser, logoutUser, onChainHandleState, saveOnChain } = this.props;
    const { onchain, offchain } = this.state;

    return (
      <div className="group">
        <div className="logo"><Logo /></div>
        <Text>Welcome, <code>{currentUser.public_address}</code>.</Text>

        <div className="form">
          <div className="text-input">
            <TextInput
              placeholder="@ethBounties"
              value={offchain}
              onChange={value => this.onTextChange('offchain', value)}
            />
          </div>
          <Button className="button" type="action" onClick={logoutUser}>
            Save (off-chain)
          </Button>
        </div>

        <div className="form">
          <div className="text-input">
            <TextInput
              placeholder="@ethBounties"
              value={onchain}
              disabled={onChainHandleState.saving}
              onChange={value => this.onTextChange('onchain', value)}
            />
          </div>
          <Button
            className="button"
            type="primary"
            loading={onChainHandleState.saving}
            disabled={onChainHandleState.saving}
            onClick={() => saveOnChain(onchain)}>
            Save (on-chain)
          </Button>
        </div>

        <Button
          type="destructive"
          loading={this.props.logoutState.loading}
          onClick={logoutUser}
        >
          Logout
        </Button>
      </div>
    );
  }
}

const Protected = compose(RequireLogin)(ProtectedComponent)

class AppComponent extends Component {
  render() {
    const {
      loginState,
      clientInitialized,
      currentUser,
      currentUserState,
      hasWallet,
      initiateWalkthrough,
      onChainHandleState
    } = this.props;

    let content = '';

    if (currentUser) {
      content = (
        <Protected
          currentUser={currentUser}
          loadOnChain={this.props.loadOnChain}
          saveOnChain={handle => initiateWalkthrough(() => this.props.saveOnChain(handle))}
          logoutUser={this.props.logoutUser}
          logoutState={this.props.logoutState}
          onChainHandleState={onChainHandleState}
        />
      )
    }

    if (!currentUser) {
      content = (
        <Login
          loading={loginState.loading}
          currentUser={currentUser}
          showLogin={this.props.showLogin}
          initiateLoginProtection={this.props.initiateLoginProtection}
        />
      );
    }

    const isPageLoading = currentUserState.loading ||
                          !currentUserState.loaded ||
                          !clientInitialized ||
                          onChainHandleState.loading

    if (isPageLoading) {
      content = (
        <div className="center">
          <Loader color="white" size="medium" />
        </div>
      );
    }

    return (
      <React.Fragment>
        <ToastContainer
          newestOnTop
          autoClose={false}
          hideProgressBar
          draggable
        />
        <div className="center">
          {!isPageLoading && hasWallet && <Network network={this.props.network} className="network" theme="light" />}
          {content}
        </div>
        <LoginWalkthrough/>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    onChainHandleState: handleOnChainSelector(state),
    loginState: selectors.authentication.loginStateSelector(state),
    logoutState: selectors.authentication.logoutStateSelector(state),
    currentUser:selectors.authentication.getCurrentUserSelector(state),
    currentUserState: selectors.authentication.getCurrentUserStateSelector(state),
    hasWallet: selectors.client.hasWalletSelector(state),
    network: selectors.client.networkSelector(state),
    clientInitialized: selectors.client.initializedSelector(state)
  };
};

const App = compose(
  FunctionalLoginLock({
  // wrapperClassName: styles.body
  }),
  TransactionWalkthrough({
    dismissable: false,
    // wrapperClassName: styles.body
  }),
  connect(
    mapStateToProps,
    {
      showLogin: loginActions.showLogin,
      login: actions.authentication.login,
      logoutUser: actions.authentication.logout,
      loadOnChain: handleActions.loadOnChainHandle,
      saveOnChain: handleActions.saveOnChainHandle
    }
  )
)(AppComponent);

export default App;
