const state = {
  base: null,
  presentEmotion: null,
  futureEmotion: null,
  gradYear: null,
  lane: null
};

const ROUTES = {
  table: "https://wholedonuts.cloud/table",
  counter: "https://wholedonuts.cloud/counter"
};
const ENTRY_ENDPOINT = "/api/entry";
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
const emailInput = document.getElementById("email");
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
  if (!emailInput.validity.valid) {
    return "Enter one valid email address for private registration.";
  }
  if (state.lane === "table" && !underCollegeConfirmed.checked) {
    return "Confirm the under-college path before continuing to The Table.";
  }
  return null;
}

async function registerEntry() {
  const response = await fetch(ENTRY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: emailInput.value.trim(),
      graduationYear: state.gradYear,
      lane: state.lane,
      underCollegeConfirmed: underCollegeConfirmed.checked,
      sequence: {
        base: state.base,
        presentEmotion: state.presentEmotion,
        futureEmotion: state.futureEmotion
      }
    })
  });

  if (!response.ok) {
    let message = "Registration could not be completed.";
    try {
      const error = await response.json();
      message = error.error || message;
    } catch {
      // The service may return a non-JSON error before it reaches the entry handler.
    }
    throw new Error(message);
  }

  const result = await response.json();
  if (!result.entryToken || typeof result.entryToken !== "string") {
    throw new Error("Registration did not return a valid entry token.");
  }

  if (!["table", "counter"].includes(result.lane)) {
    throw new Error("Registration did not return a valid destination.");
  }

  return result;
}

routeButton.addEventListener("click", async () => {
  setLaneFromGraduationYear();
  const validationMessage = validateEntry();
  if (validationMessage) {
    showMessage(validationMessage);
    return;
  }

  routeButton.disabled = true;
  showMessage("Creating your private, one-time entry...");

  try {
    const registration = await registerEntry();
    const destination = new URL(ROUTES[registration.lane]);
    destination.searchParams.set("entry", registration.entryToken);
    destination.searchParams.set("exit", "estore");
    window.location.replace(destination);
  } catch (error) {
    showMessage(error.message || "Registration is unavailable. Please try again.");
    routeButton.disabled = false;
  }
});
