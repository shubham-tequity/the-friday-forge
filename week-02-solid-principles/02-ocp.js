// ========================================
// O — OPEN/CLOSED PRINCIPLE
// "Open for extension, closed for modification."
// Add new behavior by writing new code — not by editing old code.
// ========================================

// ❌ VIOLATION: Every new channel requires editing this function.
// Every edit risks breaking Email, SMS, and Push that already work.

class NotificationServiceBad {
  send(type, user, message) {
    if (type === "email") {
      console.log(`[Email] to ${user.email}: ${message}`);
    } else if (type === "sms") {
      console.log(`[SMS] to ${user.phone}: ${message}`);
    } else if (type === "push") {
      console.log(`[Push] to ${user.deviceId}: ${message}`);
    }
    // Boss: "Add WhatsApp" → edit here. Risk breaking email/sms/push.
    // Boss: "Add Slack"    → edit here. Again.
    // Boss: "Add Telegram" → edit here. Again.
  }
}

const user = {
  email: "john@test.com",
  phone: "+919999999999",
  deviceId: "device-abc123",
};

console.log("❌ VIOLATION — Every new channel = edit existing code:\n");
const badService = new NotificationServiceBad();
badService.send("email", user, "Order shipped!");
badService.send("sms", user, "Order shipped!");
badService.send("push", user, "Order shipped!");

// ========================================
// ✅ FIX: Each channel is its own class.
// Adding a new channel = writing a new class.
// Existing classes are never touched.
// ========================================

class EmailNotification {
  send(user, message) {
    console.log(`[Email] to ${user.email}: ${message}`);
  }
}

class SMSNotification {
  send(user, message) {
    console.log(`[SMS] to ${user.phone}: ${message}`);
  }
}

class PushNotification {
  send(user, message) {
    console.log(`[Push] to ${user.deviceId}: ${message}`);
  }
}

// New channel? New class. Zero changes to anything above.
class WhatsAppNotification {
  send(user, message) {
    console.log(`[WhatsApp] to ${user.phone}: ${message}`);
  }
}

// This orchestrator is CLOSED for modification — it never needs to change.
class NotificationService {
  sendAll(channels, user, message) {
    channels.forEach((channel) => channel.send(user, message));
  }
}

console.log("\n✅ FIX — New channel = new class, old code untouched:\n");
const service = new NotificationService();
service.sendAll(
  [
    new EmailNotification(),
    new SMSNotification(),
    new PushNotification(),
    new WhatsAppNotification(), // ← added without touching anything else
  ],
  user,
  "Order shipped!",
);

// ========================================
// COMPARE:
//
// ❌ BEFORE                    ✅ AFTER
// if-else for every channel    class per channel
// New channel = edit function  New channel = new file
// Edit = risk to all channels  Existing classes untouched
// Growing if-else forever      Flat list of focused classes
//
// When you feel the urge to add `else if` for a new type —
// stop. Write a new class instead. That's OCP.
// ========================================
