document.addEventListener("DOMContentLoaded", () => {

/* ================= STICKY HEADER ================= */
const header = document.querySelector(".menu-header");

if(header){
  window.addEventListener("scroll", () => {
    if(window.innerWidth >= 768){
      if(window.scrollY > 120){
        header.classList.add("is-sticky");
      }else{
        header.classList.remove("is-sticky");
      }
    }
  });
}


/* ================= HERO SLIDER ================= */
const heroSlides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const dotsContainer = document.querySelector(".slider-dots");

if(heroSlides.length && prevBtn && nextBtn && dotsContainer){

  let currentSlide = 0;
  let interval;

  heroSlides.forEach((_, index)=>{
    const dot = document.createElement("button");
    if(index === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);

    dot.addEventListener("click", ()=>{
      goToSlide(index);
    });
  });

  const dots = dotsContainer.querySelectorAll("button");

  function goToSlide(index){

    if(!heroSlides[index]) return;

    heroSlides.forEach(s=>s.classList.remove("active"));
    dots.forEach(d=>d.classList.remove("active"));

    heroSlides[index].classList.add("active");
    dots[index].classList.add("active");

    currentSlide = index;
  }

  function nextSlide(){
    currentSlide = (currentSlide + 1) % heroSlides.length;
    goToSlide(currentSlide);
  }

  function prevSlide(){
    currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    goToSlide(currentSlide);
  }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  interval = setInterval(nextSlide,5000);
}


/* ================= MOBILE MENU ================= */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger?.addEventListener("click",()=>{
  mobileMenu?.classList.toggle("active");
});


/* ================= FAQ / PARAMETERS ================= */
document.querySelectorAll(".param-header").forEach(header=>{
  header.addEventListener("click",()=>{
    header.parentElement.classList.toggle("active");
  });
});


/* ================= OFFER SLIDER ================= */
const offerSlides = document.querySelectorAll(".offer-slider .slide");
const offerDotsContainer = document.querySelector(".offer-slider .slider-dots");

if(offerSlides.length && offerDotsContainer){

  let current = 0;

  offerDotsContainer.innerHTML = "";

  offerSlides.forEach((_,i)=>{
    const dot = document.createElement("button");
    if(i === 0) dot.classList.add("active");
    offerDotsContainer.appendChild(dot);

    dot.addEventListener("click",()=>{
      goToOfferSlide(i);
    });
  });

  const dots = offerDotsContainer.querySelectorAll("button");

  function goToOfferSlide(i){

    if(!offerSlides[i]) return;

    offerSlides.forEach(s=>s.classList.remove("active"));
    dots.forEach(d=>d.classList.remove("active"));

    offerSlides[i].classList.add("active");
    dots[i].classList.add("active");

    current = i;
  }

  function nextOfferSlide(){
    current = (current + 1) % offerSlides.length;
    goToOfferSlide(current);
  }

  setInterval(nextOfferSlide,4000);
}


/* ================= LOCATION POPUP ================= */
const locationModal = document.querySelector(".location-modal");
const closePopup = document.querySelector(".close-btn");
const locationBtn = document.querySelector(".location-btn");

const KEY = "homePopupShown";
const ONE_DAY = 24*60*60*1000;

if(locationModal){

  const lastShown = localStorage.getItem(KEY);
  const now = Date.now();

  if(!lastShown || now-lastShown > ONE_DAY){
    locationModal.classList.add("active");
    localStorage.setItem(KEY,now);
  }

  locationBtn?.addEventListener("click",()=>{
    locationModal.classList.add("active");
  });

  closePopup?.addEventListener("click",()=>{
    locationModal.classList.remove("active");
  });

  locationModal.addEventListener("click",(e)=>{
    if(e.target === locationModal){
      locationModal.classList.remove("active");
    }
  });
}


/* ================= SEARCH ================= */
const navSearch = document.querySelector(".nav-search");
const searchBtn = document.querySelector(".search-btn");

searchBtn?.addEventListener("click",()=>{
  navSearch?.classList.toggle("active");
});


/* ================= BOOKING MODAL ================= */
const bookingModal = document.getElementById("bookingModal");
const openBtns = document.querySelectorAll(".hk-book");
const closeBookingBtn = document.getElementById("closeBookingModal");

const detectBtn = document.getElementById("detectLocation");
const locationInput = document.getElementById("locationInput");
const testTypeInput = document.getElementById("testTypeInput");

openBtns.forEach(btn=>{

  btn.addEventListener("click",()=>{

    const card = btn.closest(".hk-card");
    const testName = card?.querySelector(".hk-name")?.innerText || "";

    if(testTypeInput) testTypeInput.value = testName;

    bookingModal.style.display="flex";

  });

});

closeBookingBtn?.addEventListener("click",()=>{
  bookingModal.style.display="none";
});

window.addEventListener("click",(e)=>{
  if(e.target === bookingModal){
    bookingModal.style.display="none";
  }
});

});


/* ================= PACKAGE SCROLL ================= */
function scrollPackages(section,direction){

  const container = document.querySelector(`.hk-scroll[data-scroll="${section}"]`);

  if(!container) return;

  container.scrollBy({
    left: direction*300,
    behavior:"smooth"
  });

}