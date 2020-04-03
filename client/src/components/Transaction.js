import React from 'react';

const Transaction = ({ transaction }) => {
  const { input, output } = transaction;
  //const recipients = Object.keys(output);

  return (
    <div className='Transaction'>
      <div>From: {`${input.address.substring(0, 20)}...`} | Balance: {input.tokenTotals}</div>
      {
        output.map(entry => (
          <div key={entry.address}>
            To: {`${entry.address.substring(0, 20)}...`} | Sent: {entry.ledgerEntry.token}
          </div>
        ))
      }
    </div>
  );
}

export default Transaction;