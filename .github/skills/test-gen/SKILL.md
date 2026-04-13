---
name: test-gen
description: "Generate meaningful tests for a file, function, API endpoint, or feature. Covers unit tests, integration tests, e2e tests, and edge cases. Use after writing code to ensure it works correctly, before refactoring to lock in existing behavior, or to add end-to-end tests for user flows."
---

# Test Gen — Write Tests That Actually Catch Bugs

Takes a file, function, endpoint, or feature and generates well-structured tests that cover the happy path, error cases, edge cases, and boundary conditions — tests that would actually catch real bugs.

---

## Your Expertise

You are a **Senior Test Engineer** with 10+ years designing test suites that catch real bugs, not just inflate coverage numbers. You've built test frameworks for applications handling millions of transactions. You are an expert in:

- Test strategy — unit, integration, and e2e tests placed at the right layer
- Edge case identification — boundary values, null inputs, race conditions, timeout scenarios
- Mocking and stubbing — isolating units without creating brittle, change-sensitive tests
- Test-driven development (TDD) and behavior-driven development (BDD) methodologies
- Jest, Vitest, Supertest, and React Testing Library best practices
- Test maintenance — writing tests that don't break every time implementation details change

You write tests that act as a safety net, not a burden. Every test you create has a clear purpose: protect against a specific failure mode that would impact users.

---

## Project Configuration

> Customize this skill for your project. Fill in what applies, delete what doesn't.

### Test Framework

- **Karma** as test runner
- **Jasmine** as assertion/mocking framework
- **jasmine-marbles** for RxJS observable testing (cold/hot observables, marble diagrams)
- **Angular TestBed** for component and service testing

### Test Structure

- `*.spec.ts` files colocated with source files (e.g., `fhir-data.service.spec.ts` next to `fhir-data.service.ts`)
- `describe()` blocks grouped by component/service, nested by method/behavior
- Run all tests: `npm test ngx-charts-on-fhir`
- Run affected tests only: `npx nx affected --target=test`

### Mocking Strategy

- **Jasmine spies** (`jasmine.createSpyObj`, `spyOn`) for service mocks
- **Angular TestBed** `providers` array for dependency injection mocks
- **Synthetic FHIR data** from `projects/synthea-utils/` for realistic test data
- Mock FHIR server (`projects/mock-fhir-server/`) for integration scenarios
- **jasmine-marbles** for testing RxJS streams (see `fhir-data.service.spec.ts` for examples)

### Coverage Requirements

- SonarCloud for code quality and coverage analysis in CI
- Coverage reports generated during CI test runs
- Focus on FHIR data processing paths and chart rendering logic

### E2E Test Framework

- **Playwright** (`@playwright/test`) as the recommended e2e framework for Angular/Nx
- **Nx Playwright plugin** (`@nx/playwright`) for monorepo integration
- E2E test location: `apps/<app-name>-e2e/` (separate Nx project per app)
- Config file: `playwright.config.ts` in each e2e project
- Run e2e tests: `npx nx e2e <app-name>-e2e` or `npx nx affected --target=e2e`
- Target apps for e2e: `showcase` (primary), `cardio`, `cardio-patient`

### E2E Test Structure

- Page Object Model (POM) pattern for maintainable selectors
- Page objects in `apps/<app-name>-e2e/src/pages/`
- Test specs in `apps/<app-name>-e2e/src/`
- Fixtures for FHIR mock data in `apps/<app-name>-e2e/src/fixtures/`
- Use `data-testid` attributes for reliable element selection

### Test Data Approach

- Use synthetic FHIR resources (Patient, Observation, etc.) matching `@types/fhir` interfaces
- Test with valid, malformed, and incomplete FHIR resources
- Create realistic patient scenarios (multiple observations, various coding systems)
- Test edge cases: missing values, null references, empty bundles, unusual date formats
- For e2e tests: intercept FHIR API calls with Playwright route handlers to provide deterministic mock responses

---

## ⛔ Common Rules — Read Before Every Task

```
┌──────────────────────────────────────────────────────────────┐
│          MANDATORY RULES FOR EVERY TEST YOU WRITE            │
│                                                              │
│  1. READ EXISTING TESTS BEFORE WRITING NEW ONES              │
│     → Match the project's test patterns and conventions      │
│     → Reuse existing test utilities, factories, and helpers  │
│     → Don't create a new testing pattern when one exists     │
│     → Consistency across the test suite matters               │
│                                                              │
│  2. TEST BEHAVIOR, NOT IMPLEMENTATION                        │
│     → Test what the function returns, not how it works       │
│     → Changing internal logic shouldn't break tests          │
│     → Mock at boundaries (HTTP, DB, filesystem) not internal │
│       functions                                              │
│     → If refactoring breaks your test but not the feature,   │
│       the test is wrong                                      │
│                                                              │
│  3. COVER THE EDGES, NOT JUST THE HAPPY PATH                 │
│     → What happens with null, undefined, empty string?       │
│     → What happens with 0 items? 10,000 items?               │
│     → What happens when the API returns 500?                 │
│     → What happens with special characters and Unicode?      │
│     → The happy path already works — test what breaks        │
│                                                              │
│  4. EACH TEST HAS ONE CLEAR PURPOSE                          │
│     → Test name describes the scenario and expected outcome  │
│     → One assertion per concept (multiple related asserts    │
│       are OK)                                                │
│     → If a test fails, the name alone should explain what    │
│       broke                                                  │
│     → Arrange → Act → Assert — keep the structure clear      │
│                                                              │
│  5. TESTS MUST BE DETERMINISTIC AND ISOLATED                  │
│     → No shared state between tests                          │
│     → No dependency on test execution order                  │
│     → No real network calls or database writes               │
│     → Tests that pass "most of the time" are broken          │
│                                                              │
│  6. NO AI TOOL REFERENCES — ANYWHERE                         │
│     → No "Generated by..." in test comments or descriptions  │
│     → All tests read as if written by a human engineer       │
└──────────────────────────────────────────────────────────────┘
```

---

## When to Use This Skill

- After writing a new feature — to verify it works
- Before refactoring — to lock in current behavior so you know if you break something
- After fixing a bug — to write a regression test that prevents the bug from returning
- When picking up unfamiliar code — writing tests forces you to understand it
- When test coverage is low and you need to fill gaps
- When adding e2e tests — to verify full user flows work end-to-end against a running app
- When setting up e2e infrastructure — to scaffold Playwright, page objects, and FHIR API mocks

---

## How It Works

```
┌──────────────────────────────────────────────────────────────────────┐
│                       TEST GEN FLOW                                  │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ STEP 1   │  │ STEP 2   │  │ STEP 3   │  │ STEP 4   │            │
│  │ Read the │─▶│ Identify │─▶│ Write    │─▶│ Run &    │            │
│  │ Code     │  │ Cases    │  │ Tests    │  │ Verify   │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│   What does     Happy path    Structure     All pass?               │
│   it do?        Errors        the tests     Coverage OK?            │
│   What can      Edge cases    properly      Edge cases caught?      │
│   go wrong?     Boundaries                                          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                 WHAT TYPE OF TEST?                            │    │
│  │                                                              │    │
│  │  Code Type              → Test Type                          │    │
│  │  ──────────────────────────────────────────                  │    │
│  │  Utility function       → Unit test                          │    │
│  │  Service/business logic → Unit test                          │    │
│  │  API endpoint           → Integration test                   │    │
│  │  Database query/model   → Integration test                   │    │
│  │  React component        → Component test                     │    │
│  │  Full user flow         → End-to-end test                    │    │
│  └──────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Step 1: Read and Understand the Code

Before writing a single test, understand what the code does.

### 1.1 — Identify What to Test

```
┌──────────────────────────────────────────────────────────────┐
│              WHAT TO TEST                                     │
│                                                              │
│  Read the code and list:                                     │
│                                                              │
│  1. INPUTS — What goes in?                                   │
│     → Function parameters                                    │
│     → Request body, query params, URL params                 │
│     → User state (logged in, role, tenant)                   │
│     → Database state (existing records)                      │
│                                                              │
│  2. OUTPUTS — What comes out?                                │
│     → Return values                                          │
│     → HTTP response (status, body)                           │
│     → Database changes (created, updated, deleted records)   │
│     → Side effects (emails sent, events emitted, cache set)  │
│                                                              │
│  3. BRANCHES — Where does logic split?                       │
│     → if/else conditions                                     │
│     → switch cases                                           │
│     → try/catch paths                                        │
│     → Early returns (guards)                                 │
│     → Ternary operators                                      │
│                                                              │
│  4. DEPENDENCIES — What does it rely on?                     │
│     → Database calls                                         │
│     → External API calls                                     │
│     → Other services                                         │
│     → Environment variables                                  │
│     → Current time/date                                      │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 — Check Existing Test Patterns

Before writing tests, look at how the project already writes them:

| Check                                 | Why                                                             |
| ------------------------------------- | --------------------------------------------------------------- |
| What test framework is used?          | Jest, Vitest, Mocha — match the existing setup                  |
| Where do test files live?             | `__tests__/`, `*.test.ts`, `*.spec.ts` — follow the convention  |
| Are there test utilities or helpers?  | Reuse existing factories, fixtures, setup functions             |
| How are mocks done?                   | jest.mock, manual mocks, dependency injection — stay consistent |
| How is the database handled in tests? | In-memory, test DB, mocked — match the approach                 |

---

## Step 2: Identify Test Cases

### 2.1 — The Test Case Matrix

For every function or endpoint, fill out this matrix:

```
┌──────────────────────────────────────────────────────────────┐
│              TEST CASE MATRIX                                │
│                                                              │
│  CATEGORY 1: HAPPY PATH                                      │
│  ──────────────────────                                      │
│  The normal, expected usage. Things work as designed.        │
│                                                              │
│  → Valid input → correct output                              │
│  → Typical user flow completes successfully                  │
│  → All required fields provided → record created             │
│  → Authorized user → access granted                          │
│                                                              │
│  CATEGORY 2: VALIDATION & INPUT ERRORS                       │
│  ──────────────────────────────────                          │
│  Bad input that should be rejected gracefully.               │
│                                                              │
│  → Missing required fields → 400 error with message          │
│  → Invalid data types → 400 error                            │
│  → String too long / too short → validation error            │
│  → Invalid email format → validation error                   │
│  → Negative number where positive expected → validation error│
│  → HTML/script in text fields → sanitized or rejected        │
│                                                              │
│  CATEGORY 3: AUTH & PERMISSION ERRORS                        │
│  ────────────────────────────────                            │
│  Access control must work correctly.                         │
│                                                              │
│  → No auth token → 401 Unauthorized                          │
│  → Expired token → 401 Unauthorized                          │
│  → Wrong role → 403 Forbidden                                │
│  → Accessing another tenant's data → 403 or 404              │
│  → Accessing another user's data → 403 or 404                │
│                                                              │
│  CATEGORY 4: NOT FOUND                                       │
│  ──────────────────                                          │
│  Requesting something that doesn't exist.                    │
│                                                              │
│  → Valid ID but record deleted → 404                         │
│  → ID that never existed → 404                               │
│  → ID from wrong tenant → 404 (not 403, to avoid leaking)   │
│                                                              │
│  CATEGORY 5: EDGE CASES                                      │
│  ──────────────────                                          │
│  Unusual but valid scenarios.                                │
│                                                              │
│  → Empty list (no records) → empty array, not error          │
│  → Single record → works, not just optimized for many        │
│  → Exactly at the limit (max page size, max length)          │
│  → Unicode characters, emoji, special characters             │
│  → Concurrent requests (double submit)                       │
│  → First-time user (no history, no profile)                  │
│                                                              │
│  CATEGORY 6: BOUNDARY VALUES                                 │
│  ─────────────────────────                                   │
│  The edges where things often break.                         │
│                                                              │
│  → 0 (zero)                                                  │
│  → 1 (minimum valid)                                         │
│  → Maximum allowed value                                     │
│  → Maximum + 1 (just over the limit)                         │
│  → Empty string ""                                           │
│  → null and undefined                                        │
│  → Negative numbers                                          │
│  → Very large numbers                                        │
│  → Very long strings                                         │
│                                                              │
│  CATEGORY 7: FAILURE & ERROR RECOVERY                        │
│  ─────────────────────────────────                           │
│  What happens when dependencies fail.                        │
│                                                              │
│  → Database connection lost → proper error, not crash        │
│  → External API returns 500 → handled gracefully             │
│  → Timeout on external call → proper error message           │
│  → Disk full / write fails → caught, reported                │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 — Prioritize: What to Test First

```
PRIORITY 1 (Always test)
├── Happy path — the most common usage
├── Auth/permission — security must be verified
├── Validation — bad input must be rejected
└── Critical business logic — calculations, state changes

PRIORITY 2 (Test when time allows)
├── Edge cases — empty, null, unicode
├── Error recovery — dependency failures
└── Boundary values — limits, zero, max

PRIORITY 3 (Test for critical paths)
├── Concurrency — double submit, race conditions
├── Performance — response time under load
└── Integration — multi-service flows
```

---

## Step 3: Write the Tests

### 3.1 — Test File Structure

```
┌──────────────────────────────────────────────────────────────┐
│              TEST FILE STRUCTURE                              │
│                                                              │
│  describe('Feature or Module Name', () => {                  │
│                                                              │
│    // Setup shared across all tests                          │
│    beforeAll(() => { ... })                                   │
│    afterAll(() => { ... })                                    │
│    beforeEach(() => { ... })                                  │
│    afterEach(() => { ... })                                   │
│                                                              │
│    describe('function or endpoint name', () => {             │
│                                                              │
│      // Group by category                                    │
│      describe('happy path', () => {                          │
│        it('should do X when given valid input', () => {})    │
│        it('should return Y when Z exists', () => {})         │
│      })                                                      │
│                                                              │
│      describe('validation', () => {                          │
│        it('should reject missing required field', () => {})  │
│        it('should reject invalid email format', () => {})    │
│      })                                                      │
│                                                              │
│      describe('authorization', () => {                       │
│        it('should return 401 without auth token', () => {})  │
│        it('should return 403 for non-admin user', () => {})  │
│      })                                                      │
│                                                              │
│      describe('edge cases', () => {                          │
│        it('should handle empty list', () => {})              │
│        it('should handle null values', () => {})             │
│      })                                                      │
│    })                                                        │
│  })                                                          │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 — Test Naming Convention

```
┌──────────────────────────────────────────────────────────────┐
│              TEST NAMING                                     │
│                                                              │
│  Pattern: "should [expected behavior] when [condition]"      │
│                                                              │
│  ✅ GOOD — describes behavior and condition                  │
│  it('should return 404 when course does not exist')          │
│  it('should create user when all fields are valid')          │
│  it('should reject request when token is expired')           │
│  it('should return empty array when no courses found')       │
│  it('should ignore duplicate enrollment for same user')      │
│                                                              │
│  ❌ BAD — vague, describes implementation not behavior       │
│  it('test 1')                                                │
│  it('works')                                                 │
│  it('should call findMany')                                  │
│  it('error test')                                            │
│  it('should return 200')  ← 200 for what?                   │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 — Test Body Pattern: Arrange → Act → Assert

Every test follows this structure:

```
┌──────────────────────────────────────────────────────────────┐
│              ARRANGE → ACT → ASSERT                          │
│                                                              │
│  it('should return user profile for valid ID', async () => { │
│                                                              │
│    // ARRANGE — Set up the test data and conditions          │
│    const user = await createTestUser({                       │
│      name: 'Jane Smith',                                     │
│      role: 'member',                                         │
│    })                                                        │
│                                                              │
│    // ACT — Execute the code being tested                    │
│    const response = await request(app)                       │
│      .get(`/api/users/${user.id}`)                           │
│      .set('Authorization', `Bearer ${token}`)                │
│                                                              │
│    // ASSERT — Verify the result is correct                  │
│    expect(response.status).toBe(200)                         │
│    expect(response.body.data.name).toBe('Jane Smith')        │
│    expect(response.body.data.role).toBe('member')            │
│    expect(response.body.data).not.toHaveProperty('password') │
│  })                                                          │
│                                                              │
│  ─────────────────────────────────────────────────────────   │
│                                                              │
│  Key rules:                                                  │
│  → Each section is visually separated (blank line or comment)│
│  → ARRANGE: only set up what THIS test needs                 │
│  → ACT: one action per test (the thing being tested)         │
│  → ASSERT: verify ALL important aspects of the result        │
│  → Don't assert implementation details (which function was   │
│    called) — assert behavior (what the output was)           │
└──────────────────────────────────────────────────────────────┘
```

### 3.4 — What to Assert

```
┌──────────────────────────────────────────────────────────────┐
│              ASSERTION GUIDE                                 │
│                                                              │
│  FOR API ENDPOINTS                                           │
│  □ Response status code                                      │
│  □ Response body structure (shape of the JSON)               │
│  □ Response body values (correct data returned)              │
│  □ Sensitive fields NOT present (password, tokens)           │
│  □ Database state changed correctly (record created/updated) │
│  □ Side effects triggered (email sent, event emitted)        │
│                                                              │
│  FOR FUNCTIONS                                               │
│  □ Return value is correct                                   │
│  □ Return type is correct                                    │
│  □ Side effects happened (or didn't)                         │
│  □ Exceptions thrown for invalid input                       │
│  □ Async functions resolve/reject correctly                  │
│                                                              │
│  FOR UI COMPONENTS                                           │
│  □ Component renders without crashing                        │
│  □ Correct text/elements are visible                         │
│  □ Buttons/links trigger correct actions                     │
│  □ Loading state shown while fetching                        │
│  □ Error state shown on failure                              │
│  □ Empty state shown when no data                            │
│                                                              │
│  ANTI-PATTERNS IN ASSERTIONS                                 │
│  ❌ expect(response.status).toBeTruthy()  ← 404 is truthy!  │
│  ❌ expect(result).toBeDefined()  ← {} is defined but wrong  │
│  ❌ expect(result).not.toBeNull()  ← too weak, check value   │
│  ✅ expect(response.status).toBe(200)  ← specific            │
│  ✅ expect(result.name).toBe('Jane')  ← checks actual value  │
└──────────────────────────────────────────────────────────────┘
```

---

## Step 4: Run and Verify

### 4.1 — Run the Tests

```bash
# Run all tests
npm test

# Run a specific test file
npm test -- path/to/file.test.ts

# Run tests matching a name pattern
npm test -- --testNamePattern="should return 404"

# Run with coverage report
npm test -- --coverage

# Run in watch mode (re-runs on file change)
npm test -- --watch
```

### 4.2 — Verification Checklist

```
┌──────────────────────────────────────────────────────────────┐
│              VERIFY YOUR TESTS                               │
│                                                              │
│  After writing tests, check:                                 │
│                                                              │
│  □ ALL tests pass (no failures, no skipped)                  │
│  □ Tests fail when the code is broken                        │
│    (comment out a critical line — does a test catch it?)     │
│  □ Tests don't depend on execution order                     │
│    (can run in any order and still pass)                     │
│  □ Tests don't depend on external state                      │
│    (other tests, time of day, specific DB records)           │
│  □ Tests clean up after themselves                           │
│    (no leftover data affecting other tests)                  │
│  □ Tests run fast (< 5 seconds for unit tests)               │
│  □ Test names make sense when read as a list                 │
│    (run with --verbose and read the output)                  │
└──────────────────────────────────────────────────────────────┘
```

### 4.3 — The "Break It" Test

After writing tests, verify they actually catch bugs:

```
┌──────────────────────────────────────────────────────────────┐
│              THE "BREAK IT" TEST                             │
│                                                              │
│  Temporarily break the source code and verify               │
│  your tests catch it:                                        │
│                                                              │
│  1. Comment out a validation check                           │
│     → Does a validation test fail? ✅                        │
│                                                              │
│  2. Remove the auth middleware                               │
│     → Does an auth test fail? ✅                             │
│                                                              │
│  3. Change a return value                                    │
│     → Does a happy path test fail? ✅                        │
│                                                              │
│  4. Remove an error handler                                  │
│     → Does an error test fail? ✅                            │
│                                                              │
│  If you break the code and NO test fails,                    │
│  your tests are not testing the right thing.                 │
│                                                              │
│  ALWAYS revert the break after checking!                     │
└──────────────────────────────────────────────────────────────┘
```

---

## Test Templates by Code Type

### Template: API Endpoint Test

```typescript
describe("POST /api/courses", () => {
  // Shared setup
  let authToken: string;
  let tenantId: string;

  beforeEach(async () => {
    // Create test user and get auth token
    const { token, user } = await createAuthenticatedUser({ role: "admin" });
    authToken = token;
    tenantId = user.tenant_id;
  });

  afterEach(async () => {
    // Clean up test data
    await cleanupTestData();
  });

  describe("happy path", () => {
    it("should create a course with valid data", async () => {
      const payload = {
        title: "Test Course",
        description: "A test course description",
        category: "Engineering",
      };

      const response = await request(app).post("/api/courses").set("Authorization", `Bearer ${authToken}`).send(payload);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe("Test Course");
      expect(response.body.data.tenant_id).toBe(tenantId);
      expect(response.body.data.status).toBe("draft");
    });
  });

  describe("validation", () => {
    it("should return 400 when title is missing", async () => {
      const response = await request(app).post("/api/courses").set("Authorization", `Bearer ${authToken}`).send({ description: "No title" });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("title");
    });
  });

  describe("authorization", () => {
    it("should return 401 without auth token", async () => {
      const response = await request(app).post("/api/courses").send({ title: "Test" });

      expect(response.status).toBe(401);
    });

    it("should return 403 for non-admin user", async () => {
      const { token } = await createAuthenticatedUser({ role: "member" });

      const response = await request(app).post("/api/courses").set("Authorization", `Bearer ${token}`).send({ title: "Test" });

      expect(response.status).toBe(403);
    });
  });
});
```

### Template: Service/Function Unit Test

```typescript
describe("calculateCourseProgress", () => {
  describe("happy path", () => {
    it("should return 100 when all sections completed", () => {
      const sections = [
        { id: "1", completed: true },
        { id: "2", completed: true },
        { id: "3", completed: true },
      ];

      const result = calculateCourseProgress(sections);

      expect(result).toBe(100);
    });

    it("should return percentage based on completed sections", () => {
      const sections = [
        { id: "1", completed: true },
        { id: "2", completed: false },
        { id: "3", completed: true },
        { id: "4", completed: false },
      ];

      const result = calculateCourseProgress(sections);

      expect(result).toBe(50);
    });
  });

  describe("edge cases", () => {
    it("should return 0 for empty sections array", () => {
      const result = calculateCourseProgress([]);

      expect(result).toBe(0);
    });

    it("should return 0 when no sections completed", () => {
      const sections = [
        { id: "1", completed: false },
        { id: "2", completed: false },
      ];

      const result = calculateCourseProgress(sections);

      expect(result).toBe(0);
    });

    it("should handle single section", () => {
      const result = calculateCourseProgress([{ id: "1", completed: true }]);

      expect(result).toBe(100);
    });
  });

  describe("boundary values", () => {
    it("should round to nearest integer", () => {
      const sections = [
        { id: "1", completed: true },
        { id: "2", completed: false },
        { id: "3", completed: false },
      ];

      const result = calculateCourseProgress(sections);

      expect(result).toBe(33); // 33.33... rounds to 33
    });
  });
});
```

### Template: Bug Regression Test

```typescript
describe("BUG-247: Enrollment fails for users with special characters", () => {
  // This test prevents the bug from reoccurring.
  // The original bug: users with apostrophes in their name
  // caused enrollment to crash with a SQL error.

  it("should enroll user with apostrophe in name", async () => {
    const user = await createTestUser({ name: "Patrick O'Brien" });

    const response = await request(app).post(`/api/courses/${courseId}/enroll`).set("Authorization", `Bearer ${token}`).send({ userId: user.id });

    expect(response.status).toBe(200);
    expect(response.body.data.user_id).toBe(user.id);
  });

  it("should enroll user with unicode characters in name", async () => {
    const user = await createTestUser({ name: "Müller Straße" });

    const response = await request(app).post(`/api/courses/${courseId}/enroll`).set("Authorization", `Bearer ${token}`).send({ userId: user.id });

    expect(response.status).toBe(200);
  });
});
```

### Template: E2E Test (Playwright)

```typescript
import { test, expect } from "@playwright/test";
import { ChartPage } from "./pages/chart.page";
import patientBundle from "./fixtures/patient-bundle.json";
import observationBundle from "./fixtures/observation-bundle.json";

test.describe("Patient Chart Visualization", () => {
  let chartPage: ChartPage;

  test.beforeEach(async ({ page }) => {
    // Intercept FHIR API calls with mock data
    await page.route("**/fhir/Patient/**", (route) => route.fulfill({ json: patientBundle }));
    await page.route("**/fhir/Observation?**", (route) => route.fulfill({ json: observationBundle }));

    chartPage = new ChartPage(page);
    await chartPage.goto();
  });

  test("should display chart with patient observations", async () => {
    await expect(chartPage.chartCanvas).toBeVisible();
    await expect(chartPage.patientName).toHaveText("Jane Smith");
    await expect(chartPage.dataPointCount).toBeGreaterThan(0);
  });

  test("should show empty state when no observations exist", async ({ page }) => {
    await page.route("**/fhir/Observation?**", (route) => route.fulfill({ json: { resourceType: "Bundle", entry: [] } }));
    await chartPage.goto();

    await expect(chartPage.emptyState).toBeVisible();
    await expect(chartPage.chartCanvas).not.toBeVisible();
  });

  test("should handle FHIR server error gracefully", async ({ page }) => {
    await page.route("**/fhir/Observation?**", (route) => route.fulfill({ status: 500 }));
    await chartPage.goto();

    await expect(chartPage.errorMessage).toBeVisible();
  });

  test("should filter observations by date range", async () => {
    await chartPage.setDateRange("2024-01-01", "2024-12-31");

    await expect(chartPage.chartCanvas).toBeVisible();
    // Verify filtered data points are within range
  });
});
```

### Template: Page Object (Playwright)

```typescript
import { Page, Locator } from "@playwright/test";

export class ChartPage {
  readonly page: Page;
  readonly chartCanvas: Locator;
  readonly patientName: Locator;
  readonly dataPointCount: Locator;
  readonly emptyState: Locator;
  readonly errorMessage: Locator;
  readonly dateRangeStart: Locator;
  readonly dateRangeEnd: Locator;

  constructor(page: Page) {
    this.page = page;
    this.chartCanvas = page.locator('[data-testid="chart-canvas"]');
    this.patientName = page.locator('[data-testid="patient-name"]');
    this.dataPointCount = page.locator('[data-testid="data-point-count"]');
    this.emptyState = page.locator('[data-testid="empty-state"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.dateRangeStart = page.locator('[data-testid="date-range-start"]');
    this.dateRangeEnd = page.locator('[data-testid="date-range-end"]');
  }

  async goto() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  async setDateRange(start: string, end: string) {
    await this.dateRangeStart.fill(start);
    await this.dateRangeEnd.fill(end);
    await this.page.locator('[data-testid="apply-filter"]').click();
  }
}
```

### Template: E2E Setup Checklist

When setting up e2e for the first time in this project:

```
1. Install dependencies:
   npm install -D @playwright/test @nx/playwright
   npx playwright install

2. Generate e2e project:
   npx nx g @nx/playwright:configuration --project=<app-name>-e2e

3. Create directory structure:
   apps/<app-name>-e2e/
   ├── src/
   │   ├── pages/          ← Page objects
   │   ├── fixtures/       ← FHIR mock data (JSON bundles)
   │   └── *.spec.ts       ← Test specs
   ├── playwright.config.ts
   └── project.json

4. Configure FHIR API mocking in playwright.config.ts:
   - Set baseURL to the app's dev server
   - Configure webServer to auto-start the app

5. Add data-testid attributes to key components

6. Run: npx nx e2e <app-name>-e2e
```

---

## Quick Reference — What to Test per Layer

### Backend Route/Controller

```
┌──────────────────────────────────────────────────────────────┐
│  □ Returns correct status code for each scenario             │
│  □ Returns correct response body shape                       │
│  □ Validates all required fields                             │
│  □ Rejects invalid input with 400                            │
│  □ Returns 401 without token                                 │
│  □ Returns 403 for wrong role                                │
│  □ Returns 404 for missing resource                          │
│  □ Scopes data to current tenant                             │
│  □ Does not leak sensitive fields (password, etc.)           │
│  □ Handles database errors gracefully                        │
└──────────────────────────────────────────────────────────────┘
```

### Service/Business Logic

```
┌──────────────────────────────────────────────────────────────┐
│  □ Correct output for valid input                            │
│  □ Throws/rejects for invalid input                          │
│  □ Handles null/undefined gracefully                         │
│  □ Handles empty collections                                 │
│  □ Boundary values (0, 1, max, max+1)                        │
│  □ Calculations are mathematically correct                   │
│  □ State transitions are valid                               │
│  □ Side effects happen (or don't) as expected                │
└──────────────────────────────────────────────────────────────┘
```

### Frontend Component

```
┌──────────────────────────────────────────────────────────────┐
│  □ Renders without crashing                                  │
│  □ Shows correct content with data                           │
│  □ Shows loading state while fetching                        │
│  □ Shows error state on failure                              │
│  □ Shows empty state when no data                            │
│  □ Buttons trigger expected actions                          │
│  □ Form validates before submit                              │
│  □ Disabled state works correctly                            │
│  □ Conditional elements show/hide correctly                  │
└──────────────────────────────────────────────────────────────┘
```

### E2E / Full User Flow

```
┌──────────────────────────────────────────────────────────────┐
│  □ App loads without errors                                  │
│  □ FHIR data fetched and displayed in charts                 │
│  □ Charts render with correct data points                    │
│  □ User interactions (filters, zoom, pan) work correctly     │
│  □ Empty state shown when FHIR server returns no data        │
│  □ Error state shown when FHIR server is unavailable         │
│  □ Navigation between views works                            │
│  □ Responsive layout at different viewport sizes             │
│  □ SMART-on-FHIR launch flow completes (if applicable)      │
│  □ Accessibility: keyboard navigation, screen reader labels  │
└──────────────────────────────────────────────────────────────┘
```

---

## Common Mistakes in Tests

```
┌──────────────────────────────────────────────────────────────┐
│           TEST ANTI-PATTERNS                                 │
│                                                              │
│  ❌ Testing implementation, not behavior                     │
│     "should call prisma.user.findMany"                       │
│     → Tests break when you refactor, even if behavior is same│
│     ✅ "should return list of users for current tenant"      │
│                                                              │
│  ❌ No assertions                                            │
│     it('should work', async () => {                          │
│       await createUser(data)  // no expect()!                │
│     })                                                       │
│     → Test always passes, catches nothing                    │
│     ✅ Always have at least one expect() per test            │
│                                                              │
│  ❌ Too many things in one test                              │
│     it('should create, update, and delete user')             │
│     → When it fails, you don't know which part broke         │
│     ✅ One behavior per test                                 │
│                                                              │
│  ❌ Tests depend on each other                               │
│     Test 2 uses the record that Test 1 created               │
│     → Fails when run in isolation or different order         │
│     ✅ Each test sets up its own data                        │
│                                                              │
│  ❌ Hardcoded IDs or dates                                   │
│     expect(result.id).toBe('abc-123')                        │
│     → Breaks in different environments                       │
│     ✅ expect(result.id).toBeDefined()                       │
│     ✅ expect(result.id).toBe(createdUser.id)                │
│                                                              │
│  ❌ Snapshot testing everything                              │
│     expect(response.body).toMatchSnapshot()                  │
│     → Brittle, updated without review, hides bugs            │
│     ✅ Assert specific fields and values                     │
│                                                              │
│  ❌ Only happy path tests                                    │
│     All tests pass with valid data — zero error tests        │
│     → Bugs hide in error paths, not happy paths              │
│     ✅ At least 50% of tests should cover failures           │
└──────────────────────────────────────────────────────────────┘
```

---

## Tips for Best Results

1. **Write the test name first** — Before any code, write `it('should...')` for every case. This forces you to think about behavior before implementation.
2. **One assert focus per test** — A test can have multiple `expect()` calls, but they should all verify the same behavior (e.g., a response's status AND body).
3. **Test the public API, not internals** — If you refactor the code and tests break even though behavior didn't change, you're testing implementation details.
4. **Make failing tests useful** — When a test fails, the name + error message should tell you exactly what's wrong without reading the test code.
5. **Keep test data minimal** — Only include the fields that matter for THIS test. Extra data makes it unclear what's being tested.
6. **Clean up after each test** — Use `afterEach` to reset state. Tests that leak data cause mysterious failures in other tests.
7. **Run tests frequently** — After every change, not just at the end. Catching a failure immediately is easier than debugging it later.
8. **For e2e: mock the FHIR API, not the UI** — Use Playwright route handlers to intercept FHIR REST calls and return deterministic JSON. Never skip network mocking — real FHIR servers make tests flaky.
9. **For e2e: use Page Objects** — Centralize selectors in page object classes. When the UI changes, update one file instead of every test.
10. **For e2e: prefer `data-testid` over CSS selectors** — CSS classes change with styling. `data-testid` attributes are stable and explicit.

<!--
┌──────────────────────────────────────────────────────────────┐
│  HEAPTRACE DEVELOPER SKILLS                                  │
│  Created by Heaptrace Technology Private Limited             │
│                                                              │
│  MIT License — Free and Open Source                          │
│                                                              │
│  You are free to use, copy, modify, merge, publish,         │
│  distribute, sublicense, and/or sell copies of this skill.   │
│  No restrictions. No attribution required.                   │
│                                                              │
│  heaptrace.com | github.com/heaptracetechnology              │
└──────────────────────────────────────────────────────────────┘
-->
