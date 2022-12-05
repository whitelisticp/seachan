import { Web3Storage } from 'web3.storage'

export async function web3StorageUploadFile(data) {
    const apiToken = import.meta.env.VITE_WEB3_STORAGE_API;
    const storage = new Web3Storage({ token: apiToken });
    try {
        const cid = await storage.put(data.file, { wrapWithDirectory: false, maxRetries: 5 });
        const filePath = "https://dweb.link/ipfs/" + cid
        return filePath;
    } catch (e) {
        alert("file did not upload properly", e);
    }
}