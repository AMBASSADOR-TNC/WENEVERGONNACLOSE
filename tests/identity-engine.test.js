const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const script = fs.readFileSync(path.join(root, "js/identity-engine.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

function makeElement(dataset = {}) {
  const listeners = {};
  const classes = new Set();
  return {
    dataset,
    textContent: "",
    value: "",
    listeners,
    classList: {
      add: name => classes.add(name),
      remove: name => classes.delete(name),
      contains: name => classes.has(name)
    },
    addEventListener: (name, callback) => {
      listeners[name] = callback;
    },
    click: () => listeners.click()
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
  const entryMessage = makeElement();
  const gradInput = makeElement();
  const routeButton = makeElement();
  const routeMessage = makeElement();

  const groups = {
    ".figure-card": figures,
    "#present-emotions .emotion-card": present,
    "#future-emotions .emotion-card": future
  };
  const elementsById = { entryMessage, gradYear: gradInput, routeButton, routeMessage };
  const document = {
    querySelectorAll: selector => groups[selector] || [],
    getElementById: id => elementsById[id]
  };
  const context = vm.createContext({ document, Math });
  for (const api of ["fetch", "XMLHttpRequest", "localStorage", "sessionStorage"]) {
    Object.defineProperty(context, api, {
      get() {
        throw new Error(`Unexpected use of ${api}`);
      }
    });
  }
  vm.runInContext(script, context);

  return { context, figures, present, future, entryMessage, gradInput, routeButton, routeMessage };
}

test("entry messages are unique through exhaustion and the four figures remain unchanged", () => {
  const page = createPage();
  const messageCount = vm.runInContext("welcomeMessages.length", page.context);
  const displayed = [page.entryMessage.textContent];

  assert.equal(page.entryMessage.textContent.includes("+U"), true);
  assert.deepEqual(page.figures.map(figure => figure.dataset.base), [
    "adult-man", "adult-woman", "youth-boy", "youth-girl"
  ]);
  assert.match(html, /id="entryMessage"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.deepEqual(
    [...html.matchAll(/<button class="figure-card" data-base="([^"]+)">/g)].map(match => match[1]),
    ["adult-man", "adult-woman", "youth-boy", "youth-girl"]
  );

  for (let index = 0; index < messageCount + 3; index += 1) {
    page.figures[index % page.figures.length].click();
    displayed.push(page.entryMessage.textContent);
  }

  assert.equal(new Set(displayed).size, messageCount);
  assert.equal(displayed.at(-1), displayed.at(-2));
  assert.equal(page.figures.filter(figure => figure.classList.contains("selected")).length, 1);
  assert.equal(page.figures.find(figure => figure.classList.contains("selected")).dataset.base, "adult-man");
});

test("repeat clicks do not rotate copy and selection plus lane routing stay local", () => {
  const page = createPage();
  page.figures[0].click();
  const selectedMessage = page.entryMessage.textContent;
  page.figures[0].click();
  assert.equal(page.entryMessage.textContent, selectedMessage);

  page.present[0].click();
  page.future[0].click();
  page.routeButton.click();
  assert.match(page.routeMessage.textContent, /Finish all four steps/);

  page.figures[1].click();
  page.gradInput.value = "2000";
  page.routeButton.click();
  assert.match(page.routeMessage.textContent, /Adult lane locally/);
  assert.match(page.routeMessage.textContent, /External routing is blocked/);
});
