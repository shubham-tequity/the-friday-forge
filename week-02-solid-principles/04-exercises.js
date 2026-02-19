// ========================================
// SPOT THE SOLID VIOLATION
// For each snippet: Which principle is broken? Why?
// Scroll past the code to see the answer.
// ========================================

// --- SNIPPET 1: UserService ---

class UserService {
  register(userData) {
    // Validate
    if (!userData.email.includes("@")) throw new Error("Invalid email");

    // Save to DB
    // db.insert('users', userData);

    // Send welcome email
    // smtp.send(userData.email, 'Welcome!');

    // Generate PDF report
    // pdf.generate({ user: userData });

    console.log(`Registered: ${userData.email}`);
    return "Registered!";
  }
}

// Run to see it work:
const userSvc = new UserService();
console.log(userSvc.register({ email: "alice@test.com" }));

// What's wrong? Scroll down...
//
//
//
//
//
//
//
// VIOLATION: S — Single Responsibility
// UserService validates, saves to DB, sends email, AND generates a PDF.
// Four unrelated reasons to change = four separate classes needed.
// FIX: UserValidator, UserRepository, WelcomeEmailSender, UserReportGenerator

console.log("---");

// --- SNIPPET 2: calculateBonus ---

function calculateBonus(employee) {
  if (employee.role === "developer") {
    return employee.salary * 0.1;
  } else if (employee.role === "manager") {
    return employee.salary * 0.15;
  } else if (employee.role === "director") {
    return employee.salary * 0.25;
  }
  return 0;
  // New role = edit this function. Every time.
}

console.log(calculateBonus({ role: "manager", salary: 100000 })); // 15000

// What's wrong? Scroll down...
//
//
//
//
//
//
//
// VIOLATION: O — Open/Closed
// Adding a new role requires editing this function (modification, not extension).
// FIX: Use a lookup object — new role = add one line, nothing else changes.

const bonusRates = {
  developer: 0.1,
  manager: 0.15,
  director: 0.25,
};
const calculateBonusBetter = (employee) =>
  employee.salary * (bonusRates[employee.role] ?? 0);

console.log(calculateBonusBetter({ role: "director", salary: 100000 })); // 25000
console.log("---");

// --- SNIPPET 3: ReadOnlyNotification ---

class BaseNotification {
  send(user, message) {
    console.log(`Notified ${user.email}: ${message}`);
  }
}

class ReadOnlyNotification extends BaseNotification {
  send(user, message) {
    throw new Error("This notification channel is read-only!");
  }
}

function notifyAll(channels, user, message) {
  channels.forEach((ch) => ch.send(user, message)); // Will crash on ReadOnlyNotification
}

// Don't run notifyAll here — it would throw. Uncomment to see:
// notifyAll([new ReadOnlyNotification()], { email: 'a@b.com' }, 'Hello');

// What's wrong? Scroll down...
//
//
//
//
//
//
//
// VIOLATION: L — Liskov Substitution
// ReadOnlyNotification extends BaseNotification but breaks its contract.
// Any caller that uses BaseNotification.send() will crash unexpectedly.
// FIX: Redesign the hierarchy. ReadOnlyNotification shouldn't extend a class
// that promises to send. Use a separate abstraction that doesn't have send().

console.log("(Snippet 3 — L violation: would throw if send() called)");
console.log("---");

// --- SNIPPET 4: SlackNotifier (forced interface) ---

class SlackNotifier {
  sendEmail(user, message) {
    // SlackNotifier cannot send email — but forced to implement this!
    throw new Error("Not supported");
  }

  sendSMS(user, message) {
    // SlackNotifier cannot send SMS — but forced to implement this!
    throw new Error("Not supported");
  }

  sendSlack(user, message) {
    // Only this makes sense for SlackNotifier
    console.log(`[Slack] to ${user.slackId}: ${message}`);
  }
}

const slackNotifier = new SlackNotifier();
slackNotifier.sendSlack({ slackId: "U12345" }, "Order shipped!");

// What's wrong? Scroll down...
//
//
//
//
//
//
//
// VIOLATION: I — Interface Segregation
// A fat "INotifier" interface forced SlackNotifier to implement methods it can't support.
// FIX: Split into IEmailSender, ISMSSender, ISlackSender.
// SlackNotifier implements only ISlackSender — nothing more.

console.log("---");

// --- SNIPPET 5: OrderProcessor ---

class MySQLDatabase {
  save(data) {
    console.log(`[MySQL] Saving order: ${JSON.stringify(data)}`);
  }
}

class StripePayment {
  charge(amount) {
    console.log(`[Stripe] Charging $${amount}`);
  }
}

class EmailNotifier {
  notify(user, message) {
    console.log(`[Email] to ${user.email}: ${message}`);
  }
}

class OrderProcessorBad {
  process(order) {
    // Creates all dependencies internally — tightly coupled!
    const db = new MySQLDatabase(); // Want PostgreSQL? Edit this.
    const payment = new StripePayment(); // Want Razorpay? Edit this.
    const notifier = new EmailNotifier(); // Want SMS? Edit this.

    db.save(order);
    payment.charge(order.total);
    notifier.notify(order.user, "Order placed!");
  }
}

console.log("❌ OrderProcessor DIP violation:\n");
const badProcessor = new OrderProcessorBad();
badProcessor.process({
  id: 42,
  total: 999,
  user: { email: "john@test.com" },
});

// What's wrong? Scroll down...
//
//
//
//
//
//
//
// VIOLATION: D — Dependency Inversion
// OrderProcessor creates its own concrete dependencies — can't swap, can't test.
// FIX: Inject db, payment, notifier via constructor.

class OrderProcessor {
  constructor(db, payment, notifier) {
    this.db = db;
    this.payment = payment;
    this.notifier = notifier;
  }

  process(order) {
    this.db.save(order);
    this.payment.charge(order.total);
    this.notifier.notify(order.user, "Order placed!");
  }
}

console.log("\n✅ OrderProcessor DIP fixed:\n");
const goodProcessor = new OrderProcessor(
  new MySQLDatabase(),
  new StripePayment(),
  new EmailNotifier(),
);
goodProcessor.process({
  id: 42,
  total: 999,
  user: { email: "john@test.com" },
});

// ========================================
// ANSWERS SUMMARY:
//
// Snippet 1 → S (Single Responsibility)  — too many jobs in UserService
// Snippet 2 → O (Open/Closed)            — if-else for new roles
// Snippet 3 → L (Liskov Substitution)    — subclass breaks parent's contract
// Snippet 4 → I (Interface Segregation)  — fat interface, unused methods
// Snippet 5 → D (Dependency Inversion)   — creates deps inside instead of injecting
// ========================================
