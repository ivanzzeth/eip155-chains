**eip155-chains** • [**Docs**](globals.md)

***

# unikvstore

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> Aggregate all eip155 chains in one place.

# Usage

```Typescript
import { ethers } from 'ethers';
import { getChainById } from 'eip155-chains';

const chainInfo = await getChainById(viemChains.baseSepolia.id)
console.log(`rpcs: `, chainInfo.rpc)

const providers = chainInfo.rpc.map(v => new ethers.JsonRpcProvider(v))
const provider = new ethers.FallbackProvider(providers)

const blockNumber = await provider.getBlockNumber()
console.log(blockNumber)
```

# Sources

EIP155ChainInfo sources:

- npm package `eth-chains`
- [chainid.network](https://chainid.network/chains.json) and cached it in repo

Rpc nodes sources:

- viem chains definition
- [chainid.network](https://chainid.network/chains.json)

[build-img]:https://github.com/ryansonshine/typescript-npm-package-template/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/ryansonshine/typescript-npm-package-template/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/typescript-npm-package-template
[downloads-url]:https://www.npmtrends.com/typescript-npm-package-template
[npm-img]:https://img.shields.io/npm/v/typescript-npm-package-template
[npm-url]:https://www.npmjs.com/package/typescript-npm-package-template
[issues-img]:https://img.shields.io/github/issues/ryansonshine/typescript-npm-package-template
[issues-url]:https://github.com/ryansonshine/typescript-npm-package-template/issues
[codecov-img]:https://codecov.io/gh/ryansonshine/typescript-npm-package-template/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/ryansonshine/typescript-npm-package-template
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
