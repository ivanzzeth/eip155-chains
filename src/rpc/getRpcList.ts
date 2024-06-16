import {BaseProvider, JsonRpcProvider, WebSocketProvider} from '@ethersproject/providers'

import { ApiKeys, filterRpcListByFeatures, Filters, fulfillRpcFeatures, isValidRpcProtocol, registeredRpcServices, RPC_TIMEOUT, RpcList, RpcUrl } from "."
import { RpcNotFound } from "../errors"
import { sleep } from "../utils"
import { destroyEthersProvider } from '../provider'

export async function getRpcsByChainId(chainId: number, extraRpcs?: RpcList, healthyCheckEanbled = false, apiKeys?: ApiKeys, filters?: Filters): Promise<RpcList> {
    const rpcs: RpcList = []

    // Add all rpc nodes from services
    await Promise.all(
        registeredRpcServices.map(async (service) => {
            const list = await service.getRpcList(chainId)
            rpcs.push(...list)
        })
    )

    if (extraRpcs) {
        rpcs.push(...extraRpcs)
    }

    // Remove redundant nodes
    let res: RpcList = []
    new Set(rpcs).forEach(v => res.push(v))

    if (apiKeys) {
        // Replace api keys using config
        res = res.map(rpc => {
            let url: RpcUrl = rpc.url
            if (apiKeys.INFURA_API_KEY && rpc.url.includes("${INFURA_API_KEY}")) {
                url = rpc.url.replace("${INFURA_API_KEY}", apiKeys.INFURA_API_KEY) as RpcUrl
            }

            if (apiKeys.ALCHEMY_API_KEY && rpc.url.includes("${ALCHEMY_API_KEY}")) {
                url = rpc.url.replace("${ALCHEMY_API_KEY}", apiKeys.ALCHEMY_API_KEY) as RpcUrl
            }

            if (apiKeys.ANKR_API_KEY && rpc.url.includes("${ANKR_API_KEY}")) {
                url = rpc.url.replace("${ANKR_API_KEY}", apiKeys.ANKR_API_KEY) as RpcUrl
            }

            return {
                ...rpc,
                url,
            }
        })
    }

    // Remove all rpc nodes with invalid protocol
    res = res.filter(rpc => isValidRpcProtocol(rpc.url))

    // Remove rpc nodes needing API key
    res = res.filter(rpc => !rpc.url.includes("API_KEY"))

    // Apply filters
    if (filters) {
        if (filters.features) {
            res = filterRpcListByFeatures(res, filters.features)
        }
    }

    // Remove all invalid rpc nodes
    if (healthyCheckEanbled) {
        res = await healthyCheck(res)
    }

    if (res.length == 0) {
        throw RpcNotFound
    }

    fulfillRpcFeatures(res)

    return res
}

export async function healthyCheck(rpcs: RpcList): Promise<RpcList> {
    rpcs = await Promise.all(
        rpcs.map(async (rpc) => {
            const startTime = Date.now()
            let latency: number = -1
            let provider: BaseProvider
            if (rpc.url.startsWith("http://") || rpc.url.startsWith("https://")) {
                provider = new JsonRpcProvider(rpc.url)
            } else if (rpc.url.startsWith("ws://") || rpc.url.startsWith("wss://")) {
                provider = new WebSocketProvider(rpc.url)
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
                latency = Date.now() - startTime
            } catch {
                // empty
            }

            // Release provider
            await destroyEthersProvider(provider)

            if (ok) {
                rpc.latency = latency
                return rpc
            }
            
            return null
        })
    )

    rpcs = rpcs.filter((rpc) => rpc !== null)

    return rpcs
}