## Oasis Sapphire Voting Component

This project incorporates a decentralized voting system built on the Oasis Sapphire network, leveraging its unique privacy features for secure and confidential voting.

### Oasis Sapphire Integration

The voting component is deployed on the Oasis Sapphire testnet, which provides enhanced privacy and confidentiality for blockchain transactions. This makes it an ideal platform for a voting system where user privacy is crucial.

- **Network**: Oasis Sapphire Testnet
- **Chain ID**: 23295
- **RPC URL**: https://testnet.sapphire.oasis.dev

### Smart Contract

The voting smart contract is deployed at the following address:

```
0x3bDBE423fb31D844C392c77d35db5f38611C897B
```

#### Contract Functionality

The smart contract provides the following key functions:

1. `vote(uint256 option)`: Allows a user to cast a vote for their chosen option.
2. `getVotes()`: Returns the current vote counts for all options.
3. `hasVoted(address)`: Checks if a specific address has already voted.

### Voting Component Features

- **Wallet Connection**: Users can connect their Web3 wallet (e.g., MetaMask) to interact with the voting system.
- **Network Validation**: The component ensures users are connected to the Oasis Sapphire testnet before allowing interactions.
- **Vote Casting**: Users can select and submit their vote through an intuitive interface.
- **Real-time Results**: The current vote tallies are displayed and updated in real-time.

### Privacy Features

Oasis Sapphire's privacy-preserving technology ensures that:

1. Individual votes remain confidential.
2. The voting process is transparent and verifiable without compromising user anonymity.
3. Smart contract computations are performed in a secure enclave, protecting sensitive data.

### Integration Notes

When incorporating this component into the larger project:

1. Ensure the Web3 provider is correctly set up for the Oasis Sapphire network.
2. Handle network switching to guide users to the correct network if needed.
3. Manage state updates to reflect real-time changes in voting data.

For full functionality, users will need to have ROSE tokens on the Sapphire testnet to cover gas fees for voting transactions.