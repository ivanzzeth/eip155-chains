import { ViemService } from './services'

export interface ClassifiedRpc {
    http: RPC[]
    https: RPC[]
    ws: RPC[]
    wss: RPC[]
}

export interface RPC {
    url: RpcUrl
    features?: Array<RpcFeature>
}

export type RpcUrl = `http://${string}` | `https://${string}` | `ws://${string}` | `wss://${string}`

export type RpcList = Array<RPC>

export type RpcFeaturePrivacy = 'privacy'
export type RpcFeatureMevProtection = 'MEV protection'
export type RpcFeatureLoadBalance = 'load balance'
export type RpcFeatureFree = 'free to use'
export type RpcFeature = RpcFeaturePrivacy | RpcFeatureMevProtection | RpcFeatureLoadBalance | RpcFeatureFree

export interface RpcService {
    getRpcList: (chainId: number) => RpcList | Promise<RpcList>
    hasRpc?(url: RpcUrl): boolean
    getFeatures?(): Array<RpcFeature>
}

export const registeredRpcServices: Array<RpcService> = []

export function registerRpcService(service: RpcService): void {
    registeredRpcServices.push(service)
}

// register all pre-built rpc services
registerRpcService(new ViemService())

export interface ApiKeys {
    INFURA_API_KEY?: string
    ALCHEMY_API_KEY?: string
    ANKR_API_KEY?: string
}

export const RPC_TIMEOUT = 5_000

export * from './getRpcList'
export * from './utils'