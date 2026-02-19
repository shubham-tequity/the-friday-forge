// ========================================
// S — SINGLE RESPONSIBILITY PRINCIPLE
// "A class should have only one reason to change."
// ========================================

// ❌ VIOLATION: One class doing five different jobs
// Every time ANY of these change (email provider, analytics tool,
// message format, DB schema, user lookup), this one class changes.

class NotificationServiceBad {
  send(userId, message) {
    // Job 1: Fetch user from database
    const user = {
      id: userId,
      name: "John",
      email: "john@test.com",
      phone: "+919999999999",
    };
    console.log(`[DB] Fetched user: ${user.name}`);

    // Job 2: Format the message
    const date = new Date().toISOString().split("T")[0];
    const formatted = `[${date}] ${message}`;

    // Job 3: Send email
    console.log(`[SMTP] Email to ${user.email}: ${formatted}`);

    // Job 4: Track in analytics
    console.log(`[Analytics] Tracked: notification_sent for user ${userId}`);

    // Job 5: Save log to database
    console.log(`[DB] Saved log: userId=${userId}`);

    return `Sent to ${user.email}`;
  }
}

console.log("❌ VIOLATION — One class, five jobs:\n");
const badService = new NotificationServiceBad();
console.log(badService.send(1, "Your order has shipped!"));

// ========================================
// ✅ FIX: Each class has exactly ONE job
// One reason to change = one class.
// ========================================

// Only knows how to fetch users
class UserRepository {
  find(id) {
    return { id, name: "John", email: "john@test.com", phone: "+919999999999" };
  }
}

// Only knows how to format messages
class MessageFormatter {
  format(message) {
    const date = new Date().toISOString().split("T")[0];
    return `[${date}] ${message}`;
  }
}

// Only knows how to send emails
class EmailSender {
  send(email, message) {
    console.log(`[SMTP] Email to ${email}: ${message}`);
  }
}

// Only knows how to log notifications
class NotificationLogger {
  log(userId) {
    console.log(`[Analytics] Tracked: notification_sent for user ${userId}`);
    console.log(`[DB] Saved log: userId=${userId}`);
  }
}

// Only knows how to coordinate the pieces
class NotificationService {
  constructor(repo, formatter, sender, logger) {
    this.repo = repo;
    this.formatter = formatter;
    this.sender = sender;
    this.logger = logger;
  }

  send(userId, message) {
    const user = this.repo.find(userId);
    const formatted = this.formatter.format(message);
    this.sender.send(user.email, formatted);
    this.logger.log(userId);
    return `Sent to ${user.email}`;
  }
}

console.log("\n✅ FIX — Each class has one job:\n");
const service = new NotificationService(
  new UserRepository(),
  new MessageFormatter(),
  new EmailSender(),
  new NotificationLogger(),
);
console.log(service.send(1, "Your order has shipped!"));

// ========================================
// COMPARE:
//
// ❌ BEFORE                    ✅ AFTER
// One class, 5 jobs            5 classes, 1 job each
// 5 reasons to change          1 reason per class
// Can't test email alone       Test EmailSender in isolation
// Analytics change = touch     Analytics change = only NotificationLogger
// this class                   changes. Nothing else.
// ========================================
