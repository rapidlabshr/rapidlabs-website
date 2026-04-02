document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     SAFETY CHECK
  ================================ */
  if (!window.PRODUCT_DATA) {
    console.error("❌ PRODUCT_DATA not found");
    return;
  }

  const searchInput   = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const navSearch     = document.querySelector(".nav-search");

  if (!searchInput || !searchResults) {
    console.error("❌ Search DOM elements missing");
    return;
  }

  /* ===============================
     BUILD SEARCH INDEX
  ================================ */
  const PRODUCTS = Object.entries(window.PRODUCT_DATA).map(
    ([id, p]) => ({
      id: Number(id),
      name: p.name,
      price: p.price,
      details: p.details,
      text: `${p.name} ${p.details}`.toLowerCase()
    })
  );

  /* ===============================
     CART HELPERS (SYNC WITH cart.js)
  ================================ */
  function getCart() {
    return JSON.parse(localStorage.getItem("rapidlabs_cart")) || [];
  }

  function isInCart(id) {
    return getCart().some(item => item.id === id);
  }

  /* ===============================
     SMART MATCH (MULTI WORD)
  ================================ */
function smartMatch(text, query) {

  text = text.toLowerCase();
  query = query.toLowerCase();

  const SYNONYMS = {
    mri: ["scan", "imaging"],
    brain: ["neuro"],
    heart: ["cardiac"],
    sugar: ["diabetes", "glucose"],
    test: ["checkup", "profile"]
  };

  const words = query.split(" ").filter(Boolean);

  function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] =
          b[i - 1] === a[j - 1]
            ? matrix[i - 1][j - 1]
            : Math.min(
                matrix[i - 1][j - 1] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j] + 1
              );
      }
    }
    return matrix[b.length][a.length];
  }

  return words.every(word => {

    // Direct match
    if (text.includes(word)) return true;

    // Synonym match
    if (SYNONYMS[word]) {
      return SYNONYMS[word].some(syn => text.includes(syn));
    }

    // Fuzzy match (typo tolerance)
    return text.split(" ").some(tw => levenshtein(tw, word) <= 2);

  });
}

  /* ===============================
     SEARCH INPUT HANDLER
  ================================ */
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();

    if (!q) {
      searchResults.innerHTML = "";
      searchResults.style.display = "none";
      return;
    }

    const matches = PRODUCTS
      .map(p => {
        let score = 0;

        if (p.text.includes(q)) score += 10;
        if (smartMatch(p.text, q)) score += 5;

        return { ...p, score };
      })
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

    renderResults(matches);
  });

  /* ===============================
     CLICK OUTSIDE → CLOSE
  ================================ */
  document.addEventListener("click", e => {
    if (!navSearch.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.innerHTML = "";
      searchResults.style.display = "none";
    }
  });

  /* ===============================
     RENDER RESULTS
  ================================ */
  function renderResults(items) {
    searchResults.innerHTML = "";
    searchResults.style.display = "block";

    if (!items.length) {
      searchResults.innerHTML = `
        <div style="padding:14px;font-size:14px;color:#64748b;">
          No matching tests found
        </div>
      `;
      return;
    }

    items.forEach(p => {
      const inCart = isInCart(p.id);

      const div = document.createElement("div");
      div.className = "search-item";

      div.innerHTML = `
        <div class="search-info">
          <strong>${p.name}</strong>
          <small>${p.details}</small>
          <span>₹${p.price}</span>
        </div>
        <button class="search-cart-btn">
          ${inCart ? "View Cart" : "Add to Cart"}
        </button>
      `;

      const btn = div.querySelector("button");

      btn.addEventListener("click", e => {
        e.stopPropagation();

        if (isInCart(p.id)) {
          window.location.href = "cart.html";
        } else {
          addToCart(p.id); // 🔥 from cart.js
          btn.textContent = "View Cart";
          btn.style.background = "#8BC34A";
        }
      });

      searchResults.appendChild(div);
    });
  }

});


searchInput.addEventListener("focus", () => {
  navSearch.classList.add("active");
});

searchInput.addEventListener("blur", () => {
  setTimeout(() => navSearch.classList.remove("active"), 200);
});

document.addEventListener("DOMContentLoaded", function () {

  const input = document.getElementById("searchInput");

  if (!input) return;

  const texts = [
    "Search Blood Tests...",
    "Search Health Packages...",
    "Search Full Body Checkup...",
    "Search Thyroid Test...",
    "Search Diabetes Test...",
    "Search Scan Services..."
  ];

  let index = 0;

  function changePlaceholder() {
    input.style.opacity = "0.5";   // fade out
    setTimeout(() => {
      index = (index + 1) % texts.length;
      input.setAttribute("placeholder", texts[index]);
      input.style.opacity = "1";   // fade in
    }, 300);
  }

  setInterval(changePlaceholder, 2500);

});

/* ===============================
   🎤 Voice Search (Same Page)
================================ */
document.addEventListener("DOMContentLoaded", function () {

  const micIcon = document.querySelector(".mic-icon");
  const searchInput = document.getElementById("searchInput");

  if (!micIcon || !searchInput) {
    console.log("Mic or input not found");
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition not supported. Use Chrome.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  micIcon.addEventListener("click", function () {
    recognition.start();
    micIcon.classList.add("listening");
  });

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    searchInput.value = transcript;

    // Trigger your existing search
    searchInput.dispatchEvent(new Event("input"));
  };

  recognition.onend = function () {
    micIcon.classList.remove("listening");
  };

  recognition.onerror = function (event) {
    micIcon.classList.remove("listening");
    console.log(event.error);
  };

});