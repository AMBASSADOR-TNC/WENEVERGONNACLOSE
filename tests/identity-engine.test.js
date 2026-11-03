const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const script = fs.readFileSync(path.join(root, "js/identity-engine.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const routingManifest = JSON.parse(fs.readFileSync(path.join(root, "bathroom-door-routing.json"), "utf8"));

function makeElement(dataset = {}) {
  const listeners = {};
  const classes = new Set();
  return {
    checked: false,
    dataset,
    hidden: false,
    textContent: "",
    value: "",
    classList: {
      contains: name => classes.has(name),
      toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name)
    },
    addEventListener: (name, callback) => {
      listeners[name] = callback;
    },
    click: () => listeners.click(),
    emit: name => listeners[name](),
    setAttribute: () => {}
  };
}

function createPage() {
  const figures = [
    makeElement({ base: "adult-man" }),
    makeElement({ base: "adult-woman" }),
    makeElement({ base: "youth-boy" }),
    makeElement({ base: "youth-girl" })
  ];
  const present = [makeElement({ present: "calm" })];
  const future = [makeElement({ future: "steady" })];
  const gradInput = makeElement();
  const collegeConfirmation = makeElement();
  const underCollegeConfirmed = makeElement();
  const routeButton = makeElement();
  const routeMessage = makeElement();
  const location = { replace: destination => { location.destination = destination; } };
  const groups = {
    ".figure-card": figures,
    "#present-emotions .emotion-card": present,
    "#future-emotions .emotion-card": future
  };
  const elementsById = {
    gradYear: gradInput,
    collegeConfirmation,
    underCollegeConfirmed,
    routeButton,
    routeMessage
  };
  const document = {
    querySelectorAll: selector => groups[selector] || [],
    getElementById: id => elementsById[id]
  };
  const context = vm.createContext({ Date, document, window: { location } });
  vm.runInContext(script, context);

  return {
    collegeConfirmation,
    figures,
    future,
    gradInput,
    location,
    present,
    routeButton,
    routeMessage,
    underCollegeConfirmed
  };
}

test("the entry flow keeps selections in memory until a valid lane is chosen", () => {
  const page = createPage();
  const currentYear = new Date().getFullYear();

  page.figures[0].click();
  page.present[0].click();
  page.future[0].click();
  page.gradInput.value = String(currentYear);
  page.gradInput.emit("input");

  assert.equal(page.figures[0].classList.contains("selected"), true);
  assert.equal(page.figures[1].classList.contains("selected"), false);
  assert.equal(page.collegeConfirmation.hidden, false);

  page.routeButton.click();
  assert.match(page.routeMessage.textContent, /under-college path/);
  assert.equal(page.location.destination, undefined);
});

test("a confirmed youth lane replaces browser history with the local Table page", () => {
  const page = createPage();
  const currentYear = new Date().getFullYear();

  page.figures[2].click();
  page.present[0].click();
  page.future[0].click();
  page.gradInput.value = String(currentYear);
  page.gradInput.emit("input");
  page.underCollegeConfirmed.checked = true;
  page.routeButton.click();

  assert.equal(page.location.destination, "table.html");
});

test("an adult lane opens the local Counter page without a network request", () => {
  const page = createPage();

  page.figures[0].click();
  page.present[0].click();
  page.future[0].click();
  page.gradInput.value = "2000";
  page.gradInput.emit("input");
  page.routeButton.click();

  assert.equal(page.location.destination, "counter.html");
  assert.doesNotMatch(html, /type="email"|id="email"/);
  assert.equal(fs.existsSync(path.join(root, "table.html")), true);
  assert.equal(fs.existsSync(path.join(root, "counter.html")), true);
  assert.equal(routingManifest.WD.OUTPUT.length, 2);
});
