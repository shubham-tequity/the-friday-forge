// ========================================
// SAME ORDER SYSTEM — BUT WITH PATTERNS
// Zero if-else. Easy to extend.
// ========================================

// --- Pricing is its OWN thing ---
// (Strategy pattern — Week 5)

const pricingRules = {
  regular:  (price) => price,
  premium:  (price) => price * 0.9,
  gold:     (price) => price * 0.8,
  employee: (price) => price * 0.5,
  vip:      (price) => price * 0.7,
  // TRY: Add "platinum" with 25% off — just ONE line, nothing else changes
};

function calculatePrice(basePrice, customerType) {
  const rule = pricingRules[customerType];
  if (!rule) throw new Error(`Unknown customer type: ${customerType}`);
  return rule(basePrice);
}

// --- Notifications are their OWN thing ---
// (Strategy + Factory pattern — Weeks 3 & 5)

const notifiers = {
  email:    (to, msg) => console.log(`EMAIL to ${to.email}: ${msg}`),
  sms:      (to, msg) => console.log(`SMS to ${to.phone}: ${msg}`),
  push:     (to, msg) => console.log(`PUSH to ${to.deviceId}: ${msg}`),
  whatsapp: (to, msg) => console.log(`WHATSAPP to ${to.phone}: ${msg}`),
  // TRY: Add "slack" — just ONE line
};

function sendNotification(type, recipient, message) {
  const notify = notifiers[type];
  if (!notify) throw new Error(`Unknown notification type: ${type}`);
  notify(recipient, message);
}

// --- The main function just COORDINATES ---
// (Facade pattern — Week 9)

function processOrder(order) {
  const finalPrice = calculatePrice(order.basePrice, order.customerType);

  sendNotification(
    order.notifyBy,
    order,
    `Order confirmed! Price: $${finalPrice}`
  );

  saveOrder(order.id, finalPrice);

  return { orderId: order.id, finalPrice, status: 'processed' };
}

function saveOrder(id, price) {
  console.log(`Saved order ${id} with price $${price}`);
}

// --- Test it (same input, same output) ---

const result = processOrder({
  id: 101,
  basePrice: 100,
  customerType: 'gold',
  notifyBy: 'email',
  email: 'john@test.com',
});

console.log(result);

// ========================================
// COMPARE WITH 01-the-problem.js:
//
// BEFORE                    AFTER
// 15 if-else branches       0 if-else branches
// Change = scary            Change = easy
// Test = impossible          Test = test each piece alone
//
// New customer type?  → Add ONE line to pricingRules
// New notification?   → Add ONE line to notifiers
// Nothing else changes. Nothing else breaks.
// ========================================
