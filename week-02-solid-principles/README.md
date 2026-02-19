# Week 2: SOLID Principles

> **Key Takeaway:** SOLID = building codes for software. Patterns are the *how*. SOLID is the *why* they hold together.

---

## What We Covered

- **S** — Single Responsibility: one class, one job, one reason to change
- **O** — Open/Closed: extend behavior by adding new code, not by editing old code
- **L** — Liskov Substitution: subclasses must be usable wherever their parent is used
- **I** — Interface Segregation: keep interfaces small and focused — no fat contracts
- **D** — Dependency Inversion: depend on abstractions; accept dependencies from outside instead of creating them inside

## Code Files

| File | What It Shows |
|------|---------------|
| [01-srp.js](01-srp.js) | `NotificationService` doing 5 jobs → split into focused classes |
| [02-ocp.js](02-ocp.js) | if-else chain for notification channels → extensible class-per-channel |
| [03-dip.js](03-dip.js) | Hard-coded dependencies → injected from outside (+ brief LSP/ISP notes) |
| [04-exercises.js](04-exercises.js) | 5 snippets — one SOLID violation each, with fixes |

## Try It

```bash
node 01-srp.js     # Same output as before — but each class does ONE thing
node 02-ocp.js     # Add a new channel without touching existing code
node 03-dip.js     # Swap real vs fake implementations with zero code changes
node 04-exercises.js  # 5 violations — read comments, spot the problem
```

## Challenge

After running `01-srp.js`, add a **SlackSender** class that logs to Slack. Notice:
- You create one new class
- `NotificationService` doesn't change
- Nothing else breaks

That's SRP + OCP working together.

## How SOLID Connects to Patterns

Every pattern you'll learn works *because* of these principles:

| Pattern | SOLID Principle Behind It |
|---------|--------------------------|
| Strategy | OCP — add behaviors without modifying callers |
| Factory | SRP — creation logic in one place |
| Observer | OCP — add new listeners without touching the emitter |
| Decorator | OCP — extend behavior without modifying the original |
| Dependency Injection | DIP — depend on abstractions, not concretions |

## Coming Up

**Week 3 — Singleton Pattern**
When you need exactly ONE instance of something in your entire app — and how to enforce that cleanly.
