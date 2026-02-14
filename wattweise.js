
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

   // Visually remove .html extension from URL for cleaner look
   try {
      if (window.location.pathname.endsWith('.html')) {
         // Remove .html
         let newPath = window.location.pathname.slice(0, -5);

         // If it ends with /index, replace with /home
         if (newPath.endsWith('/index')) {
            newPath = newPath.replace(/\/index$/, '/home');
         } else if (newPath === 'index') {
            newPath = 'home';
         }

         // Update URL without reloading
         window.history.replaceState({}, document.title, newPath + window.location.search + window.location.hash);
      }
   } catch (e) {
      // Functionality not available in local file:// protocol
      // console.log('URL rewriting skipped (local file protocol restriction)');
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

// Check for Tab URL Parameter on Load (Services Page)
window.addEventListener('load', () => {
   const urlParams = new URLSearchParams(window.location.search);
   const tabId = urlParams.get('tab');

   if (tabId) {
      // Find the button that corresponds to this tab
      const tabBtn = document.querySelector(`.tab-btn[onclick*="'${tabId}'"]`);
      if (tabBtn) {
         switchTab(tabBtn, tabId);
      }
   }
});

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
               video.play().catch(e => { /* console.log("Autoplay prevented", e) */ });
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

/**
 * SERVICE DETAILS PAGE LOGIC
 */

// Data storage for services
const serviceData = {
   // SOLUTIONS TAB
   'power-studies': {
      title: 'Power System Studies',
      subtitle: 'Ensuring Reliability, Safety, and Compliance',
      content: [
         {
            title: 'Load Flow & Voltage Drop Analysis',
            text: 'We perform detailed load flow analysis to determine the steady-state performance of your power system. Our studies identify overloaded equipment, voltage drop issues, and power factor correction requirements to ensure your network operates efficiently under various loading conditions.',
            image: 'images/coding-screen.jpg'
         },
         {
            title: 'Short Circuit Analysis',
            text: 'Our short circuit studies calculate the maximum fault currents at different points in your system. This is critical for sizing switchgear, verifying equipment ratings, and ensuring that protective devices can safely interrupt faults without catastrophic failure.',
            image: 'images/ai-optimized-templates.jpg'
         },
         {
            title: 'Protection Coordination',
            text: 'We design and validate protective device settings to ensure selectivity and speed. A well-coordinated system isolates faults quickly to minimize damage and downtime while keeping the rest of the network operational.',
            image: 'images/brand-identity.jpg'
         },
         {
            title: 'Arc Flash Hazard Analysis',
            text: 'Safety is paramount. We conduct Arc Flash Hazard Analysis in accordance with IEEE 1584 and NFPA 70E standards. We provide detailed labels, boundary calculations, and PPE recommendations to protect personnel from dangerous arc flash incidents.',
            image: 'images/digital-strategy.jpg'
         }
      ]
   },
   'arc-flash': {
      title: 'Arc Flash & Electrical Safety',
      subtitle: 'Protecting Personnel and Assets',
      content: [
         {
            title: 'Hazard Analysis',
            text: 'Comprehensive analysis to quantify the release of thermal energy caused by an electric arc. We determine the boundaries and incident energy levels to keep your team safe.',
            image: 'images/coding-screen.jpg'
         },
         {
            title: 'Labeling & Compliance',
            text: 'We provide NFPA 70E compliant arc flash labels for all your electrical equipment, ensuring clear communication of hazards to anyone working on the system.',
            image: 'images/ai-optimized-templates.jpg'
         },
         {
            title: 'Safety Training',
            text: 'Beyond analysis, we offer training to ensure your staff understands the risks of arc flash and knows how to interpret labels and select appropriate PPE.',
            image: 'images/brand-identity.jpg'
         },
         {
            title: 'Mitigation Strategies',
            text: 'If incident energy levels are high, we propose engineering solutions such as relay setting changes or arc-flash detection systems to lower the risk category.',
            image: 'images/digital-strategy.jpg'
         }
      ]
   },
   'power-quality': {
      title: 'Power Quality Analysis',
      subtitle: 'Optimizing System Performance',
      content: [
         {
            title: 'Harmonic Analysis',
            text: 'We identify sources of harmonic distortion and design filter solutions to prevent equipment overheating and malfunction.',
            image: 'images/coding-screen.jpg'
         },
         {
            title: 'Voltage Sag & Swell',
            text: 'Monitoring and analysis of voltage stability to protect sensitive electronics and manufacturing processes from costly interruptions.',
            image: 'images/ai-optimized-templates.jpg'
         },
         {
            title: 'Transient Analysis',
            text: 'Study of switching transients and lightning impacts to ensure appropriate surge protection is in place.',
            image: 'images/brand-identity.jpg'
         },
         {
            title: 'Monitoring Solutions',
            text: 'Implementation of power quality meters and monitoring systems for continuous tracking of electrical parameters.',
            image: 'images/digital-strategy.jpg'
         }
      ]
   },
   'energy-management': {
      title: 'Energy Management',
      subtitle: 'Efficiency & Sustainability',
      content: [
         {
            title: 'Energy Audits',
            text: 'Detailed assessment of energy consumption patterns to identify waste and opportunities for savings.',
            image: 'images/coding-screen.jpg'
         },
         {
            title: 'ISO 50001 Implementation',
            text: 'Guidance and support for establishing an Energy Management System compliant with international standards.',
            image: 'images/ai-optimized-templates.jpg'
         },
         {
            title: 'Loss Reduction',
            text: 'Analysis of technical losses in transformers and cables, proposing solutions to improve overall system efficiency.',
            image: 'images/brand-identity.jpg'
         },
         {
            title: 'Peak Shaving',
            text: 'Strategies to manage demand charges and optimize usage during peak tariff periods.',
            image: 'images/digital-strategy.jpg'
         }
      ]
   },
   'training': {
      title: 'Training Services',
      subtitle: 'Empowering Your Engineering Team',
      content: [
         {
            title: 'ETAP Workshops',
            text: 'Hands-on training sessions covering load flow, short circuit, protection, and arc flash analysis using ETAP software.',
            image: 'images/coding-screen.jpg'
         },
         {
            title: 'Power System Fundamentals',
            text: 'Core concepts of electrical engineering for new graduates and technicians, bridging the gap between theory and practice.',
            image: 'images/ai-optimized-templates.jpg'
         },
         {
            title: 'Safety Procedures',
            text: 'Training on electrical safety standards, lockout/tagout (LOTO), and safe working practices.',
            image: 'images/brand-identity.jpg'
         },
         {
            title: 'Custom Modules',
            text: 'Tailored training programs designed to address specific challenges and equipment configurations at your facility.',
            image: 'images/digital-strategy.jpg'
         }
      ]
   },
   'grid-analysis': {
      title: 'Grid Analysis',
      subtitle: 'Interconnection & Stability',
      content: [
         {
            title: 'Interconnection Studies',
            text: 'Assessing the impact of connecting new generation or large loads to the utility grid, ensuring compliance with grid codes.',
            image: 'images/coding-screen.jpg'
         },
         {
            title: 'Transient Stability',
            text: 'Dynamic simulation of system response to disturbances, ensuring the grid remains stable during faults and switching events.',
            image: 'images/ai-optimized-templates.jpg'
         },
         {
            title: 'Distributed Generation',
            text: 'Analysis of islanding, voltage regulation, and protection coordination for distributed energy resources.',
            image: 'images/brand-identity.jpg'
         },
         {
            title: 'Switching Studies',
            text: 'Evaluation of switching transients to prevent insulation breakdown and nuisance tripping.',
            image: 'images/digital-strategy.jpg'
         }
      ]
   },
   'engineering-services': {
      title: 'Engineering Services',
      subtitle: 'Concept to Commissioning',
      content: [
         {
            title: 'Detailed Design',
            text: 'Complete electrical design services including single line diagrams, layouts, and schematics for substations and industrial facilities.',
            image: 'images/coding-screen.jpg'
         },
         {
            title: 'Cable Sizing & Routing',
            text: 'Optimization of cable selection and routing paths to minimize cost and voltage drop while ensuring thermal capacity.',
            image: 'images/ai-optimized-templates.jpg'
         },
         {
            title: 'Earthing & Lightning Protection',
            text: 'Design of earthing grids and lightning protection systems to ensure personnel safety and equipment integrity.',
            image: 'images/brand-identity.jpg'
         },
         {
            title: 'Tendering Support',
            text: 'Preparation of technical specifications and bill of quantities (BOQ) for procurement and contracting.',
            image: 'images/digital-strategy.jpg'
         }
      ]
   },
   'protection-devices': {
      title: 'Meters & Protection',
      subtitle: 'Intelligent System Monitoring',
      content: [
         {
            title: 'Device Selection',
            text: 'Recommendation of appropriate protection relays and meters based on system requirements and budget.',
            image: 'images/coding-screen.jpg'
         },
         {
            title: 'Configuration & Logic',
            text: 'Development of relay logic schemes and configuration files for protective devices from major manufacturers.',
            image: 'images/ai-optimized-templates.jpg'
         },
         {
            title: 'Testing & Commissioning',
            text: 'Support during on-site testing to verify that protection systems operate as designed.',
            image: 'images/brand-identity.jpg'
         },
         {
            title: 'SCADA Integration',
            text: 'Integration of meters and relays into SCADA systems for remote monitoring and control.',
            image: 'images/digital-strategy.jpg'
         }
      ]
   },

   // INDUSTRIES TAB
   'data-centre': {
      title: 'Data Centre Solutions',
      subtitle: 'Mission Critical Power',
      content: [
         {
            title: 'Reliability Analysis',
            text: 'Tier-based reliability assessment to ensure 99.999% uptime for critical IT infrastructure.',
            image: 'images/design-screen.jpg'
         },
         {
            title: 'UPS & Generator Design',
            text: 'Sizing and integration of backup power systems to provide seamless continuity during utility outages.',
            image: 'images/brand-identity.jpg'
         },
         {
            title: 'PUE Optimization',
            text: 'strategies to reduce Power Usage Effectiveness (PUE) through efficient electrical distribution and cooling support.',
            image: 'images/motion-design.jpg'
         },
         {
            title: 'Failure Mode Analysis',
            text: 'Identification of single points of failure and development of redundancy strategies.',
            image: 'images/design-screen.jpg'
         }
      ]
   },
   'pharma': {
      title: 'Pharmaceutical Industry',
      subtitle: 'Precision & Compliance',
      content: [
         {
            title: 'Clean Room Power',
            text: 'Design of electrical systems for controlled environments, minimizing contamination risks.',
            image: 'images/brand-identity.jpg'
         },
         {
            title: 'GMP Compliance',
            text: 'Ensuring electrical infrastructure meets Good Manufacturing Practice (GMP) standards.',
            image: 'images/motion-design.jpg'
         },
         {
            title: 'Critical Process Protection',
            text: 'Protection schemes designed to prevent interruptions to sensitive batch manufacturing processes.',
            image: 'images/design-screen.jpg'
         },
         {
            title: 'Power Quality',
            text: 'Filtering solutions to protect sensitive laboratory and testing equipment.',
            image: 'images/brand-identity.jpg'
         }
      ]
   },
   'renewable-energy': {
      title: 'Renewable Energy',
      subtitle: 'Powering a Greener Future',
      content: [
         {
            title: 'Solar Farm Design',
            text: 'DC and AC system design for utility-scale solar PV plants, optimizing yield and efficiency.',
            image: 'images/motion-design.jpg'
         },
         {
            title: 'Wind Farm Collection',
            text: 'Design of medium voltage collector networks for wind farms to minimize losses.',
            image: 'images/design-screen.jpg'
         },
         {
            title: 'BESS Integration',
            text: 'Integration of Battery Energy Storage Systems for grid stabilization and time-shifting.',
            image: 'images/brand-identity.jpg'
         },
         {
            title: 'Grid Compliance',
            text: 'Ensuring renewable assets meet grid code requirements for voltage ride-through and frequency response.',
            image: 'images/motion-design.jpg'
         }
      ]
   },
   'advanced-manufacturing': {
      title: 'Advanced Manufacturing',
      subtitle: 'Efficiency & Automation',
      content: [
         {
            title: 'Robotics Integration',
            text: 'Power quality solutions to support sensitive robotic and automated assembly lines.',
            image: 'images/design-screen.jpg'
         },
         {
            title: 'Motor Control',
            text: 'Design of MCCs and VFD systems for efficient control of industrial motors.',
            image: 'images/brand-identity.jpg'
         },
         {
            title: 'Scalable Distribution',
            text: 'Flexible electrical distribution systems that allow for easy retooling and expansion.',
            image: 'images/motion-design.jpg'
         },
         {
            title: 'Safety Interlocks',
            text: 'Design of safety systems to protect operators and machinery.',
            image: 'images/design-screen.jpg'
         }
      ]
   },
   'oil-gas': {
      title: 'Power, Oil & Gas',
      subtitle: 'Robust Engineering for Harsh Environments',
      content: [
         {
            title: 'Explosion Proof Design',
            text: 'Design of electrical systems for hazardous areas (Ex) compliant with ATEX and IECEx.',
            image: 'images/brand-identity.jpg'
         },
         {
            title: 'Offshore Power',
            text: 'Specialized engineering for offshore platforms requiring high reliability and corrosion resistance.',
            image: 'images/motion-design.jpg'
         },
         {
            title: 'Large Motor Starting',
            text: 'Studies to analyze voltage drop during starting of large compressors and pumps.',
            image: 'images/design-screen.jpg'
         },
         {
            title: 'Emergency Systems',
            text: 'Critical power systems for emergency shutdown (ESD) and fire & gas detection.',
            image: 'images/brand-identity.jpg'
         }
      ]
   },
   'food-beverage': {
      title: 'Food & Beverage',
      subtitle: 'Hygiene & Uptime',
      content: [
         {
            title: 'Washdown Rated Systems',
            text: 'Specification of equipment suitable for high-pressure washdown environments.',
            image: 'images/motion-design.jpg'
         },
         {
            title: 'Process Continuity',
            text: 'Strategies to eliminate momentary outages that can spoil production batches.',
            image: 'images/design-screen.jpg'
         },
         {
            title: 'Refrigeration Power',
            text: 'Reliable power engineering for cold storage and refrigeration systems.',
            image: 'images/brand-identity.jpg'
         },
         {
            title: 'Energy Efficiency',
            text: 'Optimizing power usage in energy-intensive processing and packaging lines.',
            image: 'images/motion-design.jpg'
         }
      ]
   },

   // CONSULTING TAB
   'grid-modernization': {
      title: 'Grid Modernization',
      subtitle: 'Smart Infrastructure Strategy',
      content: [
         {
            title: 'Smart Grid Roadmap',
            text: 'Strategic planning for the adoption of smart meters, automation, and communication technologies.',
            image: 'images/digital-strategy.jpg'
         },
         {
            title: 'DER Strategy',
            text: 'Frameworks for integrating distributed energy resources into the legacy distribution grid.',
            image: 'images/tech-audit.jpg'
         },
         {
            title: 'Digital Twin',
            text: 'Development of digital twins for real-time simulation and predictive maintenance.',
            image: 'images/process-optimized.jpg'
         },
         {
            title: 'Regulatory Support',
            text: 'Assistance with navigating changing utility regulations and interconnection standards.',
            image: 'images/digital-strategy.jpg'
         }
      ]
   },
   'safety-audit': {
      title: 'Electrical Safety Audit',
      subtitle: 'Identifying & Mitigating Risks',
      content: [
         {
            title: 'Site Inspections',
            text: 'Physical inspection of electrical installations to identify code violations and safety hazards.',
            image: 'images/tech-audit.jpg'
         },
         {
            title: 'Compliance Review',
            text: 'Auditing documentation and procedures against local and international safety standards.',
            image: 'images/process-optimized.jpg'
         },
         {
            title: 'Risk Assessment',
            text: 'Quantitative and qualitative assessment of risks associated with electrical operations.',
            image: 'images/digital-strategy.jpg'
         },
         {
            title: 'Gap Analysis',
            text: 'Reporting on gaps between current practices and industry best practices, with corrective actions.',
            image: 'images/tech-audit.jpg'
         }
      ]
   },
   'system-optimization': {
      title: 'System Optimization',
      subtitle: 'Maximizing Performance',
      content: [
         {
            title: 'Loss Minimization',
            text: 'Strategies to reduce technical and non-technical losses in the distribution network.',
            image: 'images/process-optimized.jpg'
         },
         {
            title: 'Capacity Enhancement',
            text: 'Identifying bottlenecks and low-cost methods to release latent capacity in existing assets.',
            image: 'images/digital-strategy.jpg'
         },
         {
            title: 'Reliability Improvement',
            text: 'Targeted interventions to reduce outage frequency (SAIFI) and duration (SAIDI).',
            image: 'images/tech-audit.jpg'
         },
         {
            title: 'Voltage Optimization',
            text: 'Conservation voltage reduction (CVR) and volt-var optimization (VVO) implementation.',
            image: 'images/process-optimized.jpg'
         }
      ]
   },

   // SUPPORT TAB
   'technical-support': {
      title: 'Technical Support',
      subtitle: 'Expert Engineering Assistance',
      content: [
         {
            title: 'Troubleshooting',
            text: 'On-demand engineering support to investigate and resolve complex electrical faults.',
            image: 'images/247-support.jpg'
         },
         {
            title: 'Design Review',
            text: 'Third-party review of engineering designs to ensure quality and compliance.',
            image: 'images/training-center.jpg'
         },
         {
            title: 'Operational Support',
            text: 'Assistance with switching procedures, energization plans, and load management.',
            image: 'images/managed-service.jpg'
         },
         {
            title: 'Emergency Response',
            text: 'Rapid engineering response to restore power after major failures or outages.',
            image: 'images/247-support.jpg'
         }
      ]
   },
   'workshops': {
      title: 'Training & Workshops',
      subtitle: 'Knowledge Transfer',
      content: [
         {
            title: 'Webinars',
            text: 'Regular online sessions covering emerging topics in power systems engineering.',
            image: 'images/training-center.jpg'
         },
         {
            title: 'On-Site Training',
            text: 'customized training delivered at your facility using your own equipment and drawings.',
            image: 'images/managed-service.jpg'
         },
         {
            title: 'Software Training',
            text: 'Specialized courses on industry-standard software packages like ETAP, CYME, and PSCAD.',
            image: 'images/247-support.jpg'
         },
         {
            title: 'Certification Prep',
            text: 'Preparation courses for professional engineering licensure and certifications.',
            image: 'images/training-center.jpg'
         }
      ]
   },
   'asset-management': {
      title: 'Asset Management',
      subtitle: 'Lifecycle Optimization',
      content: [
         {
            title: 'Condition Monitoring',
            text: 'Implementation of online monitoring for transformers, switchgear, and cables.',
            image: 'images/managed-service.jpg'
         },
         {
            title: 'Predictive Maintenance',
            text: 'Using data analytics to predict failures before they occur and schedule timely maintenance.',
            image: 'images/247-support.jpg'
         },
         {
            title: 'Asset Health Indexing',
            text: 'Development of composite health indices to prioritize asset replacement and investment.',
            image: 'images/training-center.jpg'
         },
         {
            title: 'Inventory Optimization',
            text: 'Strategies for managing critical spares to minimize downtime while controlling costs.',
            image: 'images/managed-service.jpg'
         }
      ]
   }
};

// Function to load details
function loadServiceDetails() {
   const detailsContainer = document.getElementById('serviceContent');
   if (!detailsContainer) return; // Not on details page

   // Parse URL param
   const urlParams = new URLSearchParams(window.location.search);
   const serviceId = urlParams.get('id');

   if (serviceId && serviceData[serviceId]) {
      const data = serviceData[serviceId];

      // Update Headers
      document.getElementById('serviceTitle').textContent = data.title;
      document.getElementById('serviceSubtitle').textContent = data.subtitle;

      // Update Back Button to preserve tab state
      const fromTab = urlParams.get('tab');
      if (fromTab) {
         const backBtn = document.querySelector('.back-btn');
         if (backBtn) {
            backBtn.href = `services.html?tab=${fromTab}`;
            backBtn.textContent = '← Back to ' + fromTab.charAt(0).toUpperCase() + fromTab.slice(1);
         }
      }

      // Populate Content
      let html = '';
      data.content.forEach((item, index) => {
         // Even index = Normal (Image Left, Text Right)
         // Odd index = Reverse (Text Left, Image Right)
         // Note: CSS .reverse class handles flexion-direction: row-reverse

         const isReverse = index % 2 !== 0 ? 'reverse' : '';

         html += `
            <div class="detail-row ${isReverse}">
               <div class="detail-image">
                  <img src="${item.image}" alt="${item.title}">
               </div>
               <div class="detail-text">
                  <h3>${item.title}</h3>
                  <p>${item.text}</p>
               </div>
            </div>
         `;
      });

      detailsContainer.innerHTML = html;
   } else {
      // Handle case where ID is missing or invalid
      detailsContainer.innerHTML = '<p style="text-align:center;">Service not found.</p>';
   }
}

// Run on load
if (document.getElementById('serviceContent')) {
   loadServiceDetails();
}
