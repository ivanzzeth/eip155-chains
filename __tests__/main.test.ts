// import * as sinon from "sinon";
import * as viemChains from 'viem/chains'

import { getChainById, getRandomString } from "../src";
import { getEthersProvider } from '../src/provider';
import { Options } from '../dist';

const crypto = require('crypto');

Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr: string | any[]) => crypto.randomBytes(arr.length)
  }
});

describe("Utils", function () {
  describe("test getRandomString", function () {
    it("not equal", async function () {
      const v1 = getRandomString();
      const v2 = getRandomString();
      expect(v1).not.toEqual(v2);
    });
  })
})

describe("index", function () {
  describe("test getChain", function () {
    it("should get correct block number", async function () {
      const chainIds = [
        viemChains.mainnet.id,
        viemChains.sepolia.id,
        viemChains.baseSepolia.id,
        viemChains.base.id,
        viemChains.arbitrumSepolia.id,
        viemChains.arbitrum.id,
        viemChains.opBNBTestnet.id,
        viemChains.opBNB.id,
        viemChains.mantleSepoliaTestnet.id,
        viemChains.mantle.id
      ]
      await Promise.all(chainIds.map(async function (chainId) {
        const options: Options = {
          healthyCheckEnabled: true
        }

        const chainInfo = await getChainById(chainId, options)
        console.log(`chainId: ${chainInfo.chainId}, rpc: ${chainInfo.rpc}, classifiedRpc: ${JSON.stringify(chainInfo.classifiedRpc)}`)

        expect(chainInfo.rpc.length).not.toEqual(0)

        const [provider, stop] = await getEthersProvider(chainId, options)
        
        const blockNumber = await provider.getBlockNumber()
        expect(blockNumber).toBeGreaterThan(0)

        await stop()
      }))
    }, 20_000)
  })
})