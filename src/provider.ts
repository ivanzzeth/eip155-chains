import { FallbackProvider, FallbackProviderConfig, JsonRpcProvider, Provider, WebSocketProvider } from "@ethersproject/providers";
import { getChainById } from "./getChain";
import { Options, RpcNotFound } from ".";

const ProviderStallTimeoutMultiplier = 3

export async function getEthersProvider(chainId: number, options?: Options): Promise<[Provider, () => Promise<void>]> {
    const chain = await getChainById(chainId, options)

    let providersConfigs: Array<FallbackProviderConfig> = chain.rpcList.map((rpc) => {
        // Double check
        try {
            let provider: Provider
            if (rpc.url.startsWith('http://') || rpc.url.startsWith('https://')) {
                provider = new JsonRpcProvider(rpc.url)
            } else {
                provider = new WebSocketProvider(rpc.url)
            }

            return {
                provider,
                stallTimeout: rpc.latency * ProviderStallTimeoutMultiplier,
                priority: rpc.latency,
            }
        } catch (e) { /* empty */ }
        
        return null
    })

    // Remove invalid providers
    providersConfigs = providersConfigs.filter(v => v != null)

    if (providersConfigs.length == 0) {
        throw RpcNotFound
    }

    if (providersConfigs.length == 1) {
        return [providersConfigs[0].provider, async () => destroyEthersProvider(providersConfigs[0].provider)]
    }

    const provider = new FallbackProvider(providersConfigs)
    return [provider, async () => {
        await destroyEthersProvider(provider)
        await Promise.all(providersConfigs.map(config => destroyEthersProvider(config.provider)))
    }]
}

export async function destroyEthersProvider(provider: Provider): Promise<void> {
    if (provider && (provider as any).destroy) {
        await (provider as any).destroy()
    }
}
