import { FlashbotsService, OneRpcService, ViemService } from './services'

export interface ClassifiedRpc {
    http: RPC[]
    https: RPC[]
    ws: RPC[]
    wss: RPC[]
}

export interface RPC {
    url: RpcUrl
    latency?: number // ms
    features?: Array<RpcFeature>
}

export type RpcUrl = `http://${string}` | `https://${string}` | `ws://${string}` | `wss://${string}`

export type RpcList = Array<RPC>

export type RpcFeatureFree = 'free to use'
export type RpcFeatureLoadBalance = 'load balance'
export type RpcFeaturePrivacy = 'privacy'
export type RpcFeatureMevProtection = 'MEV protection'
// e.g. [1RPC](https://www.1rpc.io/): Transaction sanitizers defend against phishing threats in Web3, in real-time.
// Anti-phishing rules. Malicious address scanning. Explorer contract verification.
export type RpcFeaturePhishingProtection = 'phishing protection'
// only whitelisted smart contract can be executed
export type RpcFeatureSmartContractWhitelist = 'smart contract whitelist'
export type RpcFeatureSmartContractMethodChecks = 'smart contract method checks'
export type RpcFeature =
    RpcFeatureFree
    | RpcFeatureLoadBalance
    | RpcFeaturePrivacy
    | RpcFeatureMevProtection
    | RpcFeaturePhishingProtection
    | RpcFeatureSmartContractWhitelist
    | RpcFeatureSmartContractMethodChecks

export interface RpcService {
    getRpcList: (chainId: number, apiKey?: string) => RpcList | Promise<RpcList>
    hasRpc?(url: RpcUrl): boolean
    getFeatures?(): Array<RpcFeature>
}

export const registeredRpcServices: Array<RpcService> = []

export function registerRpcService(service: RpcService): void {
    registeredRpcServices.push(service)
}

// register all pre-built rpc services
registerRpcService(new ViemService())
registerRpcService(new FlashbotsService())
registerRpcService(new OneRpcService())

export interface ApiKeys {
    INFURA_API_KEY?: string
    ALCHEMY_API_KEY?: string
    ANKR_API_KEY?: string
}

export interface Filters {
    features?: Array<RpcFeature>
}

export const RPC_TIMEOUT = 5_000

export * from './getRpcList'
export * from './utils'