// TheWhisper dock: present on every screen. Nothing is sent anywhere.
// 10 full listens per visit (sessionStorage). Voices are the device's own.
// Ported from the +U beta prototype's cast + walk player; the prototype's
// voice dropdowns only ever showed "Auto" because buildCast ran only on
// voiceschanged — here the list is populated on voiceschanged AND immediately.
(function () {
  if (typeof document === "undefined") return;

  var dock = document.getElementById("whisper-dock");
  if (!dock) return;
  var toggle = document.getElementById("whisper-toggle");
  var panel = document.getElementById("whisper-panel");
  var lineEl = document.getElementById("whisper-line");
  var playsEl = document.getElementById("whisper-plays");
  var playBtn = document.getElementById("whisper-play");
  var stopBtn = document.getElementById("whisper-stop");
  var captionEl = document.getElementById("whisper-caption");
  var castSelect = document.getElementById("whisper-cast");
  var hearCastBtn = document.getElementById("whisper-hear-cast");

  var MAX_PLAYS = 10;
  var PLAYS_KEY = "plusu-whisper-plays";
  var VOICE_KEY = "plusu-whisper-voice";

  var WHISPER_LINES = [
    "psst… no rush.", "you belong here.", "one small thing is plenty.",
    "we never gonna close.", "walk in when you're ready.", "how are U doing, really?",
    "no pressure, fr.", "you're good here.", "take a breath, then tap.",
    "psst… no rush. The stool's yours.", "you belong at this counter.",
    "nobody's keeping score here."
  ];

  // Timed captions for TheWhisper.mp3, from the prototype's walk player.
  var L = [
    ["Shh… come in, little one. You've just stepped into a whole new world, and look… you're a stick figure. Simple lines. Nothing to prove yet.", 0],
    ["Pick the one that feels like you. Grown or growing, there's no wrong door here.", 10.37],
    ["Now tell me, honestly, how are you today? Heavy is allowed. I've carried heavy too.", 15.856],
    ["And how would you like to feel? Just name it. Naming it is the first step.", 22.387],
    ["When did you finish school, or when will you? That tells me which way to walk you.", 27.638],
    ["This is The Table. A seat is saved for you. Come sit, eat, and grow with us.", 33.045],
    ["This is The Counter. You've lived some life, and here it gets put to good use.", 38.922],
    ["See your figure? Shoulders a little low. That's okay. Everyone starts somewhere.", 45.035],
    ["Pick one small thing you'll really do. Just one. Watch what happens.", 50.521],
    ["There… standing taller. A little smile. Arms opening up. That's you, choosing it.", 56.085],
    ["Feel that warmth? That's your +U showing. You did that, nobody else.", 63.791],
    ["Look around. All these figures, every one of them started just like you. You're not alone.", 69.512],
    ["Now pass a little of it forward, sweetheart. That's how this world keeps growing. I'll be right here whenever you come back.", 76.356]
  ];

  var ROLEV = {
    chef:   { name: "Chef",            accent: "Irish English",     prefs: ["en-ie", "en-gb", "en"],                 rate: 0.95, pitch: 0.85 },
    friend: { name: "+U Friend",       accent: "Nigerian English",  prefs: ["en-ng", "en-za", "en-ke", "en-jm", "en-us", "en"], rate: 1.06, pitch: 1.2 },
    prof:   { name: "Professor",       accent: "Indian English",    prefs: ["en-in", "en-gb", "en"],                 rate: 0.98, pitch: 1 },
    door:   { name: "+U (front door)", accent: "Australian English", prefs: ["en-au", "en-nz", "en-us", "en"],       rate: 1,    pitch: 1.1 }
  };

  var CAST_LINES = [
    ["chef", "Ah, there you are!"],
    ["friend", "Yo, welcome in!"],
    ["prof", "Choose one. That's the whole step."],
    ["door", "How are U doing?"],
    ["friend", "we never gonna close."]
  ];

  function sessionGet(key) {
    try { return window.sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function sessionSet(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch (e) { /* page memory only */ }
  }
  function getPlays() {
    var n = parseInt(sessionGet(PLAYS_KEY) || "0", 10);
    return isNaN(n) ? 0 : n;
  }
  function setPlays(n) { sessionSet(PLAYS_KEY, String(n)); }

  function allVoices() {
    try { return window.speechSynthesis ? speechSynthesis.getVoices() || [] : []; } catch (e) { return []; }
  }
  function pickVoice(prefs) {
    var vs = allVoices();
    for (var i = 0; i < prefs.length; i++) {
      for (var j = 0; j < vs.length; j++) {
        if (vs[j].lang && vs[j].lang.toLowerCase().replace("_", "-").indexOf(prefs[i]) === 0) return vs[j];
      }
    }
    return null;
  }
  function voiceByURI(uri) {
    var vs = allVoices();
    for (var i = 0; i < vs.length; i++) if (vs[i].voiceURI === uri) return vs[i];
    return null;
  }

  // The narrator voice: the select's value is either a role ("role:chef"),
  // a device voice URI, or "" for Auto (the front door's voice).
  function narratorVoice() {
    if (!castSelect) return pickVoice(ROLEV.door.prefs);
    var value = castSelect.value || "";
    if (value.indexOf("role:") === 0) {
      var role = ROLEV[value.slice(5)];
      return role ? pickVoice(role.prefs) : null;
    }
    if (value) return voiceByURI(value);
    return pickVoice(ROLEV.door.prefs);
  }
  function narratorRatePitch() {
    if (!castSelect) return { rate: 1, pitch: 1.1 };
    var value = castSelect.value || "";
    if (value.indexOf("role:") === 0) {
      var role = ROLEV[value.slice(5)];
      return role ? { rate: role.rate, pitch: role.pitch } : { rate: 1, pitch: 1.1 };
    }
    return { rate: 1, pitch: 1 };
  }

  function populateCastSelect() {
    if (!castSelect) return;
    var previous = castSelect.value || sessionGet(VOICE_KEY) || "";
    var voices = allVoices().slice().sort(function (a, b) {
      return (a.lang + a.name).localeCompare(b.lang + b.name);
    });
    castSelect.replaceChildren();
    var auto = document.createElement("option");
    auto.value = "";
    auto.textContent = "Auto: TheWhisper's voice";
    castSelect.appendChild(auto);
    Object.keys(ROLEV).forEach(function (key) {
      var option = document.createElement("option");
      option.value = "role:" + key;
      option.textContent = ROLEV[key].name + " (" + ROLEV[key].accent + ")";
      castSelect.appendChild(option);
    });
    voices.forEach(function (voice) {
      var option = document.createElement("option");
      option.value = voice.voiceURI;
      option.textContent = voice.name + (voice.lang ? " (" + voice.lang + ")" : "");
      castSelect.appendChild(option);
    });
    if (previous) castSelect.value = previous;
  }
  populateCastSelect();
  if ("speechSynthesis" in window) {
    try { speechSynthesis.addEventListener("voiceschanged", populateCastSelect); } catch (e) {}
  }
  if (castSelect) {
    castSelect.addEventListener("change", function () {
      sessionSet(VOICE_KEY, castSelect.value || "");
    });
  }

  // Whisper line rotator on the toggle button.
  var lineIndex = 0;
  function rotateLine() {
    if (!lineEl) return;
    lineEl.textContent = WHISPER_LINES[lineIndex % WHISPER_LINES.length];
    lineIndex += 1;
  }
  rotateLine();
  setInterval(rotateLine, 9000);

  // Panel toggle.
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function updatePlays() {
    var n = getPlays();
    if (playsEl) {
      playsEl.textContent = n >= MAX_PLAYS
        ? "TheWhisper has shared " + MAX_PLAYS + " listens this visit. Come back and listen again — the table is always open."
        : "Listens this visit: " + n + " of " + MAX_PLAYS + ".";
    }
    if (playBtn) playBtn.disabled = n >= MAX_PLAYS;
  }
  updatePlays();

  var audio = null;
  var ttsIndex = -1;
  var mode = "";

  function setCaption(text) {
    if (captionEl) captionEl.textContent = text;
  }
  function setPlaying(playing) {
    if (playBtn) playBtn.textContent = playing ? "Listening…" : "Listen to TheWhisper";
    if (stopBtn) stopBtn.disabled = !playing;
  }
  function countPlay() {
    var n = getPlays();
    if (n < MAX_PLAYS) setPlays(n + 1);
    updatePlays();
  }

  function stopAll() {
    if (audio) { try { audio.pause(); } catch (e) {} audio = null; }
    if ("speechSynthesis" in window) { try { speechSynthesis.cancel(); } catch (e) {} }
    mode = "";
    ttsIndex = -1;
    setPlaying(false);
    setCaption("");
  }
  if (stopBtn) stopBtn.addEventListener("click", stopAll);

  function speakCaption(index) {
    if (mode !== "tts") return;
    if (index >= L.length) { countPlay(); stopAll(); return; }
    ttsIndex = index;
    setCaption(L[index][0]);
    if (!("speechSynthesis" in window)) {
      // No voice on this device: captions carry every word.
      setTimeout(function () { speakCaption(index + 1); }, 4500);
      return;
    }
    var voice = narratorVoice();
    var rp = narratorRatePitch();
    var u = new SpeechSynthesisUtterance(L[index][0]);
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    u.rate = rp.rate;
    u.pitch = rp.pitch;
    u.onend = function () { speakCaption(index + 1); };
    u.onerror = function () { speakCaption(index + 1); };
    try { speechSynthesis.speak(u); } catch (e) { speakCaption(index + 1); }
  }

  function playTts() {
    mode = "tts";
    setPlaying(true);
    speakCaption(0);
  }

  function playAudio() {
    mode = "audio";
    setPlaying(true);
    audio = new Audio("TheWhisper.mp3");
    audio.addEventListener("timeupdate", function () {
      var t = audio ? audio.currentTime : 0;
      var current = 0;
      for (var i = 0; i < L.length; i++) {
        if (t >= L[i][1]) current = i;
      }
      setCaption(L[current][0]);
    });
    audio.addEventListener("ended", function () {
      countPlay();
      stopAll();
    });
    audio.addEventListener("error", function () {
      // The recording is not here: fall back to the spoken captions.
      audio = null;
      playTts();
    });
    var promise = null;
    try {
      promise = audio.play();
    } catch (e) {
      audio = null;
      playTts();
      return;
    }
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {
        audio = null;
        playTts();
      });
    }
  }

  if (playBtn) {
    playBtn.addEventListener("click", function () {
      if (getPlays() >= MAX_PLAYS) { updatePlays(); return; }
      stopAll();
      playAudio();
    });
  }

  if (hearCastBtn) {
    hearCastBtn.addEventListener("click", function () {
      if (!("speechSynthesis" in window)) {
        setCaption("Voices are not available on this device — the captions carry every word.");
        return;
      }
      try { speechSynthesis.cancel(); } catch (e) {}
      CAST_LINES.forEach(function (pair) {
        var role = ROLEV[pair[0]];
        var u = new SpeechSynthesisUtterance(pair[1]);
        var voice = pickVoice(role.prefs);
        if (voice) { u.voice = voice; u.lang = voice.lang; }
        u.rate = role.rate;
        u.pitch = role.pitch;
        try { speechSynthesis.speak(u); } catch (e) {}
      });
      setCaption("Chef, +U Friend, Professor, and the front door — one welcome, four voices.");
    });
  }
})();
