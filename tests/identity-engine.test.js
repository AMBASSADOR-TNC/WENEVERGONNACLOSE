const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const { URL } = require("node:url");

const root = path.join(__dirname, "..");
const script = fs.readFileSync(path.join(root, "js/identity-engine.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const entryFunction = fs.readFileSync(path.join(root, "functions/api/entry.js"), "utf8");
const consumeFunction = fs.readFileSync(path.join(root, "functions/api/entry/consume.js"), "utf8");
const schema = fs.readFileSync(path.join(root, "db/schema.sql"), "utf8");
const headers = fs.readFileSync(path.join(root, "_headers"), "utf8");

function makeElement(dataset = {}) {
  const listeners = {};
  const classes = new Set();
  const attributes = {};
  return {
    attributes,
    checked: false,
    dataset,
    disabled: false,
    hidden: false,
    textContent: "",
    value: "",
    validity: { valid: false },
    classList: {
      contains: name => classes.has(name),
      toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name)
    },
    addEventListener: (name, callback) => {
      listeners[name] = callback;
    },
    click: () => listeners.click(),
    emit: name => listeners[name](),
    setAttribute: (name, value) => {
      attributes[name] = value;
    }
  };
}

function createPage(fetchResponse) {
  const figures = [
    makeElement({ base: "adult-man" }),
    makeElement({ base: "adult-woman" }),
    makeElement({ base: "youth-boy" }),
    makeElement({ base: "youth-girl" })
  ];
  const present = [makeElement({ present: "calm" })];
  const future = [makeElement({ future: "steady" })];
  const gradInput = makeElement();
  const emailInput = makeElement();
  const collegeConfirmation = makeElement();
  const underCollegeConfirmed = makeElement();
  const routeButton = makeElement();
  const routeMessage = makeElement();
  const requests = [];
  const location = { replace: destination => { location.destination = String(destination); } };

  const groups = {
    ".figure-card": figures,
    "#present-emotions .emotion-card": present,
    "#future-emotions .emotion-card": future
  };
  const elementsById = {
    gradYear: gradInput,
    email: emailInput,
    collegeConfirmation,
    underCollegeConfirmed,
    routeButton,
    routeMessage
  };
  const document = {
    querySelectorAll: selector => groups[selector] || [],
    getElementById: id => elementsById[id]
  };
  const context = vm.createContext({
    Date,
    URL,
    document,
    fetch: async (...arguments_) => {
      requests.push(arguments_);
      return fetchResponse;
    },
    window: { location }
  });
  vm.runInContext(script, context);

  return {
    collegeConfirmation,
    emailInput,
    figures,
    future,
    gradInput,
    location,
    present,
    requests,
    routeButton,
    routeMessage,
    underCollegeConfirmed
  };
}

test("the entry flow keeps stick-figure selections private until valid registration", async () => {
  const page = createPage({ ok: true, json: async () => ({ entryToken: "token", lane: "table" }) });
  const currentYear = new Date().getFullYear();

  page.figures[0].click();
  page.present[0].click();
  page.future[0].click();
  page.gradInput.value = String(currentYear);
  page.gradInput.emit("input");

  assert.equal(page.figures[0].classList.contains("selected"), true);
  assert.equal(page.figures[1].classList.contains("selected"), false);
  assert.equal(page.collegeConfirmation.hidden, false);

  await page.routeButton.click();
  assert.match(page.routeMessage.textContent, /valid email address/);
  assert.equal(page.requests.length, 0);
  assert.equal(page.location.destination, undefined);
});

test("a confirmed entry posts the anonymous sequence and replaces browser history", async () => {
  const page = createPage({ ok: true, json: async () => ({ entryToken: "entry-token", lane: "table" }) });
  const currentYear = new Date().getFullYear();

  page.figures[2].click();
  page.present[0].click();
  page.future[0].click();
  page.gradInput.value = String(currentYear);
  page.gradInput.emit("input");
  page.emailInput.value = "guest@example.com";
  page.emailInput.validity.valid = true;
  page.underCollegeConfirmed.checked = true;

  await page.routeButton.click();

  assert.equal(page.requests.length, 1);
  const [endpoint, request] = page.requests[0];
  assert.equal(endpoint, "/api/entry");
  assert.equal(request.method, "POST");
  assert.deepEqual(JSON.parse(request.body), {
    email: "guest@example.com",
    graduationYear: currentYear,
    lane: "table",
    underCollegeConfirmed: true,
    sequence: {
      base: "youth-boy",
      presentEmotion: "calm",
      futureEmotion: "steady"
    }
  });
  assert.equal(page.location.destination, "https://wholedonuts.cloud/table?entry=entry-token&exit=estore");
});

test("the Pages API stores only keyed identifiers and consumes each token once", () => {
  assert.match(html, /id="email"/);
  assert.doesNotMatch(html, /name="name"|id="name"/);
  assert.match(entryFunction, /CF-Connecting-IP/);
  assert.match(entryFunction, /keyedHash/);
  assert.match(schema, /email_hash TEXT NOT NULL UNIQUE/);
  assert.match(schema, /ip_hash TEXT NOT NULL UNIQUE/);
  assert.match(consumeFunction, /consumed_at IS NULL/);
  assert.match(headers, /Content-Security-Policy/);
  assert.match(headers, /connect-src 'self'/);
  assert.equal(fs.existsSync(path.join(root, ".github/workflows/deploy-pages.yml")), false);
});
