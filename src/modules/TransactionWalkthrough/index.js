import React from 'react';
import PropTypes from 'prop-types';
import styles from './TransactionWalkthrough.module.scss';
import { Text, Modal, Button } from '@bounties-network/components';

const InitiateWalkthrough = props => {
  const { onClose, visible, onConfirm } = props;

  return (
    <Modal onClose={onClose} visible={visible} fixed size="small">
      <Modal.Header icon={['fas', 'wallet']}>
        <Modal.Message>Your wallet will take it from here!</Modal.Message>
      </Modal.Header>
      <Modal.Body>
        <Modal.Description>
          <Text className={styles.textBreak}>
            After clicking &quot;OK &quot;, a wallet dialogue will prompt you to
            confirm your Ethereum transaction and pay a small amount of ETH (for
            gas fees).
          </Text>
          <Text>A default gas limit and price will be set for you.</Text>
        </Modal.Description>
      </Modal.Body>
      <Modal.Footer>
        <Button margin onClick={onClose}>
          Cancel
        </Button>
        <Button type="primary" onClick={onConfirm}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

InitiateWalkthrough.propTypes = {
  onClose: PropTypes.func,
  visible: PropTypes.bool,
  onConfirm: PropTypes.func
};

const PendingWalletConfirm = props => {
  const { text, visible } = props;

  return (
    <Modal visible={visible} fixed size="small">
      <Modal.Header loadingIcon>
        <Modal.Message>{text}</Modal.Message>
      </Modal.Header>
    </Modal>
  );
};

PendingWalletConfirm.propTypes = {
  text: PropTypes.string
};

const PendingReceipt = props => {
  const { text, visible, onClose } = props;

  return (
    <Modal visible={visible} fixed size="small">
      <Modal.Header loadingIcon>
        <Modal.Message>
          Waiting for your transaction to be confirmed on the blockchain...
        </Modal.Message>
      </Modal.Header>
      <Modal.Body>
        <Modal.Description>{text}</Modal.Description>
      </Modal.Body>
      <Modal.Footer>
        <Button type="primary" onClick={onClose}>
          Okay
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

PendingReceipt.propTypes = {
  text: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.fn
};

const WalkthroughError = props => {
  const { onClose, visible } = props;

  return (
    <Modal dismissable onClose={onClose} fixed size="small" visible={visible}>
      <Modal.Header icon={['fas', 'exclamation-triangle']} closable />
      <Modal.Body>
        <Modal.Message>Something happened. Try again later.</Modal.Message>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

WalkthroughError.propTypes = {
  onClose: PropTypes.func
};

const WalkthroughSuccess = props => {
  const { visible, onClose } = props;

  return (
    <Modal fixed size="small" visible={visible}>
      <Modal.Header icon={['far', 'check-circle']} />
      <Modal.Body>
        <Modal.Message>Your transaction has been confirmed!</Modal.Message>
      </Modal.Body>
      <Modal.Footer>
        <Button margin onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const TransactionWalkthrough = props => {
  const {
    visible,
    stage,
    onClose,
    onConfirm,
    pendingReceiptText,
    pendingWalletText,
    transaction,
    successLink
  } = props;

  return (
    <React.Fragment>
      <InitiateWalkthrough
        onConfirm={onConfirm}
        visible={visible && stage === 'initiatePrompt'}
        onClose={onClose}
      />
      <PendingWalletConfirm
        text={pendingWalletText}
        visible={visible && stage === 'pendingWalletConfirm'}
      />
      <PendingReceipt
        text={pendingReceiptText}
        visible={
          visible && !transaction.completed && stage === 'pendingReceipt'
        }
        onClose={onClose}
      />
      <WalkthroughSuccess
        visible={visible && transaction.completed && stage === 'pendingReceipt'}
        onClose={onClose}
        buttonText={transaction.linkText}
        successLink={successLink}
      />
      <WalkthroughError
        onClose={onClose}
        visible={visible && stage === 'error'}
      />
    </React.Fragment>
  );
};

TransactionWalkthrough.propTypes = {
  visible: PropTypes.bool,
  stage: PropTypes.oneOf([
    'initiatePrompt',
    'pendingWalletConfirm',
    'pendingReceipt',
    'error'
  ]),
  onClose: PropTypes.func,
  onDismiss: PropTypes.func,
  onConfirm: PropTypes.func,
  pendingReceiptText: PropTypes.string,
  pendingWalletText: PropTypes.string
};

TransactionWalkthrough.defaultProps = {
  pendingReceiptText:
    'Your transaction is being processed. We will notify you once it is confirmed.',
  pendingWalletText:
    'Confirming Ethereum transaction with your enabled wallet. This may take a few seconds.'
};

export default TransactionWalkthrough;