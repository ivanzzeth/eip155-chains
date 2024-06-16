import { ClassifiedRpc, registeredRpcServices, RPC, RpcFeature, RpcList } from "."

export function splitRpcsByProtocol(rpcs: RpcList): ClassifiedRpc {
    const classifiedRpc: ClassifiedRpc = {
        http: [],
        https: [],
        ws: [],
        wss: []
    }

    for (const rpc of rpcs) {
        if (rpc.url.startsWith("http://")) {
            classifiedRpc.http.push(rpc)
        } else if (rpc.url.startsWith("https://")) {
            classifiedRpc.https.push(rpc)
        } else if (rpc.url.startsWith("ws://")) {
            classifiedRpc.ws.push(rpc)
        } else if (rpc.url.startsWith("wss://")) {
            classifiedRpc.wss.push(rpc)
        }
    }

    return classifiedRpc
}

export function fulfillRpcFeatures(rpcs: RpcList): void {
    for (const rpc of rpcs) {
        for (const service of registeredRpcServices) {
            if (service.hasRpc && service.getFeatures && service.hasRpc(rpc.url)) {
                rpc.features = service.getFeatures()
                break
            }
        }
    }
}

export function filterRpcListByFeatures(rpcs: RpcList, features?: Array<RpcFeature>): RpcList {
    if (!features || features.length == 0) {
        return rpcs
    }

    const res = new Array<RPC>()
    for (const rpc of rpcs) {
        let count = 0
        for (const feature of features) {
            if (rpc.features && rpc.features.includes(feature)) {
                count++
            }
        }

        if (count == features.length) {
            res.push(rpc)
        }
    }

    return res
}

export function isValidRpcProtocol(rpc: string): boolean {
    return rpc.startsWith("http://") || rpc.startsWith("https://") || rpc.startsWith("ws://") || rpc.startsWith("wss://")
}