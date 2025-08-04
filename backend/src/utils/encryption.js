const crypto = require('crypto');

// Генерация ключей для пользователя
const generateUserKeys = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  return { publicKey, privateKey };
};

// Шифрование сообщения
const encryptMessage = (message, publicKey) => {
  try {
    // Генерируем случайный ключ для AES
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // Шифруем сообщение с помощью AES
    const cipher = crypto.createCipher('aes-256-cbc', aesKey);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Шифруем AES ключ с помощью RSA публичного ключа
    const encryptedKey = crypto.publicEncrypt(publicKey, aesKey);

    // Возвращаем зашифрованные данные
    return {
      encryptedContent: encrypted,
      encryptedKey: encryptedKey.toString('base64'),
      iv: iv.toString('hex')
    };
  } catch (error) {
    console.error('Error encrypting message:', error);
    throw new Error('Failed to encrypt message');
  }
};

// Расшифровка сообщения
const decryptMessage = (encryptedData, privateKey) => {
  try {
    // Расшифровываем AES ключ
    const encryptedKey = Buffer.from(encryptedData.encryptedKey, 'base64');
    const aesKey = crypto.privateDecrypt(privateKey, encryptedKey);

    // Расшифровываем сообщение
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const decipher = crypto.createDecipher('aes-256-cbc', aesKey);
    let decrypted = decipher.update(encryptedData.encryptedContent, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Error decrypting message:', error);
    throw new Error('Failed to decrypt message');
  }
};

// Создание подписи сообщения
const signMessage = (message, privateKey) => {
  try {
    const sign = crypto.createSign('SHA256');
    sign.update(message);
    sign.end();
    return sign.sign(privateKey, 'base64');
  } catch (error) {
    console.error('Error signing message:', error);
    throw new Error('Failed to sign message');
  }
};

// Проверка подписи сообщения
const verifySignature = (message, signature, publicKey) => {
  try {
    const verify = crypto.createVerify('SHA256');
    verify.update(message);
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

// Создание хеша сообщения
const createMessageHash = (message, timestamp, senderId) => {
  const data = `${message}${timestamp}${senderId}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Генерация ключа для диалога
const generateConversationKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = {
  generateUserKeys,
  encryptMessage,
  decryptMessage,
  signMessage,
  verifySignature,
  createMessageHash,
  generateConversationKey
}; 