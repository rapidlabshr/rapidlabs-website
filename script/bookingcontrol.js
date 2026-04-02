/* ================= CREATE LEAD FUNCTION ================= */

window.createLead = async function(leadData){

    try{

        const res = await fetch("http://127.0.0.1:5000/api/create-lead",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify(leadData)

        });

        const data = await res.json();

        if(data.success){

            alert("✅ Booking confirmed! Our team will contact you.");

            localStorage.removeItem("rapidlabs_cart");
            localStorage.removeItem("rapidlabs_appointment");

            window.location.href="../index.html";

        }else{

            alert("❌ Booking failed.");

        }

    }catch(error){

        console.error(error);

        alert("❌ Server error. Backend may not be running.");

    }

};


document.addEventListener("DOMContentLoaded", () => {

const bookingForm = document.getElementById("bookingForm");
const bookingModal = document.getElementById("bookingModal");
const locationInput = document.getElementById("locationInput");
const testTypeInput = document.getElementById("testTypeInput");

if(!bookingForm) return;


/* ================= SUBMIT BOOKING ================= */

bookingForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || "offline";

    const name = bookingForm.querySelector('input[placeholder="Enter your name"]').value;
    const mobile = bookingForm.querySelector('input[placeholder="Enter phone number"]').value;

    const testName = testTypeInput.value;
    const location = locationInput.value;

    const pincode = location.split(",").pop().trim();


    /* ================= CART DATA ================= */

    const cart = JSON.parse(localStorage.getItem("rapidlabs_cart")) || [];

    let totalAmount = 0;
    let tests = "";


    /* ================= CASE 1 : CART BOOKING ================= */

    if(cart.length > 0){

        totalAmount = cart.reduce((sum,item)=> sum + (item.price || 0), 0);
        tests = cart.map(item => item.name).join(", ");

    }


    /* ================= CASE 2 : DIRECT TEST BOOKING ================= */

    else{

        tests = testName;

        /* FIND PRICE FROM PRODUCT_DATA */

        if(window.PRODUCT_DATA){

            const product = Object.values(window.PRODUCT_DATA)
                .find(p => p.name.trim().toLowerCase() === testName.trim().toLowerCase())

            if(product){
                totalAmount = product.price || 0;
            }

        }

        /* TRY PACKAGES */

        if(totalAmount === 0 && window.packages){

            const pkg = window.packages.find(p => p.name === testName);

            if(pkg){
                totalAmount = pkg.price || 0;
            }

        }

    }


    /* ================= LEAD DATA ================= */

        const sampleDate = document.getElementById("sampleDateInput").value;
        const sampleTime = document.getElementById("sampleTimeInput").value;

        const leadData = {
            name: name,
            mobile_number: mobile,
            test_name: tests,
            location: location,
            pincode: pincode,
            amount: totalAmount,
            sample_date: sampleDate,
            sample_time: sampleTime
        };

        console.log("Lead Data:", leadData)
/* ================= API CALL ================= */

try{

    if(paymentMethod === "online"){

        // 🔹 Create Razorpay order
        const orderRes = await fetch("http://127.0.0.1:5000/create-order",{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({ amount: totalAmount })
        });

        const order = await orderRes.json();

        const options = {
            key: "rzp_live_SSBMTmhAOm7s8f",
            amount: order.amount,
            currency: "INR",
            name: "Rapid Labs",
            description: "Lab Booking",
            order_id: order.id,

            handler: async function () {

                // ✅ Save lead after successful payment
                await fetch("http://127.0.0.1:5000/api/create-lead",{
                    method:"POST",
                    headers:{ "Content-Type":"application/json" },
                    body: JSON.stringify({
                        ...leadData,
                        payment_status: "Paid"
                    })
                });

                alert("✅ Payment Successful & Booking Confirmed");

                bookingModal.style.display = "none";
                bookingForm.reset();

                localStorage.removeItem("rapidlabs_cart");
                localStorage.removeItem("rapidlabs_appointment");

            }
        };

        const rzp = new Razorpay(options);
        rzp.open();

    }else{

        // 🔹 Offline booking
        const res = await fetch("http://127.0.0.1:5000/api/create-lead",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                ...leadData,
                payment_status: "Not Paid"
            })
        });

        const data = await res.json();

        if(data.success){

            alert("✅ Booking confirmed! Pay at Home");

            bookingModal.style.display = "none";
            bookingForm.reset();

            localStorage.removeItem("rapidlabs_cart");
            localStorage.removeItem("rapidlabs_appointment");

        }else{

            alert("❌ Booking failed.");

        }

    }

}catch(error){

    console.error(error);

    alert("❌ Server error. Backend may not be running.");

}

});

});


  /* ================= FOOTER BOOK TEST SUBMIT ================= */

  const bookBtn = document.getElementById("book-btn");
  const confirmMsg = document.getElementById("confirmation-message");

  if (bookBtn) {

    bookBtn.addEventListener("click", async function () {

      const name = document.getElementById("user-name").value.trim();
      const mobile = document.getElementById("mobile-number").value.trim();
      const test = document.getElementById("test-search").value.trim();

      if (!name || mobile.length !== 10 || !test) {
        confirmMsg.style.color = "red";
        confirmMsg.textContent = "Please fill all details correctly.";
        return;
      }

      const leadData = {
        name: name,
        mobile_number: mobile,
        test_name: test,
        location: "Not Provided",
        pincode: "",
        amount: 0,
        sample_date: "",
        sample_time: "",
        payment_status: "Not Paid"
      };

      try {

        // 🔥 CALL YOUR BACKEND FUNCTION
        await window.createLead(leadData);

      } catch (err) {

        console.error(err);
        confirmMsg.style.color = "red";
        confirmMsg.textContent = "❌ Failed to send booking.";

      }

    });

  }


//   uploaing file

document.getElementById("upload-btn").onclick = async function () {

  const fileInput = document.getElementById("prescription-file");
  const name = document.getElementById("prescription-name").value.trim();
  const mobile = document.getElementById("prescription-mobile").value.trim();
  const notes = document.getElementById("prescription-notes").value.trim();
  const message = document.getElementById("upload-confirmation");

  const file = fileInput.files[0];

  // ✅ VALIDATION
  if (!file) {
    message.style.display = "block";
    message.style.color = "red";
    message.innerText = "Please upload prescription file";
    return;
  }

  if (!name) {
    message.style.display = "block";
    message.style.color = "red";
    message.innerText = "Please enter name";
    return;
  }

  if (mobile.length !== 10) {
    message.style.display = "block";
    message.style.color = "red";
    message.innerText = "Enter valid mobile number";
    return;
  }

  // ✅ FORM DATA
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name);
  formData.append("mobile", mobile);
  formData.append("notes", notes);

  try {

    const res = await fetch("http://127.0.0.1:5000/api/upload-prescription", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.success) {

      message.style.display = "block";
      message.style.color = "green";
      message.innerText = "✅ Prescription uploaded successfully";

      // ✅ RESET FORM
      fileInput.value = "";
      document.getElementById("prescription-name").value = "";
      document.getElementById("prescription-mobile").value = "";
      document.getElementById("prescription-notes").value = "";

    } else {
      message.style.display = "block";
      message.style.color = "red";
      message.innerText = data.message || "Upload failed";
    }

  } catch (err) {
    console.error(err);
    message.style.display = "block";
    message.style.color = "red";
    message.innerText = "Server error (Flask not running?)";
  }

};


// ✅ FILE RENDER FUNCTION (keep this)
function renderFile(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();

  if (ext === "pdf") {
    return `<iframe src="${filePath}" width="100%" height="400"></iframe>`;
  } 
  else if (["jpg", "jpeg", "png"].includes(ext)) {
    return `<img src="${filePath}" width="200"/>`;
  } 
  else {
    return `<a href="${filePath}" target="_blank">Open File</a>`;
  }
}


// download report 
const downloadBtn = document.getElementById("download-btn");
const downloadMsg = document.getElementById("download-message");

if (downloadBtn) {

  downloadBtn.addEventListener("click", async function () {

    const id = document.getElementById("report-id").value.trim();
    const mobile = document.getElementById("report-mobile").value.trim();

    downloadMsg.style.display = "block";
    downloadMsg.textContent = "";

    // ✅ validation
    if (!id || mobile.length !== 10) {
      downloadMsg.style.color = "red";
      downloadMsg.textContent = "Enter valid ID and Mobile";
      return;
    }

    try {

      const res = await fetch("http://127.0.0.1:5000/api/get-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, mobile })
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      // ❌ INVALID DETAILS
      if (!data.success) {
        downloadMsg.style.color = "red";
        downloadMsg.textContent = "❌ Details not matching";
        return;
      }

      // ✅ REPORT READY (MAIN FIX)
      if (data.report_url) {

        downloadMsg.style.color = "green";
        downloadMsg.textContent = "✅ Report ready! Opening...";

        setTimeout(() => {
          window.open(data.report_url, "_blank");
        }, 500);

        return;
      }

      // ⏳ PENDING
      if (data.status === "pending") {
        downloadMsg.style.color = "orange";
        downloadMsg.textContent = "⏳ Report is still processing";
        return;
      }

      // ⚠️ FALLBACK
      downloadMsg.style.color = "red";
      downloadMsg.textContent = "❌ Report not available yet";

    } catch (error) {

      console.error(error);

      downloadMsg.style.color = "red";
      downloadMsg.textContent = "Server error";

    }

  });

}