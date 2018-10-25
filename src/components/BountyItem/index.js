import React from 'react';
import './styles.css';
import { Avatar, Text } from '@bounties-network/components';

const BountyItem = props => {
  const { title, issuer } = props

  return (
    <div className="bounty-item">
      <Avatar className="issuer-avatar" border hash={issuer} />
      <Text>{title}</Text>
    </div>
  );

}

export default BountyItem;