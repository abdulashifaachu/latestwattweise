
// Loading Screen
window.addEventListener('load', () => {
   const loader = document.getElementById('loadingScreen');
   if (loader) {
      setTimeout(() => {
         loader.classList.add('hidden');
      }, 800);
   }

   // Check if we are on the menu page and trigger entry animation
   const menuGrid = document.getElementById('menuGrid');
   if (menuGrid) {
      animateMenuEntry();
   }

   // Check for stats on load (Introduction page)
   if (document.querySelector('.metric-value')) {
      setTimeout(animateStats, 500);
   }
});

/**
 * MENU PAGE LOGIC
 */
const menuGrid = document.getElementById('menuGrid');

if (menuGrid) {
   const menuItems = document.querySelectorAll('.menu-item');
   const mainHeader = document.getElementById('mainHeader');
   const mainFooter = document.getElementById('mainFooter');

   // Menu Entry Animation
   function animateMenuEntry() {
      // Ensure items are hidden initially or have the initial-load class

      // Staggered fade in
      menuItems.forEach((item, index) => {
         setTimeout(() => {
            // If using CSS transitions class
            item.style.opacity = '1';
            item.style.transform = 'translateY(0) scale(1)';
         }, index * 100 + 500); // Start after loader
      });
   }

   // Menu Click - Exit Animation
   menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
         e.preventDefault(); // Stop immediate navigation
         const href = item.getAttribute('href');

         // Float out animation
         menuItems.forEach((menuItem, index) => {
            setTimeout(() => {
               menuItem.style.transition = 'all 0.4s ease-in';
               menuItem.style.opacity = '0';
               menuItem.style.transform = 'translateY(-20px) scale(0.9)';
            }, index * 30);
         });

         // Header/Footer fade out
         if (mainHeader) {
            mainHeader.style.transition = 'opacity 0.4s ease';
            mainHeader.style.opacity = '0';
         }
         if (mainFooter) {
            mainFooter.style.transition = 'opacity 0.4s ease';
            mainFooter.style.opacity = '0';
         }

         // Navigate after animation
         setTimeout(() => {
            window.location.href = href;
         }, 600);
      });
   });
}

/**
 * SHARED / PAGE SPECIFIC LOGIC
 */

// Tab Switching (Services Page)
function switchTab(btn, tabId) {
   document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
   btn.classList.add('active');

   document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
   const pane = document.getElementById(tabId);
   if (pane) pane.classList.add('active');
}

// Gallery Filter (Gallery Page)
function filterGallery(category, btn) {
   document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
   btn.classList.add('active');

   const items = document.querySelectorAll('.gallery-item');
   items.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
         item.style.display = 'block';
         item.style.animation = 'tabFade 0.4s ease-out';
      } else {
         item.style.display = 'none';
      }
   });
}

// Stats Animation (Introduction Page)
function animateStats() {
   const metricValues = document.querySelectorAll('.metric-value[data-target]');
   if (metricValues.length === 0) return;

   metricValues.forEach((el, index) => {
      setTimeout(() => {
         const rawTarget = el.dataset.target;
         const target = parseInt(rawTarget);
         const suffix = rawTarget.replace(/[0-9]/g, '');

         // Check if there is already a separate suffix element
         const nextSibling = el.nextElementSibling;
         const hasSuffixElement = nextSibling && nextSibling.classList.contains('metric-suffix');
         const suffixToDisplay = hasSuffixElement ? '' : suffix;

         let current = 0;
         const increment = Math.ceil(target / 50);
         const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
               current = target;
               clearInterval(timer);
               el.textContent = current + suffixToDisplay;
            } else {
               el.textContent = current + suffixToDisplay;
            }
         }, 30);
      }, index * 200);
   });
}

// Video Slider Logic (Training Page)
const sliderWrapper = document.querySelector(".cust-video-slider-wrapper");
if (sliderWrapper) {
   const track = document.getElementById("custSliderTrack");
   let slides = Array.from(document.querySelectorAll(".cust-video-slide"));
   let index = 0;
   const slideWidth = () => sliderWrapper.offsetWidth;

   // Auto-scroll forward
   setInterval(() => {
      index++;

      sliderWrapper.scrollTo({
         left: index * slideWidth(),
         behavior: "smooth",
      });

      // Check if we are at the last original slide
      if (index >= slides.length - 1) {
         // Clone slides dynamically
         slides.forEach((slide) => {
            const clone = slide.cloneNode(true);
            track.appendChild(clone);
         });

         // Update slides array
         slides = Array.from(document.querySelectorAll(".cust-video-slide"));
      }
   }, 11300);

   // Adjust scroll on resize
   window.addEventListener("resize", () => {
      sliderWrapper.scrollTo({
         left: index * slideWidth(),
         behavior: "auto",
      });
   });

   // Video autoplay/pause logic
   const videoSlides = document.querySelectorAll(".cust-video-slide video");
   const observer = new IntersectionObserver(
      (entries) => {
         entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting) {
               video.currentTime = 0;
               video.play().catch(e => console.log("Autoplay prevented", e));
            } else {
               video.pause();
            }
         });
      },
      {
         root: sliderWrapper,
         threshold: 0.5,
      }
   );
   videoSlides.forEach((video) => observer.observe(video));

   // Section visibility animation
   const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
         entries.forEach((entry) => {
            if (entry.isIntersecting) {
               sliderWrapper.classList.add("visible");
               observer.unobserve(entry.target);
            }
         });
      },
      { threshold: 0.3 }
   );
   sectionObserver.observe(sliderWrapper);
}
