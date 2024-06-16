// import * as sinon from "sinon";
import * as viemChains from 'viem/chains'

import { getChainById, getRandomString } from "../src";
import { ethers } from 'ethers';

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
        const chainInfo = await getChainById(chainId, {
          healthyCheckEnabled: true
        })
        console.log(`chainId: ${chainInfo.chainId}, rpc: ${chainInfo.rpc}, classifiedRpc: ${JSON.stringify(chainInfo.classifiedRpc)}`)

        expect(chainInfo.rpc.length).not.toEqual(0)

        const providers = chainInfo.rpc.map(url => {
          if (url.startsWith("http://") || url.startsWith("https://")) {
            return new ethers.JsonRpcProvider(url)
          } else /** if (url.startsWith("ws://") || url.startsWith("wss://")) */ {
            return new ethers.WebSocketProvider(url)
          }
        })
        
        const provider = new ethers.FallbackProvider(providers)
        
        const blockNumber = await provider.getBlockNumber()
        console.log(blockNumber)

        await provider.destroy()
        await Promise.all(providers.map(provider => provider.destroy()))
      }))
    }, 20_000)
  })
})