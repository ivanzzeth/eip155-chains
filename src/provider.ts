import { BaseProvider, FallbackProvider, JsonRpcProvider, WebSocketProvider } from "@ethersproject/providers";
import { getChainById } from "./getChain";
import { Options, RpcNotFound } from ".";

export async function getEthersProvider(chainId: number, options?: Options): Promise<[BaseProvider, () => Promise<void>]> {
    const chain = await getChainById(chainId, options)

    let providers = chain.rpc.map((rpc) => {
        // Double check
        try {
            if (rpc.startsWith('http://') || rpc.startsWith('https://')) {
                return new JsonRpcProvider(rpc)
            } else {
                return new WebSocketProvider(rpc)
            }
        } catch (e) { /* empty */ }
        
        return null
    })

    // Remove invalid providers
    providers = providers.filter(v => v != null)

    if (providers.length == 0) {
        throw RpcNotFound
    }

    if (providers.length == 1) {
        return [providers[0], async () => destroyEthersProvider(provider)]
    }

    const provider = new FallbackProvider(providers)
    return [provider, async () => {
        await destroyEthersProvider(provider)
        await Promise.all(providers.map(provider => destroyEthersProvider(provider)))
    }]
}

export async function destroyEthersProvider(provider: BaseProvider): Promise<void> {
    if (provider && (provider as any).destroy) {
        await (provider as any).destroy()
    }
}