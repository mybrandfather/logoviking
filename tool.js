// LogoViking — Tool Logic (client-side image processing)

const TOOLS = {
  compress: {
    title: 'Compress Image',
    desc: 'Shrink file sizes without visible quality loss. Supports bulk processing.',
    icon: '🗜',
    iconBg: '#f97316',
    formats: ['JPG', 'PNG', 'WebP', 'GIF', 'BMP'],
    settings: `
      <div class="setting-row">
        <div><div class="setting-label">Quality</div><div class="setting-desc">Higher = better quality, larger file</div></div>
        <div class="range-wrapper">
          <input type="range" id="quality" min="10" max="100" value="80" oninput="document.getElementById('qualityVal').textContent=this.value+'%'">
          <span class="range-value" id="qualityVal">80%</span>
        </div>
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Output Format</div></div>
        <select id="outFormat"><option value="original">Keep original</option><option value="jpeg">JPEG</option><option value="webp">WebP</option><option value="png">PNG</option></select>
      </div>
      <button class="process-btn" id="processBtn">🗜 Compress Images</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processCompress
  },
  resize: {
    title: 'Resize Image',
    desc: 'Change image dimensions by pixel or percentage. Batch resize multiple files at once.',
    icon: '⇲',
    iconBg: '#3b82f6',
    formats: ['JPG', 'PNG', 'WebP', 'GIF', 'BMP'],
    settings: `
      <div class="setting-row">
        <div><div class="setting-label">Width (px)</div></div>
        <input type="number" id="resizeW" value="1920" min="1" max="8000">
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Height (px)</div></div>
        <input type="number" id="resizeH" value="1080" min="1" max="8000">
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Maintain aspect ratio</div></div>
        <label class="toggle-switch"><input type="checkbox" id="keepRatio" checked><span class="slider"></span></label>
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Output Format</div></div>
        <select id="resizeFmt"><option value="original">Keep original</option><option value="jpeg">JPEG</option><option value="png">PNG</option><option value="webp">WebP</option></select>
      </div>
      <button class="process-btn" id="processBtn">⇲ Resize Images</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processResize
  },
  crop: {
    title: 'Crop Image',
    desc: 'Crop to exact pixel dimensions or choose from aspect ratio presets.',
    icon: '✂',
    iconBg: '#10b981',
    formats: ['JPG', 'PNG', 'WebP', 'GIF'],
    settings: `
      <div class="setting-row">
        <div><div class="setting-label">Aspect Ratio Preset</div></div>
        <select id="aspectPreset" onchange="updateCropDims()">
          <option value="free">Free</option>
          <option value="1:1">Square 1:1</option>
          <option value="16:9">Landscape 16:9</option>
          <option value="4:3">4:3</option>
          <option value="9:16">Portrait 9:16</option>
          <option value="3:2">3:2</option>
          <option value="a4">A4 Document</option>
        </select>
      </div>
      <div class="setting-row">
        <div><div class="setting-label">X Offset (px)</div></div>
        <input type="number" id="cropX" value="0" min="0">
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Y Offset (px)</div></div>
        <input type="number" id="cropY" value="0" min="0">
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Width (px)</div></div>
        <input type="number" id="cropW" value="800" min="1">
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Height (px)</div></div>
        <input type="number" id="cropH" value="600" min="1">
      </div>
      <button class="process-btn" id="processBtn">✂ Crop Images</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processCrop
  },
  rotate: {
    title: 'Rotate Image',
    desc: 'Rotate or flip images. Choose to rotate only landscape or portrait images.',
    icon: '↻',
    iconBg: '#f59e0b',
    formats: ['JPG', 'PNG', 'WebP', 'GIF', 'BMP'],
    settings: `
      <div class="setting-row">
        <div><div class="setting-label">Rotation</div></div>
        <select id="rotateDeg">
          <option value="90">90° Clockwise</option>
          <option value="180">180°</option>
          <option value="270">90° Counter-clockwise</option>
          <option value="flipH">Flip Horizontal</option>
          <option value="flipV">Flip Vertical</option>
        </select>
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Apply only to</div></div>
        <select id="rotateFilter">
          <option value="all">All images</option>
          <option value="landscape">Landscape only</option>
          <option value="portrait">Portrait only</option>
        </select>
      </div>
      <button class="process-btn" id="processBtn">↻ Rotate Images</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processRotate
  },
  tojpg: {
    title: 'Convert to JPG',
    desc: 'Convert PNG, GIF, WEBP, HEIC, RAW, TIF and other formats to JPG in bulk.',
    icon: '📄',
    iconBg: '#ef4444',
    formats: ['PNG', 'WebP', 'GIF', 'BMP', 'TIFF', 'SVG'],
    settings: `
      <div class="setting-row">
        <div><div class="setting-label">JPG Quality</div></div>
        <div class="range-wrapper">
          <input type="range" id="jpgQ" min="10" max="100" value="90" oninput="document.getElementById('jpgQVal').textContent=this.value+'%'">
          <span class="range-value" id="jpgQVal">90%</span>
        </div>
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Background color</div><div class="setting-desc">For transparent images (PNG/GIF)</div></div>
        <input type="color" id="jpgBg" value="#ffffff" style="width:40px;height:32px;border:1px solid var(--border);border-radius:6px;cursor:pointer;background:none;padding:0">
      </div>
      <button class="process-btn" id="processBtn">📄 Convert to JPG</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processConvertTo.bind(null, 'jpeg')
  },
  topng: {
    title: 'Convert to PNG',
    desc: 'Convert JPG, WebP, GIF and more formats to lossless PNG.',
    icon: '🖼',
    iconBg: '#06b6d4',
    formats: ['JPG', 'WebP', 'GIF', 'BMP', 'TIFF'],
    settings: `
      <button class="process-btn" id="processBtn">🖼 Convert to PNG</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processConvertTo.bind(null, 'png')
  },
  towebp: {
    title: 'Convert to WebP',
    desc: 'Convert any image to modern WebP format — up to 30% smaller than JPG/PNG.',
    icon: '🌐',
    iconBg: '#84cc16',
    formats: ['JPG', 'PNG', 'GIF', 'BMP', 'TIFF'],
    settings: `
      <div class="setting-row">
        <div><div class="setting-label">WebP Quality</div></div>
        <div class="range-wrapper">
          <input type="range" id="webpQ" min="10" max="100" value="85" oninput="document.getElementById('webpQVal').textContent=this.value+'%'">
          <span class="range-value" id="webpQVal">85%</span>
        </div>
      </div>
      <button class="process-btn" id="processBtn">🌐 Convert to WebP</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processConvertTo.bind(null, 'webp')
  },
  toavif: {
    title: 'Convert to AVIF',
    desc: 'Next-generation image format with best-in-class compression. Smaller files, better quality.',
    icon: '⭐',
    iconBg: '#a78bfa',
    formats: ['JPG', 'PNG', 'WebP'],
    settings: `
      <div style="padding:12px;background:var(--bg3);border-radius:8px;font-size:0.85rem;color:var(--text2);margin-bottom:12px">
        ⚠ AVIF encoding is not yet natively supported in all browsers. Files will be converted via WebP as fallback with AVIF naming.
      </div>
      <button class="process-btn" id="processBtn">⭐ Convert to AVIF</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processConvertTo.bind(null, 'webp')
  },
  watermark: {
    title: 'Watermark Image',
    desc: 'Add text or image watermarks. Control position, opacity and size.',
    icon: '🛡',
    iconBg: '#6366f1',
    formats: ['JPG', 'PNG', 'WebP', 'BMP'],
    settings: `
      <div class="setting-row">
        <div><div class="setting-label">Watermark Text</div></div>
        <input type="text" id="wmText" value="© LogoViking" style="background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:7px 10px;border-radius:6px;width:200px;font-family:var(--font-body);font-size:0.88rem">
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Font Size</div></div>
        <div class="range-wrapper">
          <input type="range" id="wmSize" min="12" max="120" value="36" oninput="document.getElementById('wmSizeVal').textContent=this.value+'px'">
          <span class="range-value" id="wmSizeVal">36px</span>
        </div>
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Opacity</div></div>
        <div class="range-wrapper">
          <input type="range" id="wmOpacity" min="10" max="100" value="50" oninput="document.getElementById('wmOpVal').textContent=this.value+'%'">
          <span class="range-value" id="wmOpVal">50%</span>
        </div>
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Color</div></div>
        <input type="color" id="wmColor" value="#ffffff" style="width:40px;height:32px;border:1px solid var(--border);border-radius:6px;cursor:pointer;background:none;padding:0">
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Position</div></div>
        <select id="wmPos">
          <option value="br">Bottom Right</option>
          <option value="bl">Bottom Left</option>
          <option value="tr">Top Right</option>
          <option value="tl">Top Left</option>
          <option value="center">Center</option>
          <option value="tile">Tiled</option>
        </select>
      </div>
      <button class="process-btn" id="processBtn">🛡 Apply Watermark</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processWatermark
  },
  meme: {
    title: 'Meme Generator',
    desc: 'Upload a photo or choose a template. Add top and bottom text. Export instantly.',
    icon: '😂',
    iconBg: '#f97316',
    formats: ['JPG', 'PNG', 'WebP', 'GIF'],
    settings: `
      <div class="setting-row">
        <div><div class="setting-label">Top Text</div></div>
        <input type="text" id="memeTop" value="WHEN YOU FINALLY" style="background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:7px 10px;border-radius:6px;width:220px;font-family:var(--font-body);font-size:0.88rem">
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Bottom Text</div></div>
        <input type="text" id="memeBottom" value="GET IT TO WORK" style="background:var(--bg3);border:1px solid var(--border);color:var(--text);padding:7px 10px;border-radius:6px;width:220px;font-family:var(--font-body);font-size:0.88rem">
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Font Size</div></div>
        <div class="range-wrapper">
          <input type="range" id="memeFontSize" min="20" max="100" value="48" oninput="document.getElementById('memeFontVal').textContent=this.value+'px'">
          <span class="range-value" id="memeFontVal">48px</span>
        </div>
      </div>
      <button class="process-btn" id="processBtn">😂 Generate Meme</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processMeme
  },
  palette: {
    title: 'Color Palette Extractor',
    desc: 'Instantly extract dominant colors from any image and copy hex codes.',
    icon: '🎨',
    iconBg: '#ec4899',
    formats: ['JPG', 'PNG', 'WebP', 'GIF'],
    settings: `
      <div class="setting-row">
        <div><div class="setting-label">Number of Colors</div></div>
        <select id="paletteCount"><option value="5">5 colors</option><option value="8">8 colors</option><option value="12" selected>12 colors</option><option value="16">16 colors</option></select>
      </div>
      <button class="process-btn" id="processBtn">🎨 Extract Palette</button>
    `,
    process: processPalette
  },
  exif: {
    title: 'Remove EXIF Data',
    desc: 'Strip GPS location, camera model, shooting settings and all hidden metadata from photos.',
    icon: '🔒',
    iconBg: '#f59e0b',
    formats: ['JPG', 'PNG', 'WebP'],
    settings: `
      <div style="padding:14px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:8px;font-size:0.85rem;margin-bottom:16px;">
        ✓ This tool strips all EXIF metadata including GPS coordinates, device info, capture settings, and copyright data.
      </div>
      <button class="process-btn" id="processBtn">🔒 Remove EXIF Data</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processExifRemove
  },
  blurface: {
    title: 'Blur Faces',
    desc: 'Automatically detect and blur faces, license plates or private info in your photos.',
    icon: '👁',
    iconBg: '#6366f1',
    formats: ['JPG', 'PNG', 'WebP'],
    settings: `
      <div class="setting-row">
        <div><div class="setting-label">Blur Intensity</div></div>
        <div class="range-wrapper">
          <input type="range" id="blurAmount" min="5" max="40" value="15" oninput="document.getElementById('blurVal').textContent=this.value">
          <span class="range-value" id="blurVal">15</span>
        </div>
      </div>
      <div style="padding:12px;background:var(--bg3);border-radius:8px;font-size:0.82rem;color:var(--text2);margin-bottom:12px">
        ℹ AI face detection runs client-side. This demo applies gaussian blur to a center region as a preview. Full AI detection requires the Pro plan.
      </div>
      <button class="process-btn" id="processBtn">👁 Blur Faces</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processBlurFace
  },
  screenshot: {
    title: 'Screenshot Beautifier',
    desc: 'Wrap screenshots in gorgeous frames with gradients, rounded corners and shadows.',
    icon: '🖥',
    iconBg: '#14b8a6',
    formats: ['JPG', 'PNG', 'WebP'],
    settings: `
      <div class="setting-row">
        <div><div class="setting-label">Background</div></div>
        <select id="screenshotBg">
          <option value="purple">Purple Gradient</option>
          <option value="dark">Dark</option>
          <option value="blue">Ocean Blue</option>
          <option value="sunset">Sunset</option>
          <option value="mint">Mint</option>
        </select>
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Padding</div></div>
        <div class="range-wrapper">
          <input type="range" id="screenshotPad" min="20" max="120" value="60" oninput="document.getElementById('padVal').textContent=this.value+'px'">
          <span class="range-value" id="padVal">60px</span>
        </div>
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Corner Radius</div></div>
        <div class="range-wrapper">
          <input type="range" id="screenshotRadius" min="0" max="30" value="12" oninput="document.getElementById('radiusVal').textContent=this.value+'px'">
          <span class="range-value" id="radiusVal">12px</span>
        </div>
      </div>
      <button class="process-btn" id="processBtn">🖥 Beautify Screenshot</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processScreenshot
  },
  imgpdf: {
    title: 'Image to PDF',
    desc: 'Combine multiple images into a single PDF document. Choose page orientation.',
    icon: '📋',
    iconBg: '#ef4444',
    formats: ['JPG', 'PNG', 'WebP', 'BMP', 'GIF'],
    settings: `
      <div class="setting-row">
        <div><div class="setting-label">Page Orientation</div></div>
        <select id="pdfOrient"><option value="auto">Auto-fit</option><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select>
      </div>
      <div style="padding:12px;background:var(--bg3);border-radius:8px;font-size:0.82rem;color:var(--text2);margin-bottom:12px">
        ℹ This tool creates a PDF from your images using the browser's print API. For advanced PDF features, try our Pro plan.
      </div>
      <button class="process-btn" id="processBtn">📋 Create PDF</button>
    `,
    process: processImageToPDF
  },
  upscale: {
    title: 'AI Upscale Image',
    desc: 'Enlarge images 2x to 4x using AI super-resolution for stunning clarity.',
    icon: '🔍',
    iconBg: '#8b5cf6',
    formats: ['JPG', 'PNG', 'WebP'],
    settings: `
      <div class="setting-row">
        <div><div class="setting-label">Upscale Factor</div></div>
        <select id="upscaleFactor"><option value="2">2x (Double)</option><option value="4">4x (Quadruple)</option></select>
      </div>
      <div style="padding:12px;background:var(--bg3);border-radius:8px;font-size:0.82rem;color:var(--text2);margin-bottom:12px">
        ℹ Full AI upscaling requires a Pro plan. This demo resizes using canvas interpolation as a preview.
      </div>
      <button class="process-btn" id="processBtn">🔍 Upscale Image</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processUpscale
  },
  removebg: {
    title: 'Remove Background',
    desc: 'Automatically remove image backgrounds in one click with AI precision.',
    icon: '✨',
    iconBg: '#ec4899',
    formats: ['JPG', 'PNG', 'WebP'],
    settings: `
      <div style="padding:12px;background:var(--bg3);border-radius:8px;font-size:0.82rem;color:var(--text2);margin-bottom:12px">
        ℹ AI background removal requires cloud processing (Pro plan). This demo converts to PNG and removes near-white backgrounds as a preview.
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Threshold</div></div>
        <div class="range-wrapper">
          <input type="range" id="bgThreshold" min="10" max="80" value="30" oninput="document.getElementById('bgThVal').textContent=this.value">
          <span class="range-value" id="bgThVal">30</span>
        </div>
      </div>
      <button class="process-btn" id="processBtn">✨ Remove Background</button>
      <div class="progress-bar-wrap" id="progressWrap" style="display:none"><div class="progress-bar" id="progressBar"></div></div>
    `,
    process: processRemoveBg
  }
};

// ============================================================
// INIT
// ============================================================
let uploadedFiles = [];

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const toolId = params.get('t') || 'compress';
  const tool = TOOLS[toolId];

  if (!tool) {
    document.body.innerHTML = '<div style="text-align:center;padding:100px 20px"><h2>Tool not found</h2><a href="index.html">← Back</a></div>';
    return;
  }

  // Set page title
  document.title = `${tool.title} — LogoViking`;
  document.getElementById('pageTitle').textContent = document.title;
  document.getElementById('toolTitle').textContent = tool.title;
  document.getElementById('toolDesc').textContent = tool.desc;

  // Hero icon
  const heroIcon = document.getElementById('toolHeroIcon');
  heroIcon.textContent = tool.icon;
  heroIcon.style.background = `${tool.iconBg}22`;
  heroIcon.style.border = `1px solid ${tool.iconBg}44`;

  // Format badges
  const badgesEl = document.getElementById('formatBadges');
  tool.formats.forEach(fmt => {
    const b = document.createElement('span');
    b.className = 'format-badge';
    b.textContent = fmt;
    badgesEl.appendChild(b);
  });

  // Settings
  document.getElementById('toolSettings').innerHTML = tool.settings;

  // Dropzone
  setupDropzone();
  loadRelatedTools(toolId);
});

// ============================================================
// DROPZONE
// ============================================================
function setupDropzone() {
  const dz = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');

  dz.addEventListener('click', (e) => {
    if (e.target.classList.contains('dz-browse')) return;
    fileInput.click();
  });

  dz.addEventListener('dragover', e => {
    e.preventDefault();
    dz.classList.add('drag-over');
  });

  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));

  dz.addEventListener('drop', e => {
    e.preventDefault();
    dz.classList.remove('drag-over');
    handleFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')));
  });

  fileInput.addEventListener('change', () => {
    handleFiles(Array.from(fileInput.files));
    fileInput.value = '';
  });
}

function handleFiles(files) {
  if (!files.length) return;
  uploadedFiles = [...uploadedFiles, ...files];

  const dz = document.getElementById('dropzone');
  dz.classList.add('has-files');

  let previews = document.querySelector('.file-previews');
  if (!previews) {
    previews = document.createElement('div');
    previews.className = 'file-previews';
    document.getElementById('dzInner').appendChild(previews);
  }

  files.forEach((file, idx) => {
    const reader = new FileReader();
    reader.onload = e => {
      const item = document.createElement('div');
      item.className = 'file-preview-item';
      const gIdx = uploadedFiles.indexOf(file);
      item.dataset.idx = gIdx;
      item.innerHTML = `
        <img src="${e.target.result}" alt="${file.name}">
        <button class="remove-file" onclick="removeFile(${gIdx})">✕</button>
      `;
      previews.appendChild(item);
    };
    reader.readAsDataURL(file);
  });

  document.getElementById('settingsPanel').style.display = 'block';
  document.getElementById('resultsPanel').style.display = 'none';

  // Attach process button
  setTimeout(() => {
    const btn = document.getElementById('processBtn');
    btn?.addEventListener('click', runProcess);
  }, 100);
}

function removeFile(idx) {
  uploadedFiles.splice(idx, 1);
  const item = document.querySelector(`.file-preview-item[data-idx="${idx}"]`);
  item?.remove();
  if (uploadedFiles.length === 0) {
    document.getElementById('dropzone').classList.remove('has-files');
    document.querySelector('.file-previews')?.remove();
    document.getElementById('settingsPanel').style.display = 'none';
  }
}

// ============================================================
// RUN PROCESS
// ============================================================
async function runProcess() {
  const params = new URLSearchParams(window.location.search);
  const toolId = params.get('t') || 'compress';
  const tool = TOOLS[toolId];

  if (!uploadedFiles.length) {
    alert('Please upload at least one image first.');
    return;
  }

  const btn = document.getElementById('processBtn');
  btn.disabled = true;
  btn.textContent = 'Processing...';

  const progressWrap = document.getElementById('progressWrap');
  const progressBar = document.getElementById('progressBar');
  if (progressWrap) progressWrap.style.display = 'block';

  const results = [];
  for (let i = 0; i < uploadedFiles.length; i++) {
    const file = uploadedFiles[i];
    try {
      const result = await tool.process(file);
      results.push(result);
    } catch (err) {
      console.error(err);
    }
    if (progressBar) progressBar.style.width = `${((i + 1) / uploadedFiles.length) * 100}%`;
  }

  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = btn.textContent.replace('Processing...', tool.title.split(' ')[0]);
    if (progressWrap) progressWrap.style.display = 'none';
    if (progressBar) progressBar.style.width = '0%';
    showResults(results);
  }, 200);
}

function showResults(results) {
  const panel = document.getElementById('resultsPanel');
  const list = document.getElementById('resultsList');
  const countEl = document.getElementById('resultCount');

  panel.style.display = 'block';
  list.innerHTML = '';
  countEl.textContent = `(${results.length} file${results.length !== 1 ? 's' : ''})`;

  results.forEach(r => {
    if (!r) return;
    const item = document.createElement('div');
    item.className = 'result-item';
    const savingsHtml = r.savings != null
      ? `<span class="result-savings">${r.savings}</span>`
      : `<span class="result-savings neutral">Done</span>`;
    item.innerHTML = `
      <img class="result-thumb" src="${r.dataUrl}" alt="${r.name}">
      <div class="result-info">
        <div class="result-name">${r.name}</div>
        <div class="result-meta">${r.meta || ''}</div>
      </div>
      ${savingsHtml}
      <a class="btn-dl" href="${r.dataUrl}" download="${r.name}">⬇</a>
    `;
    list.appendChild(item);
  });

  document.getElementById('downloadAllBtn').onclick = () => downloadAll(results);
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function downloadAll(results) {
  results.forEach((r, i) => {
    if (!r) return;
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = r.dataUrl;
      a.download = r.name;
      a.click();
    }, i * 200);
  });
}

// ============================================================
// PROCESS FUNCTIONS
// ============================================================

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

async function processCompress(file) {
  const quality = (parseInt(document.getElementById('quality')?.value) || 80) / 100;
  const fmt = document.getElementById('outFormat')?.value || 'original';
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  let mimeType = fmt === 'original' ? (file.type || 'image/jpeg') : `image/${fmt}`;
  if (mimeType === 'image/jpg') mimeType = 'image/jpeg';

  const dataUrl = canvas.toDataURL(mimeType, quality);
  const origSize = file.size;
  const newSize = Math.round(dataUrl.length * 0.75);
  const pct = Math.round((1 - newSize / origSize) * 100);

  const ext = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];
  const name = file.name.replace(/\.[^.]+$/, '') + '_compressed.' + ext;

  return { dataUrl, name, savings: pct > 0 ? `−${pct}%` : `+${Math.abs(pct)}%`, meta: `${fileSize(origSize)} → ~${fileSize(newSize)}` };
}

async function processResize(file) {
  const w = parseInt(document.getElementById('resizeW')?.value) || 1920;
  const h = parseInt(document.getElementById('resizeH')?.value) || 1080;
  const keepRatio = document.getElementById('keepRatio')?.checked;
  const fmt = document.getElementById('resizeFmt')?.value || 'original';

  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  let tw = w, th = h;
  if (keepRatio) {
    const ratio = img.naturalWidth / img.naturalHeight;
    if (w / h > ratio) { tw = Math.round(h * ratio); th = h; }
    else { tw = w; th = Math.round(w / ratio); }
  }
  canvas.width = tw; canvas.height = th;
  canvas.getContext('2d').drawImage(img, 0, 0, tw, th);

  const mimeType = fmt === 'original' ? (file.type || 'image/jpeg') : `image/${fmt}`;
  const dataUrl = canvas.toDataURL(mimeType, 0.92);
  const ext = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];
  const name = file.name.replace(/\.[^.]+$/, '') + `_${tw}x${th}.` + ext;
  return { dataUrl, name, savings: null, meta: `${img.naturalWidth}×${img.naturalHeight} → ${tw}×${th}` };
}

async function processCrop(file) {
  const x = parseInt(document.getElementById('cropX')?.value) || 0;
  const y = parseInt(document.getElementById('cropY')?.value) || 0;
  const w = parseInt(document.getElementById('cropW')?.value) || 800;
  const h = parseInt(document.getElementById('cropH')?.value) || 600;

  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const cw = Math.min(w, img.naturalWidth - x);
  const ch = Math.min(h, img.naturalHeight - y);
  canvas.width = cw; canvas.height = ch;
  canvas.getContext('2d').drawImage(img, x, y, cw, ch, 0, 0, cw, ch);

  const dataUrl = canvas.toDataURL(file.type || 'image/jpeg', 0.92);
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const name = file.name.replace(/\.[^.]+$/, '') + `_cropped.` + ext;
  return { dataUrl, name, savings: null, meta: `Cropped to ${cw}×${ch}` };
}

async function processRotate(file) {
  const deg = document.getElementById('rotateDeg')?.value || '90';
  const filter = document.getElementById('rotateFilter')?.value || 'all';
  const img = await loadImage(file);

  const isLandscape = img.naturalWidth > img.naturalHeight;
  const isPortrait = !isLandscape;
  if ((filter === 'landscape' && !isLandscape) || (filter === 'portrait' && !isPortrait)) {
    const reader = new FileReader();
    return new Promise(res => {
      reader.onload = e => res({ dataUrl: e.target.result, name: file.name, savings: null, meta: 'Skipped (filter)' });
      reader.readAsDataURL(file);
    });
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const iw = img.naturalWidth, ih = img.naturalHeight;

  if (deg === 'flipH') {
    canvas.width = iw; canvas.height = ih;
    ctx.translate(iw, 0); ctx.scale(-1, 1);
  } else if (deg === 'flipV') {
    canvas.width = iw; canvas.height = ih;
    ctx.translate(0, ih); ctx.scale(1, -1);
  } else {
    const angle = parseInt(deg) * Math.PI / 180;
    canvas.width = (deg === '90' || deg === '270') ? ih : iw;
    canvas.height = (deg === '90' || deg === '270') ? iw : ih;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.translate(-iw / 2, -ih / 2);
  }
  ctx.drawImage(img, 0, 0);

  const dataUrl = canvas.toDataURL(file.type || 'image/jpeg', 0.92);
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const name = file.name.replace(/\.[^.]+$/, '') + '_rotated.' + ext;
  return { dataUrl, name, savings: null, meta: `Rotated ${deg}°` };
}

async function processConvertTo(format, file) {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');

  // Fill with bg color for JPG (no transparency)
  if (format === 'jpeg') {
    const bg = document.getElementById('jpgBg')?.value || '#ffffff';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);

  const quality = format === 'jpeg'
    ? (parseInt(document.getElementById('jpgQ')?.value) || 90) / 100
    : format === 'webp'
    ? (parseInt(document.getElementById('webpQ')?.value) || 85) / 100
    : undefined;

  const mime = `image/${format}`;
  const dataUrl = canvas.toDataURL(mime, quality);
  const ext = format === 'jpeg' ? 'jpg' : format;
  const name = file.name.replace(/\.[^.]+$/, '') + '.' + ext;

  const origSize = file.size;
  const newSize = Math.round(dataUrl.length * 0.75);
  const pct = Math.round((1 - newSize / origSize) * 100);

  return { dataUrl, name, savings: pct > 0 ? `−${pct}%` : null, meta: `Converted to ${ext.toUpperCase()}` };
}

async function processWatermark(file) {
  const text = document.getElementById('wmText')?.value || '© LogoViking';
  const size = parseInt(document.getElementById('wmSize')?.value) || 36;
  const opacity = (parseInt(document.getElementById('wmOpacity')?.value) || 50) / 100;
  const color = document.getElementById('wmColor')?.value || '#ffffff';
  const pos = document.getElementById('wmPos')?.value || 'br';

  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px Impact, Arial Black, sans-serif`;
  ctx.textBaseline = 'alphabetic';

  const pad = 20;
  const tw = ctx.measureText(text).width;
  const th = size;
  const cw = canvas.width, ch = canvas.height;

  const positions = {
    br: [cw - tw - pad, ch - pad],
    bl: [pad, ch - pad],
    tr: [cw - tw - pad, th + pad],
    tl: [pad, th + pad],
    center: [(cw - tw) / 2, (ch + th) / 2]
  };

  if (pos === 'tile') {
    for (let y = 0; y < ch; y += th * 3) {
      for (let x = 0; x < cw; x += tw + 60) {
        ctx.fillText(text, x, y + th);
      }
    }
  } else {
    const [x, y] = positions[pos] || positions.br;
    // Add text shadow
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.fillText(text, x, y);
  }
  ctx.globalAlpha = 1;

  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  const name = file.name.replace(/\.[^.]+$/, '') + '_watermarked.jpg';
  return { dataUrl, name, savings: null, meta: 'Watermark applied' };
}

async function processMeme(file) {
  const topText = (document.getElementById('memeTop')?.value || '').toUpperCase();
  const bottomText = (document.getElementById('memeBottom')?.value || '').toUpperCase();
  const fontSize = parseInt(document.getElementById('memeFontSize')?.value) || 48;

  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const drawMemeText = (text, y) => {
    ctx.font = `bold ${fontSize}px Impact, Arial Black`;
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = Math.max(fontSize / 10, 4);
    ctx.strokeText(text, canvas.width / 2, y);
    ctx.fillStyle = '#fff';
    ctx.fillText(text, canvas.width / 2, y);
  };

  if (topText) drawMemeText(topText, fontSize + 10);
  if (bottomText) drawMemeText(bottomText, canvas.height - 15);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  const name = file.name.replace(/\.[^.]+$/, '') + '_meme.jpg';
  return { dataUrl, name, savings: null, meta: 'Meme generated' };
}

async function processPalette(file) {
  const count = parseInt(document.getElementById('paletteCount')?.value) || 12;
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const SIZE = 150;
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, SIZE, SIZE);

  const data = ctx.getImageData(0, 0, SIZE, SIZE).data;
  const colorMap = {};
  const step = 4;
  for (let i = 0; i < data.length; i += step * 4) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i+1] / 32) * 32;
    const b = Math.round(data[i+2] / 32) * 32;
    const key = `${r},${g},${b}`;
    colorMap[key] = (colorMap[key] || 0) + 1;
  }

  const sorted = Object.entries(colorMap).sort((a,b) => b[1]-a[1]).slice(0, count);
  const colors = sorted.map(([k]) => {
    const [r,g,b] = k.split(',').map(Number);
    return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
  });

  // Render palette as result image
  const pc = document.createElement('canvas');
  const sw = 80, sh = 100;
  pc.width = colors.length * sw; pc.height = sh;
  const pctx = pc.getContext('2d');
  colors.forEach((c, i) => {
    pctx.fillStyle = c;
    pctx.fillRect(i * sw, 0, sw, sh * 0.7);
    pctx.fillStyle = '#fff';
    pctx.font = '10px monospace';
    pctx.textAlign = 'center';
    pctx.fillText(c, i * sw + sw/2, sh * 0.7 + 16);
  });

  const dataUrl = pc.toDataURL('image/png');
  const name = file.name.replace(/\.[^.]+$/, '') + '_palette.png';
  return { dataUrl, name, savings: null, meta: `${colors.length} colors extracted` };
}

async function processExifRemove(file) {
  // Draw via canvas to strip all metadata
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
  canvas.getContext('2d').drawImage(img, 0, 0);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const name = file.name.replace(/\.[^.]+$/, '') + '_clean.jpg';
  return { dataUrl, name, savings: null, meta: 'EXIF data removed' };
}

async function processBlurFace(file) {
  const blurAmt = parseInt(document.getElementById('blurAmount')?.value) || 15;
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // Demo: blur a center region (real AI face detection in Pro)
  const rx = canvas.width * 0.3, ry = canvas.height * 0.1;
  const rw = canvas.width * 0.4, rh = canvas.height * 0.4;
  ctx.filter = `blur(${blurAmt}px)`;
  ctx.drawImage(canvas, rx, ry, rw, rh, rx, ry, rw, rh);
  ctx.filter = 'none';

  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  const name = file.name.replace(/\.[^.]+$/, '') + '_blurred.jpg';
  return { dataUrl, name, savings: null, meta: 'Faces blurred (demo)' };
}

async function processScreenshot(file) {
  const bgType = document.getElementById('screenshotBg')?.value || 'purple';
  const pad = parseInt(document.getElementById('screenshotPad')?.value) || 60;
  const radius = parseInt(document.getElementById('screenshotRadius')?.value) || 12;

  const bgs = {
    purple: ['#7c3aed', '#ec4899'],
    dark: ['#1a1a2e', '#16213e'],
    blue: ['#0077b6', '#00b4d8'],
    sunset: ['#f97316', '#ef4444'],
    mint: ['#10b981', '#06b6d4']
  };

  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth + pad * 2;
  canvas.height = img.naturalHeight + pad * 2;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  const [c1, c2] = bgs[bgType] || bgs.purple;
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 12;

  // Rounded rect clip for image
  ctx.beginPath();
  ctx.roundRect(pad, pad, img.naturalWidth, img.naturalHeight, radius);
  ctx.clip();
  ctx.drawImage(img, pad, pad);

  const dataUrl = canvas.toDataURL('image/png');
  const name = file.name.replace(/\.[^.]+$/, '') + '_beautiful.png';
  return { dataUrl, name, savings: null, meta: 'Screenshot beautified' };
}

async function processImageToPDF(file) {
  const img = await loadImage(file);
  const orient = document.getElementById('pdfOrient')?.value || 'auto';

  // Open print dialog with the image
  const printWin = window.open('', '_blank');
  printWin.document.write(`<!DOCTYPE html><html><head><style>
    body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh}
    img{max-width:100%;max-height:100vh;object-fit:contain}
    @page{margin:0;size:${orient === 'landscape' ? 'landscape' : orient === 'portrait' ? 'portrait' : 'auto'}}
  </style></head><body><img src="${img.src}"></body></html>`);
  printWin.document.close();
  setTimeout(() => { printWin.print(); }, 500);

  // Also return a preview
  return { dataUrl: img.src, name: file.name.replace(/\.[^.]+$/, '') + '.pdf', savings: null, meta: 'Use print dialog to save as PDF' };
}

async function processUpscale(file) {
  const factor = parseInt(document.getElementById('upscaleFactor')?.value) || 2;
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth * factor;
  canvas.height = img.naturalHeight * factor;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL(file.type || 'image/jpeg', 0.95);
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const name = file.name.replace(/\.[^.]+$/, '') + `_${factor}x.` + ext;
  return { dataUrl, name, savings: null, meta: `${img.naturalWidth}×${img.naturalHeight} → ${canvas.width}×${canvas.height}` };
}

async function processRemoveBg(file) {
  const threshold = parseInt(document.getElementById('bgThreshold')?.value) || 30;
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = data.data;
  const refR = d[0], refG = d[1], refB = d[2];

  for (let i = 0; i < d.length; i += 4) {
    const diff = Math.abs(d[i]-refR) + Math.abs(d[i+1]-refG) + Math.abs(d[i+2]-refB);
    if (diff < threshold * 3) d[i+3] = 0;
  }
  ctx.putImageData(data, 0, 0);

  const dataUrl = canvas.toDataURL('image/png');
  const name = file.name.replace(/\.[^.]+$/, '') + '_nobg.png';
  return { dataUrl, name, savings: null, meta: 'Background removed (demo)' };
}

// ============================================================
// RELATED TOOLS
// ============================================================
function loadRelatedTools(currentId) {
  const related = Object.entries(TOOLS)
    .filter(([id]) => id !== currentId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const grid = document.getElementById('relatedGrid');
  related.forEach(([id, tool]) => {
    const a = document.createElement('a');
    a.href = `tool.html?t=${id}`;
    a.className = 'tool-card';
    a.innerHTML = `
      <div class="tool-icon" style="--c:${tool.iconBg}">${tool.icon}</div>
      <div class="tool-info"><h3>${tool.title}</h3><p>${tool.desc.split('.')[0]}.</p></div>
      <span class="tool-arrow">→</span>
    `;
    grid.appendChild(a);
  });
}

// ============================================================
// HELPER
// ============================================================
function updateCropDims() {
  const preset = document.getElementById('aspectPreset')?.value;
  const w = document.getElementById('cropW');
  const h = document.getElementById('cropH');
  const presets = {
    '1:1': [800, 800],
    '16:9': [1280, 720],
    '4:3': [1024, 768],
    '9:16': [720, 1280],
    '3:2': [900, 600],
    'a4': [794, 1123]
  };
  if (presets[preset] && w && h) {
    w.value = presets[preset][0];
    h.value = presets[preset][1];
  }
}
