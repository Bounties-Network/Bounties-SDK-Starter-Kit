import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { map } from 'lodash';
import './App.css';
import Logo from './logo';
import { actions as handleActions } from '../modules/Handle';
import { handleSelector, handleOnChainSelector } from '../modules/Handle/selectors';
import LoadComponent from '../hocs/LoadComponent';
import { Button, Loader, Network, Text, ToastContainer, TextInput, Textbox } from '@bounties-network/components';
import { BountyItem } from '../components';
import { actions as loginActions } from '../modules/LoginWalkthrough/reducer';
import { actions, selectors } from '@bounties-network/modules';
import TransactionWalkthrough from '../modules/TransactionWalkthrough/hocs/TransactionWalkthrough';
import FunctionalLoginLock from '../modules/LoginWalkthrough/hocs/FunctionalLoginLock';
import RequireLogin from '../modules/LoginWalkthrough/hocs/RequireLoginComponent';
import LoginWalkthrough from '../modules/LoginWalkthrough';

const ListComponent = props => {
  const {
    bountiesState,
    loading,
    showLogin,
    initiateLoginProtection,
    bounties,
    showCreate
  } = props;

  let content = (
    <div className="group">
      <div className="header">
        <h1 className="logo"><Logo /></h1>

        <Text>Welcome to the Bounties Network starter kit</Text>
        <div className="button-group centered">
          <Button
            type="primary"
            onClick={showCreate}
            loading={loading}
          >
            New Bounty
          </Button>
          {props.currentUser && (
            <Button
              type="destructive"
              loading={props.logoutState.loading}
              onClick={props.logoutUser}
            >
              Logout
            </Button>
          )}
        </div>

      </div>
      <div className="bounty-list">
        <Text typeScale="Small" alignment='align-left'>Last 25 bounties:</Text>
        {map(bounties, bounty => (
          <BountyItem
            key={bounty.id}
            title={bounty.title}
            issuer={bounty.issuer_address}
          />
        ))}
      </div>
    </div>
  );

  if (bountiesState.loading) {
      content = <Loader color="white" size="medium" />;
  }

  return content;
}

const List = compose(LoadComponent('loadBounties'))(ListComponent)

class CreateBountyComponent extends React.Component {
  state = { title: null, body: null, amount: null };
  onTextChange = (key, value) => { this.setState({ [key]: value }) }

  values = () => ({
    title: this.state.title,
    description: this.state.body,
    categories: ['starter-kit'],
    tokenContract: '',
    experienceLevel: 'Beginner',
    issuer_email: 'starter.kit@bounties.network',
    issuer_name: 'Bounty User',
    fulfillmentAmount: this.state.amount,
    paysTokens: false,
    privateFulfillments: false,
    revisions: 0,
    deadline: 999999999999999,
    sourceDirectoryHash: '',
    sourceFileName: '',
    webReferenceURL: ''
  })

  render() {
    const {
      currentUser,
      logoutUser,
      showList,
      createBounty
    } = this.props;
    const { title, body, amount } = this.state;

    return (
      <div className="group">
        <div className="form-input">
          <div className="logo"><Logo /></div>
          <Text>Create a new bounty</Text>
        </div>

        <div className="form">
          <div className="form-input">
            <TextInput
              placeholder="bounty title"
              value={title}
              onChange={value => this.onTextChange('title', value)}
            />
          </div>
          <div className="form-input">
            <Textbox
              placeholder="bounty body"
              value={body}
              onChange={value => this.onTextChange('body', value)}
            />
          </div>
          <div className="form-input">
            <TextInput
              placeholder="eth amount"
              value={amount}
              onChange={value => this.onTextChange('amount', value)}
            />
          </div>
        </div>
        <div className="button-group">
          <Button
            type="action"
            onClick={() => createBounty(this.values(), this.state.amount)}
          >
            Save
          </Button>
          <Button
            type="destructive"
            onClick={showList}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}

class AppComponent extends React.Component {
  state = { stage: 'list' }

  showCreate = () => this.setState({ stage: 'create' });
  showList = () => this.setState({ stage: 'list' });

  render() {
    const {
      loginState,
      clientInitialized,
      currentUser,
      currentUserState,
      hasWallet,
      initiateLoginProtection,
      initiateWalkthrough
    } = this.props;

    const { stage } = this.state;

    let content = '';

    if (stage === 'create') {
      content = (
        <CreateBountyComponent
          currentUser={currentUser}
          showList={this.showList}
          createBounty={(values, balance) =>
            initiateLoginProtection(() =>
              initiateWalkthrough(() =>
                this.props.createBounty(values, balance)
          ))}
        />
      )
    }

    if (stage === 'list') {
      content = (
        <List
          bountiesState={this.props.bountiesState}
          loadBounties={this.props.loadBounties}
          bounties={this.props.bounties}
          showCreate={this.showCreate}
          currentUser={currentUser}
          logoutState={this.props.logoutState}
          logoutUser={this.props.logoutUser}
        />
      );
    }

    const isPageLoading = currentUserState.loading ||
                          !currentUserState.loaded ||
                          !clientInitialized

    if (isPageLoading) {
      content = <Loader color="white" size="medium" />;
    }

    return (
      <React.Fragment>
        <div className={[
          'center', (
            isPageLoading ||
            this.props.bountiesState.loading ||
            this.state.stage === 'create'
          ) && 'loading'].join(' ')}
        >
          <ToastContainer
            newestOnTop
            autoClose={false}
            hideProgressBar
            draggable
          />
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
    bounties: selectors.bounties.bountiesSelector(state),
    bountiesState: selectors.bounties.bountiesStateSelector(state),
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
      loadBounties: actions.bounties.loadBounties,
      showLogin: loginActions.showLogin,
      login: actions.authentication.login,
      logoutUser: actions.authentication.logout,
      createBounty: actions.bounty.createBounty,
    }
  )
)(AppComponent);

export default App;
