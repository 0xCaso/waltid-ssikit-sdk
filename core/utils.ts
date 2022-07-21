import axios from 'axios';

type Call = "GET" | "POST" | "DELETE" | "PUT";
type Port = 7000 | 7001 | 7002 | 7003 | 7004;

export const apiPorts: { [key: string]: Port } = {
    Core: 7000,
    Signatory: 7001,
    Custodian: 7002,
    Auditor: 7003,
    ESSIF: 7004,
}

export async function callAPI(
    type: Call,
    port: Port,
    url: string,
    params?: object
): 
    Promise<any> 
{
    let response
    let config = params;
    if (type === "GET") {
        response = await axios.get(`http://0.0.0.0:${port}${url}`, config);
    } else 
    if (type === "POST") {
        response = await axios.post(`http://0.0.0.0:${port}${url}`, config);
    } else 
    if (type === "DELETE") {
        response = await axios.delete(`http://0.0.0.0:${port}${url}`, config);
    } else
    if (type === "PUT") {
        response = await axios.put(`http://0.0.0.0:${port}${url}`, config);
    }
    return response
}

export class Key {
    public id: string;

    constructor(_id: string) {
        this.id = _id;
    }
}


