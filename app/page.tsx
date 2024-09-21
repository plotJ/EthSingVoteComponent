'use client'

import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { VotingAppComponent } from '@/components/ui/voting-app'

function getLibrary(provider: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc): ethers.providers.Web3Provider {
  return new ethers.providers.Web3Provider(provider)
}

export default function Home() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <VotingAppComponent />
    </Web3ReactProvider>
  )
}