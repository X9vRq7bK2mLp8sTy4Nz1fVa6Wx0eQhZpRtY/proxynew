const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
function genEp(s, i) {
  let e = '', t = s + i * 7919;
  for (let j = 0; j < 8; j++) {
    t = (t * 16807) % 2147483647;
    e += chars[t % 36];
  }
  return e;
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
    if (!body || !body.e) {
      return res.status(400).json({ error: 'Missing key' });
    }

    const seed = Math.floor((Date.now() / 1000 - 1704067200) / 3600);
    const validKey = genEp(seed, 0);
    if (body.e !== validKey) {
      return res.status(401).json({ error: 'Invalid key' });
    }

    const scriptContent = `print("PROTECTED SCRIPT LOADED!")\nprint("User:", game.Players.LocalPlayer.Name)`;
    res.status(200).json({ script: scriptContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
