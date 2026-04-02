// /* ===============================
//    PRODUCTS MASTER DATA
// ================================ */
// const PRODUCTS = {
//   // Blood Tests
//   1: { name: "CBC Test", price: 280, details: "15 Parameters · Blood Test" },
//   2: { name: "CRP Test", price: 280, details: "70 Parameters · Blood Test" },
//   3: { name: "HbA1c Test", price: 455, details: "1 Parameter · Blood Test" },
//   4: { name: "Vitamin B12, D Test", price: 1890, details: "2 Parameters · Blood Test" },
//   5: { name: "Lipid Profile Test", price: 420, details: "8 Parameters · Blood Test" },
//   303: { name: "Kidney Function Test (KFT)", price: 700, details: "Blood Test · 8 Parameters" },

//   // Health Packages
//   6: { name: "Basic Health Checkup", price: 1299, details: "Routine health screening package" },
//   7: { name: "Master Health Checkup", price: 2499, details: "Comprehensive full body package" },
//   8: { name: "Heart Health Checkup", price: 2199, details: "Cardiac risk assessment tests" },
//   9: { name: "Well Women Checkup", price: 2299, details: "Women’s complete health profile" },
//   10:{ name: "Diabetic Profile", price: 1199, details: "Blood sugar & diabetes monitoring" }
// };


/* ===============================
   CART STORAGE HELPERS
================================ */
function getCart() {
  return JSON.parse(localStorage.getItem("rapidlabs_cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("rapidlabs_cart", JSON.stringify(cart));
}

/* ===============================
   ADD / REMOVE
================================ */
function addToCart(id) {

  const product = window.PRODUCT_DATA?.[id];
  if (!product) return;

  const name = product.name.toLowerCase();

// 🔥 small animation feedback
const cartBtn = document.querySelector(".cart-btn");
if (cartBtn) {
  cartBtn.style.transform = "scale(1.15)";
  setTimeout(() => {
    cartBtn.style.transform = "scale(1)";
  }, 200);
}

/* ===============================
   AUTO DETECT PARENT SCANS
================================ */

const parentScanIds = [11,12,13,14,15];

if (parentScanIds.includes(id)) {

  const name = product.name.toLowerCase();

  const relatedScans = Object.keys(window.PRODUCT_DATA)
    .map(Number)
    .filter(pid => {

      const p = window.PRODUCT_DATA[pid];
      const pname = p.name.toLowerCase();

      return pname.includes(name.split(" ")[0]) && pid !== id;

    });

  if (relatedScans.length > 0) {
    showScanModal(product.name, relatedScans);
    return;
  }
}

  /* ===============================
     NORMAL ADD TO CART
  ================================ */

  const cart = getCart();

  if (cart.find(item => Number(item.id) === Number(id))) return;

  cart.push({
    id: Number(id),
    name: product.name,
    price: product.price,
    details: product.details
  });

  saveCart(cart);
  updateCartCount();
  updateAddToCartButtons();
}


function showScanModal(parentName, subIds) {

  const modal = document.getElementById("scanModal");
  const optionsContainer = document.getElementById("scanOptions");
  const title = document.getElementById("scanModalTitle");
  const closeBtn = modal?.querySelector(".scan-close");

  if (!modal) return;

  title.textContent = `Select ${parentName.replace("Scan", "").trim()} Type`;

  modal.classList.add("active");
  optionsContainer.innerHTML = "";

  // Sort by price (low to high)
  subIds.sort((a, b) =>
    window.PRODUCT_DATA[a].price - window.PRODUCT_DATA[b].price
  );

  subIds.forEach(subId => {

    const product = window.PRODUCT_DATA[subId];

    const div = document.createElement("div");
    div.className = "scan-option";

    div.innerHTML = `
      <strong>${product.name}</strong>
      <div style="margin-top:6px;font-weight:600;color:#2563eb;">
        ₹${product.price}
      </div>
    `;

    div.onclick = function () {
      modal.classList.remove("active");
      addToCart(subId);
    };

    optionsContainer.appendChild(div);
  });

/* ===============================
   ADD "OTHER / NOT LISTED" OPTION
================================ */

const otherDiv = document.createElement("div");
otherDiv.className = "scan-option other-scan-box";

otherDiv.innerHTML = `
  <div style="margin-bottom:10px;">
    <strong>Other / Not Listed?</strong>
    <div style="margin-top:4px;color:#dc2626;font-weight:600;">
      Need a custom ${parentName.replace("Scan", "").trim()}?
    </div>
  </div>

  <div style="display:flex;gap:10px;margin-top:10px;">
    <button class="other-btn call-btn">📞 Call Now</button>
    <button class="other-btn whatsapp-btn">💬 WhatsApp</button>
  </div>
`;

// Prevent closing when clicking buttons container
otherDiv.onclick = function(e) {
  e.stopPropagation();
};

optionsContainer.appendChild(otherDiv);

/* ===============================
   BUTTON ACTIONS
================================ */

const callBtn = otherDiv.querySelector(".call-btn");
const whatsappBtn = otherDiv.querySelector(".whatsapp-btn");

// 📞 Direct Call
callBtn.onclick = function () {
  window.location.href = "tel:+919999999999";  // replace with your number
};

// 💬 WhatsApp with pre-filled message
whatsappBtn.onclick = function () {
  const message = encodeURIComponent(
    `Hello, I need a custom ${parentName}. Please assist.`
  );
  window.open(`https://wa.me/919999999999?text=${message}`, "_blank"); // replace number
};

  /* =============================== */

  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.remove("active");
  }

  window.onclick = function (e) {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  };
}

// remve from cart 
function removeFromCart(id) {
  let cart = getCart();

  cart = cart.filter(item => item.id !== id);

  saveCart(cart);

  renderCart();
  updateCartCount();
  updateAddToCartButtons();
}


/* ===============================
   CART COUNT (Footer)
================================ */
function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  const footerCount = document.getElementById("cart-count");
  const cartBtn = document.querySelector(".cart-btn");

  const cart = getCart();

  // Header count
  if (countEl) {
    countEl.innerText = cart.length;
    countEl.style.display = cart.length ? "inline-block" : "none";
  }

  // Footer count
  if (footerCount) {
    footerCount.innerText = cart.length;
  }

  // 🔥 ACTIVE STATE (MAIN FEATURE)
  if (cartBtn) {
    if (cart.length > 0) {
      cartBtn.classList.add("cart-active");
    } else {
      cartBtn.classList.remove("cart-active");
    }
  }
}

/* ===============================
   ADD TO CART → VIEW CART BUTTON
================================ */
function updateAddToCartButtons() {
  const cart = getCart();

  document.querySelectorAll(".hk-cart").forEach(btn => {
    const id = Number(btn.dataset.id);
    if (!id) return;

    const exists = cart.find(item => item.id === id);

    if (exists) {
      btn.textContent = "View Cart";
      btn.style.background = "#8BC34A";
      btn.onclick = () => window.location.href = "cart.html";
    } else {
      btn.textContent = "Add to Cart";
      btn.style.background = "#007bff";
      btn.onclick = () => addToCart(id);
    }
  });
}



/* ===============================
   CART PAGE RENDER
================================ */
function renderCart() {
  const container = document.getElementById("cartItems");
  const subTotalEl = document.getElementById("subTotal");
  const totalEl = document.getElementById("totalPayable");
  const nextBtn = document.getElementById("nextBtn");

  if (!container) return;

  const cart = getCart();
  container.innerHTML = "";

  let subtotal = 0;

if (cart.length === 0) {
  container.innerHTML = `
    <div class="empty-cart">
      <img src="../images/mtcart.webp" alt="Empty Cart">
      <h3>Your Cart is Empty</h3>
      <p>Add tests to proceed with booking</p>
    </div>
  `;
  subTotalEl.innerText = "₹0.00";
  totalEl.innerText = "₹0.00";
  nextBtn.disabled = false;
  return;
}


  cart.forEach(product => {

    subtotal += product.price;

    container.innerHTML += `
      <div class="cart-item">
        <div>
          <h3>${product.name}</h3>
          <p>${product.details}</p>
          <p>Report Delivery: 6 hours</p>
        </div>
        <div class="cart-item-right">
          <span class="price">₹${product.price.toFixed(2)}</span>
          <button class="remove-btn" onclick="removeFromCart(${product.id})">✕</button>
        </div>
      </div>
    `;
  });

  subTotalEl.innerText = `₹${subtotal.toFixed(2)}`;
  totalEl.innerText = `₹${subtotal.toFixed(2)}`;
  nextBtn.disabled = false;
}


/* ===============================
   NEXT BUTTON
================================ */
function initNextButton() {
  const nextBtn = document.getElementById("nextBtn");
  if (!nextBtn) return;

  nextBtn.addEventListener("click", () => {
    if (getCart().length === 0) {
      alert("⚠️ Please add at least one test to continue.");
      return;
    }
    window.location.href = "select-member.html";
  });
}

/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  updateAddToCartButtons();
  renderCart();
  initNextButton();
  initModal();   // ADD THIS LINE
});



/* ===============================
   MODAL LOGIC
================================= */

function initModal() {
  const modal = document.getElementById("productModal");
  const openBtn = document.getElementById("openModalBtn");
  const closeBtn = document.querySelector(".close-modal");
  const productList = document.getElementById("modalProductList");

  if (!modal || !openBtn) return;

  openBtn.addEventListener("click", function(e) {
    e.preventDefault();
    modal.style.display = "block";
    loadModalProducts();
  });

  closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
  });

  window.addEventListener("click", function(e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  const searchInput = document.getElementById("productSearch");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      loadModalProducts(this.value);
    });
  }
}



function loadModalProducts(filter = "") {
  const productList = document.getElementById("modalProductList");
  if (!productList) return;

  productList.innerHTML = "";

  const products = window.PRODUCT_DATA;

  if (!products) {
    productList.innerHTML = "<p>No products available</p>";
    return;
  }

  Object.keys(products).forEach(id => {
    const product = products[id];

    // 🔍 FILTER LOGIC
    if (
      product.name.toLowerCase().includes(filter.toLowerCase()) === false
    ) {
      return;
    }

    productList.innerHTML += `
      <div class="modal-product">
        <div>
          <strong>${product.name}</strong>
          <div style="font-size:13px;color:#64748b;">
            ${product.details}
          </div>
          <div style="font-weight:600;margin-top:4px;">
            ₹${product.price}
          </div>
        </div>
        <button onclick="handleAddClick(this, ${id})">
          Add
        </button>
      </div>
    `;
  });
}

function handleAddClick(btn, id) {
  addToCart(id);
  renderCart();

  // change UI
  btn.innerText = "Added";
  btn.style.background = "#22c55e"; // green
  btn.style.color = "#fff";
  btn.disabled = true;
}



function goToCart() {
  window.location.href = "cart.html";
}

function goToServices() {
  window.location.href = "services.html";
}