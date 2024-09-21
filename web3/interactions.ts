import { ethers } from 'ethers'
import { InjectedConnector } from '@web3-react/injected-connector'

const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "option",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "option",
        "type": "uint256"
      }
    ],
    "name": "VoteCast",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getVotes",
    "outputs": [
      {
        "internalType": "uint256[4]",
        "name": "",
        "type": "uint256[4]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "votes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const CONTRACT_ADDRESS = '0x3bDBE423fb31D844C392c77d35db5f38611C897B'

export const injectedConnector = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 23294, 23295], // Ethereum mainnet, testnets, and Sapphire networks
  })

export async function connectWallet(activate: (connector: InjectedConnector) => Promise<void>) {
    try {
      await activate(injectedConnector)
      return true
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      return false
    }
  }

export async function getContract(provider: any) {
  const signer = provider.getSigner()
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
}

export async function submitVote(provider: any, option: string) {
  const contract = await getContract(provider)
  try {
    const optionIndex = ['Red', 'Blue', 'Green', 'Yellow'].indexOf(option)
    if (optionIndex === -1) throw new Error('Invalid option')
    console.log('Submitting vote for option:', option, 'index:', optionIndex)
    const tx = await contract.vote(optionIndex)
    console.log('Transaction sent:', tx.hash)
    const receipt = await tx.wait()
    console.log('Transaction receipt:', receipt)
    return true
  } catch (error: any) {
    console.error('Failed to submit vote:', error)
    if (error.message.includes('user rejected transaction')) {
      console.error('User rejected the transaction')
    } else if (error.message.includes('insufficient funds')) {
      console.error('Insufficient funds for gas')
    } else {
      console.error('Unknown error:', error.message)
    }
    return false
  }
}

export async function getVotes(provider: any) {
    const contract = await getContract(provider)
    try {
      const votes = await contract.getVotes()
      console.log('Raw votes from contract:', votes)
      return {
        Red: votes[0].toNumber(),
        Blue: votes[1].toNumber(),
        Green: votes[2].toNumber(),
        Yellow: votes[3].toNumber(),
      }
    } catch (error) {
      console.error('Failed to get votes:', error)
      throw error
    }
  }

export async function hasVoted(provider: any, address: string) {
  const contract = await getContract(provider)
  try {
    return await contract.hasVoted(address)
  } catch (error) {
    console.error('Failed to check if address has voted:', error)
    return false
  }
}