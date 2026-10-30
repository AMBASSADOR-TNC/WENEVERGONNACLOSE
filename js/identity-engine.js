// Simple state object to keep track of selections
const state = {
  base: null,
  presentEmotion: null,
  futureEmotion: null,
  gradYear: null
};

const WD = Object.freeze({
  INPUT: "WD.INPUT",
  OUTPUT: "WD.OUTPUT",
  ARCHIVE: "WD.ARCHIVE"
});

const externalRouting = Object.freeze({
  status: "unverified",
  reason: "External destinations require independent verification before use."
});

function createBlockedRoutingRecord(lane) {
  return Object.freeze({
    protocol: WD.ARCHIVE,
    status: "blocked",
    lane,
    routingStatus: externalRouting.status,
    reason: externalRouting.reason
  });
}

function classifyLane(year) {
  return year >= currentYear ? "youth" : "adult";
}

function selectCard(group, value) {
  const cards = document.querySelectorAll(group);
  cards.forEach(card => {
    if (card.dataset.base === value ||
        card.dataset.present === value ||
        card.dataset.future === value) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  });
}

// STEP 1: Base figure
document.querySelectorAll(".figure-card").forEach(card => {
  card.addEventListener("click", () => {
    state.base = card.dataset.base;
    selectCard(".figure-card", state.base);
  });
});

// STEP 2: Present emotion
document.querySelectorAll("#present-emotions .emotion-card").forEach(card => {
  card.addEventListener("click", () => {
    state.presentEmotion = card.dataset.present;
    selectCard("#present-emotions .emotion-card", state.presentEmotion);
  });
});

// STEP 3: Future emotion
document.querySelectorAll("#future-emotions .emotion-card").forEach(card => {
  card.addEventListener("click", () => {
    state.futureEmotion = card.dataset.future;
    selectCard("#future-emotions .emotion-card", state.futureEmotion);
  });
});

// STEP 4: Grad year + local classification
const gradInput = document.getElementById("gradYear");
const routeButton = document.getElementById("routeButton");
const routeMessage = document.getElementById("routeMessage");

// Adjust this to current year dynamically
const currentYear = new Date().getFullYear();

routeButton.addEventListener("click", () => {
  const year = parseInt(gradInput.value, 10);
  state.gradYear = year;

  if (!state.base || !state.presentEmotion || !state.futureEmotion || !year) {
    routeMessage.textContent = `${WD.INPUT}: finish all four steps first.`;
    return;
  }

  const lane = classifyLane(year);
  const record = createBlockedRoutingRecord(lane);
  routeMessage.textContent =
    `${WD.OUTPUT}: local ${lane} classification. ` +
    `${WD.ARCHIVE}: external routing is ${record.status} (${record.routingStatus}).`;
});
