import axios from 'axios'
import { Chain, chains } from 'eth-chains'

export async function getChainMetadataById(chainId: number): Promise<Chain | undefined> {
    let chain = getChainMetadataByIdByEthChains(chainId)
    if (chain) {
        return chain
    }

    chain = await getChainMetadataByIdByChainIdNetwork(chainId)

    console.log(`getChainMetadataById, chainId=${chainId}, chain=${chain}`)
    return chain
}

export function getChainMetadataByIdByEthChains(chainId: number): Chain | undefined {
    return chains.getById(chainId)
}

export async function getChainMetadataByIdByChainIdNetwork(chainId: number): Promise<Chain | undefined> {
    const resp = await axios.get<Chain[]>(`https://chainid.network/chains.json`)
    const chainlist: Chain[] = resp.data
    return chainlist.find(chain => chain.chainId == chainId)
}
