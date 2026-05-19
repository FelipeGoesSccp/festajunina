const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método não permitido' });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Variáveis de ambiente do Supabase não configuradas.' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { categoria } = req.query;

  try {
    let query = supabase
      .from('produtos')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true });

    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.status(200).json({ produtos: data });
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    return res.status(500).json({ error: err.message || 'Erro interno ao buscar produtos' });
  }
};
