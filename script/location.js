document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("locationModal");
  const openBtn = document.getElementById("openLocationModal");
  const closeBtn = document.getElementById("closeLocationModal");
  const checkBtn = document.getElementById("checkAvailabilityBtn");
  const resultBox = document.getElementById("resultBox");
  const pincodeInput = document.getElementById("pincode");

  // 🔴 SAFETY CHECK
  if (!modal || !openBtn || !closeBtn) {
    console.error("Location modal elements not found");
    return;
  }

  // ============================
  // AUTO POPUP ONCE PER DAY
  // ============================
  const today = new Date().toISOString().slice(0, 10);
  const lastSeen = localStorage.getItem("locationModalLastSeen");

  if (lastSeen !== today) {
    modal.style.display = "flex";
    localStorage.setItem("locationModalLastSeen", today);
  }

  // ============================
  // OPEN MODAL
  // ============================
  openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // ============================
  // CLOSE MODAL
  // ============================
  closeBtn.addEventListener("click", closeModal);

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ============================
  // CHECK PINCODE BUTTON
  // ============================
  checkBtn.addEventListener("click", checkAvailability);

  function checkAvailability() {

    const pincode = pincodeInput.value.trim();

    // Validate pincode
    if (!/^\d{6}$/.test(pincode)) {
      resultBox.className = "error";
      resultBox.textContent = "❌ Please enter a valid 6-digit PIN code.";
      return;
    }

    // ============================
    // CALL BACKEND API
    // ============================
    fetch("http://127.0.0.1:5000/api/check-location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ pincode: pincode })
    })
      .then(res => res.json())
      .then(data => {

        if (data.available) {

          resultBox.className = "success";
          resultBox.innerHTML = `
            ✅ Home sample collection is available at your location.
            <a href="#" class="action-btn">Book Home Collection</a>
          `;

        } else {

          resultBox.className = "warning";
          resultBox.innerHTML = `
            ⚠️ Home collection is not available in your area yet.
            <a href="https://maps.google.com" target="_blank" class="action-btn">
              Visit Our Lab
            </a>
            <a href="tel:+919999999999" class="action-btn">
              Call for Special Pickup
            </a>
            <a href="#" class="action-btn">
              Notify Me When Available
            </a>
          `;

        }

      })
      .catch(error => {
        console.error("API Error:", error);
        resultBox.className = "error";
        resultBox.textContent = "⚠️ Unable to check location right now.";
      });

  }

  // ============================
  // CLOSE MODAL FUNCTION
  // ============================
  function closeModal() {
    modal.style.display = "none";
    resultBox.textContent = "";
    pincodeInput.value = "";
  }

});