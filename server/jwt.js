const crypto = require('crypto');

class JWT {
  constructor(secret) {
    this.secret = secret;
  }

  generate(data) {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedData = this.base64UrlEncode(JSON.stringify(data));

    const signatureInput = encodedHeader + '.' + encodedData;
    const signature = this.generateSignature(signatureInput);

    return `${encodedHeader}.${encodedData}.${signature}`;
  }

  verify(token) {
    const [encodedHeader, encodedData, signature] = token.split('.');

    const signatureInput = encodedHeader + '.' + encodedData;
    const expectedSignature = this.generateSignature(signatureInput);

    return {
      verified: signature === expectedSignature, 
      data: this.base64UrlDecode(encodedData) ? this.base64UrlDecode(encodedData) : null
    };
  }

  base64UrlEncode(data) {
    const base64 = Buffer.from(data).toString('base64');
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  base64UrlDecode(encoded) {
    encoded = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const paddingLength = 4 - (encoded.length % 4);
    if (paddingLength !== 4) {
      encoded += '='.repeat(paddingLength);
    }
    return Buffer.from(encoded, 'base64').toString('utf-8');
  }

  generateSignature(data) {
    return crypto.createHmac('sha256', this.secret).update(data).digest('base64');
  }
}

/*
const jwt = new JWT('your-secret-key');

const token = jwt.generate({ });

const isValid = jwt.verify(token);
*/

module.exports = { JWT };