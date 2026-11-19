/* ==========================================================================
   ✨ ASSISTENTE IA DE BANCADA (GEMINI) - ELE-TEC
   ========================================================================== */
(function() {
  // 1. Cria o botão flutuante no canto inferior direito
  const btn = document.createElement('button');
  btn.id = 'btn-ia-flutuante';
  btn.innerHTML = '✨ Assistente IA';
  btn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#4f46e5;color:#fff;border:none;border-radius:30px;padding:12px 20px;font-size:14px;font-weight:bold;cursor:pointer;box-shadow:0 4px 15px rgba(79,70,229,0.4);z-index:99999;transition:all 0.2s;';
  btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
  btn.onmouseout = () => btn.style.transform = 'scale(1)';
  document.body.appendChild(btn);

  // 2. Cria a janela do Assistente
  const modal = document.createElement('div');
  modal.id = 'modal-ia-assistente';
  modal.style.cssText = 'display:none;position:fixed;bottom:75px;right:20px;width:380px;max-height:540px;background:#fff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.25);z-index:99999;flex-direction:column;overflow:hidden;font-family:sans-serif;border:1px solid #e2e8f0;';
  modal.innerHTML = `
    <div style="background:#4f46e5;color:#fff;padding:14px;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-weight:bold;font-size:15px;">🤖 Assistente de Bancada Gemini</span>
      <span id="fechar-ia" style="cursor:pointer;font-size:18px;line-height:1;">&times;</span>
    </div>
    <div style="padding:15px;overflow-y:auto;flex:1;">
      <label style="font-size:12px;font-weight:bold;color:#475569;">Aparelho (Marca / Modelo):</label>
      <input type="text" id="ia-aparelho" placeholder="Ex: Samsung A12, iPhone 11" style="width:100%;padding:8px;margin:4px 0 10px;border:1px solid #cbd5e1;border-radius:6px;box-sizing:border-box;">

      <label style="font-size:12px;font-weight:bold;color:#475569;">Defeito ou Dúvida Técnica:</label>
      <textarea id="ia-defeito" rows="3" placeholder="Ex: Não carrega e esquenta / Como testar curto?" style="width:100%;padding:8px;margin:4px 0 10px;border:1px solid #cbd5e1;border-radius:6px;box-sizing:border-box;font-family:inherit;"></textarea>

      <button id="ia-consultar-btn" style="width:100%;background:#4f46e5;color:#fff;padding:10px;border:none;border-radius:6px;font-weight:bold;cursor:pointer;">
        🔍 Analisar com Gemini
      </button>

      <div id="ia-resultado" style="margin-top:12px;padding:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;line-height:1.4;display:none;white-space:pre-wrap;color:#1e293b;"></div>
      
      <button id="ia-copiar-btn" style="width:100%;background:#10b981;color:#fff;padding:8px;border:none;border-radius:6px;font-weight:bold;cursor:pointer;margin-top:8px;display:none;">
        📋 Copiar Laudo para a Área de Transferência
      </button>
    </div>
  `;
  document.body.appendChild(modal);

  // 3. Ações de abrir e fechar
  btn.onclick = () => {
    modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
  };
  document.getElementById('fechar-ia').onclick = () => {
    modal.style.display = 'none';
  };

  // 4. Executa a análise com Gemini
  document.getElementById('ia-consultar-btn').onclick = async () => {
    const model = document.getElementById('ia-aparelho').value.trim();
    const issue = document.getElementById('ia-defeito').value.trim();
    const resBox = document.getElementById('ia-resultado');
    const copyBtn = document.getElementById('ia-copiar-btn');
    const consultBtn = document.getElementById('ia-consultar-btn');

    if (!issue && !model) {
      alert('Digite o aparelho ou o defeito relatado!');
      return;
    }

    consultBtn.innerText = 'Consultando Gemini... ⏳';
    consultBtn.disabled = true;
    resBox.style.display = 'block';
    resBox.innerText = 'Analisando histórico de bancada...';
    copyBtn.style.display = 'none';

    try {
      const resp = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, issue })
      });
      const data = await resp.json();
      if (data.recommendation) {
        resBox.innerText = data.recommendation;
        copyBtn.style.display = 'block';
      } else {
        resBox.innerText = 'Erro: ' + (data.error || 'Não foi possível analisar.');
      }
    } catch (e) {
      resBox.innerText = 'Erro de conexão: ' + e.message;
    } finally {
      consultBtn.innerText = '🔍 Analisar com Gemini';
      consultBtn.disabled = false;
    }
  };

  // 5. Botão de copiar laudo
  document.getElementById('ia-copiar-btn').onclick = () => {
    const texto = document.getElementById('ia-resultado').innerText;
    navigator.clipboard.writeText(texto).then(() => {
      const b = document.getElementById('ia-copiar-btn');
      b.innerText = '✅ Copiado!';
      setTimeout(() => b.innerText = '📋 Copiar Laudo para a Área de Transferência', 2000);
    });
  };
})();
