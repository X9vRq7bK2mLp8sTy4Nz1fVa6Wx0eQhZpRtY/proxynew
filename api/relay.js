const crypto = require('crypto');

// AES key and IV (replace with secure values)
const AES_KEY = process.env.AES_KEY || 'your-32-byte-secret-key-here-1234'; // 32 bytes
const AES_IV = process.env.AES_IV || 'your-16-byte-iv-here'; // 16 bytes

// AES encrypt
function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(AES_KEY), Buffer.from(AES_IV));
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

// AES decrypt
function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(AES_KEY), Buffer.from(AES_IV));
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const body = req.body;
    if (!body || !body.encryptedPayload) {
      return res.status(400).json({ error: 'Missing encryptedPayload' });
    }

    // Decrypt payload
    let payload;
    try {
      payload = JSON.parse(decrypt(body.encryptedPayload));
    } catch (e) {
      return res.status(400).json({ error: 'Invalid encrypted payload' });
    }

    // Verify action
    if (payload.action !== 'get_script') {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Read scripts/EXAMPLE.lua from GitHub (in production, use GitHub API or local file)
    const scriptContent = `print("PROTECTED SCRIPT LOADED!")\nprint("User:", game.Players.LocalPlayer.Name)`;

    // Encrypt response
    const encryptedResponse = encrypt(scriptContent);

    res.status(200).json({ encryptedResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
