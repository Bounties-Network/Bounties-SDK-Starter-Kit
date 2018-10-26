import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  WalletRequired,
  UnlockWallet,
  SignIn,
  SigningIn,
  ErrorModal
} from './components';
import { rootLoginSelector } from './selectors';
import { actions } from './reducer';

import { actions as moduleActions, selectors } from 'bounties';

const {
  getCurrentUserSelector,
  loginStateSelector,
  logoutStateSelector
} = selectors.authentication;

const {
  addressSelector,
  walletLockedSelector,
  hasWalletSelector
} = selectors.client;


class LoginComponent extends React.Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible && window.ethereum) {
      window.ethereum.enable();
    }
  }

  render() {
    const {
      visible,
      hasWallet,
      walletLocked,
      showLogin,
      login,
      signingIn,
      resetLoginState,
      resetLogoutState,
      loginError,
      logoutError,
      loggedIn
    } = this.props;

    const config = {
      showWalletRequired: false,
      showUnlockWallet: false,
      showErrorModal: false,
      showSigningIn: false,
      showSignIn: false
    };

    if (visible) {
      if (!hasWallet) {
        config.showWalletRequired = true;
      } else if (walletLocked) {
        config.showUnlockWallet = true;
      } else if (loginError || logoutError) {
        config.showErrorModal = true;
      } else if (signingIn || loggedIn) {
        config.showSigningIn = true;
      } else {
        config.showSignIn = true;
      }
    }

    return (
      <React.Fragment>
        <WalletRequired
          visible={config.showWalletRequired}
          onClose={() => showLogin(false)}
        />
        <UnlockWallet
          visible={config.showUnlockWallet}
          onClose={() => showLogin(false)}
        />
        <ErrorModal
          visible={config.showErrorModal}
          onClose={loginError ? resetLoginState : resetLogoutState}
        />
        <SigningIn visible={config.showSigningIn} />
        <SignIn
          visible={config.showSignIn}
          onClose={() => showLogin(false)}
          signIn={login}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  const rootLogin = rootLoginSelector(state);
  const user = getCurrentUserSelector(state);
  const loginState = loginStateSelector(state);
  const logoutState = logoutStateSelector(state);

  return {
    hasWallet: hasWalletSelector(state),
    walletLocked: walletLockedSelector(state),
    walletAddress: addressSelector(state),
    userAddress: user && user.public_address,
    loggedIn: !!user,
    userName: user && user.name,
    userEmail: user && user.email,
    visible: rootLogin.visible,
    stage: rootLogin.stage,
    img: user && user.img,
    signingIn: loginState.loading,
    loginError: loginState.error,
    logoutError: logoutState.error,
    loggingOut: logoutState.loading
  };
};

const Login = compose(
  connect(
    mapStateToProps,
    {
      showLogin: actions.showLogin,
      login: moduleActions.authentication.login,
      logout: moduleActions.authentication.logout,
      resetLoginState: moduleActions.authentication.resetLoginState,
      resetLogoutState: moduleActions.authentication.resetLogoutState
    }
  )
)(LoginComponent);

Login.propTypes = {
  visible: PropTypes.bool,
  stage: PropTypes.string,
  hasWallet: PropTypes.bool,
  walletLocked: PropTypes.bool,
  walletAddress: PropTypes.string,
  userAddress: PropTypes.string,
  img: PropTypes.string,
  showLogin: PropTypes.bool,
  login: PropTypes.func,
  logout: PropTypes.func,
  signingIn: PropTypes.bool,
  loggingOut: PropTypes.bool,
  resetLoginState: PropTypes.func,
  resetLogoutState: PropTypes.func,
  loginError: PropTypes.bool,
  logoutError: PropTypes.bool
};

export default Login;
