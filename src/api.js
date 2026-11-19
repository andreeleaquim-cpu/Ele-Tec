  // --- IA DE BANCADA COM GEMINI ---
  add('POST', '/api/ai/recommend', 'staff', async (req, ctx) => {
    const body = await req.json();
    const { brand, model, issue, question } = body;
    const apiKey = env.GEMINI_API_KEY || (typeof ctx !== 'undefined' && ctx.env?.GEMINI_API_KEY);

    const prompt = question 
      ? `Você é um técnico especialista em bancada de eletrônicos e smartphones. Responda à dúvida técnica de forma prática e direta: ${question}`
      : `Você é um especialista em bancada de assistência técnica de celulares e eletrônicos.
Aparelho: ${brand || ''} ${model || 'Aparelho'}
Defeito relatado: ${issue || 'Não especificado'}

Gere um diagnóstico técnico em português brasileiro com:
1. 🔍 Causa mais provável
2. 🛠️ Testes de bancada recomendados (ex: fonte assimétrica, multímetro, conector)
3. 📦 Possíveis peças de reposição
4. ⏱️ Grau de dificuldade e tempo estimado
Seja direto e prático em tópicos.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
    
    try {
      const res = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!res.ok) {
        return Response.json({ error: 'Erro ao consultar Gemini' }, { status: 500 });
      }

      const data = await res.json();
      const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta do Gemini.';
      return Response.json({ recommendation: texto });
    } catch (e) {
      return Response.json({ error: e.message }, { status: 500 });
    }
  });
