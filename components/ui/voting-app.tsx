'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button } from "@/components/ui/button"
import { submitVote, getVotes, hasVoted, injectedConnector } from '@/web3/interactions'

type VoteOption = 'Red' | 'Blue' | 'Green' | 'Yellow';
type Votes = Record<VoteOption, number>;

export function VotingAppComponent() {
  const { active, account, library, chainId, activate } = useWeb3React()
  const [votes, setVotes] = useState<Votes>({ Red: 0, Blue: 0, Green: 0, Yellow: 0 })
  const [selectedOption, setSelectedOption] = useState<VoteOption | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [networkError, setNetworkError] = useState<string | null>(null)
  const [hasUserVoted, setHasUserVoted] = useState(false)

  const fetchVotes = useCallback(async () => {
    try {
      const currentVotes = await getVotes()
      console.log('Fetched votes:', currentVotes)
      setVotes(currentVotes)
    } catch (error) {
      console.error('Failed to fetch votes:', error)
      setNetworkError('Failed to fetch votes. Please check your network connection.')
    }
  }, [])

  const checkIfUserHasVoted = useCallback(async () => {
    if (active && account && library) {
      try {
        const voted = await hasVoted(library, account)
        setHasUserVoted(voted)
      } catch (error) {
        console.error('Failed to check if user has voted:', error)
      }
    }
  }, [active, account, library])

  useEffect(() => {
    fetchVotes() // Fetch votes immediately, regardless of wallet connection

    const checkNetwork = async () => {
      if (active && library) {
        const network = await library.getNetwork()
        console.log('Current network:', network)
        setIsCorrectNetwork(network.chainId === 23295) // Sapphire testnet
        if (network.chainId !== 23295) {
          setNetworkError('Please connect to the Sapphire testnet (Chain ID: 23295)')
        } else {
          setNetworkError(null)
          checkIfUserHasVoted()
        }
      }
    }

    checkNetwork()
  }, [active, library, chainId, fetchVotes, checkIfUserHasVoted])

  const handleConnectWallet = async () => {
    try {
      await activate(injectedConnector)
    } catch (error) {
      console.error('Failed to connect:', error)
      setNetworkError('Failed to connect wallet. Please try again.')
    }
  }

  const handleSubmitVote = async () => {
    if (selectedOption && library && isCorrectNetwork && !hasUserVoted) {
      setIsVoting(true)
      try {
        const success = await submitVote(library, selectedOption)
        if (success) {
          await fetchVotes()
          setSelectedOption(null)
          setHasUserVoted(true)
        } else {
          setNetworkError('Failed to submit vote. Please try again.')
        }
      } catch (error) {
        console.error('Failed to submit vote:', error)
        setNetworkError('An error occurred while submitting your vote. Please try again.')
      } finally {
        setIsVoting(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Decentralized Voting App</h1>
              <Button
                onClick={handleConnectWallet}
                disabled={active}
                variant="outline"
                className="bg-blue-500 hover:bg-blue-700 text-white"
              >
                {active ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
              </Button>
            </div>
            
            {networkError && (
              <div className="text-red-500 mb-4">
                {networkError}
              </div>
            )}

            {active && hasUserVoted && (
              <div className="text-green-500 mb-4">
                You have already voted. Thank you for participating!
              </div>
            )}

            <h2 className="text-xl font-semibold text-gray-700 mb-4">What is your favorite color?</h2>
            
            <div className="space-y-4 mb-6">
              {(Object.keys(votes) as VoteOption[]).map((color) => (
                <Button
                  key={color}
                  onClick={() => setSelectedOption(color)}
                  variant="outline"
                  className={`w-full flex items-center justify-between px-4 py-2 ${
                    selectedOption === color ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  disabled={!active || !isCorrectNetwork || hasUserVoted}
                >
                  <span>{color}</span>
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: color.toLowerCase() }}
                  ></div>
                </Button>
              ))}
            </div>
            
            <Button
              onClick={handleSubmitVote}
              disabled={!active || !selectedOption || isVoting || !isCorrectNetwork || hasUserVoted}
              className="w-full bg-green-500 hover:bg-green-700 text-white"
            >
              {isVoting ? 'Submitting...' : hasUserVoted ? 'Already Voted' : 'Submit Vote'}
            </Button>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Results</h3>
              {(Object.entries(votes) as [VoteOption, number][]).map(([color, count]) => (
                <div key={color} className="flex justify-between items-center mb-2">
                  <span>{color}</span>
                  <span>{count} votes</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}