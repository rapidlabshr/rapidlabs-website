document.addEventListener("DOMContentLoaded", () => {

const bookingModal = document.getElementById("bookingModal");
const openBtns = document.querySelectorAll(".hk-book");
const closeBtn = document.getElementById("closeBookingModal");

const detectBtn = document.getElementById("detectLocation");
const locationInput = document.getElementById("locationInput");
const testTypeInput = document.getElementById("testTypeInput");

const bookingForm = document.getElementById("bookingForm");

let userLat = null;
let userLng = null;


/* ================= OPEN BOOKING MODAL ================= */

openBtns.forEach(btn => {

  btn.addEventListener("click", () => {

    const card = btn.closest(".hk-card");
    const testName = card?.querySelector(".hk-name")?.innerText || "";

    if(testTypeInput){
      testTypeInput.value = testName;
    }

    bookingModal.style.display = "flex";

  });

});


/* ================= CLOSE MODAL ================= */

closeBtn?.addEventListener("click", () => {
  bookingModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if(e.target === bookingModal){
    bookingModal.style.display = "none";
  }
});


/* ================= DETECT USER LOCATION ================= */

detectBtn?.addEventListener("click", () => {

  if(!navigator.geolocation){
    alert("Location not supported");
    return;
  }

  locationInput.value = "Detecting location...";

  navigator.geolocation.getCurrentPosition(async (pos) => {

    userLat = pos.coords.latitude;
    userLng = pos.coords.longitude;

    // INSTANT DISPLAY
    locationInput.value = `${userLat.toFixed(5)}, ${userLng.toFixed(5)}`;

    // BACKGROUND ADDRESS FETCH
    try{

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${userLat}&lon=${userLng}&format=json`
      );

      const data = await res.json();
      const a = data.address;

      const location = [
        a.suburb || a.neighbourhood,
        a.city || a.town || a.village,
        a.state,
        a.postcode
      ].filter(Boolean).join(", ");

      if(location){
        locationInput.value = location;
      }

    }catch{
      console.log("Address fetch failed");
    }

  },
  ()=>{
    locationInput.value="";
    alert("Unable to access location");
  },
  {
    enableHighAccuracy:true
  });

});


/* ================= CHECK DISTANCE FROM LAB ================= */

async function checkDistance(){

  if(!userLat || !userLng){
    alert("Please detect your location first.");
    return false;
  }

  try{

    const res = await fetch("http://127.0.0.1:5000/api/check-distance",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body: JSON.stringify({
        latitude:userLat,
        longitude:userLng
      })

    });

    const data = await res.json();

    if(!data.allowed){

      alert("❌ Home collection not available in your area.\nYou can request special pickup.");

      return false;

    }

    return true;

  }catch(error){

    console.error(error);
    alert("Unable to verify location. Make sure backend is running.");

    return false;

  }

}

});