document.addEventListener('DOMContentLoaded', function () {
  let slideIndex = 0;     // Which slide is showing
  let slides, autoTimer;  // We'll store slides array + auto-advance timer

  // 1. On page load, gather slides & start the show
  window.onload = function () {
    slides = document.getElementsByClassName("mySlides");
    // Start auto-rotation
    showSlidesAuto();
  };

  // 2. Auto-advance function
  function showSlidesAuto() {
    // Hide all slides first
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
      slides[i].style.opacity = 0;
    }

    // Move to the next slide index
    slideIndex++;
    if (slideIndex > slides.length) {
      slideIndex = 1; // wrap to first
    }

    // Show the current slide
    slides[slideIndex - 1].style.display = "block";
    // Fade in
    setTimeout(() => {
      slides[slideIndex - 1].style.opacity = 1;
    }, 50);

    // Change image every 1 second
    autoTimer = setTimeout(showSlidesAuto, 2500);
  }

  // 3. Manual controls
  function nextSlide() {
    clearTimeout(autoTimer); // Stop auto for an immediate manual change
    slideIndex++;
    if (slideIndex > slides.length) {
      slideIndex = 1;
    }
    showSlideManual();
  }

  function prevSlide() {
    clearTimeout(autoTimer);
    slideIndex--;
    if (slideIndex < 1) {
      slideIndex = slides.length;
    }
    showSlideManual();
  }

  // 4. Show a slide immediately after a manual click, then restart auto
  function showSlideManual() {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
      slides[i].style.opacity = 0;
    }
    slides[slideIndex - 1].style.display = "block";
    // Fade in
    setTimeout(() => {
      slides[slideIndex - 1].style.opacity = 1;
    }, 50);

    // Restart auto
    autoTimer = setTimeout(showSlidesAuto, 2500);
  }
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');

  // Function to create and animate the ripple effect
  function createRipple(event) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = searchButton.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = event.clientX - rect.left - size / 2 + 'px';
    ripple.style.top = event.clientY - rect.top - size / 2 + 'px';
    searchButton.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Handle button click: trigger ripple and search action
  searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    if (searchInput.value.trim() !== '') {
      const input = { eventname: document.getElementById("searchInput").value };
      fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)

      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          console.log(data.Event_ID);
          window.location.href = `eventdetails.html?id=${data.Event_ID}`;
        });

    } else {
      searchInput.focus();
    }
  });

  // Allow the Enter key to trigger the search action
  searchInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      searchButton.click();
    }
  });
  const event_btn = document.querySelector('.event')

  const hamburger = document.getElementById("hamburger");
  const sideMenu = document.getElementById("sideMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  hamburger.addEventListener("click", () => {
    sideMenu.classList.toggle("open");
    menuOverlay.classList.toggle("open");
  });

  // If you want clicking outside the menu (on the overlay) to close it:
  menuOverlay.addEventListener("click", () => {
    sideMenu.classList.remove("open");
    menuOverlay.classList.remove("open");
  });
  const profile = document.getElementById("Profile");

  profile.addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = './user.html';
  })
  document.getElementById("Home").addEventListener("click", function () {
    document.getElementById("sideMenu").classList.remove("open");
    document.getElementById("menuOverlay").classList.remove("open");
  });

  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log(payload.name);
    const login_buttons = document.getElementById("login_btn");
    const login_buttons2 = document.getElementById("login_btn1");
    const hey = document.getElementById("hey");
    const pElement = document.createElement("p");
    pElement.className = 'intro';
    pElement.textContent = `Hi ${payload.name}`;
    login_buttons.replaceWith(pElement);
    const x = document.createElement("p");
    x.textContent = "";
    login_buttons2.replaceWith(x);
    hey.innerHTML = `<p>Hey! ${payload.name}</p>`
  }
  ;
  const ticket_info = document.getElementById("Ticketlog");
  ticket_info.addEventListener('click', function (event) {
    event.preventDefault();
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      window.location.href = `Mytickets.html?id=${payload.name}`;
    }

  })
  const signout = document.getElementById("Sign-out");
  signout.addEventListener('click', function (event) {
    event.preventDefault();
    localStorage.removeItem("token");
    location.reload();
  })
  const images = document.querySelectorAll('.event-card');

  images.forEach(image => {
    image.addEventListener('click', function (event) {
      event.preventDefault();
      const eventType = this.getAttribute('data-id')
      window.location.href = `categoryevents.html?id=${eventType}`
    });
  });
  const about=document.getElementById('')



});