// ========================================
// ORDER PROCESSING SYSTEM
// "It works, so what's the problem?"
// ========================================

function processOrder(order) {

  // Calculate price
  let price = order.basePrice;

  if (order.customerType === 'regular') {
    price = price;
  } else if (order.customerType === 'premium') {
    price = price * 0.9;
  } else if (order.customerType === 'gold') {
    price = price * 0.8;
  } else if (order.customerType === 'employee') {
    price = price * 0.5;
  } else if (order.customerType === 'vip') {
    price = price * 0.7;
  }

  // Send notification
  if (order.notifyBy === 'email') {
    console.log(`Sending email to ${order.email}: Order confirmed! Price: $${price}`);
  } else if (order.notifyBy === 'sms') {
    console.log(`Sending SMS to ${order.phone}: Order confirmed! Price: $${price}`);
  } else if (order.notifyBy === 'push') {
    console.log(`Sending push to ${order.deviceId}: Order confirmed! Price: $${price}`);
  } else if (order.notifyBy === 'whatsapp') {
    console.log(`Sending WhatsApp to ${order.phone}: Order confirmed! Price: $${price}`);
  }

  // Save to database
  if (order.database === 'mysql') {
    console.log(`INSERT INTO mysql_orders VALUES (${order.id}, ${price})`);
  } else if (order.database === 'mongodb') {
    console.log(`db.orders.insertOne({ id: ${order.id}, price: ${price} })`);
  } else if (order.database === 'postgres') {
    console.log(`INSERT INTO pg_orders VALUES (${order.id}, ${price})`);
  }

  return { orderId: order.id, finalPrice: price, status: 'processed' };
}

// Test it — it works!
const result = processOrder({
  id: 101,
  basePrice: 100,
  customerType: 'gold',
  notifyBy: 'email',
  email: 'john@test.com',
  database: 'postgres'
});

console.log(result);

// ========================================
// THINK ABOUT:
//
// 1. What if we add a 6th customer type?
//    → Edit this function. Again. And again.
//
// 2. What if we add Slack notifications?
//    → Another if-else here AND everywhere else.
//
// 3. What if another function also calculates price?
//    → Copy-paste the if-else? Change one, forget the other. BUG.
//
// 4. How do you test just the pricing logic?
//    → You can't. It's tangled with notifications and database.
//
// 5. Two developers changing this function?
//    → Merge conflict. Every. Single. Time.
// ========================================
