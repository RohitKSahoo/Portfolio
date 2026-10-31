export interface BadgeData {
  name: string;
  role: string;
  institution: string;
  since: string;
  projects: string;
  technologies: string;
  commits: string;
  avatarUrl?: string;
  githubUsername?: string;
  languages?: string[];
  orientation?: 'portrait' | 'landscape';
}

/**
 * Antigravity Spatial Design System - 3D Lanyard Badge Generator
 * Employs deep obsidian gradients, frosted glass bento cells,
 * precision HUD telemetry accents, and signature crimson (#ef4444) glowing elements.
 */

// Draw an Antigravity Frosted Glass Bento Module
const drawGlassCard = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  borderColor = 'rgba(255, 255, 255, 0.10)',
  isAccent = false
) => {
  ctx.save();

  // 1. Soft Ambient Depth Glow
  if (isAccent) {
    ctx.shadowColor = 'rgba(239, 68, 68, 0.18)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 8;
  } else {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 6;
  }

  // 2. Translucent Glass Fill
  const glassGrad = ctx.createLinearGradient(x, y, x + w, y + h);
  glassGrad.addColorStop(0, isAccent ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255, 255, 255, 0.045)');
  glassGrad.addColorStop(1, isAccent ? 'rgba(10, 10, 14, 0.75)' : 'rgba(10, 10, 14, 0.65)');
  ctx.fillStyle = glassGrad;

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();

  ctx.restore();

  // 3. Specular Hairline Inner Border
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 4. Subtle Top-Edge Specular Highlight (Glass Rim Glare)
  const rimGrad = ctx.createLinearGradient(x, y, x + w, y);
  rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  rimGrad.addColorStop(0.2, isAccent ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.22)');
  rimGrad.addColorStop(0.8, isAccent ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.22)');
  rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.strokeStyle = rimGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.stroke();

  ctx.restore();
};

// Draw Precision Corner Crosshair Fiducials
const drawCrosshair = (ctx: CanvasRenderingContext2D, x: number, y: number, size = 12, color = 'rgba(239, 68, 68, 0.55)') => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - size, y);
  ctx.lineTo(x + size, y);
  ctx.moveTo(x, y - size);
  ctx.lineTo(x, y + size);
  ctx.stroke();
  ctx.restore();
};

export const generateFrontBadge = (data: BadgeData): string => {
  const isLandscape = data.orientation !== 'portrait';
  const canvas = document.createElement('canvas');
  canvas.width = isLandscape ? 1530 : 800;
  canvas.height = isLandscape ? 1000 : 1125;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const W = canvas.width;
  const H = canvas.height;

  // 1. Antigravity Deep Obsidian Radial Lighting
  const bgGrad = ctx.createRadialGradient(W / 2, 400, 80, W / 2, 500, 950);
  bgGrad.addColorStop(0, '#131318');
  bgGrad.addColorStop(0.45, '#0b0b0e');
  bgGrad.addColorStop(1, '#050507');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Spatial Blueprint Micro-Dot Matrix with Subtle Falloff
  const gridStep = isLandscape ? 38 : 32;
  for (let x = 36; x < W; x += gridStep) {
    for (let y = 36; y < H; y += gridStep) {
      const distFromCenter = Math.hypot(x - W / 2, y - H / 2);
      const alpha = Math.max(0.015, 0.045 - (distFromCenter / 1400) * 0.035);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.fillRect(x, y, 2.5, 2.5);
    }
  }

  // 3. Perimeter Antigravity HUD Framing
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, W - 64, H - 64);

  // Corner Accent Brackets
  const cOff = 32;
  const cLen = 42;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(cOff, cOff + cLen); ctx.lineTo(cOff, cOff); ctx.lineTo(cOff + cLen, cOff);
  ctx.moveTo(W - cOff - cLen, cOff); ctx.lineTo(W - cOff, cOff); ctx.lineTo(W - cOff, cOff + cLen);
  ctx.moveTo(cOff, H - cOff - cLen); ctx.lineTo(cOff, H - cOff); ctx.lineTo(cOff + cLen, H - cOff);
  ctx.moveTo(W - cOff - cLen, H - cOff); ctx.lineTo(W - cOff, H - cOff); ctx.lineTo(W - cOff, H - cOff - cLen);
  ctx.stroke();

  // Subtle Outer Crosshairs
  drawCrosshair(ctx, cOff + 18, cOff + 18, 8, 'rgba(239, 68, 68, 0.4)');
  drawCrosshair(ctx, W - cOff - 18, cOff + 18, 8, 'rgba(239, 68, 68, 0.4)');
  drawCrosshair(ctx, cOff + 18, H - cOff - 18, 8, 'rgba(239, 68, 68, 0.4)');
  drawCrosshair(ctx, W - cOff - 18, H - cOff - 18, 8, 'rgba(239, 68, 68, 0.4)');

  // Telemetry Micro-Readouts
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = 'bold 12px "SF Mono", monospace, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('SYS.CORE // TELEMETRY_v2.0', 90, 56);
  ctx.textAlign = 'right';
  ctx.fillText('SECURITY STATUS: ENCRYPTED // ACTIVE', W - 90, 56);
  ctx.restore();

  if (isLandscape) {
    // =========================================================================
    // 4 FLOATING ANTIGRAVITY BENTO MODULES (COMMITS, PROJECTS, SINCE, TECHNOLOGIES)
    // =========================================================================
    const cardW = 600;
    const cardH = 320;
    const radius = 22;

    const col1X = 135;
    const col2X = 795;
    const row1Y = 195;
    const row2Y = 565;

    const renderBentoModule = (
      x: number,
      y: number,
      indexTag: string,
      statusTag: string,
      label: string,
      value: string,
      footerNote: string,
      isPrimary = false
    ) => {
      // 1. Draw Glass Capsule
      drawGlassCard(
        ctx,
        x,
        y,
        cardW,
        cardH,
        radius,
        isPrimary ? 'rgba(239, 68, 68, 0.40)' : 'rgba(255, 255, 255, 0.12)',
        isPrimary
      );

      // 2. Top Meta Header inside module
      ctx.save();
      ctx.textAlign = 'left';
      ctx.fillStyle = isPrimary ? '#ef4444' : 'rgba(255, 255, 255, 0.4)';
      ctx.font = 'bold 15px "SF Mono", monospace, sans-serif';
      ctx.fillText(indexTag, x + 36, y + 46);

      ctx.textAlign = 'right';
      if (isPrimary) {
        // Glowing Green Pulse Beacon for Commits Activity
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(x + cardW - 130, y + 41, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 13px "SF Mono", monospace, sans-serif';
        ctx.fillText('LIVE RECORD', x + cardW - 36, y + 46);
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.font = 'bold 13px "SF Mono", monospace, sans-serif';
        ctx.fillText(statusTag, x + cardW - 36, y + 46);
      }

      // 3. Section Title / Label
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.50)';
      ctx.font = 'bold 20px "SF Mono", monospace, sans-serif';
      ctx.fillText(label.toUpperCase(), x + 36, y + 90);

      // 4. Large Stat Numeral
      ctx.fillStyle = isPrimary ? '#ef4444' : '#ffffff';
      ctx.font = 'bold 124px "Satoshi", sans-serif, -apple-system';

      if (isPrimary) {
        ctx.shadowColor = 'rgba(239, 68, 68, 0.35)';
        ctx.shadowBlur = 18;
      } else {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
      }
      ctx.fillText(value, x + 36, y + 215);
      ctx.shadowBlur = 0; // reset

      // 5. Bottom Descriptor Line
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.font = '13px "SF Mono", monospace, sans-serif';
      ctx.fillText(footerNote, x + 36, y + 276);

      // Decorative corner tick
      ctx.strokeStyle = isPrimary ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + cardW - 24, y + cardH - 12);
      ctx.lineTo(x + cardW - 12, y + cardH - 12);
      ctx.lineTo(x + cardW - 12, y + cardH - 24);
      ctx.stroke();

      ctx.restore();
    };

    // Render 4 Quadrants
    renderBentoModule(
      col1X,
      row1Y,
      '// 01',
      'ACTIVE STREAM',
      'Commits',
      data.commits,
      'PRODUCTION & OSS CONTRIBUTIONS',
      true
    );

    renderBentoModule(
      col2X,
      row1Y,
      '// 02',
      'VERIFIED ARCH',
      'Projects',
      data.projects,
      'PUBLIC REPOSITORIES & PACKAGES',
      false
    );

    renderBentoModule(
      col1X,
      row2Y,
      '// 03',
      'ORIGIN YEAR',
      'Since',
      data.since,
      'CONTINUOUS DEPLOYMENT CYCLE',
      false
    );

    renderBentoModule(
      col2X,
      row2Y,
      '// 04',
      'CORE ECOSYSTEM',
      'Technologies',
      data.technologies,
      'LANGUAGES & FRAMEWORKS IN USE',
      false
    );

  } else {
    // Portrait Fallback
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = 'bold 18px "SF Mono", monospace, sans-serif';
    ctx.fillText('COMMITS', 100, 200);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 80px "Satoshi", sans-serif';
    ctx.fillText(data.commits, 100, 280);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('PROJECTS', 100, 420);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(data.projects, 100, 500);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('SINCE', 100, 640);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(data.since, 100, 720);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('TECHNOLOGIES', 100, 860);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(data.technologies, 100, 940);
  }

  return canvas.toDataURL('image/png');
};

export const generateBackBadge = (data: BadgeData): string => {
  const isLandscape = data.orientation !== 'portrait';
  const canvas = document.createElement('canvas');
  canvas.width = isLandscape ? 1530 : 800;
  canvas.height = isLandscape ? 1000 : 1125;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const W = canvas.width;
  const H = canvas.height;

  // 1. Antigravity Deep Obsidian Radial Lighting
  const bgGrad = ctx.createRadialGradient(W / 2, 400, 80, W / 2, 500, 950);
  bgGrad.addColorStop(0, '#131318');
  bgGrad.addColorStop(0.45, '#0b0b0e');
  bgGrad.addColorStop(1, '#050507');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Spatial Blueprint Micro-Dot Matrix with Subtle Falloff
  const gridStep = isLandscape ? 38 : 32;
  for (let x = 36; x < W; x += gridStep) {
    for (let y = 36; y < H; y += gridStep) {
      const distFromCenter = Math.hypot(x - W / 2, y - H / 2);
      const alpha = Math.max(0.015, 0.045 - (distFromCenter / 1400) * 0.035);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.fillRect(x, y, 2.5, 2.5);
    }
  }

  // 3. Perimeter Antigravity HUD Framing
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, W - 64, H - 64);

  // Corner Accent Brackets
  const cOff = 32;
  const cLen = 42;
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(cOff, cOff + cLen); ctx.lineTo(cOff, cOff); ctx.lineTo(cOff + cLen, cOff);
  ctx.moveTo(W - cOff - cLen, cOff); ctx.lineTo(W - cOff, cOff); ctx.lineTo(W - cOff, cOff + cLen);
  ctx.moveTo(cOff, H - cOff - cLen); ctx.lineTo(cOff, H - cOff); ctx.lineTo(cOff + cLen, H - cOff);
  ctx.moveTo(W - cOff - cLen, H - cOff); ctx.lineTo(W - cOff, H - cOff); ctx.lineTo(W - cOff, H - cOff - cLen);
  ctx.stroke();

  // Subtle Outer Crosshairs
  drawCrosshair(ctx, cOff + 18, cOff + 18, 8, 'rgba(239, 68, 68, 0.4)');
  drawCrosshair(ctx, W - cOff - 18, cOff + 18, 8, 'rgba(239, 68, 68, 0.4)');
  drawCrosshair(ctx, cOff + 18, H - cOff - 18, 8, 'rgba(239, 68, 68, 0.4)');
  drawCrosshair(ctx, W - cOff - 18, H - cOff - 18, 8, 'rgba(239, 68, 68, 0.4)');

  // Telemetry Micro-Readouts
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = 'bold 12px "SF Mono", monospace, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('IDENTITY MIRROR // TECH RADAR', 90, 56);
  ctx.textAlign = 'right';
  ctx.fillText('SPECIALIZATIONS & ARCHITECTURE', W - 90, 56);
  ctx.restore();

  if (isLandscape) {
    // =========================================================================
    // 3 EXPANDED BENTO COLUMNS (CORE LANGUAGES, FRAMEWORKS & UI, SYSTEMS & RUNTIME)
    // =========================================================================

    // Top Section Header
    ctx.save();
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 15px "SF Mono", monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('// 02 · TECHNICAL_COMPETENCIES', 130, 112);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px "Satoshi", sans-serif, -apple-system';
    ctx.fillText('PROGRAMMING LANGUAGES & CORE STACK', 130, 150);

    // Right-aligned status beacon
    ctx.textAlign = 'right';
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(W - 275, 138, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = 'bold 14px "SF Mono", monospace, sans-serif';
    ctx.fillText('VERIFIED ECOSYSTEM', W - 130, 143);
    ctx.restore();

    // 3 Bento Columns:
    const colW = 390;
    const colH = 720;
    const gap = 45;
    const startX = 130;
    const startY = 185;

    const categories = [
      {
        tag: '// 01',
        title: 'CORE LANGUAGES',
        subtitle: 'Systems & Typed Languages',
        skills: [
          { name: 'Kotlin', desc: 'Android Native · Coroutines · KMP', tag: 'NATIVE' },
          { name: 'Java', desc: 'Core SE · OOP · Enterprise Systems', tag: 'CORE' },
          { name: 'TypeScript', desc: 'Type Systems · Full-Stack ESNext', tag: 'TYPED' },
          { name: 'JavaScript', desc: 'V8 Engine · DOM · Modern Async', tag: 'WEB' },
          { name: 'Python', desc: 'Automation · Data Pipelines · ML', tag: 'SCRIPT' },
          { name: 'C / C++', desc: 'Memory Management · JNI Bridge', tag: 'PERF' },
        ]
      },
      {
        tag: '// 02',
        title: 'FRAMEWORKS & UI',
        subtitle: '3D Graphics & Reactive Apps',
        skills: [
          { name: 'React 18 / 19', desc: 'Concurrent Hooks · Component Trees', tag: 'UI' },
          { name: 'Next.js', desc: 'App Router · Server Components', tag: 'SSR' },
          { name: 'Three.js', desc: 'WebGL · Shaders · 3D Math Pipeline', tag: '3D/GL' },
          { name: 'Tailwind CSS', desc: 'Design Tokens · Responsive Layouts', tag: 'CSS' },
          { name: 'Framer Motion', desc: 'Spring Dynamics · Gesture Physics', tag: 'ANIM' },
          { name: 'Jetpack Compose', desc: 'Modern Declarative Android UI', tag: 'MOBILE' },
        ]
      },
      {
        tag: '// 03',
        title: 'SYSTEMS & TOOLING',
        subtitle: 'APIs, DevOps & Runtime Infra',
        skills: [
          { name: 'Node.js & Express', desc: 'High-Concurrency Backend Endpoints', tag: 'SERVER' },
          { name: 'Git & GitHub Actions', desc: 'CI/CD Pipelines · Automated Workflows', tag: 'CI/CD' },
          { name: 'Linux & Bash CLI', desc: 'POSIX Environment · Shell Scripting', tag: 'SYSTEM' },
          { name: 'REST & GraphQL', desc: 'API Design · Schema Architecture', tag: 'APIS' },
          { name: 'Firebase & SQLite', desc: 'Cloud Firestore · Local DB Engines', tag: 'DATA' },
          { name: 'Android NDK / JNI', desc: 'Native C++ Audio & Latency Opt', tag: 'LOW-LVL' },
        ]
      }
    ];

    categories.forEach((cat, colIndex) => {
      const cx = startX + colIndex * (colW + gap);
      const cy = startY;

      // 1. Column Frosted Glass Bento Container
      drawGlassCard(ctx, cx, cy, colW, colH, 22, colIndex === 0 ? 'rgba(239, 68, 68, 0.38)' : 'rgba(255, 255, 255, 0.12)', colIndex === 0);

      // 2. Column Header
      ctx.save();
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 14px "SF Mono", monospace, sans-serif';
      ctx.fillText(cat.tag, cx + 28, cy + 42);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Satoshi", sans-serif, -apple-system';
      ctx.fillText(cat.title, cx + 28, cy + 74);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.40)';
      ctx.font = '12px "SF Mono", monospace, sans-serif';
      ctx.fillText(cat.subtitle.toUpperCase(), cx + 28, cy + 96);

      // Subtle divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + 28, cy + 112);
      ctx.lineTo(cx + colW - 28, cy + 112);
      ctx.stroke();
      ctx.restore();

      // 3. Render 6 Enlarged Skill Capsules
      const rowStartY = cy + 128;
      const rowH = 80;
      const rowGap = 13;
      const rowW = colW - 48;
      const rowX = cx + 24;

      cat.skills.forEach((skill, rIndex) => {
        const ry = rowStartY + rIndex * (rowH + rowGap);

        ctx.save();
        // Capsule Glass background
        const rowGrad = ctx.createLinearGradient(rowX, ry, rowX + rowW, ry + rowH);
        rowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.045)');
        rowGrad.addColorStop(1, 'rgba(10, 10, 14, 0.65)');
        ctx.fillStyle = rowGrad;
        ctx.beginPath();
        ctx.roundRect(rowX, ry, rowW, rowH, 14);
        ctx.fill();

        // Border with subtle hover accent on col 0
        ctx.strokeStyle = colIndex === 0 ? 'rgba(239, 68, 68, 0.22)' : 'rgba(255, 255, 255, 0.09)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Glowing Crimson Indicator Beacon
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(rowX + 22, ry + 30, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Skill Name (Enlarged, high-contrast)
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px "Satoshi", sans-serif, -apple-system';
        ctx.textAlign = 'left';
        ctx.fillText(skill.name, rowX + 38, ry + 36);

        // Category Tag Badge on the right
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = 'bold 11px "SF Mono", monospace, sans-serif';
        ctx.fillText(skill.tag, rowX + rowW - 16, ry + 34);

        // Skill Sub-Descriptor Line
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '12px "SF Mono", monospace, sans-serif';
        ctx.fillText(skill.desc, rowX + 22, ry + 62);

        ctx.restore();
      });
    });

  } else {
    // Portrait fallback: 2 stacked cards
    const cardW = 680;
    const colX = 60;
    
    // Top card: Languages
    drawGlassCard(ctx, colX, 160, cardW, 430, 22, 'rgba(239, 68, 68, 0.35)', true);
    ctx.save();
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px "SF Mono", monospace, sans-serif';
    ctx.fillText('// 01 · CORE LANGUAGES', colX + 32, 205);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Satoshi", sans-serif';
    ctx.fillText('PROGRAMMING LANGUAGES', colX + 32, 240);

    const portLangs = ['Kotlin', 'Java', 'TypeScript', 'JavaScript', 'Python', 'C / C++'];
    portLangs.forEach((lang, idx) => {
      const ly = 270 + idx * 56;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Satoshi", sans-serif';
      ctx.fillText(`• ${lang}`, colX + 36, ly);
    });
    ctx.restore();

    // Bottom card: Frameworks & Tools
    drawGlassCard(ctx, colX, 620, cardW, 440, 22, 'rgba(255, 255, 255, 0.12)', false);
    ctx.save();
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px "SF Mono", monospace, sans-serif';
    ctx.fillText('// 02 · FRAMEWORKS & TOOLS', colX + 32, 665);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Satoshi", sans-serif';
    ctx.fillText('DEVELOPMENT STACK', colX + 32, 700);

    const portTools = ['React 18 / 19', 'Next.js', 'Three.js (WebGL)', 'Tailwind CSS', 'Node.js & Express', 'Git & Linux'];
    portTools.forEach((tool, idx) => {
      const ty = 730 + idx * 56;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Satoshi", sans-serif';
      ctx.fillText(`• ${tool}`, colX + 36, ty);
    });
    ctx.restore();
  }

  return canvas.toDataURL('image/png');
};

export const generateStrapImage = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Tactical Carbon Obsidian Weave Base
  ctx.fillStyle = '#08080a';
  ctx.fillRect(0, 0, 768, 192);

  // Ballistic herringbone texture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
  for (let x = 0; x < 768; x += 8) {
    ctx.fillRect(x, 0, 2, 192);
  }

  // 2. High-Visibility Crimson Edge Piping
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(0, 0, 768, 8);
  ctx.fillRect(0, 184, 768, 8);

  // Darker inner border rail
  ctx.fillStyle = '#1c1c22';
  ctx.fillRect(0, 8, 768, 10);
  ctx.fillRect(0, 174, 768, 10);

  // 3. High-Tensile Safety Stitched Dashes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let x = 8; x < 768; x += 18) {
    ctx.fillRect(x, 12, 8, 2.5);
    ctx.fillRect(x, 177, 8, 2.5);
  }

  // 4. Centered Repeated Tactical Typography
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px "Satoshi", sans-serif, -apple-system';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 8;
  ctx.fillText('★  ROHIT K. SAHOO  //  GITHUB : ROHITKSAHOO  //  VSSUT CSE  ★', 384, 96);
  ctx.restore();

  return canvas.toDataURL('image/png');
};
