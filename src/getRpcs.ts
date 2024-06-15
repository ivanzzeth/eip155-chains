import { getViemChainInfo, sleep } from "./utils"
import { RpcNotFound } from './errors'

export interface ApiKeys {
    INFURA_API_KEY?: string
    ALCHEMY_API_KEY?: string
    ANKR_API_KEY?: string
}

export interface ClassifiedRpc {
    http: string[]
    https: string[]
    ws: string[]
    wss: string[]
}

const RPC_TIMEOUT = 5_000

export async function getRpcsByChainId(chainId: number, extraRpcs?: string[], healthyCheckEanbled = true, apiKeys?: ApiKeys): Promise<string[]> {
    const rpcs: string[] = []

    // Add all rpc nodes
    rpcs.push(...getRpcsByChainIdByViem(chainId))
    if (extraRpcs) {
        rpcs.push(...extraRpcs)
    }

    // Remove redundant nodes
    let res: string[] = []
    new Set(rpcs).forEach(v => res.push(v))

    if (apiKeys) {
        // Replace api keys using config
        res = res.map(v => {
            if (apiKeys.INFURA_API_KEY && v.includes("${INFURA_API_KEY}")) {
                return v.replace("${INFURA_API_KEY}", apiKeys.INFURA_API_KEY)
            }

            if (apiKeys.ALCHEMY_API_KEY && v.includes("${ALCHEMY_API_KEY}")) {
                return v.replace("${ALCHEMY_API_KEY}", apiKeys.ALCHEMY_API_KEY)
            }

            if (apiKeys.ANKR_API_KEY && v.includes("${ANKR_API_KEY}")) {
                return v.replace("${ANKR_API_KEY}", apiKeys.ANKR_API_KEY)
            }

            return v
        })
    }

    // Remove all rpc nodes with invalid protocol
    res = res.filter(rpc => isValidRpcProtocol(rpc))

    // Remove rpc nodes needing API key
    res = res.filter(rpc => !rpc.includes("API_KEY"))

    // Remove all invalid rpc nodes
    if (healthyCheckEanbled) {
        res = await healthyCheck(res)
    }

    if (res.length == 0) {
        throw RpcNotFound
    }

    return res
}

export function splitRpcsByProtocol(rpcs: string[]): ClassifiedRpc {
    const classifiedRpc: ClassifiedRpc = {
        http: [],
        https: [],
        ws: [],
        wss: []
    }
    
    for (const rpc of rpcs) {
        if (rpc.startsWith("http://")) {
            classifiedRpc.http.push(rpc)
        } else if (rpc.startsWith("https://")) {
            classifiedRpc.https.push(rpc)
        } else if (rpc.startsWith("ws://")) {
            classifiedRpc.ws.push(rpc)
        } else if (rpc.startsWith("wss://")) {
            classifiedRpc.wss.push(rpc)
        }
    }

    return classifiedRpc
}

export function isValidRpcProtocol(rpc: string): boolean {
    return rpc.startsWith("http://") || rpc.startsWith("https://") || rpc.startsWith("ws://") || rpc.startsWith("wss://")
}

export async function healthyCheck(rpcs: string[]): Promise<string[]> {
    rpcs = await Promise.all(
        rpcs.map(async (rpc) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const ethers = require('ethers')
            const jsonRpcProvider = ethers.providers ? ethers.providers.JsonRpcProvider : ethers.JsonRpcProvider
            const wsRpcProvider = ethers.providers ? ethers.providers.WebSocketProvider : ethers.WebSocketProvider

            let provider
            if (jsonRpcProvider && rpc.startsWith("http://") || rpc.startsWith("https://")) {
                provider = new jsonRpcProvider(rpc)
            } else if (wsRpcProvider && rpc.startsWith("ws://") || rpc.startsWith("wss://")) {
                provider = new wsRpcProvider(rpc)
            } else {
                return null
            }

            let ok = false
            try {
                const number: number = await Promise.race(
                    [
                        (provider.getBlockNumber() as Promise<number>),
                        sleep(RPC_TIMEOUT).then(() => -1)
                    ]
                )

                ok = number > 0
            } catch {
                // empty
            }

            if (provider && provider.destroy) {
                await provider.destroy()
            }

            if (ok) {
                return rpc
            }
            
            return null
        })
    )

    rpcs = rpcs.filter((rpc) => rpc !== null)

    return rpcs
}

export function getRpcsByChainIdByViem(chainId: number): string[] {
    const chain = getViemChainInfo(chainId)
    return [...chain.rpcUrls.default.http]
}