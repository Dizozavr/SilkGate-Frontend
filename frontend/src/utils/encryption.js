// Утилиты шифрования для frontend (демо-версия)
// В реальной версии здесь будет настоящая криптография

// Генерация ключей для пользователя
export const generateUserKeys = () => {
  // В реальной версии здесь будет генерация RSA ключей
  const publicKey = 'demo-public-key-' + Date.now();
  const privateKey = 'demo-private-key-' + Date.now();
  
  return { publicKey, privateKey };
};

// Шифрование сообщения (демо)
export const encryptMessage = (message, publicKey) => {
  try {
    // В реальной версии здесь будет настоящее шифрование
    const encrypted = btoa(message + '|' + publicKey + '|' + Date.now());
    return {
      encryptedContent: encrypted,
      encryptedKey: btoa('demo-key'),
      iv: btoa('demo-iv')
    };
  } catch (error) {
    console.error('Error encrypting message:', error);
    throw new Error('Failed to encrypt message');
  }
};

// Расшифровка сообщения (демо)
export const decryptMessage = (encryptedData, privateKey) => {
  try {
    // В реальной версии здесь будет настоящая расшифровка
    const decrypted = atob(encryptedData.encryptedContent);
    const parts = decrypted.split('|');
    return parts[0]; // Возвращаем только сообщение
  } catch (error) {
    console.error('Error decrypting message:', error);
    throw new Error('Failed to decrypt message');
  }
};

// Создание подписи сообщения (демо)
export const signMessage = (message, privateKey) => {
  try {
    // В реальной версии здесь будет настоящая подпись
    return btoa(message + '|' + privateKey + '|' + Date.now());
  } catch (error) {
    console.error('Error signing message:', error);
    throw new Error('Failed to sign message');
  }
};

// Проверка подписи сообщения (демо)
export const verifySignature = (message, signature, publicKey) => {
  try {
    // В реальной версии здесь будет настоящая проверка
    const decoded = atob(signature);
    return decoded.includes(message);
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

// Создание хеша сообщения
export const createMessageHash = (message, timestamp, senderId) => {
  const data = `${message}${timestamp}${senderId}`;
  // Простой хеш для демо
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
};

// Генерация ключа для диалога
export const generateConversationKey = () => {
  return 'demo-conversation-key-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}; 