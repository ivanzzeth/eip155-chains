import { Chain } from "eth-chains";
import { getChainMetadataById } from "./getEIP155ChainMetadata";
import { getRpcsByChainId } from "./getRpcs";
import { ChainNotFound } from "./errors";

export async function getChainById(chainId: number): Promise<Chain> {
    console.log(`getChainById ${chainId}`)
    const chain = await getChainMetadataById(chainId)

    if (!chain) {
        throw ChainNotFound
    }

    chain.rpc = await getRpcsByChainId(chainId, chain.rpc)
    return chain
}
