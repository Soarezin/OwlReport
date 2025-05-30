// OwlReport Feedback Widget
const css = `
  #owlreport-feedback-btn {
    position: fixed;
    right: 0;
    top: 40%;
    writing-mode: vertical-rl;
    background: #4f46e5;
    color: white;
    padding: 10px 5px;
    border-radius: 8px 0 0 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 0 10px rgba(79, 70, 229, 0.5);
    transition: background 0.3s;
  }

  #owlreport-feedback-btn:hover {
    background: #6366f1;
  }

  #owlreport-modal {
    position: fixed;
    inset: 0;
    display: none;
    justify-content: flex-end;
    z-index: 2001;
    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: blur(2px);
  }

  #owlreport-modal-content {
    width: 360px;
    margin: 20px;
    background: #111C2D;
    border: 1px solid #38bdf86b;
    border-radius: 16px;
    padding: 24px;
    font-family: 'Inter', sans-serif;
    color: #f1f5f9;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: absolute;
    box-shadow: 0 0 20px rgba(0,0,0,0.6);
    animation: slideIn 0.3s ease-out;
    right:0;
    bottom: 0;
  }

  #owlreport-modal-content h3 {
    margin: 0 0 6px;
    font-size: 18px;
  }

  #owlreport-modal-content label {
    font-size: 14px;
    color: #cbd5e1;
    margin-top: 6px;
  }

  #owlreport-modal-content select,
  #owlreport-modal-content textarea {
    width: 100%;
    padding: 10px;
    background-color: #0f172a;
    color: #e2e8f0;
    border: 1px solid #334155;
    border-radius: 8px;
    font-size: 14px;
  }

  #owlreport-modal-content textarea {
    resize: vertical;
  }

  #owlreport-modal-content button {
    width: 100%;
    padding: 12px;
    background: #6366f1;
    border: none;
    color: white;
    font-weight: bold;
    border-radius: 8px;
    margin-top: 12px;
    cursor: pointer;
    transition: background 0.3s;
  }

  #owlreport-modal-content button:hover {
    background: #4f46e5;
  }

  #owlreport-modal-content .close-btn {
    position: absolute;
    top: 12px;
    right: 14px;
    font-size: 20px;
    font-weight: bold;
    color: #9ca3af;
    cursor: pointer;
  }

  #owlreport-modal-content .close-btn:hover {
    color: #e2e8f0;
  }

  #owlreport-status {
    font-size: 12px;
    text-align: center;
    margin-top: 8px;
    color: #94a3b8;
  }

  @keyframes slideIn {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;


(function () {
    let publicKey = null;
    let settings = {};

    let currentScript = document.currentScript || [...document.querySelectorAll('script[src*="test-rrweb.js"]')].pop();
    const projectToken = currentScript?.getAttribute('data-project-token') || "";

    async function loadPublicKey() {
        const res = await fetch("http://localhost:5043/report/public-key", {
            headers: { projectToken }
        });
        if (!res.ok) throw new Error("Erro ao buscar chave pública: " + res.status);
        const pubKeyJson = await res.json();
        settings = {
            blockConsoleLogs: pubKeyJson.blockConsoleLogs,
            blockNetworkLogs: pubKeyJson.blockNetworkLogs,
            blockReplayLogs: pubKeyJson.blockReplayLogs,
            blockedUrls: pubKeyJson.blockedurl || [],
            severities: pubKeyJson.severities || [],
            categories: pubKeyJson.categories || [],
        };
        populateSelect("owlreport-category", pubKeyJson.categories || []);
        populateSelect("owlreport-severity", pubKeyJson.severities || []);
        const pem = pubKeyJson.token.replace(/-----.*-----|\n/g, "");
        const binaryDer = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
        publicKey = await crypto.subtle.importKey("spki", binaryDer, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]);
    }

    //HTML
    document.head.appendChild(Object.assign(document.createElement("style"), { innerText: css }));
    function populateSelect(id, items) {
        const select = document.getElementById(id);
        select.innerHTML = ""; // limpa tudo

        // Adiciona a opção padrão
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Selecionar...";
        select.appendChild(defaultOption);

        for (const item of items) {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name;
            select.appendChild(option);
        }
    }

    const button = Object.assign(document.createElement("div"), {
        id: "owlreport-feedback-btn",
        innerText: "Reportar"
    });

    const modal = document.createElement("div");
    modal.id = "owlreport-modal";
    modal.innerHTML = `
  <div id="owlreport-modal-content">
    <div class="close-btn" onclick="document.getElementById('owlreport-modal').style.display='none'">&times;</div>
    <h3>Deixe-nos um feedback</h3>

    <div class="form-group">
      <label for="owlreport-category">Categoria</label>
      <select id="owlreport-category" required>
        <option value="">Selecionar...</option>
      </select>
    </div>

    <div class="form-group">
      <label for="owlreport-severity">Severidade</label>
      <select id="owlreport-severity" required>
        <option value="">Selecionar...</option>
      </select>
    </div>

    <div class="form-group">
      <label for="owlreport-comment">Comentário</label>
      <textarea id="owlreport-comment" rows="4" placeholder="Deixe seu comentário aqui..."></textarea>
    </div>

    <button id="owlreport-send">Enviar feedback</button>

    <p id="owlreport-status"></p>
  </div>
`;
    // Intercepta console
    if (!window.__consoleHooked) {
        window.__consoleHooked = true;
        window.consoleLogs = [];
        const addLog = (log) => { if (consoleLogs.length >= 200) consoleLogs.shift(); consoleLogs.push(log); };
        ["log", "warn", "error", "info"].forEach((level) => {
            const original = console[level];
            console[level] = function (...args) {
                addLog({ level, message: args.map(String).join(" "), rawArgs: args, timestamp: new Date().toISOString() });
                original.apply(console, args);
            };
        });
        window.addEventListener("error", e => addLog({ level: "error", message: `Uncaught: ${e.message} at ${e.filename}:${e.lineno}:${e.colno}`, timestamp: new Date().toISOString() }));
        window.addEventListener("unhandledrejection", e => addLog({ level: "error", message: `Unhandled Promise rejection: ${e.reason}`, timestamp: new Date().toISOString() }));
    }

    // Intercepta HTTP
    if (!window.__httpHooked) {
        window.__httpHooked = true;
        window.httpLogs = [];
        const addHttpLog = (log) => { if (httpLogs.length >= 100) httpLogs.shift(); httpLogs.push(log); };

        const origXhrOpen = XMLHttpRequest.prototype.open;
        const origXhrSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            this._method = method;
            this._url = url;
            return origXhrOpen.apply(this, [method, url, ...rest]);
        };
        XMLHttpRequest.prototype.send = function (body) {
            const xhr = this;
            const reqHeaders = [];
            const origSetHeader = xhr.setRequestHeader;
            xhr.setRequestHeader = function (k, v) { reqHeaders.push({ key: k, value: v }); return origSetHeader.apply(this, arguments); };
            xhr.addEventListener("loadend", function () {
                const resHeaders = []; xhr.getAllResponseHeaders().trim().split(/\r?\n/).forEach(l => {
                    const p = l.split(": "); if (p.length === 2) resHeaders.push({ key: p[0], value: p[1] });
                });
                let body = null; try { body = JSON.parse(xhr.responseText); } catch { body = xhr.responseText; }
                addHttpLog({ type: "xhr", method: xhr._method, url: xhr._url, status: xhr.status, statusText: xhr.statusText, timestamp: new Date().toISOString(), requestHeaders: reqHeaders, responseHeaders: resHeaders, responseBody: body });
            });
            return origXhrSend.apply(this, arguments);
        };

        const origFetch = window.fetch;
        window.fetch = async function (...args) {
            const [input, init] = args;
            const method = init?.method || "GET";
            const url = typeof input === "string" ? input : input.url;
            const reqHeaders = [];
            if (init?.headers) {
                const h = init.headers instanceof Headers ? Object.fromEntries(init.headers.entries()) : init.headers;
                for (const k in h) reqHeaders.push({ key: k, value: h[k] });
            }
            const start = new Date().toISOString();
            try {
                const res = await origFetch(...args);
                const clone = res.clone();
                const type = clone.headers.get("Content-Type") || "";
                const resHeaders = []; clone.headers.forEach((v, k) => resHeaders.push({ key: k, value: v }));
                const body = type.includes("json") ? await clone.json() : await clone.text();
                addHttpLog({ type: "fetch", method, url, status: res.status, statusText: res.statusText, timestamp: start, requestHeaders: reqHeaders, responseHeaders: resHeaders, responseBody: body });
                return res;
            } catch (err) {
                addHttpLog({ type: "fetch", method, url, status: 0, statusText: "Network Error", timestamp: start, requestHeaders: reqHeaders, responseHeaders: [], responseBody: String(err) });
                throw err;
            }
        };
    }

    const rrwebScript = document.createElement("script");
    rrwebScript.src = "https://cdn.jsdelivr.net/npm/rrweb@1.1.3/dist/rrweb.min.js";

    rrwebScript.onload = async () => {
        try {
            await loadPublicKey();

            const events = [];
            const stopRecording = !settings.blockReplayLogs
                ? rrweb.record({ emit: e => events.push(e) })
                : null;

            const sendBtn = document.getElementById("owlreport-send");
            if (!sendBtn) return;

            sendBtn.addEventListener("click", async () => {
                const statusMsg = modal.querySelector("p");

                stopRecording && stopRecording();

                const comment = document.getElementById("owlreport-comment")?.value || "";
                const categoryId = document.getElementById("owlreport-category")?.value || "";
                const severityId = document.getElementById("owlreport-severity")?.value || "";

                statusMsg.innerText = "";
                if (!categoryId || !severityId) {
                    statusMsg.innerText = "Por favor, selecione categoria e severidade.";
                    return;
                }

                const rawPayload = {
                    replay: [{ events }],
                    consoleLogs: window.consoleLogs || [],
                    httpLogs: window.httpLogs || []
                };

                const reportRequest = {
                    token: projectToken,
                    pageUrl: location.href,
                    userComment: comment,
                    userAgent: navigator.userAgent,
                    categoryId,
                    severityId,
                    rawPayload
                };

                try {
                    const fullJson = JSON.stringify(reportRequest);
                    const encoder = new TextEncoder();
                    const data = encoder.encode(fullJson);
                    const aesKey = window.crypto.getRandomValues(new Uint8Array(32));
                    const iv = window.crypto.getRandomValues(new Uint8Array(12));

                    const aesCryptoKey = await window.crypto.subtle.importKey("raw", aesKey, "AES-GCM", false, ["encrypt"]);
                    const encryptedData = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesCryptoKey, data);

                    const encryptedKey = await window.crypto.subtle.encrypt(
                        { name: "RSA-OAEP" },
                        publicKey,
                        aesKey
                    );

                    function toBase64(arrayBuffer) {
                        const uint8Array = new Uint8Array(arrayBuffer);
                        let binary = '';
                        for (let i = 0; i < uint8Array.length; i++) {
                            binary += String.fromCharCode(uint8Array[i]);
                        }
                        return btoa(binary);
                    }

                    const payload = {
                        encryptedKey: toBase64(encryptedKey),
                        encryptedData: toBase64(encryptedData),
                        iv: toBase64(iv)
                    }

                    fetch("http://localhost:5043/report/log", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            projectToken: reportRequest.token
                        },
                        body: JSON.stringify(payload)
                    }).then(res => {
                        statusMsg.style.color = res.ok ? "#22c55e" : "#f87171";
                        statusMsg.textContent = res.ok ? "Feedback enviado com sucesso!" : "Erro ao enviar feedback.";

                        if (res.ok) {
                            document.getElementById("owlreport-status").innerText = "Feedback enviado com sucesso!";

                            setTimeout(() => {
                                modal.style.display = "none";
                                document.getElementById("owlreport-category").value = "";
                                document.getElementById("owlreport-severity").value = "";
                                document.getElementById("owlreport-comment").value = "";
                                document.getElementById("owlreport-status").innerText = "";
                            }, 1500);
                        } else {
                            res.text().then(err => alert("Erro ao enviar feedback: " + err));
                        }
                    })


                } catch (err) {
                    alert("Erro durante a criptografia ou envio: " + err);
                }
            });
        } catch (err) {
            console.error("Erro ao carregar widget OwlReport:", err);
        }
    };
    document.addEventListener("DOMContentLoaded", () => {
        document.body.append(button, modal);
        document.head.appendChild(rrwebScript);
        button.onclick = () => modal.style.display = "block";
    });
})();
