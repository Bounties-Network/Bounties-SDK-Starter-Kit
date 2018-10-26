import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import { withRouter, Link } from 'react-router-dom';
import './RequireLoginComponent.module.css';
import { ZeroState, Card } from '@bounties-network/components';
import { actions as loginActions } from '../reducer';
import { selectors } from 'bounties';
import LoginLock from '../LoginLock';

const { getCurrentUserSelector } = selectors.authentication;

function RequireLoginComponentHOC(WrappedComponent) {
  class RequireLoginComponent extends Component {
    static propTypes = {};

    render() {
      const { isLoggedIn, showLogin } = this.props;

      if (!isLoggedIn) {
        return (
          <div className="notLoggedInWrapper">
            <div className="notLoggedIn">
              <Card className="notLoggedInCard">
                <Card.Body>
                  <ZeroState
                    title={'Sign in to use the Bounties Network'}
                    action
                    actionText={'Sign In'}
                    iconColor="blue"
                    onActionClick={() => showLogin(true)}
                    icon={['fal', 'sign-in']}
                  >
                    <div>
                      <ZeroState.BodyText>
                        In order for you to use certain features of the network
                        like creating and fulfilling bounties, commenting, and
                        viewing your network stats, please sign in using your
                        secure wallet.
                      </ZeroState.BodyText>
                    </div>
                    <div className="subText">
                      <ZeroState.BodyText>
                        If you don&#39;t wish to sign in but want to explore,
                        feel free to check out some bounties using the{' '}
                      </ZeroState.BodyText>
                      <ZeroState.BodyText>
                        {/*<Link to="/explorer">explorer</Link>*/}
                      </ZeroState.BodyText>
                      <ZeroState.BodyText>.</ZeroState.BodyText>
                    </div>
                  </ZeroState>
                </Card.Body>
              </Card>
            </div>
          </div>
        );
      }

      return (
        <div className="loginWrapper">
          <LoginLock />
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  }

  RequireLoginComponent.proptypes = {
    isLoggedIn: PropTypes.bool,
    showLogin: PropTypes.func
  };

  const mapStateToProps = state => ({
    isLoggedIn: !!getCurrentUserSelector(state)
  });
  return compose(
    // withRouter,
    connect(
      mapStateToProps,
      { showLogin: loginActions.showLogin }
    )
  )(RequireLoginComponent);
}

export default RequireLoginComponentHOC;
