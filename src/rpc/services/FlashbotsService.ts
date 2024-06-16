import * as viemChains from 'viem/chains'

import { RpcFeature, RpcList, RpcService, RpcUrl } from '../index';

export class FlashbotsService implements RpcService {
    // flashbots rpc list: https://docs.flashbots.net/flashbots-protect/quick-start
    getRpcList(chainId: number): RpcList | Promise<RpcList> {
        let url: RpcUrl | undefined
        switch(chainId) {
            case viemChains.mainnet.id:
                url = 'https://rpc.flashbots.net/fast'
                break
            case viemChains.goerli.id:
                url = 'https://rpc-goerli.flashbots.net/'
                break
            case viemChains.sepolia.id:
                url = 'https://rpc-sepolia.flashbots.net/'
                break
            case viemChains.holesky.id:
                url = 'https://rpc-holesky.flashbots.net/'
                break
        }

        if (!url) {
            return []
        }

        return [{url}]
    }

    hasRpc(url: RpcUrl): boolean {
        return url.includes('flashbots.net')
    }

    getFeatures(): Array<RpcFeature> {
        return [
            'privacy',
            'MEV protection',
            'free to use',
        ]
    }
}