document.addEventListener("DOMContentLoaded", () => {

  const dateInput   = document.getElementById("appointmentDate");
  const timeSlots   = document.querySelectorAll(".time-slot");
  const nextBtn     = document.getElementById("nextBtn");

  const summaryDate = document.getElementById("summaryDate");
  const summaryTime = document.getElementById("summaryTime");

  let selectedDate = "";
  let selectedTime = "";

  /* ===============================
     AUTO SELECT TOMORROW
  ================================ */
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yyyy = tomorrow.getFullYear();
  const mm   = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const dd   = String(tomorrow.getDate()).padStart(2, "0");

  const tomorrowStr = `${yyyy}-${mm}-${dd}`;
  dateInput.value = tomorrowStr;
  dateInput.min   = tomorrowStr;

  selectedDate = tomorrowStr;
  summaryDate.textContent = formatDate(tomorrowStr);

  /* ===============================
     AUTO SELECT FIRST SLOT
  ================================ */
  if (timeSlots.length) {
    timeSlots[0].classList.add("active");
    selectedTime = timeSlots[0].textContent;
    summaryTime.textContent = selectedTime;
  }

  /* ===============================
     DATE CHANGE
  ================================ */
  dateInput.addEventListener("change", () => {
    selectedDate = dateInput.value;
    summaryDate.textContent = formatDate(selectedDate);
  });

  /* ===============================
     TIME SLOT SELECTION
  ================================ */
  timeSlots.forEach(slot => {
    slot.addEventListener("click", () => {
      timeSlots.forEach(s => s.classList.remove("active"));
      slot.classList.add("active");

      selectedTime = slot.textContent;
      summaryTime.textContent = selectedTime;
    });
  });

  /* ===============================
     NEXT BUTTON
  ================================ */
  nextBtn.addEventListener("click", () => {

  localStorage.setItem(
    "rapidlabs_appointment",
    JSON.stringify({
      date: selectedDate,
      time: selectedTime
    })
  );

    window.location.href = "payment.html";
  });

});

/* ===============================
   DATE FORMATTER
================================ */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
