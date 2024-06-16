import { Chain } from "eth-chains";
import { getChainMetadataById } from "./getEIP155ChainMetadata";
import { ApiKeys, getRpcsByChainId, ClassifiedRpc, splitRpcsByProtocol, RpcUrl, Filters } from './rpc';
import { ChainNotFound } from "./errors";
import { RpcList } from "./rpc";

export interface EIP155Chain extends Chain {
    rpcList: RpcList
    classifiedRpc: ClassifiedRpc
}

export interface Options {
    apiKeys?: ApiKeys
    healthyCheckEnabled?: true
    filters?: Filters
}

export async function getChainById(chainId: number, options?: Options): Promise<EIP155Chain> {
    const chain = await getChainMetadataById(chainId)

    if (!chain) {
        throw ChainNotFound
    }

    const rpcList = await getRpcsByChainId(
        chainId,
        chain.rpc.map(v =>  { return {url: v as RpcUrl} }),
        options?.healthyCheckEnabled,
        options?.apiKeys,
        options?.filters
    )
    chain.rpc = rpcList.map(rpc => rpc.url)

    return {
        ...chain,
        rpcList,
        classifiedRpc: splitRpcsByProtocol(rpcList)
    }
}
