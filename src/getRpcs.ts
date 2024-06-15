import { getViemChainInfo } from "./utils"
import { RpcNotFound } from './errors'

export async function getRpcsByChainId(chainId: number, extraRpcs?: string[]): Promise<string[]> {
    const rpcs: string[] = []

    // Add all rpc nodes
    rpcs.push(...getRpcsByChainIdByViem(chainId))
    if (extraRpcs) {
        rpcs.push(...extraRpcs)
    }

    // Remove redundant nodes
    let res: string[] = []
    new Set(rpcs).forEach(v => res.push(v))

    // Remove rpc nodes needing API key
    res = res.filter(rpc => !rpc.includes("API_KEY"))

    // Remove all invalid rpc nodes

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ethers = require('ethers')

    const jsonRpcProvider = ethers.providers ? ethers.providers.JsonRpcProvider : ethers.JsonRpcProvider
    if (jsonRpcProvider) {
        res = await Promise.all(
            res.map(async (rpc) => {
                const provider = new jsonRpcProvider(rpc)
                try {
                    await provider.getBlockNumber()
                    return rpc
                } catch { /* empty */ }
    
                if (provider.destroy) provider.destroy()
                
                return null
            })
        )
    }

    res = res.filter((rpc) => rpc !== null)
    if (res.length == 0) {
        throw RpcNotFound
    }

    return res
}

export function getRpcsByChainIdByViem(chainId: number): string[] {
    const chain = getViemChainInfo(chainId)
    return [...chain.rpcUrls.default.http]
}