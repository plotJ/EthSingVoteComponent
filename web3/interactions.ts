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
  supportedChainIds: [23295], // Sapphire testnet
})

export async function getContract(provider: any) {
  const signer = provider.getSigner()
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
}

export async function submitVote(provider: any, option: string) {
  const contract = await getContract(provider)
  try {
    const optionIndex = ['Red', 'Blue', 'Green', 'Yellow'].indexOf(option)
    if (optionIndex === -1) throw new Error('Invalid option')
    const tx = await contract.vote(optionIndex)
    await tx.wait()
    return true
  } catch (error: any) {
    console.error('Failed to submit vote:', error)
    return false
  }
}

export async function getVotes() {
  // Use a default provider for read-only operations
  const provider = new ethers.providers.JsonRpcProvider('https://testnet.sapphire.oasis.dev')
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
  try {
    const votes = await contract.getVotes()
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