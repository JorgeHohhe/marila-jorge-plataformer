(() => {
  const story = window.LOVE_STORY;
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const ui = {
    gameTitle: document.getElementById("gameTitle"),
    chapterHud: document.getElementById("chapterHud"),
    memoryHud: document.getElementById("memoryHud"),
    memoryTotalHud: document.getElementById("memoryTotalHud"),
    chapterList: document.getElementById("chapterList"),
    loveCounter: document.getElementById("loveCounter"),
    startScreen: document.getElementById("startScreen"),
    startButton: document.getElementById("startButton"),
    dialogOverlay: document.getElementById("dialogOverlay"),
    dialogChapter: document.getElementById("dialogChapter"),
    dialogTitle: document.getElementById("dialogTitle"),
    dialogText: document.getElementById("dialogText"),
    prevDialog: document.getElementById("prevDialog"),
    nextDialog: document.getElementById("nextDialog"),
    closeDialog: document.getElementById("closeDialog"),
    galleryOverlay: document.getElementById("galleryOverlay"),
    galleryGrid: document.getElementById("galleryGrid"),
    closeGallery: document.getElementById("closeGallery"),
    openFinal: document.getElementById("openFinal"),
    finalOverlay: document.getElementById("finalOverlay"),
    finalMessage: document.getElementById("finalMessage"),
    loveRange: document.getElementById("loveRange"),
    loveValue: document.getElementById("loveValue"),
    loveReaction: document.getElementById("loveReaction"),
    restartGame: document.getElementById("restartGame"),
    toggleAudio: document.getElementById("toggleAudio"),
    btnJump: document.getElementById("btnJump"),
    btnInteract: document.getElementById("btnInteract"),
    moveStick: document.getElementById("moveStick"),
    moveKnob: document.getElementById("moveKnob"),
  };

  const W = canvas.width;
  const H = canvas.height;
  const maxCanvasPixelRatio = 2;
  const zoneLength = 1320;
  const worldWidth = story.chapters.length * zoneLength + 420;
  const gravity = 0.72;
  const friction = 0.82;
  const maxSpeed = 6.2;
  const jumpSpeed = -15.4;

  const moodPalettes = {
    study: ["#091020", "#17294d", "#2d4372", "#8ceeff"],
    training: ["#0b0d1e", "#1f1946", "#543b8b", "#ff9bd2"],
    city: ["#0f1124", "#172a45", "#814e75", "#ffd98f"],
    mountain: ["#08101b", "#1f3551", "#456888", "#b6f7ff"],
    warm: ["#130d18", "#42233b", "#ad6b54", "#ffd98f"],
    road: ["#090b16", "#1d2541", "#59436c", "#ffbfdf"],
    stars: ["#060814", "#121940", "#202b66", "#a8ffcb"],
  };

  const keys = new Set();
  const collected = new Set();
  const particles = [];
  const platforms = [];
  const memories = [];
  const doors = [];
  const hazards = [];

  const player = {
    x: 88,
    y: 330,
    w: 34,
    h: 54,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1,
    coyote: 0,
  };

  const state = {
    started: false,
    paused: true,
    cameraX: 0,
    time: 0,
    activeMemory: null,
    typedText: "",
    typeCursor: 0,
    typeRun: 0,
    dialogTextComplete: false,
    lastFrame: 0,
    nearbyMemory: null,
    nearbyLockedDoor: null,
    nearFinalPortal: false,
    hint: "",
  };

  const touchInput = {
    axisX: 0,
    pointerId: null,
  };

  const roomLayouts = [
    {
      memoryPlatform: 2,
      platforms: [
        { x: -50, raise: 0, w: 300, h: 90, kind: "ground" },
        { x: 310, raise: 82, w: 210, h: 22, kind: "floating" },
        { x: 620, raise: 140, w: 190, h: 22, kind: "floating" },
        { x: 930, raise: 92, w: 180, h: 22, kind: "floating" },
        { x: 1160, raise: 0, w: 170, h: 90, kind: "ground" },
      ],
    },
    {
      memoryPlatform: 3,
      platforms: [
        { x: -50, raise: 0, w: 255, h: 90, kind: "ground" },
        { x: 300, raise: 80, w: 165, h: 22, kind: "floating" },
        { x: 525, raise: 135, w: 145, h: 22, kind: "floating" },
        { x: 770, raise: 178, w: 155, h: 22, kind: "floating" },
        { x: 1000, raise: 100, w: 140, h: 22, kind: "floating" },
        { x: 1165, raise: 0, w: 165, h: 90, kind: "ground" },
      ],
    },
    {
      memoryPlatform: 3,
      platforms: [
        { x: -50, raise: 0, w: 240, h: 90, kind: "ground" },
        { x: 290, raise: 70, w: 145, h: 22, kind: "floating" },
        { x: 505, raise: 128, w: 130, h: 22, kind: "floating" },
        { x: 700, raise: 180, w: 120, h: 22, kind: "floating" },
        { x: 875, raise: 118, w: 140, h: 22, kind: "floating" },
        { x: 1080, raise: 64, w: 135, h: 22, kind: "floating" },
        { x: 1200, raise: 0, w: 130, h: 90, kind: "ground" },
      ],
    },
    {
      memoryPlatform: 3,
      platforms: [
        { x: -50, raise: 0, w: 220, h: 90, kind: "ground" },
        { x: 275, raise: 76, w: 125, h: 22, kind: "floating" },
        { x: 470, raise: 132, w: 115, h: 22, kind: "floating" },
        { x: 650, raise: 185, w: 105, h: 22, kind: "floating" },
        { x: 825, raise: 132, w: 115, h: 22, kind: "floating" },
        { x: 1010, raise: 76, w: 130, h: 22, kind: "floating" },
        { x: 1190, raise: 0, w: 140, h: 90, kind: "ground" },
      ],
    },
    {
      memoryPlatform: 3,
      platforms: [
        { x: -50, raise: 0, w: 210, h: 90, kind: "ground" },
        { x: 285, raise: 58, w: 115, h: 22, kind: "floating" },
        { x: 480, raise: 120, w: 105, h: 22, kind: "floating" },
        { x: 675, raise: 184, w: 110, h: 22, kind: "floating" },
        { x: 890, raise: 132, w: 100, h: 22, kind: "floating" },
        { x: 1075, raise: 72, w: 110, h: 22, kind: "floating" },
        { x: 1220, raise: 0, w: 110, h: 90, kind: "ground" },
      ],
    },
    {
      memoryPlatform: 3,
      platforms: [
        { x: -50, raise: 0, w: 205, h: 90, kind: "ground" },
        { x: 270, raise: 68, w: 105, h: 22, kind: "floating" },
        { x: 455, raise: 126, w: 95, h: 22, kind: "floating" },
        { x: 625, raise: 190, w: 95, h: 22, kind: "floating" },
        { x: 805, raise: 126, w: 95, h: 22, kind: "floating" },
        { x: 990, raise: 68, w: 110, h: 22, kind: "floating" },
        { x: 1185, raise: 0, w: 145, h: 90, kind: "ground" },
      ],
    },
    {
      memoryPlatform: 3,
      platforms: [
        { x: -50, raise: 0, w: 205, h: 90, kind: "ground" },
        { x: 265, raise: 72, w: 105, h: 22, kind: "floating" },
        { x: 455, raise: 138, w: 95, h: 22, kind: "floating" },
        { x: 640, raise: 202, w: 95, h: 22, kind: "floating" },
        { x: 830, raise: 138, w: 95, h: 22, kind: "floating" },
        { x: 1025, raise: 72, w: 115, h: 22, kind: "floating" },
        { x: 1200, raise: 0, w: 150, h: 90, kind: "ground" },
      ],
    },
  ];

  function init() {
    syncCanvasResolution();
    ui.gameTitle.textContent = story.title;
    ui.finalMessage.textContent = story.finalMessage;
    buildWorld();
    buildChapterList();
    buildGallery();
    updateHud();
    updateCounter();
    setInterval(updateCounter, 1000);
    bindEvents();
    window.addEventListener("resize", syncCanvasResolution);
    window.addEventListener("orientationchange", () => window.setTimeout(syncCanvasResolution, 160));
    requestAnimationFrame(loop);
  }

  function syncCanvasResolution() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, maxCanvasPixelRatio);
    const targetWidth = Math.round(W * pixelRatio);
    const targetHeight = Math.round(H * pixelRatio);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingEnabled = true;
  }

  function buildWorld() {
    platforms.length = 0;
    memories.length = 0;
    doors.length = 0;
    hazards.length = 0;

    story.chapters.forEach((chapter, index) => {
      const start = index * zoneLength;
      const groundY = 460 - (index % 2) * 8;
      const layout = roomLayouts[index % roomLayouts.length];

      layout.platforms.forEach((shape) => {
        platforms.push({
          x: start + shape.x,
          y: groundY - shape.raise,
          w: shape.w,
          h: shape.h,
          kind: shape.kind,
          roomIndex: index,
        });
      });

      addRoomHazards(start, groundY, layout.platforms);

      if (index < story.chapters.length - 1) {
        doors.push({
          x: start + zoneLength - 38,
          y: -80,
          w: 42,
          h: groundY + 170,
          gateIndex: index,
        });
      }

      const memoryPlatform = layout.platforms[layout.memoryPlatform];

      memories.push({
        id: chapter.id,
        chapterIndex: index,
        chapter,
        x: start + memoryPlatform.x + memoryPlatform.w / 2,
        y: groundY - memoryPlatform.raise - 72,
        radius: 27,
        bob: Math.random() * 100,
      });
    });

    const finalStart = story.chapters.length * zoneLength;
    platforms.push({ x: finalStart - 70, y: 454, w: 400, h: 90, kind: "ground" });
    platforms.push({ x: finalStart + 78, y: 362, w: 155, h: 22, kind: "floating" });

    for (let i = 0; i < 160; i += 1) {
      particles.push({
        x: Math.random() * worldWidth,
        y: Math.random() * H,
        r: 0.8 + Math.random() * 2.4,
        speed: 0.12 + Math.random() * 0.42,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function buildChapterList() {
    ui.chapterList.innerHTML = "";
    story.chapters.forEach((chapter, index) => {
      const li = document.createElement("li");
      li.textContent = `${chapter.title} — ${chapter.place}`;
      li.dataset.index = String(index);
      ui.chapterList.appendChild(li);
    });
    ui.memoryTotalHud.textContent = String(memories.length);
  }

  function buildGallery() {
    ui.galleryGrid.innerHTML = "";
    story.photos.forEach((photo, index) => {
      const card = document.createElement("article");
      card.className = "photo-card";

      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.caption || `Foto ${index + 1}`;
      img.onerror = () => {
        const placeholder = document.createElement("div");
        placeholder.className = "photo-placeholder";
        placeholder.innerHTML = `Coloque aqui<br><strong>${photo.src}</strong>`;
        img.replaceWith(placeholder);
      };

      const caption = document.createElement("p");
      caption.textContent = photo.caption;
      card.append(img, caption);
      ui.galleryGrid.appendChild(card);
    });
  }

  function addRoomHazards(start, groundY, platformShapes) {
    const sorted = platformShapes
      .map((shape) => ({ left: start + shape.x, right: start + shape.x + shape.w }))
      .sort((a, b) => a.left - b.left);

    for (let i = 0; i < sorted.length - 1; i += 1) {
      const left = sorted[i].right;
      const right = sorted[i + 1].left;
      const gap = right - left;
      if (gap < 72) continue;

      hazards.push({
        x: left + 14,
        y: groundY + 16,
        w: gap - 28,
        h: 42,
        roomIndex: Math.floor(start / zoneLength),
      });
    }
  }

  function bindEvents() {
    window.addEventListener("keydown", (event) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key)) {
        event.preventDefault();
      }
      keys.add(event.key.toLowerCase());

      if (event.key === " " || event.key.toLowerCase() === "w" || event.key === "ArrowUp") jump();
      if (event.key.toLowerCase() === "e" || event.key === "Enter") interact();
    });

    window.addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));

    ui.startButton.addEventListener("click", () => {
      hideOverlay(ui.startScreen);
      state.started = true;
      state.paused = false;
      try {
        window.LoveAudio.start();
      } catch (error) {
        console.warn("Não foi possível iniciar a ambiência de áudio:", error);
      }
    });

    ui.toggleAudio.addEventListener("click", () => {
      const enabled = window.LoveAudio.toggle();
      setAudioButton(enabled);
    });

    ui.nextDialog.addEventListener("click", nextDialog);
    ui.closeDialog.addEventListener("click", closeDialog);

    ui.closeGallery.addEventListener("click", () => {
      hideOverlay(ui.galleryOverlay);
      state.paused = false;
    });
    ui.openFinal.addEventListener("click", () => {
      hideOverlay(ui.galleryOverlay);
      showOverlay(ui.finalOverlay);
      burstHearts();
    });

    ui.restartGame.addEventListener("click", restart);
    ui.loveRange.addEventListener("input", updateLoveReaction);
    updateLoveReaction();

    bindJoystick();
    addTouchActionButton(ui.btnJump, jump);
    addTouchActionButton(ui.btnInteract, interact);
  }

  function bindJoystick() {
    const start = (event) => {
      if (touchInput.pointerId !== null) return;
      event.preventDefault();
      touchInput.pointerId = event.pointerId;
      ui.moveStick.setPointerCapture?.(event.pointerId);
      updateJoystick(event);
    };

    const move = (event) => {
      if (event.pointerId !== touchInput.pointerId) return;
      event.preventDefault();
      updateJoystick(event);
    };

    const end = (event) => {
      if (event.pointerId !== touchInput.pointerId) return;
      event.preventDefault();
      ui.moveStick.releasePointerCapture?.(event.pointerId);
      resetJoystick();
    };

    ui.moveStick.addEventListener("pointerdown", start);
    ui.moveStick.addEventListener("pointermove", move);
    ui.moveStick.addEventListener("pointerup", end);
    ui.moveStick.addEventListener("pointercancel", end);
  }

  function updateJoystick(event) {
    const rect = ui.moveStick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = Math.min(rect.width, rect.height) * 0.36;
    const rawX = event.clientX - centerX;
    const rawY = event.clientY - centerY;
    const distance = Math.hypot(rawX, rawY);
    const limit = distance > radius ? radius / distance : 1;
    const knobX = rawX * limit;
    const knobY = rawY * limit;
    const axisX = knobX / radius;

    touchInput.axisX = Math.abs(axisX) < 0.18 ? 0 : axisX;
    ui.moveKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;
  }

  function resetJoystick() {
    touchInput.axisX = 0;
    touchInput.pointerId = null;
    ui.moveKnob.style.transform = "translate(0, 0)";
  }

  function addTouchActionButton(button, action) {
    const press = (event) => {
      event.preventDefault();
      action();
    };
    const release = (event) => {
      event.preventDefault();
    };
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("pointerleave", release);
  }

  function setAudioButton(enabled) {
    ui.toggleAudio.textContent = enabled ? "Som ligado" : "Som desligado";
    ui.toggleAudio.setAttribute("aria-pressed", String(enabled));
    ui.toggleAudio.setAttribute("aria-label", enabled ? "Desligar trilha sonora" : "Ligar trilha sonora");
  }

  function loop(timestamp) {
    const delta = Math.min(32, timestamp - state.lastFrame || 16);
    state.lastFrame = timestamp;
    state.time += delta / 1000;

    if (state.started && !state.paused) update(delta / 16.67);
    draw();
    requestAnimationFrame(loop);
  }

  function update(dt) {
    const keyboardAxis =
      (keys.has("d") || keys.has("arrowright") ? 1 : 0) -
      (keys.has("a") || keys.has("arrowleft") ? 1 : 0);
    const moveAxis = Math.abs(touchInput.axisX) > Math.abs(keyboardAxis)
      ? touchInput.axisX
      : keyboardAxis;

    if (moveAxis !== 0) {
      player.vx += 0.76 * moveAxis * dt;
      player.facing = moveAxis < 0 ? -1 : 1;
    } else {
      player.vx *= friction;
    }

    player.vx = clamp(player.vx, -maxSpeed, maxSpeed);
    player.vy += gravity * dt;
    player.coyote = Math.max(0, player.coyote - dt);

    moveAndCollide("x", dt);
    moveAndCollide("y", dt);

    if (touchesHazard()) {
      respawn();
      return;
    }

    player.x = clamp(player.x, 20, worldWidth - player.w - 20);
    if (player.y > H + 240) respawn();

    state.cameraX = lerp(state.cameraX, clamp(player.x - W * 0.42, 0, worldWidth - W), 0.08);
    updateInteractionState();
    updateHud();

    particles.forEach((particle) => {
      particle.y += particle.speed * dt;
      particle.x += Math.sin(state.time * 0.5 + particle.phase) * 0.1 * dt;
      if (particle.y > H + 20) {
        particle.y = -20;
        particle.x = Math.random() * worldWidth;
      }
    });
  }

  function moveAndCollide(axis, dt) {
    if (axis === "x") player.x += player.vx * dt;
    if (axis === "y") {
      player.y += player.vy * dt;
      player.onGround = false;
    }

    const solidPlatforms = platforms.concat(doors.filter((door) => !isDoorOpen(door)));

    for (const platform of solidPlatforms) {
      if (!rectsOverlap(player, platform)) continue;

      if (axis === "x") {
        if (player.vx > 0) player.x = platform.x - player.w;
        if (player.vx < 0) player.x = platform.x + platform.w;
        player.vx = 0;
      }

      if (axis === "y") {
        if (player.vy > 0) {
          player.y = platform.y - player.h;
          player.vy = 0;
          player.onGround = true;
          player.coyote = 8;
        } else if (player.vy < 0) {
          player.y = platform.y + platform.h;
          player.vy = 0;
        }
      }
    }
  }

  function jump() {
    if (!state.started || state.paused) return;
    if (player.onGround || player.coyote > 0) {
      player.vy = jumpSpeed;
      player.onGround = false;
      player.coyote = 0;
      spawnSpark(player.x + player.w / 2, player.y + player.h, 10);
    }
  }

  function interact() {
    if (!state.started || state.paused) return;
    if (state.nearbyMemory) {
      openMemory(state.nearbyMemory);
      return;
    }
    if (state.nearbyLockedDoor) {
      state.hint = "A próxima sala abre depois que esta memória for guardada.";
      return;
    }
    if (state.nearFinalPortal) {
      if (collected.size >= memories.length) {
        state.paused = true;
        showOverlay(ui.galleryOverlay);
      } else {
        state.hint = "Colete todas as luzes da história antes de abrir a galeria.";
      }
    }
  }

  function updateInteractionState() {
    state.nearbyMemory = null;
    state.nearbyLockedDoor = null;
    state.nearFinalPortal = false;
    state.hint = "";

    for (const memory of memories) {
      const dx = centerX(player) - memory.x;
      const dy = centerY(player) - memory.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 92) {
        state.nearbyMemory = memory;
        state.hint = collected.has(memory.id)
          ? "Pressione para rever esta memória."
          : "Pressione para abrir esta memória.";
        return;
      }
    }

    for (const door of doors) {
      if (isDoorOpen(door)) continue;
      const dx = Math.abs(centerX(player) - (door.x + door.w / 2));
      if (dx < 116) {
        state.nearbyLockedDoor = door;
        state.hint = "Porta trancada: guarde a memória desta sala para abrir a próxima.";
        return;
      }
    }

    const portalX = worldWidth - 230;
    const portalY = 336;
    if (Math.hypot(centerX(player) - portalX, centerY(player) - portalY) < 120) {
      state.nearFinalPortal = true;
      state.hint = collected.size >= memories.length
        ? "Pressione para abrir a galeria de fotos."
        : "A galeria espera pelas luzes que ainda faltam.";
    }
  }

  function openMemory(memory) {
    state.paused = true;
    state.activeMemory = memory;
    showOverlay(ui.dialogOverlay);
    showDialogPage();
  }

  function showDialogPage() {
    const memory = state.activeMemory;
    if (!memory) return;
    ui.dialogChapter.textContent = memory.chapter.title;
    ui.dialogTitle.textContent = memory.chapter.place || memory.chapter.title;
    state.typedText = "";
    state.typeCursor = 0;
    state.typeRun += 1;
    state.dialogTextComplete = false;
    ui.dialogText.textContent = "";
    ui.prevDialog.hidden = true;
    ui.prevDialog.disabled = true;
    ui.nextDialog.textContent = "Guardar memória";
    ui.nextDialog.disabled = true;
    typeDialog();
  }

  function typeDialog() {
    const memory = state.activeMemory;
    if (!memory || ui.dialogOverlay.hidden) return;
    const fullText = getChapterText(memory.chapter);
    const run = state.typeRun;
    const step = () => {
      if (!state.activeMemory || ui.dialogOverlay.hidden || state.typeRun !== run) return;
      state.typeCursor = Math.min(fullText.length, state.typeCursor + 3);
      ui.dialogText.textContent = fullText.slice(0, state.typeCursor);
      if (state.typeCursor < fullText.length) {
        window.setTimeout(step, 12);
        return;
      }

      state.dialogTextComplete = true;
      ui.nextDialog.disabled = false;
    };
    step();
  }

  function nextDialog() {
    if (!state.activeMemory) return;
    if (!state.dialogTextComplete) return;

    collected.add(state.activeMemory.id);
    spawnSpark(state.activeMemory.x, state.activeMemory.y, 34);
    closeDialog();
  }

  function getChapterText(chapter) {
    if (typeof chapter.text === "string") return chapter.text;
    return "";
  }

  function closeDialog() {
    hideOverlay(ui.dialogOverlay);
    state.activeMemory = null;
    state.paused = false;
    updateHud();
  }

  function showOverlay(element) {
    element.hidden = false;
    requestAnimationFrame(() => element.classList.add("visible"));
  }

  function hideOverlay(element) {
    element.classList.remove("visible");
    window.setTimeout(() => {
      if (!element.classList.contains("visible")) element.hidden = true;
    }, 240);
  }

  function draw() {
    syncCanvasResolution();
    const chapterIndex = getCurrentChapterIndex();
    const chapter = story.chapters[chapterIndex];
    const palette = moodPalettes[chapter.mood] || moodPalettes.stars;
    drawBackground(palette, chapterIndex);
    drawParticles(palette);
    drawPlatforms(palette);
    drawHazards(palette);
    drawDoors(palette);
    drawMemories(palette);
    drawFinalPortal(palette);
    drawPlayer(palette);
    drawForeground(palette);
    drawHint();
  }

  function drawBackground(palette, chapterIndex) {
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, palette[0]);
    gradient.addColorStop(0.56, palette[1]);
    gradient.addColorStop(1, "#06070f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    const camera = state.cameraX;
    for (let layer = 0; layer < 3; layer += 1) {
      const parallax = 0.12 + layer * 0.11;
      const baseY = 290 + layer * 52;
      ctx.fillStyle = hexToRgba(layer === 0 ? palette[2] : palette[1], 0.2 + layer * 0.08);
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = -80; x <= W + 160; x += 120) {
        const worldX = x + camera * parallax;
        const peak = baseY + Math.sin(worldX * 0.006 + chapterIndex) * 32;
        ctx.lineTo(x, peak);
        ctx.lineTo(x + 62, peak - 58 - layer * 22);
        ctx.lineTo(x + 124, peak);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();
    }

    for (let i = 0; i < 20; i += 1) {
      const x = ((i * 240 - camera * 0.24) % (W + 260)) - 120;
      const height = 90 + ((i * 37 + chapterIndex * 23) % 120);
      ctx.fillStyle = hexToRgba(palette[2], 0.18);
      drawTree(x, 450, height);
    }
    ctx.restore();
  }

  function drawTree(x, ground, height) {
    ctx.save();
    ctx.translate(x, ground);
    ctx.fillRect(-3, -height, 6, height);
    ctx.beginPath();
    ctx.moveTo(0, -height);
    ctx.bezierCurveTo(-28, -height + 40, -34, -height + 90, -48, -height + 124);
    ctx.moveTo(0, -height + 25);
    ctx.bezierCurveTo(30, -height + 64, 34, -height + 116, 44, -height + 150);
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();
  }

  function drawParticles(palette) {
    ctx.save();
    ctx.translate(-state.cameraX * 0.18, 0);
    for (const particle of particles) {
      const glow = 0.4 + Math.sin(state.time * 1.4 + particle.phase) * 0.25;
      ctx.fillStyle = hexToRgba(palette[3], 0.18 + glow * 0.34);
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawPlatforms(palette) {
    ctx.save();
    ctx.translate(-state.cameraX, 0);
    for (const p of platforms) {
      if (p.x + p.w < state.cameraX - 80 || p.x > state.cameraX + W + 80) continue;
      const grd = ctx.createLinearGradient(0, p.y, 0, p.y + p.h);
      grd.addColorStop(0, hexToRgba(palette[3], p.kind === "ground" ? 0.38 : 0.55));
      grd.addColorStop(0.18, hexToRgba("#ffffff", 0.08));
      grd.addColorStop(1, hexToRgba("#050713", 0.92));
      ctx.fillStyle = grd;
      roundRect(p.x, p.y, p.w, p.h, p.kind === "ground" ? 30 : 14, true);

      ctx.strokeStyle = hexToRgba(palette[3], 0.32);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x + 18, p.y + 5);
      ctx.lineTo(p.x + p.w - 18, p.y + 5);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawHazards(palette) {
    ctx.save();
    ctx.translate(-state.cameraX, 0);
    for (const hazard of hazards) {
      if (hazard.x + hazard.w < state.cameraX - 80 || hazard.x > state.cameraX + W + 80) continue;
      const toothCount = Math.max(3, Math.floor(hazard.w / 18));
      const toothWidth = hazard.w / toothCount;

      ctx.fillStyle = hexToRgba("#ff6b9a", 0.34);
      ctx.strokeStyle = hexToRgba(palette[3], 0.3);
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < toothCount; i += 1) {
        const left = hazard.x + i * toothWidth;
        ctx.moveTo(left, hazard.y + hazard.h);
        ctx.lineTo(left + toothWidth * 0.5, hazard.y);
        ctx.lineTo(left + toothWidth, hazard.y + hazard.h);
      }
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawDoors(palette) {
    ctx.save();
    ctx.translate(-state.cameraX, 0);
    for (const door of doors) {
      if (door.x + door.w < state.cameraX - 90 || door.x > state.cameraX + W + 90) continue;
      const open = isDoorOpen(door);
      const shimmer = 0.75 + Math.sin(state.time * 2.7 + door.gateIndex) * 0.18;
      const labelY = 82;

      if (open) {
        ctx.strokeStyle = hexToRgba("#a8ffcb", 0.72);
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(door.x - 14, door.h - 118);
        ctx.lineTo(door.x - 14, labelY + 42);
        ctx.quadraticCurveTo(door.x + door.w / 2, labelY, door.x + door.w + 14, labelY + 42);
        ctx.lineTo(door.x + door.w + 14, door.h - 118);
        ctx.stroke();
      } else {
        const gradient = ctx.createLinearGradient(door.x, 0, door.x + door.w, 0);
        gradient.addColorStop(0, hexToRgba(palette[3], 0.16));
        gradient.addColorStop(0.5, hexToRgba("#ffffff", 0.28 * shimmer));
        gradient.addColorStop(1, hexToRgba("#ff9bd2", 0.18));
        ctx.fillStyle = gradient;
        roundRect(door.x, door.y, door.w, door.h, 18, true);
        ctx.strokeStyle = hexToRgba("#ffd98f", 0.62);
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = hexToRgba("#ffd98f", 0.9);
        ctx.beginPath();
        ctx.arc(door.x + door.w / 2, 262 + Math.sin(state.time * 2) * 4, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawMemories(palette) {
    ctx.save();
    ctx.translate(-state.cameraX, 0);
    for (const memory of memories) {
      if (memory.x < state.cameraX - 120 || memory.x > state.cameraX + W + 120) continue;
      const collectedHere = collected.has(memory.id);
      const bobY = memory.y + Math.sin(state.time * 2.2 + memory.bob) * 9;
      const pulse = 1 + Math.sin(state.time * 3 + memory.bob) * 0.08;

      const gradient = ctx.createRadialGradient(memory.x, bobY, 3, memory.x, bobY, 70);
      gradient.addColorStop(0, hexToRgba(collectedHere ? "#a8ffcb" : palette[3], 0.95));
      gradient.addColorStop(0.26, hexToRgba(collectedHere ? "#a8ffcb" : "#ffd98f", 0.36));
      gradient.addColorStop(1, hexToRgba("#ffffff", 0));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(memory.x, bobY, 70 * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = collectedHere ? "#a8ffcb" : "#ffd98f";
      ctx.beginPath();
      ctx.arc(memory.x, bobY, memory.radius * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.font = "900 15px Inter";
      ctx.textAlign = "center";
      ctx.fillText(collectedHere ? "✓" : "✦", memory.x, bobY + 5);

      ctx.font = "700 14px Inter";
      ctx.fillStyle = "rgba(247,243,255,0.86)";
      ctx.fillText(memory.chapter.title, memory.x, bobY - 48);
    }
    ctx.restore();
  }

  function drawFinalPortal(palette) {
    const x = worldWidth - 230;
    const y = 336;
    ctx.save();
    ctx.translate(-state.cameraX, 0);
    const unlocked = collected.size >= memories.length;
    const glow = ctx.createRadialGradient(x, y, 10, x, y, 118);
    glow.addColorStop(0, hexToRgba(unlocked ? "#ffd98f" : "#8ceeff", 0.75));
    glow.addColorStop(0.42, hexToRgba(unlocked ? "#ff9bd2" : "#7a4dff", 0.24));
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 118 + Math.sin(state.time * 2) * 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = hexToRgba(unlocked ? "#ffd98f" : palette[3], 0.92);
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.ellipse(x, y, 38, 92, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(247,243,255,0.9)";
    ctx.font = "900 15px Inter";
    ctx.textAlign = "center";
    ctx.fillText(unlocked ? "Galeria" : "Galeria bloqueada", x, y - 116);
    ctx.restore();
  }

  function drawPlayer(palette) {
    ctx.save();
    ctx.translate(player.x - state.cameraX + player.w / 2, player.y + player.h / 2);
    ctx.scale(player.facing, 1);

    const bob = player.onGround ? Math.sin(state.time * 9) * 1.3 : 0;
    ctx.translate(0, bob);

    const aura = ctx.createRadialGradient(0, 0, 4, 0, 0, 70);
    aura.addColorStop(0, hexToRgba("#ffffff", 0.48));
    aura.addColorStop(0.24, hexToRgba(palette[3], 0.32));
    aura.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, 70, 0, Math.PI * 2);
    ctx.fill();

    // Pequeno personagem original: um espírito/luz, sem usar artes de jogos existentes.
    ctx.fillStyle = "rgba(255,255,255,0.94)";
    ctx.beginPath();
    ctx.ellipse(0, 2, 16, 23, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = hexToRgba(palette[3], 0.88);
    ctx.beginPath();
    ctx.ellipse(-5, -11, 8, 14, -0.45, 0, Math.PI * 2);
    ctx.ellipse(8, -9, 7, 13, 0.38, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#101427";
    ctx.beginPath();
    ctx.arc(6, -2, 2.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = hexToRgba("#ffffff", 0.68);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-10, 19);
    ctx.quadraticCurveTo(-20, 24, -17, 32);
    ctx.moveTo(10, 19);
    ctx.quadraticCurveTo(19, 25, 15, 32);
    ctx.stroke();

    ctx.strokeStyle = hexToRgba("#ffd98f", 0.7);
    ctx.beginPath();
    ctx.moveTo(-15, 12);
    ctx.quadraticCurveTo(-41, 6, -44, -12);
    ctx.stroke();
    ctx.restore();
  }

  function drawForeground(palette) {
    const gradient = ctx.createLinearGradient(0, H - 120, 0, H);
    gradient.addColorStop(0, "rgba(8,10,22,0)");
    gradient.addColorStop(1, "rgba(3,4,10,0.72)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, H - 160, W, 160);

    ctx.save();
    ctx.translate(-state.cameraX * 0.55, 0);
    ctx.strokeStyle = hexToRgba(palette[3], 0.1);
    ctx.lineWidth = 2;
    for (let i = 0; i < 28; i += 1) {
      const x = i * 170;
      ctx.beginPath();
      ctx.moveTo(x, H);
      ctx.quadraticCurveTo(x + 30, H - 80 - (i % 5) * 18, x + 65, H - 18);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawHint() {
    if (!state.hint || !state.started || state.paused) return;
    ctx.save();
    const text = state.hint;
    ctx.font = "800 16px Inter";
    const width = Math.min(W - 48, ctx.measureText(text).width + 42);
    const x = (W - width) / 2;
    const y = H - 88;
    ctx.fillStyle = "rgba(4,7,18,0.74)";
    roundRect(x, y, width, 48, 18, true);
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.stroke();
    ctx.fillStyle = "rgba(247,243,255,0.95)";
    ctx.textAlign = "center";
    ctx.fillText(text, W / 2, y + 30);
    ctx.restore();
  }

  function spawnSpark(x, y, amount) {
    for (let i = 0; i < amount; i += 1) {
      particles.push({
        x,
        y,
        r: 1 + Math.random() * 3,
        speed: -1.3 - Math.random() * 1.7,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function burstHearts() {
    const old = document.querySelector(".heart-burst");
    if (old) old.remove();
    const wrapper = document.createElement("div");
    wrapper.className = "heart-burst";
    Object.assign(wrapper.style, {
      position: "fixed",
      inset: "0",
      pointerEvents: "none",
      overflow: "hidden",
      zIndex: "20",
    });

    for (let i = 0; i < 34; i += 1) {
      const heart = document.createElement("span");
      heart.textContent = i % 3 === 0 ? "✦" : "❤";
      Object.assign(heart.style, {
        position: "absolute",
        left: `${10 + Math.random() * 80}%`,
        top: `${70 + Math.random() * 20}%`,
        fontSize: `${18 + Math.random() * 24}px`,
        color: i % 2 ? "#ff9bd2" : "#ffd98f",
        opacity: "0",
        transform: "translateY(0) scale(.8)",
        transition: `transform ${1200 + Math.random() * 1000}ms ease, opacity 450ms ease`,
      });
      wrapper.appendChild(heart);
      requestAnimationFrame(() => {
        heart.style.opacity = "1";
        heart.style.transform = `translateY(-${160 + Math.random() * 260}px) scale(${0.9 + Math.random() * 0.9}) rotate(${Math.random() * 80 - 40}deg)`;
      });
    }

    document.body.appendChild(wrapper);
    window.setTimeout(() => wrapper.remove(), 2300);
  }

  function updateHud() {
    const chapterIndex = getCurrentChapterIndex();
    ui.chapterHud.textContent = story.chapters[chapterIndex].title;
    ui.memoryHud.textContent = String(collected.size);
    [...ui.chapterList.children].forEach((li, index) => {
      const unlocked = isRoomUnlocked(index);
      const collectedHere = collected.has(story.chapters[index].id);
      li.classList.toggle("active", index === chapterIndex);
      li.classList.toggle("locked", !unlocked);
      li.classList.toggle("collected", collectedHere);
    });
  }

  function updateCounter() {
    const start = new Date(story.startDate).getTime();
    const diff = Math.max(0, Date.now() - start);
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const days = Math.floor(diff / day);
    const hours = Math.floor((diff % day) / hour);
    const minutes = Math.floor((diff % hour) / minute);
    ui.loveCounter.textContent = `${days} ${plural(days, "dia", "dias")}, ${hours} ${plural(hours, "hora", "horas")} e ${minutes} ${plural(minutes, "minuto", "minutos")}`;
  }

  function updateLoveReaction() {
    const value = Number(ui.loveRange.value);
    ui.loveValue.textContent = String(value);
    if (value === 0) ui.loveReaction.textContent = "Zero? O jogo detectou brincadeira e vai pedir revisão imediata. Rum!";
    else if (value < 100) ui.loveReaction.textContent = "Ainda pode aumentar um pouquinho, né amor?";
    else if (value === 100) ui.loveReaction.textContent = "100 é bom, mas a escala permite quebrar os limites.";
    else if (value < 500) ui.loveReaction.textContent = "To começando a gostar, minha princesa.";
    else if (value < 1000) ui.loveReaction.textContent = "Agora sim: a escala tá começando a entender a grandeza.";
    else ui.loveReaction.textContent = `1000! Escala quebrada com sucesso, na minha escala também marquei 1000 para você!

Se gostou da surpresa, me manda a figurinha do personagem jogável desse jogo: o Ratinho Gorducho.`;
  }

  function restart() {
    collected.clear();
    player.x = 88;
    player.y = 330;
    player.vx = 0;
    player.vy = 0;
    state.cameraX = 0;
    state.hint = "";
    state.paused = false;
    hideOverlay(ui.finalOverlay);
    updateHud();
  }

  function respawn() {
    const index = getCurrentChapterIndex();
    player.x = index * zoneLength + 80;
    player.y = 260;
    player.vx = 0;
    player.vy = 0;
  }

  function getCurrentChapterIndex() {
    return clamp(Math.floor(player.x / zoneLength), 0, story.chapters.length - 1);
  }

  function touchesHazard() {
    return hazards.some((hazard) => rectsOverlap(player, hazard));
  }

  function isDoorOpen(door) {
    const memory = memories[door.gateIndex];
    return memory ? collected.has(memory.id) : true;
  }

  function isRoomUnlocked(index) {
    if (index <= 0) return true;
    const previousMemory = memories[index - 1];
    return previousMemory ? collected.has(previousMemory.id) : false;
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function centerX(rect) {
    return rect.x + rect.w / 2;
  }

  function centerY(rect) {
    return rect.y + rect.h / 2;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function plural(value, singular, pluralForm) {
    return value === 1 ? singular : pluralForm;
  }

  function hexToRgba(hex, alpha) {
    if (hex.startsWith("rgba")) return hex;
    const normalized = hex.replace("#", "");
    const bigint = parseInt(normalized.length === 3
      ? normalized.split("").map((char) => char + char).join("")
      : normalized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function roundRect(x, y, w, h, r, fill = false) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
    if (fill) ctx.fill();
  }

  init();
})();
