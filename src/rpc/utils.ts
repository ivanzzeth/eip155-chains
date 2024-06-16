import { ClassifiedRpc, RpcList } from "."

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

export function isValidRpcProtocol(rpc: string): boolean {
    return rpc.startsWith("http://") || rpc.startsWith("https://") || rpc.startsWith("ws://") || rpc.startsWith("wss://")
}