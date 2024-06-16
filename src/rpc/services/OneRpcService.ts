import * as viemChains from 'viem/chains';

import { RpcFeature, RpcList, RpcService, RpcUrl } from '../index';

export class OneRpcService implements RpcService {
  // 1rpc rpc list: https://www.1rpc.io/
  // TODO: apiKey
  getRpcList(chainId: number): RpcList | Promise<RpcList> {
    let url: RpcUrl | undefined;
    switch (chainId) {
      case viemChains.mainnet.id:
        url = 'https://1rpc.io/eth';
        break;
      case viemChains.sepolia.id:
        url = 'https://1rpc.io/sepolia';
        break;
      case viemChains.holesky.id:
        url = 'https://1rpc.io/holesky';
        break;
      case viemChains.arbitrum.id:
        url = 'https://1rpc.io/arb';
        break;
      case viemChains.optimism.id:
        url = 'https://1rpc.io/op';
        break;
      case viemChains.bsc.id:
        url = 'https://1rpc.io/bnb';
        break;
      case viemChains.polygon.id:
        url = 'https://1rpc.io/matic';
        break;
      case viemChains.avalanche.id:
        url = 'https://1rpc.io/avax/c';
        break;
      case viemChains.base.id:
        url = 'https://1rpc.io/base';
        break;
      case viemChains.linea.id:
        url = 'https://1rpc.io/linea';
        break;
      case viemChains.fantom.id:
        url = 'https://1rpc.io/ftm';
        break;
      case viemChains.celo.id:
        url = 'https://1rpc.io/celo';
        break;
      case viemChains.moonbeam.id:
        url = 'https://1rpc.io/glmr';
        break;
      case viemChains.zkSync.id:
        url = 'https://1rpc.io/zksync2-era';
        break;
      case viemChains.astar.id:
        url = 'https://1rpc.io/astr';
        break;
      case viemChains.acala.id:
        url = 'wss://1rpc.io/aca';
        break;
      case viemChains.klaytn.id:
        url = 'https://1rpc.io/klay';
        break;
      case viemChains.aurora.id:
        url = 'https://1rpc.io/aurora';
        break;
      case viemChains.polygonZkEvm.id:
        url = 'https://1rpc.io/polygon/zkevm';
        break;
      case viemChains.scroll.id:
        url = 'https://1rpc.io/scroll';
        break;
      case viemChains.harmonyOne.id:
        url = 'https://1rpc.io/one';
        break;
      case viemChains.okc.id:
        url = 'https://1rpc.io/oktc';
        break;
      case viemChains.gnosis.id:
        url = 'https://1rpc.io/gnosis';
        break;
      case viemChains.mantle.id:
        url = 'https://1rpc.io/mantle';
        break;
      case viemChains.cronos.id:
        url = 'https://1rpc.io/cro';
        break;
      case viemChains.opBNB.id:
        url = 'https://1rpc.io/opbnb';
        break;
      case viemChains.manta.id:
        url = 'https://1rpc.io/manta';
        break;
      case viemChains.coreDao.id:
        url = 'https://1rpc.io/core';
        break;
      case viemChains.telos.id:
        url = 'https://1rpc.io/telos/evm';
        break;
      case viemChains.boba.id:
        url = 'https://1rpc.io/boba/eth';
        break;
      case viemChains.kroma.id:
        url = 'https://1rpc.io/kroma';
        break;
      case viemChains.mode.id:
        url = 'https://1rpc.io/mode';
        break;
      case 7332: // Horizen EON
        url = 'https://1rpc.io/horizen-eon';
        break;
    }

    if (!url) {
      return [];
    }

    return [{ url }];
  }

  hasRpc(url: RpcUrl): boolean {
    return url.includes('flashbots.net');
  }

  getFeatures(): Array<RpcFeature> {
    return [
      'privacy',
      'free to use',
      'MEV protection',
      'phishing protection',
      'smart contract whitelist',
      'smart contract method checks',
    ];
  }
}
