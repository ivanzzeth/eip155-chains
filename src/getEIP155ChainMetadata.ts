import axios from 'axios'
import { Chain, chains } from 'eth-chains'
import ChainList from './chainlist.json'
import { MemoryStorage } from 'unikvstore'

const memoryStorage = new MemoryStorage()

export async function getChainMetadataById(chainId: number): Promise<Chain | undefined> {
    let chain = getChainMetadataByIdByEthChains(chainId)
    if (chain) {
        return chain
    }

    chain = getChainMetadataByIdByLocalFile(chainId)
    if (chain) {
        return chain
    }

    chain = await getChainMetadataByIdByChainIdNetwork(chainId)

    return chain
}

export function getChainMetadataByIdByEthChains(chainId: number): Chain | undefined {
    return chains.getById(chainId)
}

export function getChainMetadataByIdByLocalFile(chainId: number): Chain | undefined {
    return ChainList.find(chain => chain.chainId == chainId) as Chain
}

export async function getChainMetadataByIdByChainIdNetwork(chainId: number): Promise<Chain | undefined> {
    let chainlist: Chain[] | undefined

    const cachedChainlist = await memoryStorage.contains("chainlist")
    if (cachedChainlist) {
        chainlist = JSON.parse(await memoryStorage.get("chainlist"))
    } else {
        const resp = await axios.get<Chain[]>(`https://chainid.network/chains.json`)
        chainlist = resp.data
    }

    
    return chainlist?.find(chain => chain.chainId == chainId)
}
