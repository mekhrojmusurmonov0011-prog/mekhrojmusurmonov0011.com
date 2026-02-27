// ====== idea.js ======

document.addEventListener("DOMContentLoaded", () => {
  // 1. AUTO-BUILD CONTAINERS
  document.querySelectorAll("header, section, footer").forEach(el => {
    if (!el.querySelector('.container')) {
      const container = document.createElement('div');
      container.className = 'container';
      while (el.firstChild) { container.appendChild(el.firstChild); }
      el.appendChild(container);
    }
  });

  // 2. THE SCRAMBLE ENGINE
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

  setTimeout(() => scrambleText(document.querySelector('h1'), 40), 200);
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("mouseover", (e) => scrambleText(e.target));
  });

  // 3. DYNAMICALLY INJECT MISSING CSS ELEMENTS
  const ideaSection = document.querySelector('#ideas .container');
  
  // Inject Status Block at the bottom
  const statusBlock = document.createElement('div');
  statusBlock.className = 'status-block';
  statusBlock.innerHTML = `
    <div class="status-dot"></div>
    <div class="status-text">
      <strong>App Concept V1.0</strong>
      Status: In Development & Brainstorming
    </div>
  `;
  ideaSection.appendChild(statusBlock);

  // 4. STAGGERED REVEAL & MAGNETIC CARDS
  const listItems = document.querySelectorAll("#ideas li");
  listItems.forEach((li, index) => {
    // Fade in stagger
    li.style.opacity = '0';
    li.style.transform = 'translateY(20px)';
    li.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s`;
    
    setTimeout(() => {
      li.style.opacity = '1';
      li.style.transform = 'translateY(0)';
    }, 100);

    // Magnetic Tilt Effect
    li.addEventListener("mousemove", (e) => {
      const rect = li.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - (rect.height / 2)) / (rect.height / 2)) * -10; 
      const rotateY = ((x - (rect.width / 2)) / (rect.width / 2)) * 10;
      
      li.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      li.style.zIndex = "10";
      li.style.borderColor = "var(--accent, #e8ff47)";
    });
    
    li.addEventListener("mouseleave", () => {
      li.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      li.style.zIndex = "1";
      li.style.borderColor = "transparent";
    });
  });

  // 5. REACTIVE CURSOR
  const cursor = document.createElement('div');
  cursor.style.cssText = `position: fixed; top: 0; left: 0; width: 30px; height: 30px; border: 1px solid var(--accent, #e8ff47); border-radius: 50%; pointer-events: none; z-index: 9999; transition: width 0.2s, height 0.2s, background 0.2s; transform: translate(-50%, -50%); mix-blend-mode: difference;`;
  document.body.appendChild(cursor);
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });
  document.querySelectorAll('a, li, .status-block').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '50px'; cursor.style.height = '50px'; cursor.style.background = 'rgba(232, 255, 71, 0.2)'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '30px'; cursor.style.height = '30px'; cursor.style.background = 'transparent'; });
  });
});