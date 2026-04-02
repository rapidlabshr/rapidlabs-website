document.addEventListener("DOMContentLoaded", () => {
  const paymentSummary = document.getElementById("paymentSummary");
  const subTotalEl = document.getElementById("subTotal");
  const discountEl = document.getElementById("discountAmount");
  const totalEl = document.getElementById("totalPayable");

  const cart = JSON.parse(localStorage.getItem("rapidlabs_cart")) || [];
  const members = JSON.parse(localStorage.getItem("rapidlabs_selected_members")) || [];
  const appointment = JSON.parse(localStorage.getItem("rapidlabs_appointment"));

  let subtotal = 0;
  let discount = 0;

  /* ===============================
     RENDER SUMMARY
  ================================ */

  let html = `<h3>Tests</h3>`;
  const memberCount = members.length || 1;

  cart.forEach(item => {
    const totalItemPrice = item.price * memberCount;
    subtotal += totalItemPrice;

    html += `
      <div class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <p>${item.details}</p>
        </div>
        <div class="cart-item-right">₹${item.price}</div>
      </div>
    `;
  });

  if (members.length > 0) {
    html += `<h3>Patients (${members.length})</h3>`;

    members.forEach(m => {
      html += `<p>${m.name}</p>`;
    });
  }

  if (appointment) {
    html += `
      <h3>Appointment</h3>
      <p>${appointment.date}</p>
      <p>${appointment.time}</p>
    `;
  }

  paymentSummary.innerHTML = html;

  updateTotals();

  /* ===============================
     COUPON APPLY LOGIC
  ================================ */

document.querySelectorAll(".coupon-card button").forEach(btn => {
  btn.addEventListener("click", () => {

    const card = btn.closest(".coupon-card");
    const flat = card.dataset.discount;
    const percent = card.dataset.percent;

    discount = 0;

    // 🔥 FLAT COUPON (LAB100 → min ₹700)
    if (flat) {
      if (subtotal < 700) {
        const needed = 700 - subtotal;
        alert(`⚠️ Add ₹${needed} more to apply this coupon`);
        return;
      }
      discount = Number(flat);
    }

    // 🔥 PERCENT COUPON (HEALTH10 → min ₹450)
    if (percent) {
      if (subtotal < 450) {
        const needed = 450 - subtotal;
        alert(`⚠️ Add ₹${needed} more to apply this coupon`);
        return;
      }
      discount = Math.min((subtotal * percent) / 100, 300);
    }

    // RESET ALL
    document.querySelectorAll(".coupon-card").forEach(c => {
      c.classList.remove("applied");
      c.querySelector("button").textContent = "Apply";
    });

    card.classList.add("applied");
    btn.textContent = "Applied";

    updateTotals();
  });
});




function updateTotals() {

  const isCouponApplied = document.querySelector(".coupon-card.applied");

  // 🔥 CALCULATE HOME CHARGE
  if (!isCouponApplied && subtotal < 450) {
    homeCharge = 140;
  } else {
    homeCharge = 0;
  }

  // 🔹 UPDATE SUBTOTAL & DISCOUNT
  subTotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  discountEl.textContent = `-₹${discount.toFixed(2)}`;

  // 🔥 ADD HOME CHARGE ROW (if not exists)
  let homeRow = document.getElementById("homeChargeRow");

  if (!homeRow) {
    homeRow = document.createElement("div");
    homeRow.className = "summary-row";
    homeRow.id = "homeChargeRow";

    homeRow.innerHTML = `
      <span>Home Collection</span>
      <span id="homeCharge"></span>
    `;

    discountEl.parentElement.after(homeRow);
  }

  const homeChargeEl = document.getElementById("homeCharge");

  // 🔥 DISPLAY TEXT LOGIC
  if (!isCouponApplied && subtotal < 450) {
    homeChargeEl.textContent = `₹140 (Free above ₹500)`;
    homeChargeEl.style.color = "#dc2626"; // red
    homeChargeEl.style.fontWeight = "600";
  } else {
    homeChargeEl.textContent = `FREE`;
    homeChargeEl.style.color = "#16a34a"; // green
    homeChargeEl.style.fontWeight = "600";
  }

  // 🔥 ALWAYS SHOW ROW
  homeRow.style.display = "flex";

  // 🔥 FINAL TOTAL
  totalEl.textContent = `₹${(subtotal - discount + homeCharge).toFixed(2)}`;
}

  /* ===============================
   CONFIRM BOOKING
================================ */
const confirmBtn = document.getElementById("confirmPaymentBtn");
const paymentModal = document.getElementById("paymentModal");
const closePaymentModal = document.getElementById("closePaymentModal");

let finalLeadData = null;

// 👉 OPEN MODAL
confirmBtn.addEventListener("click", () => {

  if (members.length === 0) {
    alert("Please select patient");
    return;
  }

  if (!appointment) {
    alert("Please select date & time");
    return;
  }

  finalLeadData = {
  name: members.map(m => m.name).join(", "),
  mobile_number: members[0].mobile, // primary number
    test_name: cart.map(t => t.name).join(", "),
    location: member.location,
    pincode: "",
    amount: subtotal - discount,
    sample_date: appointment.date,
    sample_time: appointment.time
  };

  paymentModal.style.display = "flex";
});

// 👉 CLOSE MODAL
closePaymentModal.addEventListener("click", () => {
  paymentModal.style.display = "none";
});

document.getElementById("paymentForm").addEventListener("submit", async function(e){

  e.preventDefault();

  const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;

  try{

    if(paymentMethod === "online"){

      // 🔹 CREATE ORDER
      const orderRes = await fetch("http://127.0.0.1:5000/create-order",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ amount: finalLeadData.amount })
      });

      const order = await orderRes.json();

      const options = {
        key: "rzp_live_SSBMTmhAOm7s8f", // ⚠️ check this
        amount: order.amount,
        currency: "INR",
        name: "Rapid Labs",
        description: "Lab Booking",
        order_id: order.id,

        handler: async function () {

          await fetch("http://127.0.0.1:5000/api/create-lead",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({
              ...finalLeadData,
              payment_status: "Paid"
            })
          });

          alert("✅ Payment Successful & Booking Confirmed");

          localStorage.clear();
          window.location.href = "success.html";
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();

    }else{

      // 🔹 OFFLINE
      await fetch("http://127.0.0.1:5000/api/create-lead",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          ...finalLeadData,
          payment_status: "Not Paid"
        })
      });

      alert("✅ Booking Confirmed! Pay at Home");

      localStorage.clear();
      window.location.href = "success.html";
    }

  }catch(err){
    console.error(err);
    alert("❌ Server error");
  }

});


});


