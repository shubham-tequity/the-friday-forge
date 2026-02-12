# Week 1: Why Design Patterns Matter

> **Key Takeaway:** Patterns don't make code fancy. Patterns make code *changeable*.

---

## What We Covered

- Why "it works" isn't enough — code that works but can't change is technical debt
- The real cost of if-else chains: every new feature means editing the same function
- How patterns separate concerns so each piece does ONE thing

## Code Files

| File | What It Shows |
|------|---------------|
| [01-the-problem.js](01-the-problem.js) | A working order system with 15 if-else branches — messy but functional |
| [02-the-fix.js](02-the-fix.js) | Same system refactored with patterns — zero if-else, easy to extend |
| [03-exercises.js](03-exercises.js) | "Spot the smell" — 3 snippets to practice identifying code problems |

## Try It

```bash
node 01-the-problem.js   # works, but look at the code...
node 02-the-fix.js       # same output, much better structure
```

Then open `02-the-fix.js` and try adding a `platinum` customer type with 25% off. Notice how only **one line** changes.

## Pattern Preview

Over the next 11 weeks:

| Week | Pattern | Solves This Problem |
|------|---------|---------------------|
| 2 | Singleton | "I only need ONE of this thing" |
| 3 | Factory | "I need to create objects without if-else" |
| 4 | Observer | "When X happens, notify Y, Z, and W" |
| 5 | Strategy | "Same task, different ways to do it" |
| 6 | Decorator | "Add features without touching original code" |
| 7 | Adapter | "Make incompatible things work together" |
| 8 | Builder | "Build complex things step by step" |
| 9 | Facade | "Hide the messy stuff behind a clean door" |
| 10 | Proxy | "Control who can access what" |
| 11 | Command | "Undo, redo, and action queues" |
| 12 | Recap | Put it all together |
