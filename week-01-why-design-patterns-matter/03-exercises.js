// ========================================
// SPOT THE SMELL
// For each snippet: What's the problem?
// How could it be better?
// ========================================


// --- SNIPPET A: Hardcoded Discount ---

function getDiscount(day) {
  if (day === 'Monday')    return 0.05;
  if (day === 'Tuesday')   return 0.10;
  if (day === 'Wednesday') return 0.15;
  if (day === 'Thursday')  return 0.05;
  if (day === 'Friday')    return 0.20;
  if (day === 'Saturday')  return 0.25;
  if (day === 'Sunday')    return 0.00;
}

// What's wrong? Scroll down for a better version...
//
//
//
//
//
//
//
//
//
// BETTER: Use a simple object (Strategy pattern)
const discounts = {
  Monday: 0.05, Tuesday: 0.10, Wednesday: 0.15,
  Thursday: 0.05, Friday: 0.20, Saturday: 0.25, Sunday: 0.00
};
const getDiscountBetter = (day) => discounts[day] ?? 0;


// --- SNIPPET B: Multiple Connections ---

// const db1 = new DatabaseConnection('server1');
// const db2 = new DatabaseConnection('server1');
// const db3 = new DatabaseConnection('server1');
// Oops — 3 connections to the same server!

// What's wrong? Should be ONE shared instance.
// Fix: Singleton pattern (Week 2)


// --- SNIPPET C: Too Many Responsibilities ---

function sendWelcome(user) {
  // Send email
  // const smtp = connectToSMTP('smtp.gmail.com');
  // smtp.send(user.email, 'Welcome!', '<h1>Hello!</h1>');
  // smtp.disconnect();

  // Also log to analytics
  // const analytics = new AnalyticsClient('UA-12345');
  // analytics.track('user_signup', { email: user.email });
  // analytics.flush();

  console.log(`Welcome email sent to ${user.email}`);
  console.log(`Analytics tracked: user_signup for ${user.email}`);
}

// What's wrong?
// - sendWelcome knows about SMTP, analytics, and more
// - What if we also need SMS? Push? Slack?
// - What if analytics tracking is needed in 5 other functions?
//
// Fix: Observer pattern (Week 4)
// "User signed up" is an EVENT.
// Anyone who cares can listen. The signup function
// doesn't need to know about email, SMS, or analytics.

sendWelcome({ email: 'alice@test.com' });
