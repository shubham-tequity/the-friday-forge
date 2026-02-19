// ========================================
// D — DEPENDENCY INVERSION PRINCIPLE
// "Depend on abstractions, not on concretions."
// Don't create your dependencies inside — accept them from outside.
// ========================================

// ❌ VIOLATION: NotificationService creates its own dependencies.
// - Switching Gmail → SendGrid means editing NotificationService.
// - Testing is impossible without actually calling Gmail and Twilio.
// - The service is tightly coupled to specific providers forever.

class GmailSender {
  send(email, message) {
    console.log(`[Gmail] to ${email}: ${message}`);
  }
}

class TwilioSender {
  send(phone, message) {
    console.log(`[Twilio] to ${phone}: ${message}`);
  }
}

class ConsoleLogger {
  log(message) {
    console.log(`[LOG] ${message}`);
  }
}

class NotificationServiceBad {
  constructor() {
    // Hard-coded. Can't swap. Can't test.
    this.emailSender = new GmailSender();
    this.smsSender = new TwilioSender();
    this.logger = new ConsoleLogger();
  }

  notify(user, message) {
    this.emailSender.send(user.email, message);
    this.smsSender.send(user.phone, message);
    this.logger.log(`Notified ${user.email}`);
  }
}

console.log("❌ VIOLATION — Hard-coded dependencies:\n");
const badService = new NotificationServiceBad();
badService.notify({ email: "john@test.com", phone: "+919999999999" }, "Order placed!");

// ========================================
// ✅ FIX: Inject dependencies from outside.
// NotificationService doesn't care which concrete class it gets —
// as long as it behaves correctly.
// ========================================

// Fake implementations for testing — zero real network calls
class FakeEmailSender {
  send(email, message) {
    console.log(`[TEST] Fake email to ${email}: ${message}`);
  }
}

class FakeSMSSender {
  send(phone, message) {
    console.log(`[TEST] Fake SMS to ${phone}: ${message}`);
  }
}

class SilentLogger {
  log() {
    // No output in tests — intentionally silent
  }
}

// Dependencies come in from outside — injected via constructor
class NotificationService {
  constructor(emailSender, smsSender, logger) {
    this.emailSender = emailSender;
    this.smsSender = smsSender;
    this.logger = logger;
  }

  notify(user, message) {
    this.emailSender.send(user.email, message);
    this.smsSender.send(user.phone, message);
    this.logger.log(`Notified ${user.email}`);
  }
}

const user = { email: "john@test.com", phone: "+919999999999" };

console.log("\n✅ FIX — Production (real providers):\n");
const prodService = new NotificationService(
  new GmailSender(),
  new TwilioSender(),
  new ConsoleLogger(),
);
prodService.notify(user, "Order placed!");

console.log("\n✅ FIX — Testing (fake providers, same class):\n");
const testService = new NotificationService(
  new FakeEmailSender(),
  new FakeSMSSender(),
  new SilentLogger(), // silent — no noise in test output
);
testService.notify(user, "Order placed!");
console.log("(No SMS/Email logged above — SilentLogger suppressed it)");

// ========================================
// COMPARE:
//
// ❌ BEFORE                    ✅ AFTER
// new GmailSender() inside     GmailSender passed in from outside
// Can't swap providers         Swap by passing a different class
// Can't test without Gmail     Pass FakeEmailSender in tests
// Service knows too much       Service just uses whatever it receives
//
// Rule of thumb:
// If your constructor has `new ConcreteClass()` inside — DIP violation.
// Move those `new` calls to the caller.
// ========================================

// ========================================
// BRIEF: L — LISKOV SUBSTITUTION PRINCIPLE
// "Subclasses must be usable wherever their parent is used."
// ========================================

// ❌ VIOLATION: ReadOnlyNotification breaks the contract of Notification

class Notification {
  send(user, message) {
    console.log(`Notified ${user.email}: ${message}`);
  }
}

class ReadOnlyNotification extends Notification {
  send(user, message) {
    // Subclass breaks the parent's promise — callers will crash!
    throw new Error("This notification is read-only. Cannot send.");
  }
}

// Any code that expects Notification.send() to work will fail with ReadOnlyNotification.
// That's an LSP violation — the subclass is not a true substitute.

// ✅ FIX: If it can't send, it shouldn't extend a Notification that promises to send.
// Redesign the hierarchy or use a different abstraction.

// ========================================
// BRIEF: I — INTERFACE SEGREGATION PRINCIPLE
// "Don't force a class to implement methods it doesn't need."
// ========================================

// ❌ VIOLATION: SlackNotifier forced to implement email and SMS methods it can't support.

class SlackNotifier {
  sendEmail(user, message) {
    throw new Error("SlackNotifier cannot send email!"); // forced, makes no sense
  }

  sendSMS(user, message) {
    throw new Error("SlackNotifier cannot send SMS!"); // forced, makes no sense
  }

  sendSlack(user, message) {
    console.log(`[Slack] to ${user.slackId}: ${message}`); // only this makes sense
  }
}

// ✅ FIX: Separate small interfaces — each class implements only what it actually does.
// IEmailSender { sendEmail }
// ISMSSender   { sendSMS }
// ISlackSender { sendSlack }
// SlackNotifier implements only ISlackSender — nothing more.
