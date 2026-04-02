document.addEventListener("DOMContentLoaded", () => {

const memberList = document.getElementById("memberList");
const nextBtn = document.getElementById("memberNextBtn");
const addBtn = document.getElementById("addMemberBtn");

const modal = document.getElementById("memberModal");
const saveBtn = document.getElementById("saveMember");
const cancelBtn = document.getElementById("cancelMember");

const detectBtn = document.getElementById("detectLocation");

let editingMemberId = null;

let members = JSON.parse(localStorage.getItem("rapidlabs_members")) || [];


/* CREATE SELF MEMBER */

if(members.length === 0){

members = [{
id:1,
name:"Self",
mobile:"",
age:"",
gender:"",
location:"",
type:"self"
}];

localStorage.setItem("rapidlabs_members", JSON.stringify(members));

}


renderMembers();

function renderMembers(){

  memberList.innerHTML = "";

  members.forEach(member => {

    const div = document.createElement("div");
    div.className = "member-card";

    const selectedMembers = JSON.parse(localStorage.getItem("rapidlabs_selected_members")) || [];
    const isChecked = selectedMembers.some(m => m.id === member.id);

    div.innerHTML = `
    <input type="checkbox" class="member-checkbox" value="${member.id}" ${isChecked ? "checked" : ""}>

      <div>
        <strong>${member.name}</strong><br>

        <small>
          ${member.mobile || ""}
          ${member.age ? " | Age " + member.age : ""}
          ${member.gender ? " | " + member.gender : ""}
          <br>
          ${member.location || ""}
        </small>
      </div>

      <button class="editMember" data-id="${member.id}">
        Edit
      </button>
    `;

    const checkbox = div.querySelector(".member-checkbox");

    checkbox.addEventListener("change", () => {
        updateSelectedMembers();
        });



    /* ===============================
       CARD CLICK
    =============================== */
    div.onclick = function(e){

        if(e.target.classList.contains("member-checkbox")) return;
      // prevent edit click
      if(e.target.classList.contains("editMember")) return;

      // SELF MEMBER CHECK
      if(member.type === "self"){

        if(!member.mobile || !member.age || !member.gender || !member.location){
          openEditForm(member.id);
          return;
        }
      }

      // toggle checkbox
      checkbox.checked = !checkbox.checked;

      updateSelectedMembers();
    };

    /* ===============================
       EDIT BUTTON
    =============================== */
    div.querySelector(".editMember").onclick = function(e){
      e.stopPropagation();
      openEditForm(member.id);
    };

    memberList.appendChild(div);

  });

}


/* ===============================
   UPDATE SELECTED MEMBERS
================================ */
function updateSelectedMembers(){

  const selectedIds = [];

  document.querySelectorAll(".member-checkbox:checked").forEach(cb=>{
    selectedIds.push(Number(cb.value));
  });

  const selectedMembers = members.filter(m => selectedIds.includes(m.id));

  localStorage.setItem(
    "rapidlabs_selected_members",
    JSON.stringify(selectedMembers)
  );

  // enable / disable next button
  nextBtn.disabled = selectedMembers.length === 0;
}



/* OPEN EDIT FORM */

function openEditForm(id){

const member = members.find(m=>m.id == id);

editingMemberId = id;

document.getElementById("memberName").value = member.name==="Self" ? "" : member.name;
document.getElementById("memberMobile").value = member.mobile || "";
document.getElementById("memberAge").value = member.age || "";
document.getElementById("memberGender").value = member.gender || "";
document.getElementById("memberLocation").value = member.location || "";

modal.style.display="flex";

}



/* ADD MEMBER */

addBtn.addEventListener("click",()=>{

editingMemberId=null;

document.getElementById("memberName").value="";
document.getElementById("memberMobile").value="";
document.getElementById("memberAge").value="";
document.getElementById("memberGender").value="";
document.getElementById("memberLocation").value="";

modal.style.display="flex";

});


cancelBtn.addEventListener("click",()=>{
modal.style.display="none";
});



/* DETECT LOCATION */

detectBtn.addEventListener("click",()=>{

const locationInput=document.getElementById("memberLocation");

if(!navigator.geolocation){
alert("Location not supported");
return;
}

locationInput.value="Detecting location...";

navigator.geolocation.getCurrentPosition(async pos=>{

const lat=pos.coords.latitude;
const lon=pos.coords.longitude;

try{

const res=await fetch(
`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
);

const data=await res.json();

const a=data.address;

const location=[
a.suburb || a.neighbourhood,
a.city || a.town || a.village,
a.state,
a.postcode
].filter(Boolean).join(", ");

locationInput.value=location;

}catch{

locationInput.value="Location detected";

}

});

});



/* SAVE MEMBER */

saveBtn.addEventListener("click",()=>{

const name=document.getElementById("memberName").value.trim();
const mobile=document.getElementById("memberMobile").value.trim();
const age=document.getElementById("memberAge").value.trim();
const gender=document.getElementById("memberGender").value;
const location=document.getElementById("memberLocation").value.trim();

if(!name || !mobile || !age || !gender || !location){

alert("Please fill all fields");
return;

}


if(editingMemberId){

const member=members.find(m=>m.id==editingMemberId);

member.name=name;
member.mobile=mobile;
member.age=age;
member.gender=gender;
member.location=location;

// auto select updated member in multi-select
setTimeout(() => {
  renderMembers();
}, 0);

nextBtn.disabled = false;


}else{

members.push({
id:Date.now(),
name,
mobile,
age,
gender,
location
});

}


localStorage.setItem("rapidlabs_members", JSON.stringify(members));

modal.style.display="none";

renderMembers();

});


nextBtn.addEventListener("click",()=>{

const selected = JSON.parse(localStorage.getItem("rapidlabs_selected_members")) || [];

if(selected.length === 0){
alert("Please select member");
return;
}

window.location.href="date-time.html";

});

});