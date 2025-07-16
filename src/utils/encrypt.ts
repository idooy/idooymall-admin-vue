// 对敏感信息进行RSA加密处理
import { JSEncrypt } from 'jsencrypt'
import { reqPubKey } from '@/api/encrypt/index.ts';



// 公钥进行格式化
const formatPublicKey = (pubKey: string): string => {
    const publicKey_pem = `
        -----BEGIN PUBLIC KEY-----
        ${pubKey}
        -----END PUBLIC KEY-----
        `;
    return publicKey_pem
}

/**
 * RSA加密操作
 * @param text 明文 
 * @returns 
 */
export const encryption = async (text: string) => {
    const pubKey: string = await reqPubKey()
    const formattedPubKey = formatPublicKey(pubKey)
    let encryptor = new JSEncrypt()
    encryptor.setKey(formattedPubKey);
    return encryptor.encrypt(text) as string
}