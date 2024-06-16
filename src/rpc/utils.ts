import { ClassifiedRpc, registeredRpcServices, RpcList } from "."

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

export function isValidRpcProtocol(rpc: string): boolean {
    return rpc.startsWith("http://") || rpc.startsWith("https://") || rpc.startsWith("ws://") || rpc.startsWith("wss://")
}