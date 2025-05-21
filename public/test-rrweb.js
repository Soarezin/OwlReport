// (function () {
//   const rrwebScript = document.createElement("script");
//   rrwebScript.src = "https://cdn.jsdelivr.net/npm/rrweb@1.1.3/dist/rrweb.min.js";
//   rrwebScript.onload = () => {
//     const events = [];
//     const startTime = Date.now();

//     console.log("[OwlReport] Gravando por 10 segundos...");

//     const stop = rrweb.record({
//       emit(event) {
//         events.push(event);
//       },
//     });

//     setTimeout(() => {
//       stop();
//       const endTime = Date.now();

//       const payload = {
//         projectId: "owl-local-dev",
//         user: {
//           id: "test-user",
//           email: "user@email.com"
//         },
//         meta: {
//           url: window.location.href,
//           userAgent: navigator.userAgent,
//           resolution: `${window.innerWidth}x${window.innerHeight}`,
//           language: navigator.language
//         },
//         startTime,
//         endTime,
//         events
//       };

//       const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `owlreport-session-${new Date().toISOString()}.json`;
//       a.click();

//       console.log("[OwlReport] Download gerado.");
//     }, 10000);
//   };
//   document.head.appendChild(rrwebScript);
// })();
