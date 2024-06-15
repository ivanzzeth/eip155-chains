import { Chain } from "eth-chains";
import { getChainMetadataById } from "./getEIP155ChainMetadata";
import { ApiKeys, getRpcsByChainId, ClassifiedRpc, splitRpcsByProtocol } from './getRpcs';
import { ChainNotFound } from "./errors";

export interface EIP155Chain extends Chain {
    classifiedRpc: ClassifiedRpc
}

export interface Options extends ApiKeys {
    helthyCheckEanbled: boolean
}

export async function getChainById(chainId: number, options?: Options): Promise<EIP155Chain> {
    const chain = await getChainMetadataById(chainId)

    if (!chain) {
        throw ChainNotFound
    }

    chain.rpc = await getRpcsByChainId(chainId, chain.rpc, options ? options.helthyCheckEanbled : true, options)
    
    return {
        ...chain,
        classifiedRpc: splitRpcsByProtocol(chain.rpc)
    }
}
