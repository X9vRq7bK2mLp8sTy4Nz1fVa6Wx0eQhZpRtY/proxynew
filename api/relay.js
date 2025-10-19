module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const body = req.body;
    if (!body || !body.encodedPayload) {
      return res.status(400).json({ error: 'Missing encodedPayload' });
    }

    // Decode base64 payload
    let payload;
    try {
      payload = JSON.parse(Buffer.from(body.encodedPayload, 'base64').toString('utf8'));
    } catch (e) {
      return res.status(400).json({ error: 'Invalid encoded payload' });
    }

    // Verify action
    if (payload.action !== 'get_script') {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Hardcoded script content (replace with GitHub fetch for production)
    const scriptContent = `print("PROTECTED SCRIPT LOADED!")\nprint("User:", game.Players.LocalPlayer.Name)`;

    // Encode response in base64
    const encodedResponse = Buffer.from(scriptContent).toString('base64');

    res.status(200).json({ encodedResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
