// ===== LOGIN / SIGN UP (DEMO VERSION) =====
// IMPORTANT: This saves accounts in the browser's localStorage so you can learn
// how login pages work. A real website stores users on a server with a database
// and never keeps plain passwords. We'll build that version later.

const USERS_KEY = "reptoUsers";        // list of all registered users
const CURRENT_KEY = "reptoCurrentUser"; // the user who is logged in now

// ===== 1. HELPER FUNCTIONS =====
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loginUser(user) {
  // Save only the name and email, never the password
  localStorage.setItem(CURRENT_KEY, JSON.stringify({ name: user.name, email: user.email }));
}

// ===== 2. GRAB ELEMENTS =====
const tabSignin = document.getElementById("tabSignin");
const tabSignup = document.getElementById("tabSignup");
const signinForm = document.getElementById("signinForm");
const signupForm = document.getElementById("signupForm");
const message = document.getElementById("authMessage");

function showMessage(text, isError) {
  message.textContent = text;
  message.className = "auth-message " + (isError ? "error" : "success");
}

// ===== 3. SWITCH BETWEEN SIGN IN AND SIGN UP =====
function showForm(which) {
  message.textContent = "";
  if (which === "signin") {
    signinForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    tabSignin.classList.add("active");
    tabSignup.classList.remove("active");
  } else {
    signupForm.classList.remove("hidden");
    signinForm.classList.add("hidden");
    tabSignup.classList.add("active");
    tabSignin.classList.remove("active");
  }
}

tabSignin.addEventListener("click", () => showForm("signin"));
tabSignup.addEventListener("click", () => showForm("signup"));

// ===== 4. SIGN UP =====
signupForm.addEventListener("submit", (e) => {
  e.preventDefault(); // stop the page from reloading

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.", true);
    return;
  }
  if (password !== confirm) {
    showMessage("Passwords do not match.", true);
    return;
  }

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    showMessage("This email is already registered. Please sign in.", true);
    return;
  }

  const newUser = { name, email, password };
  users.push(newUser);
  saveUsers(users);
  loginUser(newUser);

  showMessage("Account created! Taking you to Repto...", false);
  setTimeout(() => { window.location.href = "index.html"; }, 1000);
});

// ===== 5. SIGN IN =====
signinForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("signinEmail").value.trim().toLowerCase();
  const password = document.getElementById("signinPassword").value;

  const user = getUsers().find(u => u.email === email && u.password === password);

  if (!user) {
    showMessage("Wrong email or password.", true);
    return;
  }

  loginUser(user);
  showMessage("Welcome back, " + user.name + "! Taking you to Repto...", false);
  setTimeout(() => { window.location.href = "index.html"; }, 800);
});
