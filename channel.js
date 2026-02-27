// ====== channel.js ======

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

  // Scramble header and nav
  setTimeout(() => scrambleText(document.querySelector('h1'), 40), 200);
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("mouseover", (e) => scrambleText(e.target));
  });

  // 3. DYNAMICALLY INJECT MISSING CSS ELEMENTS
  const channelSection = document.querySelector('#channel .container');
  
  // Inject Stats Block (Since it's in your CSS but not HTML)
  const statsDiv = document.createElement('div');
  statsDiv.className = 'stats';
  statsDiv.innerHTML = `
    <div class="stat">
      <div class="stat-value" id="view-count">0</div>
      <div class="stat-label">Top Video Views</div>
    </div>
    <div class="stat">
      <div class="stat-value">EXP<span>.01</span></div>
      <div class="stat-label">Current Phase</div>
    </div>
  `;
  channelSection.insertBefore(statsDiv, channelSection.children[2]);

  // Animate the view counter to 300k
  let views = 0;
  const viewCounter = document.getElementById('view-count');
  const countUp = setInterval(() => {
    views += 7500;
    if (views >= 300000) {
      viewCounter.innerHTML = "300<span>k</span>";
      clearInterval(countUp);
    } else {
      viewCounter.innerText = views.toLocaleString();
    }
  }, 30);

  // Upgrade the basic link into your CSS CTA Button
  const oldLinkP = channelSection.lastElementChild;
  const linkUrl = oldLinkP.querySelector('a').href;
  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'cta-wrap';
  ctaWrap.innerHTML = `
    <p>Watch the experiments live.</p>
    <a href="${linkUrl}" target="_blank" class="cta-btn">Initialize YouTube</a>
  `;
  channelSection.replaceChild(ctaWrap, oldLinkP);

  // 4. REACTIVE CURSOR
  const cursor = document.createElement('div');
  cursor.style.cssText = `position: fixed; top: 0; left: 0; width: 30px; height: 30px; border: 1px solid var(--accent, #e8ff47); border-radius: 50%; pointer-events: none; z-index: 9999; transition: width 0.2s, height 0.2s, background 0.2s; transform: translate(-50%, -50%); mix-blend-mode: difference;`;
  document.body.appendChild(cursor);
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });
  document.querySelectorAll('a, .stat').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '50px'; cursor.style.height = '50px'; cursor.style.background = 'rgba(232, 255, 71, 0.2)'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '30px'; cursor.style.height = '30px'; cursor.style.background = 'transparent'; });
  });
});