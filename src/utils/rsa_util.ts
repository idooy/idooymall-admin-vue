import { JSEncrypt } from 'jsencrypt'
import { reqPublicKey } from '@/api/user/login';


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
export const encryption = async(text: string) => {
    let encryptText = text
    await reqPublicKey().then(pubKey => {
        const formattedPubKey = formatPublicKey(pubKey)
        let encryptor = new JSEncrypt()
        encryptor.getPublicKeyB64()
        encryptor.setKey(formattedPubKey);
        encryptText = encryptor.encrypt(text) as string
    })
    return encryptText;
}