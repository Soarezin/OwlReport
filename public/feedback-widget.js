(function () {
  // CSS embutido
  const css = `
    #replayflow-feedback-btn {
      position: fixed;
      right: 0;
      top: 40%;
      writing-mode: vertical-rl;
      background: #4f46e5;
      color: white;
      padding: 10px 5px;
      border-radius: 8px 0 0 8px;
      font-size: 14px;
      cursor: pointer;
      z-index: 1000;
    }

    #replayflow-modal {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 350px;
      background: #18181b;
      border-radius: 12px;
      border: 1px solid #2e2e33;
      box-shadow: 0 0 16px rgba(0, 0, 0, 0.6);
      color: #fff;
      padding: 20px;
      z-index: 1001;
      display: none;
      font-family: sans-serif;
    }

    #replayflow-modal input,
    #replayflow-modal textarea,
    #replayflow-modal select {
      width: 100%;
      margin: 6px 0;
      padding: 8px;
      background: #0f0f10;
      color: #fff;
      border: 1px solid #333;
      border-radius: 6px;
    }

    #replayflow-modal button {
      width: 100%;
      padding: 10px;
      background: #6366f1;
      border: none;
      color: white;
      font-weight: bold;
      border-radius: 6px;
      margin-top: 12px;
      cursor: pointer;
    }

    #replayflow-modal .close-btn {
      position: absolute;
      top: 10px;
      right: 14px;
      font-size: 18px;
      cursor: pointer;
    }

    #replayflow-modal a {
      color: #a5b4fc;
      text-decoration: none;
    }
  `;
  const style = document.createElement("style");
  style.innerText = css;
  document.head.appendChild(style);

  // Botão lateral
  const button = document.createElement("div");
  button.id = "replayflow-feedback-btn";
  button.innerText = "Feedback";
  button.onclick = () => {
    modal.style.display = "block";
  };

  // Modal com formulário
  const modal = document.createElement("div");
  modal.id = "replayflow-modal";
  modal.innerHTML = `
    <div class="close-btn" onclick="document.getElementById('replayflow-modal').style.display='none'">×</div>
    <h3 style="margin-bottom: 8px;">Deixe-nos um feedback</h3>
    <select>
      <option>Erro</option>
      <option>Ideia</option>
      <option>Outro</option>
    </select>
    <input type="text" placeholder="Nome" />
    <input type="email" placeholder="E-mail" />
    <textarea rows="3" placeholder="Deixe-nos um comentário"></textarea>
    <label style="font-size: 14px;">📸 Screenshot (simulado)</label>
    <button onclick="alert('Feedback enviado (simulado)')">Enviar feedback</button>
    <p style="font-size: 11px; text-align: center; margin-top: 10px;">
      Powered by <a href="https://logaflow.com" target="_blank">LogaFlow</a>
    </p>
  `;

  document.body.appendChild(button);
  document.body.appendChild(modal);

  // Gravação com rrweb
  const ReplayFlow = {
    config: {
      appId: "demo",
      user: { id: "widget-user", email: "user@email.com" },
      endpoint: "http://localhost:3000/api/sessions"
    },
    events: [],
    startTime: Date.now(),

    startRecording: function () {
      window.rrweb.record({
        emit: (event) => this.events.push(event),
        maskAllInputs: false,
        maskInputOptions: { password: true }
      });

      window.addEventListener("beforeunload", () => this.sendSession());
    },

    sendSession: function () {
      if (!this.events.length) return;
      const payload = {
        projectId: this.config.appId,
        user: this.config.user,
        meta: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          resolution: `${window.innerWidth}x${window.innerHeight}`,
          language: navigator.language
        },
        events: this.events,
        startTime: this.startTime,
        endTime: Date.now()
      };

      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon(this.config.endpoint, blob);
    }
  };

  // Carrega rrweb dinamicamente
  const rrwebScript = document.createElement("script");
  rrwebScript.src = "https://cdn.jsdelivr.net/npm/rrweb@1.1.3/dist/rrweb.min.js";
  rrwebScript.onload = () => ReplayFlow.startRecording();
  document.head.appendChild(rrwebScript);
})();
