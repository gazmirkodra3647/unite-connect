/* 
 * SophisticatedCode.js
 * This code demonstrates a sophisticated and complex implementation using JavaScript.
 * It showcases a custom API for managing a virtual store with user authentication and payment processing.
 */

// User class represents a user of the virtual store
class User {
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.cart = [];
    this.orders = [];
  }

  addToCart(item) {
    this.cart.push(item);
  }

  placeOrder() {
    const order = new Order(this.cart);
    this.orders.push(order);
    this.cart = [];
    return order;
  }
}

// Order class represents an order within the virtual store
class Order {
  constructor(items) {
    this.items = items;
    this.total = this.calculateTotal();
    this.paid = false;
  }

  calculateTotal() {
    let totalPrice = 0;
    for (const item of this.items) {
      totalPrice += item.price;
    }
    return totalPrice;
  }

  processPayment(paymentMethod) {
    paymentMethod.processPayment(this.total);
    this.paid = true;
  }
}

// PaymentMethod class represents a payment method associated with a user
class PaymentMethod {
  constructor(type, number, expiry) {
    this.type = type;
    this.number = number;
    this.expiry = expiry;
  }

  processPayment(amount) {
    console.log(`Processing payment of ${amount} with ${this.type} ending with ${this.number.substr(-4)}`);
    // Actual payment processing goes here...
  }
}

// Item class represents an item within the store
class Item {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

// Create users
const user1 = new User(1, "John Doe", "john.doe@example.com", "securepassword");
const user2 = new User(2, "Jane Smith", "jane.smith@example.com", "password123");

// Create items
const item1 = new Item(1, "Item 1", 10);
const item2 = new Item(2, "Item 2", 15);
const item3 = new Item(3, "Item 3", 20);

// Add items to user's cart
user1.addToCart(item1);
user1.addToCart(item2);
user2.addToCart(item3);

// Place orders and process payments
const order1 = user1.placeOrder();
const order2 = user2.placeOrder();

const paymentMethod1 = new PaymentMethod("Credit Card", "1234 5678 9012 3456", "12/23");
const paymentMethod2 = new PaymentMethod("PayPal", "jane.smith@example.com", null);

order1.processPayment(paymentMethod1);
order2.processPayment(paymentMethod2);

console.log("Order details:");
console.log(order1);
console.log(order2);