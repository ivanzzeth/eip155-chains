[**eip155-chains**](../README.md) • **Docs**

***

[eip155-chains](../globals.md) / RpcService

# Interface: RpcService

## Properties

### getRpcList()

> **getRpcList**: (`chainId`, `apiKey`?) => [`RpcList`](../type-aliases/RpcList.md) \| `Promise`\<[`RpcList`](../type-aliases/RpcList.md)\>

#### Parameters

• **chainId**: `number`

• **apiKey?**: `string`

#### Returns

[`RpcList`](../type-aliases/RpcList.md) \| `Promise`\<[`RpcList`](../type-aliases/RpcList.md)\>

#### Source

[src/rpc/index.ts:40](https://github.com/ivanzzeth/eip155-chains/blob/400ef11db8a06981938f7415f945494cf060a7cb/src/rpc/index.ts#L40)

## Methods

### getFeatures()?

> `optional` **getFeatures**(): [`RpcFeature`](../type-aliases/RpcFeature.md)[]

#### Returns

[`RpcFeature`](../type-aliases/RpcFeature.md)[]

#### Source

[src/rpc/index.ts:42](https://github.com/ivanzzeth/eip155-chains/blob/400ef11db8a06981938f7415f945494cf060a7cb/src/rpc/index.ts#L42)

***

### hasRpc()?

> `optional` **hasRpc**(`url`): `boolean`

#### Parameters

• **url**: [`RpcUrl`](../type-aliases/RpcUrl.md)

#### Returns

`boolean`

#### Source

[src/rpc/index.ts:41](https://github.com/ivanzzeth/eip155-chains/blob/400ef11db8a06981938f7415f945494cf060a7cb/src/rpc/index.ts#L41)
