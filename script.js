document.addEventListener("DOMContentLoaded", () => {
  // 1. AUTO-BUILD CONTAINERS (Kept this to fix your HTML structure without you having to rewrite it)
  const layoutElements = document.querySelectorAll("header, section, footer");
  layoutElements.forEach(el => {
    if (!el.querySelector('.container')) {
      const container = document.createElement('div');
      container.className = 'container';
      while (el.firstChild) {
        container.appendChild(el.firstChild);
      }
      el.appendChild(container);
    }
  });

  // 2. THE "PRO" SCRAMBLE ENGINE
  // A global function that decodes text like a terminal
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
  const scrambleText = (target, duration = 30) => {
    const originalText = target.dataset.value || target.innerText;
    target.dataset.value = originalText;
    let iterations = 0;
    
    clearInterval(target.dataset.interval);
    
    target.dataset.interval = setInterval(() => {
      target.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (index < iterations) return originalText[index];
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");
        
      if (iterations >= originalText.length) {
        clearInterval(target.dataset.interval);
        target.innerText = originalText;
      }
      iterations += 1 / 3;
    }, duration);
  };

  // Scramble main title on load for a dramatic entrance
  const mainTitle = document.querySelector('h1');
  if (mainTitle) setTimeout(() => scrambleText(mainTitle, 40), 200);

  // Scramble nav links on hover
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("mouseover", (e) => scrambleText(e.target));
  });

  // 3. ADVANCED STAGGERED REVEAL
  // Animates elements in one by one dynamically, and triggers the scramble on Headings
  const revealTargets = document.querySelectorAll("section h2, #about p, #skills li, article, #links a, .contact-card");
  
  // Set initial states via JS
  revealTargets.forEach((target, i) => {
    target.style.opacity = '0';
    target.style.transform = 'translateY(20px)';
    target.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`;
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a slight delay based on the element's position for a cascade effect
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          // If it's a section header, scramble it when it appears
          if (entry.target.tagName === 'H2') scrambleText(entry.target);
        }, 100);
        
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  revealTargets.forEach(target => observer.observe(target));

  // 4. 3D MAGNETIC TILT EFFECT
  // Makes project cards and contact cards tilt toward your mouse
  const tiltElements = document.querySelectorAll("article, .contact-card");
  tiltElements.forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg tilt
      const rotateY = ((x - centerX) / centerX) * 6;
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      el.style.transition = "transform 0.1s ease-out";
      el.style.zIndex = "10";
      el.style.borderColor = "var(--accent)";
    });
    
    el.addEventListener("mouseleave", () => {
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      el.style.transition = "transform 0.5s ease-out";
      el.style.zIndex = "1";
      el.style.borderColor = "var(--border)";
    });
  });

  // 5. CUSTOM REACTIVE CURSOR
  // Creates a ring that follows your mouse and expands over links
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed; top: 0; left: 0; width: 30px; height: 30px; 
    border: 1px solid var(--accent); border-radius: 50%; 
    pointer-events: none; z-index: 9999; 
    transition: width 0.2s, height 0.2s, background 0.2s;
    transform: translate(-50%, -50%); mix-blend-mode: difference;
  `;
  document.body.appendChild(cursor);

  // Use requestAnimationFrame for buttery smooth cursor tracking
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Cursor hover states
  document.querySelectorAll('a, article').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '50px'; 
      cursor.style.height = '50px';
      cursor.style.background = 'rgba(232, 255, 71, 0.2)'; // Faint accent color
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '30px'; 
      cursor.style.height = '30px';
      cursor.style.background = 'transparent';
    });
  });

  // 6. LIVE SYSTEM CLOCK IN FOOTER
  // Adds a running "hacker" clock to the bottom
  const footerContainer = document.querySelector("footer .container");
  if (footerContainer) {
    const timeEl = document.createElement("p");
    timeEl.style.color = "var(--accent)";
    footerContainer.insertBefore(timeEl, footerContainer.firstChild);
    
    setInterval(() => {
      const now = new Date();
      timeEl.innerText = `SYS.TIME // ${now.toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})} LOCAL`;
    }, 1000);
  }
});