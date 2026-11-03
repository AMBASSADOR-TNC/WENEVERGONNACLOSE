const state = {
  base: null,
  presentEmotion: null,
  futureEmotion: null,
  gradYear: null,
  lane: null
};

const ROUTES = {
  table: "table.html",
  counter: "counter.html"
};
const currentYear = new Date().getFullYear();

function selectCard(group, value) {
  const cards = document.querySelectorAll(group);
  cards.forEach(card => {
    const isSelected = card.dataset.base === value ||
      card.dataset.present === value ||
      card.dataset.future === value;
    card.classList.toggle("selected", isSelected);
    card.setAttribute("aria-pressed", String(isSelected));
  });
}

document.querySelectorAll(".figure-card").forEach(card => {
  card.addEventListener("click", () => {
    state.base = card.dataset.base;
    selectCard(".figure-card", state.base);
  });
});

document.querySelectorAll("#present-emotions .emotion-card").forEach(card => {
  card.addEventListener("click", () => {
    state.presentEmotion = card.dataset.present;
    selectCard("#present-emotions .emotion-card", state.presentEmotion);
  });
});

document.querySelectorAll("#future-emotions .emotion-card").forEach(card => {
  card.addEventListener("click", () => {
    state.futureEmotion = card.dataset.future;
    selectCard("#future-emotions .emotion-card", state.futureEmotion);
  });
});

const gradInput = document.getElementById("gradYear");
const collegeConfirmation = document.getElementById("collegeConfirmation");
const underCollegeConfirmed = document.getElementById("underCollegeConfirmed");
const routeButton = document.getElementById("routeButton");
const routeMessage = document.getElementById("routeMessage");

function showMessage(message) {
  routeMessage.textContent = message;
}

function setLaneFromGraduationYear() {
  const year = Number.parseInt(gradInput.value, 10);
  if (!Number.isInteger(year) || year < 1900 || year > currentYear + 1) {
    state.gradYear = null;
    state.lane = null;
    collegeConfirmation.hidden = true;
    return;
  }

  state.gradYear = year;
  state.lane = year >= currentYear ? "table" : "counter";
  collegeConfirmation.hidden = state.lane !== "table";
}

gradInput.addEventListener("input", setLaneFromGraduationYear);

function validateEntry() {
  if (!state.base || !state.presentEmotion || !state.futureEmotion) {
    return "Complete your stick-figure sequence first.";
  }
  if (!state.lane) {
    return `Enter a graduation year from 1900 through ${currentYear + 1}.`;
  }
  if (state.lane === "table" && !underCollegeConfirmed.checked) {
    return "Confirm the under-college path before continuing to The Table.";
  }
  return null;
}

routeButton.addEventListener("click", () => {
  setLaneFromGraduationYear();
  const validationMessage = validateEntry();
  if (validationMessage) {
    showMessage(validationMessage);
    return;
  }

  showMessage(`Opening ${state.lane === "table" ? "The Table" : "The Counter"}...`);
  window.location.replace(ROUTES[state.lane]);
});
