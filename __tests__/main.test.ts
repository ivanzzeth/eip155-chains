// import * as sinon from "sinon";
// import * as viemChains from 'viem/chains'

import { getChainById, getRandomString } from "../src";

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
      const chainInfo = await getChainById(5003)
      console.log(`rpcs: `, chainInfo.rpc)

      expect(chainInfo.rpc.length).not.toEqual(0)
    })
  })
})