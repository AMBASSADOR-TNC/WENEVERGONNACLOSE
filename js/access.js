// Access bar for every page: works for every ability. Choices live only in this page's memory.
// Read aloud uses the device's own voice; nothing is sent anywhere.
(function () {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  const options = [
    { key: "big", label: "Bigger text" },
    { key: "contrast", label: "High contrast" },
    { key: "calm", label: "Calm (no motion)" },
    { key: "spacing", label: "Easier reading" }
  ];

  const bar = document.createElement("nav");
  bar.className = "access-bar";
  bar.setAttribute("aria-label", "Access options");

  options.forEach(({ key, label }) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      const on = !html.classList.contains("a11y-" + key);
      html.classList.toggle("a11y-" + key, on);
      b.setAttribute("aria-pressed", String(on));
    });
    bar.appendChild(b);
  });

  if ("speechSynthesis" in window) {
    const read = document.createElement("button");
    read.type = "button";
    read.textContent = "Read aloud";
    read.setAttribute("aria-pressed", "false");

    const voiceSelect = document.createElement("select");
    voiceSelect.className = "access-voice";
    voiceSelect.setAttribute("aria-label", "Voice for Read aloud");
    let chosenVoice = null;

    function populateVoices() {
      const voices = speechSynthesis.getVoices();
      if (!voices.length) return;
      const previous = voiceSelect.value;
      voiceSelect.replaceChildren();
      const auto = document.createElement("option");
      auto.value = "";
      auto.textContent = "Auto voice";
      voiceSelect.appendChild(auto);
      voices.forEach((voice) => {
        const option = document.createElement("option");
        option.value = voice.voiceURI;
        option.textContent = voice.name + (voice.lang ? " (" + voice.lang + ")" : "");
        voiceSelect.appendChild(option);
      });
      if (previous) voiceSelect.value = previous;
      const selected = voices.find((voice) => voice.voiceURI === voiceSelect.value);
      chosenVoice = selected || null;
    }
    // Voices may already be loaded (then voiceschanged never fires again) or
    // still loading (then it fires later): populate on both paths.
    populateVoices();
    speechSynthesis.addEventListener("voiceschanged", populateVoices);
    voiceSelect.addEventListener("change", () => {
      const selected = speechSynthesis.getVoices().find((voice) => voice.voiceURI === voiceSelect.value);
      chosenVoice = selected || null;
    });

    let reading = false;
    let chunks = [];
    let chunkIndex = 0;

    function stopReading() {
      reading = false;
      chunks = [];
      chunkIndex = 0;
      speechSynthesis.cancel();
      read.textContent = "Read aloud";
      read.setAttribute("aria-pressed", "false");
    }

    function speakNextChunk() {
      if (!reading) return;
      if (chunkIndex >= chunks.length) {
        stopReading();
        return;
      }
      const u = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      u.rate = 0.95;
      if (chosenVoice) u.voice = chosenVoice;
      u.onend = () => {
        chunkIndex += 1;
        speakNextChunk();
      };
      u.onerror = () => {
        chunkIndex += 1;
        speakNextChunk();
      };
      speechSynthesis.speak(u);
    }

    read.addEventListener("click", () => {
      if (reading || speechSynthesis.speaking) {
        stopReading();
        return;
      }
      // Read only the visible screen on the one-screen site; fall back to
      // the page's main content. One long utterance fails silently on some
      // devices, so the text is read a sentence at a time.
      const visibleScreen = document.querySelector("[data-screen].screen-active");
      const main = visibleScreen || document.querySelector("main") || document.body;
      const text = (main.innerText || main.textContent || "").replace(/\s+/g, " ").trim();
      if (!text) return;
      chunks = text.split(/(?<=[.!?])\s+/).map((part) => part.trim()).filter(Boolean);
      if (!chunks.length) return;
      reading = true;
      chunkIndex = 0;
      read.textContent = "Stop reading";
      read.setAttribute("aria-pressed", "true");
      speakNextChunk();
    });
    bar.appendChild(read);
    bar.appendChild(voiceSelect);
  }

  // Skip link: only add one when the page does not already have one.
  // The target is resolved at click time, so it always lands on the visible
  // screen (one-screen site), the engine (table/counter pages), or main.
  let skip = null;
  if (!document.querySelector(".skip-link")) {
    skip = document.createElement("a");
    skip.className = "skip-link";
    skip.textContent = "Skip to main content";
    skip.href = "#main-content";
    skip.addEventListener("click", () => {
      const visibleScreen = document.querySelector("[data-screen].screen-active");
      const target = visibleScreen || document.querySelector("#engine") || document.querySelector("main") || document.body;
      if (!target.id) target.id = "main-content";
      if (target.tabIndex < 0) target.tabIndex = -1;
      skip.href = "#" + target.id;
    });
  }

  document.body.prepend(bar);
  if (skip) document.body.prepend(skip);
})();
