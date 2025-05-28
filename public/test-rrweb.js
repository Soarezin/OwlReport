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
      cursor: pointer;
      z-index: 1000;
    }

    #owlreport-modal {
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

    #owlreport-modal input,
    #owlreport-modal textarea,
    #owlreport-modal select {
      width: 100%;
      margin: 6px 0;
      padding: 8px;
      background: #0f0f10;
      color: #fff;
      border: 1px solid #333;
      border-radius: 6px;
    }

    #owlreport-modal button {
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

    #owlreport-modal .close-btn {
      position: absolute;
      top: 10px;
      right: 14px;
      font-size: 18px;
      cursor: pointer;
    }

    #owlreport-modal a {
      color: #a5b4fc;
      text-decoration: none;
    }
  `;

(function () {
    let publicKey = null;
    let listenerAttached = false;
    const projectToken = "b59e154e225e450aa4637d054a6143ac";

    async function loadPublicKey() {
        const pubKeyRes = await fetch("http://localhost:5043/report/public-key", {
            headers: { projectToken }
        });

        if (!pubKeyRes.ok) {
            throw new Error("Erro ao buscar chave pública: " + pubKeyRes.status);
        }

        const text = await pubKeyRes.text();
        if (!text) {
            throw new Error("Resposta vazia da chave pública");
        }

        const pubKeyJson = JSON.parse(text);
        const pem = pubKeyJson.publicKey.replace(/-----.*-----|\n/g, "");
        const binaryDer = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
        publicKey = await window.crypto.subtle.importKey(
            "spki",
            binaryDer,
            { name: "RSA-OAEP", hash: "SHA-256" },
            false,
            ["encrypt"]
        );
    }

    const style = document.createElement("style");
    style.innerText = css;
    document.head.appendChild(style);

    const button = document.createElement("div");
    button.id = "owlreport-feedback-btn";
    button.innerText = "Feedback";

    const modal = document.createElement("div");
    modal.id = "owlreport-modal";
    modal.innerHTML = `
    <div class="close-btn" onclick="document.getElementById('owlreport-modal').style.display='none'">×</div>
    <h3 style="margin-bottom: 8px;">Deixe-nos um feedback</h3>
    <select id="owlreport-type">
      <option>Erro</option>
      <option>Ideia</option>
      <option>Outro</option>
    </select>
    <textarea id="owlreport-comment" rows="3" placeholder="Deixe-nos um comentário"></textarea>
    <button id="owlreport-send">Enviar feedback</button>
    <p style="font-size: 11px; text-align: center; margin-top: 10px;">
      Powered by <a href="https://logaflow.com" target="_blank">LogaFlow</a>
    </p>
  `;

    const consoleLogs = [];
    ["log", "warn", "error", "info"].forEach((level) => {
        const original = console[level];
        console[level] = function (...args) {
            consoleLogs.push({ level, message: args.map(String).join(" "), timestamp: new Date().toISOString() });
            original.apply(console, args);
        };
    });

    const httpLogs = [
        {
            status: 200,
            type: "xhr",
            method: "GET",
            url: "http://localhost:5173/api/data",
            timestamp: new Date().toISOString(),
            statusText: "OK",
            requestHeaders: [
                { key: "Authorization", value: "Bearer token123" }
            ],
            responseHeaders: [
                { key: "Content-Type", value: "application/json" }
            ],
            responseBody: {
                message: "Dados recebidos com sucesso"
            }
        }
    ];

    const rrwebScript = document.createElement("script");
    rrwebScript.src = "https://cdn.jsdelivr.net/npm/rrweb@1.1.3/dist/rrweb.min.js";

    rrwebScript.onload = async () => {
        await loadPublicKey();

        const events = [];
        const stopRecording = rrweb.record({ emit: event => events.push(event) });

        if (!listenerAttached) {
            listenerAttached = true;
            const sendBtn = document.getElementById("owlreport-send");
            if (sendBtn) {
                sendBtn.addEventListener("click", async () => {
                    stopRecording();

                    const comment = document.getElementById("owlreport-comment").value;
                    const type = document.getElementById("owlreport-type").value;
                    const categoryId = "c2222222-2222-2222-2222-222222222222";
                    const severityId = "d4444444-4444-4444-4444-444444444444";

                    const rawPayload = { replay: [{ events }], consoleLogs, httpLogs };
                    const reportRequest = {
                        token: projectToken,
                        pageUrl: window.location.href,
                        userComment: comment,
                        userAgent: navigator.userAgent,
                        categoryId,
                        severityId,
                        rawPayload
                    };

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
                    })
                        .then(res => {
                            if (res.ok) {
                                alert("Feedback enviado com sucesso!");
                                modal.style.display = "none";
                            } else {
                                res.text().then(err => alert("Erro ao enviar feedback: " + err));
                            }
                        })
                        .catch(err => alert("Erro de conexão: " + err));
                });
            }
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(button);
        document.body.appendChild(modal);
        document.head.appendChild(rrwebScript);

        button.onclick = () => modal.style.display = "block";
    });
})();