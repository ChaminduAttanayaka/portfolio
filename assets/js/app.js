/**
 * Chamindu Attanayaka — Portfolio Interactive Application Engine
 * Includes: Typewriter, Constellation Canvas, 3D Tilt, Scroll Observer, Counter Up, Interactive Terminal, & Project Filters.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initMobileNavigation();
  initBackToTop();
  initTypewriter();
  initConstellationCanvas();
  initScrollAnimations();
  initTiltEffect();
  initCardGlowEffect();
  initButtonRipples();
  initTerminalCli();
  initProjectFilters();
  initScrollSpy();
});

/* ==========================================================================
   0. SMOOTH SCROLLING ENGINE
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });
}

/* ==========================================================================
   1. DYNAMIC TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const outputElem = document.getElementById('typewriter-output');
  if (!outputElem) return;

  const titles = [
    'DevOps Engineer',
    'CICD Specialist',
    'Kubernetes Specialist',
    'Terraform IaC Engineer'
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 70;
  const deleteSpeed = 35;
  const pauseEnd = 2000;
  const pauseStart = 400;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      outputElem.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
    } else {
      outputElem.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentTitle.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      delay = pauseStart;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   2. INTERACTIVE CONSTELLATION / NETWORK PARTICLE CANVAS
   ========================================================================== */
function initConstellationCanvas() {
  const canvas = document.getElementById('interactive-network-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let dpr = 1;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2.5); // Support high-resolution retina screens
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.scale(dpr, dpr); // scale context for ultra-crisp, smooth circles

    createParticles();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.6 + 1.2;
      this.baseAlpha = Math.random() * 0.45 + 0.35;
      this.color = Math.random() > 0.45 ? 'rgba(56, 189, 248, ' : 'rgba(129, 140, 248, ';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) { this.x = 0; this.vx *= -1; }
      if (this.x > width) { this.x = width; this.vx *= -1; }
      if (this.y < 0) { this.y = 0; this.vy *= -1; }
      if (this.y > height) { this.y = height; this.vy *= -1; }

      // Mouse repulsion/interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= Math.cos(angle) * force * 2.5;
          this.y -= Math.sin(angle) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = `${this.color}${this.baseAlpha})`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 16000), 75);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 130;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.16;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 100);
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  animate();
}

/* ==========================================================================
   3. SCROLL-TRIGGERED REVEAL OBSERVER
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   4. 3D CARD TILT ON HOVER
   ========================================================================== */
function initTiltEffect() {
  const tiltWrappers = document.querySelectorAll('[data-tilt]');

  tiltWrappers.forEach((wrap) => {
    const card = wrap.querySelector('.executive-portrait-card') || wrap;

    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    wrap.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE CLOUD TERMINAL (FULL CV & SITE AWARENESS)
   ========================================================================== */
function initTerminalCli() {
  const stream = document.getElementById('terminal-stream');
  const input = document.getElementById('terminal-input');
  const quickCmds = document.querySelectorAll('.btn-quick-cmd');
  if (!stream || !input) return;

  const commandResponses = {
    help: () => `
<p class="cli-output cyan-text">✦ Available Interactive Commands:</p>
<p class="cli-output">&bull; <strong>whoami</strong>     - Profile summary, education, and career overview</p>
<p class="cli-output">&bull; <strong>skills</strong>     - Complete technology stack &amp; cloud-native tools</p>
<p class="cli-output">&bull; <strong>repos</strong>      - 9 Open-source production repositories with GitHub links</p>
<p class="cli-output">&bull; <strong>certs</strong>      - 12+ Credly verified certifications (AWS SAP, SAA, SOA, AZ-104)</p>
<p class="cli-output">&bull; <strong>exp</strong>        - Industry experience (GIG Gulf, Dialog Genie, NOC Support)</p>
<p class="cli-output">&bull; <strong>status</strong>     - Real-time cloud cluster &amp; telemetry monitoring</p>
<p class="cli-output">&bull; <strong>contact</strong>    - Email, LinkedIn, GitHub, and Credly profile channels</p>
<p class="cli-output">&bull; <strong>clear</strong>      - Clear terminal output stream</p>
`,
    whoami: () => `
<p class="cli-output cyan-text">✦ Executive Profile:</p>
<p class="cli-output"><strong>Chamindu Attanayaka</strong> — DevOps Engineer &amp; Platform Architect</p>
<p class="cli-output">&bull; <strong>Current Role:</strong> DevOps Engineer &bull; Enterprise Cloud &amp; Platform Systems (Jan 2024 &ndash; Present)</p>
<p class="cli-output">&bull; <strong>Experience:</strong> Nearly 4 years designing, automating, and operating AWS-based infrastructure, Kubernetes container fleets, Jenkins CI/CD, and full observability stacks.</p>
<p class="cli-output">&bull; <strong>Education:</strong> Bachelor of Information and Communication Technology Honors (BICT), University of Kelaniya Sri Lanka (2019&ndash;2023).</p>
<p class="cli-output">&bull; <strong>Specialization:</strong> AWS Architecture, EKS/AKS Containerization, Prometheus &amp; Grafana SRE Telemetry, Infrastructure as Code (Terraform), Zero-Downtime Releases.</p>
`,
    skills: () => `
<p class="cli-output cyan-text">✦ Core Technology Matrix &amp; Tool Ecosystem:</p>
<p class="cli-output">&bull; <strong>Cloud Platforms:</strong> AWS (Multi-VPC, EKS, Lambda, S3, RDS, EFS, SSM, Fargate, ECS, ECR), Azure (AKS, VNet), Google Cloud</p>
<p class="cli-output">&bull; <strong>Containers &amp; K8s:</strong> Kubernetes (EKS &amp; AKS Fleets), Docker &amp; Docker Hub, Helm 3, HPA Autoscalers, PodDisruptionBudgets, Rolling Restarts, RBAC</p>
<p class="cli-output">&bull; <strong>IaC &amp; CI/CD:</strong> Terraform (Modules &amp; State), Jenkins Declarative Pipelines, GitHub Actions, Python (Boto3 Cloud Scripts), Bash/Shell, Nexus Mirror</p>
<p class="cli-output">&bull; <strong>Observability &amp; SRE:</strong> Prometheus &amp; Operator, Grafana (HTTP API), Alertmanager, Elasticsearch &amp; Kibana (ELK), AWS CloudWatch, Node Exporter</p>
<p class="cli-output">&bull; <strong>Enterprise &amp; Middleware:</strong> WSO2 API Manager &amp; Micro-Integrator, NGINX Reverse Proxy, Squid Proxy, SSL/TLS Expiry Automation, CAB Governance</p>
<p class="cli-output">&bull; <strong>Network &amp; Virtualization:</strong> Cisco Routers/Switches/ASA Firewalls, VMware ESXi 8 &amp; vCenter 8.0, 2000+ VoIP IP Telephony, RRDtool</p>
`,
    repos: () => `
<p class="cli-output cyan-text">✦ Featured Open-Source Repositories (9 Production Codebases):</p>
<p class="cli-output">1. <a href="https://github.com/ChaminduAttanayaka/jmeter-aws-load-testing-platform" target="_blank" class="cyan-text"><strong>jmeter-aws-load-testing-platform</strong></a> &mdash; JMeter + Terraform + Jenkins + Docker + AWS automated API load testing</p>
<p class="cli-output">2. <a href="https://github.com/ChaminduAttanayaka/Observability-on-AWS-EKS-Fargate" target="_blank" class="cyan-text"><strong>Observability-on-AWS-EKS-Fargate</strong></a> &mdash; Prometheus &amp; Grafana on EKS Fargate with Helm &amp; Amazon EFS persistence</p>
<p class="cli-output">3. <a href="https://github.com/ChaminduAttanayaka/observability-azure-node" target="_blank" class="cyan-text"><strong>observability-azure-node</strong></a> &mdash; Prometheus &amp; Grafana monitoring on Azure AKS worker nodes</p>
<p class="cli-output">4. <a href="https://github.com/ChaminduAttanayaka/grafana-backup-restore-toolkit" target="_blank" class="cyan-text"><strong>grafana-backup-restore-toolkit</strong></a> &mdash; Bash automation for dashboards, folders, and datasources via HTTP API</p>
<p class="cli-output">5. <a href="https://github.com/ChaminduAttanayaka/jenkins-kubernetes-hpa-manager" target="_blank" class="cyan-text"><strong>jenkins-kubernetes-hpa-manager</strong></a> &mdash; Automated Jenkins pipeline for Kubernetes HPA CPU/memory autoscaling</p>
<p class="cli-output">6. <a href="https://github.com/ChaminduAttanayaka/jenkins-eks-poddisruptionbudget-manager" target="_blank" class="cyan-text"><strong>jenkins-eks-poddisruptionbudget-manager</strong></a> &mdash; Production PDB policy management on Amazon EKS</p>
<p class="cli-output">7. <a href="https://github.com/ChaminduAttanayaka/jenkins-eks-rollout-restart" target="_blank" class="cyan-text"><strong>jenkins-eks-rollout-restart</strong></a> &mdash; Controlled zero-downtime rolling restart pipeline for EKS workloads</p>
<p class="cli-output">8. <a href="https://github.com/ChaminduAttanayaka/jenkins-ecr-docker-image-builder" target="_blank" class="cyan-text"><strong>jenkins-ecr-docker-image-builder</strong></a> &mdash; Reusable Jenkins CI/CD pipeline for versioned Docker builds to Amazon ECR</p>
<p class="cli-output">9. <a href="https://github.com/ChaminduAttanayaka/nexus-repository-mirror" target="_blank" class="cyan-text"><strong>nexus-repository-mirror</strong></a> &mdash; Robust Bash automation tool for Sonatype Nexus artifact replication</p>
`,
    certs: () => `
<p class="cli-output green-text">✦ 12+ Verified Credly &amp; Professional Certifications:</p>
<p class="cli-output">&bull; <strong>AWS Certified Solutions Architect &ndash; Professional</strong> (SAP-C02) &mdash; <a href="https://www.credly.com/badges/49f4ee4f-9369-45b3-b2ee-5746739dee85/public_url" target="_blank" class="green-text">Verify</a></p>
<p class="cli-output">&bull; <strong>AWS Certified Solutions Architect &ndash; Associate</strong> (SAA-C03) &mdash; <a href="https://www.credly.com/badges/21e8bd17-01db-4223-a10e-15ed348ce876/public_url" target="_blank" class="green-text">Verify</a></p>
<p class="cli-output">&bull; <strong>AWS Certified SysOps Administrator &ndash; Associate</strong> (SOA-C02) &mdash; <a href="https://www.credly.com/badges/4eea941d-709c-4107-bb08-5de8dcbe4fec/public_url" target="_blank" class="green-text">Verify</a></p>
<p class="cli-output">&bull; <strong>Microsoft Certified: Azure Administrator Associate</strong> (AZ-104) &mdash; <a href="https://www.credly.com/badges/86aea91f-c183-4ea8-a518-ca9cedf50ba3/public_url" target="_blank" class="green-text">Verify</a></p>
<p class="cli-output">&bull; <strong>HashiCorp Certified: Terraform Associate</strong> (003) &mdash; <a href="https://www.credly.com/badges/d39ce3f1-fdfb-45f2-8eb0-0748ac9ffb43/public_url" target="_blank" class="green-text">Verify</a></p>
<p class="cli-output">&bull; <strong>Aviatrix Multicloud Network Associate</strong> (MCNA) &mdash; <a href="https://www.credly.com/badges/e26d22cc-ae26-4d77-9943-972659f9a9cc/public_url" target="_blank" class="green-text">Verify</a></p>
<p class="cli-output">&bull; <strong>Google IT Support Professional Certificate</strong> &mdash; <a href="https://www.credly.com/badges/da0ed672-0156-4fd8-8cd5-7cdadde5f765/public_url" target="_blank" class="green-text">Verify</a></p>
<p class="cli-output">&bull; <strong>Cisco CCNA (Switching, Routing, &amp; Wireless)</strong> &amp; Cybersecurity &mdash; <a href="https://www.credly.com/badges/7fd67e67-83f1-436e-a119-b114feb37bc7/public_url" target="_blank" class="green-text">Verify</a></p>
<p class="cli-output">&bull; <em>Following:</em> Certified Kubernetes Administrator (CKA)</p>
`,
    exp: () => `
<p class="cli-output cyan-text">✦ Professional Experience &amp; Enterprise Client Engagements:</p>
<p class="cli-output">&bull; <strong>DevOps Engineer</strong> (Jan 2024 &ndash; Present)</p>
<p class="cli-output">&nbsp;&nbsp;&bull; <em>GIG Gulf Insurance:</em> EC2 kernel updates, NGINX patches, CAB governance, AWS CloudWatch/Lambda alerts, Jenkins CI/CD, WSO2 API/micro-integrations, Helm Prometheus/Grafana monitoring, SSL/TLS expiry automation.</p>
<p class="cli-output">&nbsp;&nbsp;&bull; <em>Dialog Genie:</em> Multi-VPC network integration, Amazon EKS dedicated node groups, full Prometheus/Grafana/Alertmanager observability, Elastic Stack on EKS, HPA autoscaling, L2/L3 production SRE support.</p>
<p class="cli-output">&bull; <strong>System Support Engineer</strong> (Jun 2023 &ndash; Jan 2024)</p>
<p class="cli-output">&bull; <strong>NOC Support @ Sri Lankan Airlines</strong> (Oct 2022 &ndash; Jun 2023)</p>
<p class="cli-output">&nbsp;&nbsp;&bull; L1/L2 24/7 support for Sri Lanka's largest Cisco network: 10+ WAN sites, 200+ switches/routers, 100+ APs, 2000+ VoIP endpoints.</p>
`,
    status: () => `
<p class="cli-output green-text">✦ Multi-Cloud Platform Telemetry &amp; Health Metrics:</p>
<p class="cli-output">&bull; AWS Infrastructure: <strong>HEALTHY (Multi-AZ VPC Active)</strong></p>
<p class="cli-output">&bull; Kubernetes Clusters: <strong>EKS + AKS Fleets ONLINE (HPA Enabled)</strong></p>
<p class="cli-output">&bull; Observability Stack: <strong>Prometheus + Grafana Scrape Rate 100% (99.99% SLO)</strong></p>
<p class="cli-output">&bull; Terraform State: <strong>LOCKED &amp; SYNCED (0 Drift Detected)</strong></p>
<p class="cli-output">&bull; CI/CD Pipelines: <strong>9 Open-Source Repositories Synced to GitHub</strong></p>
<p class="cli-output">&bull; Active Incidents: <strong>0 Firing Alerts | Normal Operations</strong></p>
`,
    contact: () => `
<p class="cli-output cyan-text">✦ Direct Communication Channels:</p>
<p class="cli-output">&bull; Email: <a href="mailto:chamindu.m.a@gmail.com" class="cyan-text">Chamindu.m.a@gmail.com</a></p>
<p class="cli-output">&bull; LinkedIn: <a href="https://www.linkedin.com/in/chaminduattanayaka/" target="_blank" class="cyan-text">linkedin.com/in/chaminduattanayaka</a></p>
<p class="cli-output">&bull; GitHub: <a href="https://github.com/ChaminduAttanayaka" target="_blank" class="cyan-text">github.com/ChaminduAttanayaka</a></p>
<p class="cli-output">&bull; Credly: <a href="https://www.credly.com/users/chamindu-attanayaka" target="_blank" class="cyan-text">credly.com/users/chamindu-attanayaka</a></p>
`
  };

  // Aliases for friendly UX
  commandResponses.bio = commandResponses.whoami;
  commandResponses.about = commandResponses.whoami;
  commandResponses.profile = commandResponses.whoami;
  commandResponses.stack = commandResponses.skills;
  commandResponses.projects = commandResponses.repos;
  commandResponses.code = commandResponses.repos;
  commandResponses.certifications = commandResponses.certs;
  commandResponses.credly = commandResponses.certs;
  commandResponses.experience = commandResponses.exp;
  commandResponses.work = commandResponses.exp;
  commandResponses.telemetry = commandResponses.status;
  commandResponses.health = commandResponses.status;

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === 'clear') {
      stream.innerHTML = `
<p class="cli-line cli-input-row">
  <span class="cli-prompt">chamindu@cloud:~$</span>
  <input type="text" id="terminal-input" class="terminal-text-input" placeholder="Type 'whoami', 'skills', 'repos', 'certs', 'exp', 'status'..." autocomplete="off" spellcheck="false" />
</p>`;
      const newInput = document.getElementById('terminal-input');
      bindInput(newInput);
      newInput.focus();
      return;
    }

    const inputRow = stream.querySelector('.cli-input-row');
    const cmdLine = document.createElement('p');
    cmdLine.className = 'cli-line';
    cmdLine.innerHTML = `<span class="cli-prompt">chamindu@cloud:~$</span> <span class="cli-cmd">${escapeHtml(rawCmd)}</span>`;
    stream.insertBefore(cmdLine, inputRow);

    const responseDiv = document.createElement('div');
    responseDiv.className = 'cli-response-block';
    if (commandResponses[cmd]) {
      responseDiv.innerHTML = commandResponses[cmd]();
    } else {
      responseDiv.innerHTML = `<p class="cli-output" style="color:#ef4444;">zsh: command not found: <strong>${escapeHtml(cmd)}</strong>. Type <span class="cyan-text">help</span> to view available commands.</p>`;
    }
    stream.insertBefore(responseDiv, inputRow);

    input.value = '';
    stream.scrollTop = stream.scrollHeight;
  }

  function bindInput(inputElem) {
    inputElem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeCommand(inputElem.value);
      }
    });
  }

  bindInput(input);

  quickCmds.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      const currentInput = document.getElementById('terminal-input');
      if (currentInput) {
        currentInput.value = cmd;
        executeCommand(cmd);
      }
    });
  });

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

/* ==========================================================================
   7. PROJECT FILTER CHIPS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-pill-btn');
  const repoCards = document.querySelectorAll('.repo-card');

  if (!filterBtns.length || !repoCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      repoCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('is-hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   8. SCROLLSPY NAVIGATION
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-pill-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   9. FLOATING BACK TO TOP BUTTON WITH PULSE
   ========================================================================== */
function initBackToTop() {
  const btnTop = document.getElementById('floating-back-to-top');
  if (!btnTop) return;

  function toggleBtn() {
    if (window.pageYOffset > 380) {
      btnTop.classList.add('is-active');
    } else {
      btnTop.classList.remove('is-active');
    }
  }

  window.addEventListener('scroll', toggleBtn, { passive: true });

  btnTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   11. DYNAMIC RADIAL CARD GLOW ON HOVER (MOUSE TRACKING SPOTLIGHT)
   ========================================================================== */
function initCardGlowEffect() {
  const interactiveCards = document.querySelectorAll(
    '.bento-card, .repo-card, .cred-card, .client-engagement-card, .arch-layer-card, .channel-card, .interactive-terminal-card, .domain-card'
  );

  interactiveCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   12. INTERACTIVE BUTTON CLICK RIPPLE ENGINE
   ========================================================================== */
function initButtonRipples() {
  const rippleButtons = document.querySelectorAll('.btn-ripple, .btn-primary-action, .btn-secondary-action, .btn-quick-cmd, .credly-verify-btn');

  rippleButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-circle';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/* ==========================================================================
   13. MOBILE NAVIGATION DRAWER CONTROLLER
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const navItems = document.querySelectorAll('.mobile-nav-item');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.classList.add('is-active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.classList.remove('is-active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (drawer.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  toggleBtn.addEventListener('click', handleToggle);

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeDrawer();
    });
  }

  // Handle mobile drawer links navigation
  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const targetId = item.getAttribute('href');
      closeDrawer();

      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          setTimeout(() => {
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            if (history.pushState) {
              history.pushState(null, null, targetId);
            }
          }, 80);
        }
      }
    });
  });

  // Close when tapping the dark backdrop
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) {
      closeDrawer();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Update active state in mobile drawer during scroll
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    const sections = document.querySelectorAll('section[id]');

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach((item) => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });
}

