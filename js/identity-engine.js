// Simple state object to keep track of selections
const state = {
  base: null,
  presentEmotion: null,
  futureEmotion: null,
  gradYear: null
};

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

// STEP 4: Grad year + routing
const gradInput = document.getElementById("gradYear");
const routeButton = document.getElementById("routeButton");
const routeMessage = document.getElementById("routeMessage");

// Adjust this to current year dynamically
const currentYear = new Date().getFullYear();

routeButton.addEventListener("click", () => {
  const year = parseInt(gradInput.value, 10);
  state.gradYear = year;

  if (!state.base || !state.presentEmotion || !state.futureEmotion || !year) {
    routeMessage.textContent = "Finish all four steps first. Your +U identity needs all pieces.";
    return;
  }

  let lane;
  if (year >= currentYear) {
    lane = "youth";
    routeMessage.textContent = "You are Youth · The Table (wholedonuts). Routing you to wholedonuts.app …";
    // Example routing:
    window.location.href = "https://wholedonuts.app";
  } else {
    lane = "adult";
    routeMessage.textContent = "You are Adult · The Counter (thenurturedchef). Routing you to thenurturedchef.app …";
    // Example routing:
    window.location.href = "https://thenurturedchef.app";
  }

  // NOTE: No personal data stored here.
  // If you later add a backend, keep this engine anonymous and momentum-based.
});
