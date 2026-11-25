// ===== 1. THE MENU DATA =====
// Each dish is an object. To add a new dish, copy one and change the values.
const menuItems = [
  { id: 1,  name: "Margherita Pizza",    category: "Pizza",        price: 249, emoji: "🍕", rating: 4.5, desc: "Classic cheese and tomato on a thin crust." },
  { id: 2,  name: "Paneer Tikka Pizza",  category: "Pizza",        price: 299, emoji: "🍕", rating: 4.4, desc: "Spicy paneer, onion and capsicum." },
  { id: 3,  name: "Chicken Burger",      category: "Burgers",      price: 179, emoji: "🍔", rating: 4.3, desc: "Crispy chicken with fresh lettuce and mayo." },
  { id: 4,  name: "Veg Cheese Burger",   category: "Burgers",      price: 149, emoji: "🍔", rating: 4.2, desc: "Veg patty with melted cheese." },
  { id: 5,  name: "Chicken Biryani",     category: "Biryani",      price: 220, emoji: "🍛", rating: 4.7, desc: "Fragrant rice with tender chicken and raita." },
  { id: 6,  name: "Mutton Biryani",      category: "Biryani",      price: 320, emoji: "🍛", rating: 4.6, desc: "Slow-cooked mutton with aromatic spices." },
  { id: 7,  name: "Masala Dosa",         category: "South Indian", price: 90,  emoji: "🥞", rating: 4.6, desc: "Crispy dosa with potato masala, sambar and chutney." },
  { id: 8,  name: "Idli Sambar (4 pcs)", category: "South Indian", price: 70,  emoji: "🍚", rating: 4.5, desc: "Soft idlis with hot sambar and chutney." },
  { id: 9,  name: "Filter Coffee",       category: "South Indian", price: 40,  emoji: "☕", rating: 4.8, desc: "Strong South Indian filter coffee." },
  { id: 10, name: "Chocolate Brownie",   category: "Desserts",     price: 120, emoji: "🍫", rating: 4.5, desc: "Warm, fudgy brownie." },
  { id: 11, name: "Gulab Jamun (3 pcs)", category: "Desserts",     price: 80,  emoji: "🍮", rating: 4.4, desc: "Soft dumplings soaked in sugar syrup." },
  { id: 12, name: "Vanilla Ice Cream",   category: "Desserts",     price: 90,  emoji: "🍨", rating: 4.1, desc: "Two scoops of creamy vanilla." }
];

// ===== 2. STATE =====
// The cart is an object like { 1: 2, 5: 1 } meaning: 2 of dish #1, 1 of dish #5.
let cart = {};
let currentCategory = "All";

// ===== 3. GRAB ELEMENTS FROM THE PAGE =====
const menuGrid     = document.getElementById("menuGrid");
const filters      = document.getElementById("filters");
const cartEl       = document.getElementById("cart");
const overlay      = document.getElementById("overlay");
const cartItemsEl  = document.getElementById("cartItems");
const cartCountEl  = document.getElementById("cartCount");
const cartTotalEl  = document.getElementById("cartTotal");
const searchForm   = document.getElementById("searchForm");
const locationInput = document.getElementById("locationInput");
const searchMessage = document.getElementById("searchMessage");

// ===== 4. SHOW THE MENU =====
function renderMenu() {
  // Keep only the dishes in the chosen category
  const items = currentCategory === "All"
    ? menuItems
    : menuItems.filter(item => item.category === currentCategory);

  // Turn each dish into a card of HTML
  menuGrid.innerHTML = items.map(item => `
    <div class="card">
      <div class="card-img">${item.emoji}</div>
      <div class="card-body">
        <h3>${item.name}</h3>
        <p class="desc">${item.desc}</p>
        <div class="card-bottom">
          <div>
            <div class="price">₹${item.price}</div>
            <div class="rating">⭐ ${item.rating}</div>
          </div>
          <button class="add-btn" data-id="${item.id}">Add</button>
        </div>
      </div>
    </div>
  `).join("");
}

// ===== 5. CART FUNCTIONS =====
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}

function changeQty(id, change) {
  cart[id] = (cart[id] || 0) + change;
  if (cart[id] <= 0) {
    delete cart[id]; // remove the dish when quantity reaches 0
  }
  renderCart();
}

function renderCart() {
  const ids = Object.keys(cart);
  let total = 0;
  let count = 0;

  if (ids.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty">Your cart is empty.<br>Add something tasty! 😋</p>`;
  } else {
    cartItemsEl.innerHTML = ids.map(id => {
      const item = menuItems.find(m => m.id === Number(id));
      const qty = cart[id];
      total += item.price * qty;
      count += qty;
      return `
        <div class="cart-row">
          <div class="emoji">${item.emoji}</div>
          <div class="info">
            <div>${item.name}</div>
            <small>₹${item.price} each</small>
          </div>
          <div class="qty">
            <button data-id="${item.id}" data-change="-1">−</button>
            <span>${qty}</span>
            <button data-id="${item.id}" data-change="1">+</button>
          </div>
        </div>
      `;
    }).join("");
  }

  cartCountEl.textContent = count;
  cartTotalEl.textContent = "₹" + total;
}

function openCart() {
  cartEl.classList.add("open");
  overlay.classList.add("open");
}

function closeCart() {
  cartEl.classList.remove("open");
  overlay.classList.remove("open");
}

// ===== 6. EVENTS (what happens when the user clicks) =====

// Category filter buttons
filters.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter")) return;
  document.querySelectorAll(".filter").forEach(btn => btn.classList.remove("active"));
  e.target.classList.add("active");
  currentCategory = e.target.dataset.category;
  renderMenu();
});

// "Add" buttons on the dish cards
menuGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-btn")) {
    addToCart(Number(e.target.dataset.id));
  }
});

// + and − buttons inside the cart
cartItemsEl.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  const change = e.target.dataset.change;
  if (id && change) {
    changeQty(Number(id), Number(change));
  }
});

// Open and close the cart
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// Place order (demo only: there is no real payment or server yet)
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty. Add some food first!");
    return;
  }
  alert("🎉 Order placed! Your food will arrive in about 30 minutes.\n(This is a demo.)");
  cart = {};
  renderCart();
  closeCart();
});

// Search box in the hero section
searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); // stop the page from reloading
  searchMessage.textContent = "Great! Showing kitchens that deliver to " + locationInput.value.trim() + " 👇";
  document.getElementById("menu").scrollIntoView();
});

// ===== 7. LOGIN LINK IN THE HEADER =====
// If someone is logged in (saved by auth.js), show their name and a Logout option.
function setupAuthLink() {
  const authLink = document.getElementById("authLink");
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("reptoCurrentUser"));
  } catch (error) {
    user = null;
  }

  if (user) {
    authLink.textContent = "Hi, " + user.name.split(" ")[0] + " (Logout)";
    authLink.href = "#";
    authLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("reptoCurrentUser");
      location.reload();
    });
  }
}

// ===== 8. START =====
renderMenu();
renderCart();
setupAuthLink();
