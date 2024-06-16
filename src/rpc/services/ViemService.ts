import * as viemChains from 'viem/chains'

import { RpcList, RpcService } from '../index';
import { ViemChainInfoNotFound } from '../../errors';

export class ViemService implements RpcService {
    getRpcList(chainId: number): RpcList | Promise<RpcList> {
        const chain = getViemChainInfo(chainId)
        const res = [...chain.rpcUrls.default.http]
        // @ts-ignore
        if (chain.rpcUrls.default.webSocket) {
            try {
                // @ts-ignore
                res.push(...chain.rpcUrls.default.webSocket)
            } catch { /* empty */ }
        }

        return res.map(rpc => {
            return {
                url: rpc
            }
        })
    }
}

function getViemChainInfo(chainId: number) {
    const chainInfo = Object.values(viemChains).find((v) => v.id === chainId)
    if (!chainInfo) {
        throw ViemChainInfoNotFound
    }
  
    return chainInfo
}