(function(){
'use strict';
const $ = id => document.getElementById(id);

/* ---------- хранилище ---------- */
const mem = {};
const store = {
  get(k, d){ try { const v = localStorage.getItem('risovanie.'+k); return v === null ? d : JSON.parse(v); } catch(e){ return k in mem ? mem[k] : d; } },
  set(k, v){ mem[k] = v; try { localStorage.setItem('risovanie.'+k, JSON.stringify(v)); } catch(e){} }
};

/* ---------- план ---------- */
const PLAN = window.PLAN || [];
const DAYS = [];
PLAN.forEach((w, wi) => w.days.forEach((d, di) => DAYS.push({ w, wi, di, d })));
let dayIdx = Math.min(Math.max(store.get('day', 0), 0), DAYS.length - 1);

function renderDay(){
  const { w, wi, di, d } = DAYS[dayIdx];
  $('weekNo').textContent = `Неделя ${wi+1} из ${PLAN.length}`;
  $('counter').textContent = `Занятие ${dayIdx+1} из ${DAYS.length}`;
  const ticks = $('ticks'); ticks.innerHTML = '';
  let n = 0;
  PLAN.forEach(wk => {
    const g = document.createElement('div'); g.className = 'wk';
    wk.days.forEach(() => { const i = document.createElement('i'); if (n < dayIdx) i.className = 'done'; else if (n === dayIdx) i.className = 'cur'; g.appendChild(i); n++; });
    ticks.appendChild(g);
  });
  $('weekTitle').textContent = w.title;
  $('title').textContent = d.t;
  $('warm').textContent = w.warm;
  $('main').textContent = d.m;
  $('mainDur').textContent = di === 5 ? '60 мин' : '15 мин';
  const ex = (window.EXAMPLES || {})[d.ex] || '';
  $('example').innerHTML = ex;
  $('exampleRow').style.display = ex ? '' : 'none';
  $('note').value = store.get('note.'+dayIdx, '');
  $('prev').disabled = dayIdx === 0;
  $('done').textContent = dayIdx === DAYS.length-1 ? 'Программа завершена' : 'Задание выполнено';
  if (d.tool && d.tool !== 'none') setTab(d.tool);
  renderWeeks();
  $('taskSheet').scrollTop = 0;
}
function goDay(i){ dayIdx = Math.min(Math.max(i,0), DAYS.length-1); store.set('day', dayIdx); renderDay(); }
$('done').onclick = () => { if (dayIdx < DAYS.length-1) goDay(dayIdx+1); };
$('prev').onclick = () => goDay(dayIdx-1);
$('note').oninput = e => store.set('note.'+dayIdx, e.target.value);

function renderWeeks(){
  const box = $('weeks'); box.innerHTML = '';
  let i = 0;
  const curWeek = DAYS[dayIdx].wi;
  PLAN.forEach((w, wi) => {
    const det = document.createElement('details'); if (wi === curWeek) det.open = true;
    const sum = document.createElement('summary');
    sum.innerHTML = `<span class="n">${String(wi+1).padStart(2,'0')}</span><span class="wt"></span><span class="cnt">${w.days.length}</span>`;
    sum.querySelector('.wt').textContent = w.title;
    det.appendChild(sum);
    const ol = document.createElement('ol');
    w.days.forEach((d, di) => {
      const li = document.createElement('li'), b = document.createElement('button'), num = i;
      b.innerHTML = `<span class="d">${di+1}</span><span></span>`; b.lastChild.textContent = d.t;
      if (num === dayIdx) b.className = 'cur'; else if (num < dayIdx) b.className = 'done';
      b.onclick = () => { goDay(num); $('drawer').hidden = true; };
      li.appendChild(b); ol.appendChild(li); i++;
    });
    det.appendChild(ol); box.appendChild(det);
  });
}
$('openPlan').onclick = () => { $('drawer').hidden = false; };
$('closePlan').onclick = () => { $('drawer').hidden = true; };
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('drawer').hidden = true; });
$('copyNotes').onclick = () => {
  const lines = [];
  DAYS.forEach((x, i) => { const n = store.get('note.'+i, ''); if (n.trim()) lines.push(`Неделя ${x.wi+1}, «${x.d.t}». ${n.trim()}`); });
  const text = lines.join('\n') || 'Наблюдений пока нет';
  (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
    () => { $('copyNotes').textContent = 'Наблюдения скопированы'; setTimeout(()=>$('copyNotes').textContent='Копировать наблюдения', 1600); },
    () => prompt('Скопируйте текст:', text));
};

/* ---------- вкладки ---------- */
let tab = 'mannequin';
const VIEW_NAMES = { shapes: 'Формы', mannequin: 'Манекен', refs: 'Референсы' };
function setTab(t){
  tab = t;
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
  const is3d = t !== 'refs';
  const tool = document.querySelector('.tool');
  tool.classList.remove('mode-shapes','mode-mannequin','mode-refs'); tool.classList.add('mode-'+t);
  $('view3d').style.display = is3d ? '' : 'none';
  $('viewRefs').hidden = is3d;
  showCover(false);
  if (is3d){ three.mode(t); } else { showRef(refIdx < 0 ? randomRefIndex() : refIdx); }
  updateCaptions();
  restartTimer();
}
function updateCaptions(){
  if (tab === 'refs'){
    $('capView').textContent = refIdx >= 0 ? refs[refIdx].name.replace(/^.*\//,'') : '';
    $('capInfo').textContent = refIdx >= 0 ? `Изображение ${refIdx+1} из ${refs.length}` : '';
  } else {
    const a = { rand:'произвольный ракурс', eye:'ракурс на уровне глаз', low:'ракурс снизу', high:'ракурс сверху' }[angle];
    $('capView').textContent = `${VIEW_NAMES[tab]}, ${a}${$('wide').checked ? ', широкий объектив' : ''}`;
    $('capInfo').textContent = `Свет ${$('lampAz').value}° / ${$('lampEl').value}°`;
  }
}
let angle = 'rand';
function segPick(segId, btn){ document.querySelectorAll('#'+segId+' button').forEach(b => b.classList.toggle('on', b === btn)); }
$('panelToggle').onclick = () => { const p = $('panel'); p.classList.toggle('closed'); $('panelToggle').setAttribute('aria-expanded', !p.classList.contains('closed')); three.resize(); };
document.querySelectorAll('.tab').forEach(b => b.onclick = () => setTab(b.dataset.tab));

/* ---------- таймер ---------- */
let tLeft = 0, tHandle = null;
function restartTimer(){
  clearInterval(tHandle);
  const sec = timerSec;
  if (!sec){ $('timer').hidden = true; return; }
  tLeft = sec; tick();
  tHandle = setInterval(() => { tLeft--; if (tLeft <= 0){ beep(); nextThing(); tLeft = sec; } tick(); }, 1000);
}
function tick(){ $('timer').hidden = false; const m = Math.floor(tLeft/60), s = tLeft%60; $('timer').textContent = m + ':' + String(s).padStart(2,'0'); }
function nextThing(){
  if (tab === 'refs') showRef(randomRefIndex());
  else if (tab === 'shapes') three.newShapes();
  else three.newPose(lastKind);
}
let actx = null;
function beep(){
  try{
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.frequency.value = 660; g.gain.setValueAtTime(0.06, actx.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + .25);
    o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + .26);
  }catch(e){}
}
let timerSec = 0;
document.querySelectorAll('#timerSeg button').forEach(b => b.onclick = () => { segPick('timerSeg', b); timerSec = +b.dataset.v; restartTimer(); });
function showCover(on){
  $('cover').classList.toggle('show', on);
  $('hideBtn').textContent = on ? 'Показать референс' : 'Скрыть референс';
  $('hideBtn').classList.toggle('on', on);
}
$('hideBtn').onclick = () => showCover(!$('cover').classList.contains('show'));

/* ---------- мои рефы ---------- */
const refs = (window.REFS || []).map(p => ({ src: 'Референсы/' + p.split('/').map(encodeURIComponent).join('/'), name: p }));
let refIdx = -1, recent = [];
function randomRefIndex(){
  if (!refs.length) return -1;
  if (refs.length === 1) return 0;
  let i, tries = 0;
  do { i = Math.floor(Math.random() * refs.length); tries++; } while (recent.includes(i) && tries < 30);
  recent.push(i); if (recent.length > Math.min(10, refs.length-1)) recent.shift();
  return i;
}
function showRef(i){
  refIdx = i;
  const img = $('refImg');
  if (i < 0){ $('refEmpty').style.display=''; img.style.display='none'; updateCaptions(); return; }
  $('refEmpty').style.display = 'none'; img.style.display = '';
  img.onload = applyFilters;
  img.onerror = () => { $('capInfo').textContent = 'Не удалось открыть файл ' + refs[i].name; };
  img.src = refs[i].src;
  updateCaptions();
}
function applyFilters(){
  // фильтры через CSS и SVG: так работают и с файлами с диска
  const img = $('refImg');
  img.style.transform = $('mirror').checked ? 'scaleX(-1)' : '';
  img.style.filter = $('tones').checked ? 'url(#threeTones)' : ($('gray').checked ? 'grayscale(1)' : '');
}
['mirror','gray','tones'].forEach(id => $(id).onchange = () => { if (refIdx >= 0) applyFilters(); });
$('nextRef').onclick = () => { showRef(randomRefIndex()); restartTimer(); };
function addFiles(files){
  [...files].filter(f => f.type.startsWith('image/')).forEach(f => refs.push({ src: URL.createObjectURL(f), name: f.name }));
  showRef(refs.length - 1);
}
document.querySelectorAll('.addFiles').forEach(inp => inp.onchange = e => { setTab('refs'); addFiles(e.target.files); e.target.value = ''; });
const stage = $('stage');
stage.addEventListener('dragover', e => { e.preventDefault(); stage.classList.add('drop'); });
stage.addEventListener('dragleave', () => stage.classList.remove('drop'));
stage.addEventListener('drop', e => { e.preventDefault(); stage.classList.remove('drop'); if (e.dataTransfer.files.length){ setTab('refs'); addFiles(e.dataTransfer.files); } });

/* ---------- 3D ---------- */
let lastKind = 'any';
const three = (function(){
  const T = window.THREE;
  if (!T){ return { mode(){}, newShapes(){}, newPose(){} }; }
  const host = $('view3d');
  // без встроенного сглаживания: в обычном режиме картинка рисуется с запасом по размеру,
  // в режиме «3 тона» пиксель в пиксель, чтобы на краях не появлялись промежуточные цвета
  const renderer = new T.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
  const smoothRatio = () => Math.min(Math.max(window.devicePixelRatio * 2, 2), 3);
  renderer.setPixelRatio(smoothRatio());
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.outputEncoding = T.sRGBEncoding;
  host.appendChild(renderer.domElement);

  const scene = new T.Scene();
  scene.background = new T.Color(0xded4c3);
  const camera = new T.PerspectiveCamera(35, 1, 0.1, 200);
  const controls = new T.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.1;

  const hemi = new T.HemisphereLight(0xfff4e2, 0x6b5a47, 0.3); scene.add(hemi);
  const sun = new T.DirectionalLight(0xfff1dc, 0.82);
  sun.castShadow = true; sun.shadow.mapSize.set(2048,2048);
  const sc = sun.shadow.camera; sc.left = sc.bottom = -8; sc.right = sc.top = 8; sc.near = 0.5; sc.far = 60;
  sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.05;
  scene.add(sun); scene.add(sun.target);
  const lampDot = new T.Mesh(new T.SphereGeometry(0.18, 16, 12), new T.MeshBasicMaterial({ color: 0xd9a441 }));
  scene.add(lampDot);

  const floor = new T.Mesh(new T.PlaneGeometry(80, 80), new T.MeshStandardMaterial({ color: 0xb9a98f, roughness: 1 }));
  floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; scene.add(floor);

  // материалы: обычный и «3 тона»
  const matStd = new T.MeshStandardMaterial({ color: 0xd9cdb9, roughness: 0.8 });
  const matStdAcc = new T.MeshStandardMaterial({ color: 0xa8573a, roughness: 0.7 });
  const floorStd = floor.material;

  // «3 тона»: свой шейдер, на выходе ровно три цвета без полутонов
  const TONES = { light: 0xE9E1D3, mid: 0x9C8F7E, dark: 0x3E342D };
  const lin = hex => new T.Color(hex).convertSRGBToLinear();
  function makeTones(isFloor){
    return new T.ShaderMaterial({
      lights: true,
      uniforms: T.UniformsUtils.merge([T.UniformsLib.lights, {
        uLight: { value: lin(TONES.light) }, uMid: { value: lin(TONES.mid) }, uDark: { value: lin(TONES.dark) },
        uDir: { value: new T.Vector3(0, 1, 0) }, uFloor: { value: isFloor ? 1 : 0 }
      }]),
      vertexShader: `
        #include <common>
        #include <shadowmap_pars_vertex>
        varying vec3 vN;
        void main(){
          #include <beginnormal_vertex>
          #include <defaultnormal_vertex>
          #include <begin_vertex>
          #include <project_vertex>
          #include <worldpos_vertex>
          #include <shadowmap_vertex>
          vN = normalize(mat3(modelMatrix) * objectNormal);
        }`,
      fragmentShader: `
        uniform vec3 uLight, uMid, uDark, uDir; uniform float uFloor;
        varying vec3 vN;
        #include <common>
        #include <packing>
        #include <lights_pars_begin>
        #include <shadowmap_pars_fragment>
        #include <shadowmask_pars_fragment>
        void main(){
          float ndl = dot(normalize(vN), normalize(uDir));
          bool shadowed = getShadowMask() < 0.5;
          vec3 c;
          if (uFloor > 0.5) c = shadowed ? uDark : uMid;
          else if (ndl <= 0.0 || shadowed) c = uDark;
          else if (ndl < 0.45) c = uMid;
          else c = uLight;
          gl_FragColor = vec4(c, 1.0);
          #include <encodings_fragment>
        }`
    });
  }
  const matTones = makeTones(false), floorTones = makeTones(true);
  const bgStd = scene.background.clone(), bgTones = new T.Color(TONES.mid);
  let toon = false;
  const M = () => toon ? matTones : matStd;
  const MA = () => toon ? matTones : matStdAcc;

  let content = new T.Group(); scene.add(content);
  let curMode = 'mannequin';

  function mesh(geo, acc){ const m = new T.Mesh(geo, acc ? MA() : M()); m.castShadow = m.receiveShadow = true; m.userData.acc = !!acc; return m; }
  function refreshMaterials(){
    scene.traverse(o => { if (o.isMesh && o !== floor && o !== lampDot) o.material = o.userData.acc ? MA() : M(); });
    floor.material = toon ? floorTones : floorStd;
    scene.background = toon ? bgTones : bgStd;
    lampDot.visible = !toon;
    renderer.setPixelRatio(toon ? window.devicePixelRatio : smoothRatio());
    renderer.domElement.style.imageRendering = toon ? 'pixelated' : '';
    resize();
  }

  /* --- формы --- */
  function newShapes(){
    scene.remove(content); content = new T.Group(); scene.add(content);
    const n = 4 + Math.floor(Math.random()*3), placed = [];
    for (let i=0; i<n; i++){
      let x, z, r, ok, tries = 0;
      do { x = (Math.random()-.5)*7; z = (Math.random()-.5)*7; r = 0.9 + Math.random()*0.9; ok = placed.every(p => Math.hypot(p.x-x, p.z-z) > p.r + r); tries++; } while(!ok && tries < 60);
      if (!ok) continue; placed.push({x,z,r});
      const type = Math.floor(Math.random()*5), g = new T.Group(); let m;
      if (type === 0){ const w = r*1.2, h = 0.6 + Math.random()*2, d = r*(0.7+Math.random()*0.6); m = mesh(new T.BoxGeometry(w,h,d)); m.position.y = h/2; }
      else if (type === 1){ const h = 0.8 + Math.random()*2.2, rr = r*0.55; m = mesh(new T.CylinderGeometry(rr, rr, h, 40)); m.position.y = h/2; }
      else if (type === 2){ const h = r*1.8, rr = r*0.45; m = mesh(new T.CylinderGeometry(rr, rr, h, 40)); m.rotation.z = Math.PI/2; m.position.y = rr; }
      else if (type === 3){ const rr = r*0.65; m = mesh(new T.SphereGeometry(rr, 40, 28)); m.position.y = rr; }
      else { const h = 1 + Math.random()*1.8, rr = r*0.6; m = mesh(new T.ConeGeometry(rr, h, 40)); m.position.y = h/2; }
      g.add(m); g.position.set(x, 0, z); g.rotation.y = Math.random()*Math.PI*2; content.add(g);
    }
    frame(true);
  }

  /* --- манекен --- */
  // единица длины — высота головы
  function limb(rTop, rBot, len, acc){ const m = mesh(new T.CylinderGeometry(rTop, rBot, len, 24), acc); m.position.y = -len/2; return m; }
  function joint(r){ return mesh(new T.SphereGeometry(r, 20, 14)); }
  function buildMannequin(){
    const J = {};
    const root = new T.Group(); J.root = root;
    // таз
    const pelvis = mesh(new T.BoxGeometry(1.45, 0.95, 0.95)); pelvis.position.y = -0.35; root.add(pelvis);
    // позвоночник и грудь
    const spine = new T.Group(); root.add(spine); J.spine = spine;
    const belly = mesh(new T.SphereGeometry(0.62, 24, 16)); belly.scale.set(1.05, 0.9, 0.78); belly.position.y = 0.25; spine.add(belly);
    const chestPivot = new T.Group(); chestPivot.position.y = 0.45; spine.add(chestPivot); J.chest = chestPivot;
    const chest = mesh(new T.BoxGeometry(1.7, 1.55, 1.0)); chest.position.y = 0.85; chestPivot.add(chest);
    const bust = mesh(new T.BoxGeometry(1.3, 0.5, 0.2), true); bust.position.set(0, 1.15, 0.55); chestPivot.add(bust); // показывает, где перед
    // шея и голова
    const neckP = new T.Group(); neckP.position.y = 1.62; chestPivot.add(neckP); J.neck = neckP;
    const neck = limb(0.24, 0.27, 0.42); neck.position.y = 0.21; neckP.add(neck);
    const headP = new T.Group(); headP.position.y = 0.42; neckP.add(headP); J.head = headP;
    const skull = mesh(new T.SphereGeometry(0.5, 28, 20)); skull.scale.set(0.9, 1, 1); skull.position.set(0, 0.55, -0.03); headP.add(skull);
    const jaw = mesh(new T.BoxGeometry(0.62, 0.45, 0.6)); jaw.position.set(0, 0.22, 0.12); headP.add(jaw);
    const nose = mesh(new T.ConeGeometry(0.09, 0.22, 12), true); nose.rotation.x = Math.PI/2; nose.position.set(0, 0.42, 0.5); headP.add(nose);
    // руки
    ['L','R'].forEach(s => {
      const sx = s === 'L' ? 1 : -1;
      const sh = new T.Group(); sh.position.set(1.0*sx, 1.38, 0); chestPivot.add(sh); J['sh'+s] = sh;
      sh.add(joint(0.3));
      sh.add(limb(0.24, 0.18, 1.42));
      const el = new T.Group(); el.position.y = -1.42; sh.add(el); J['el'+s] = el;
      el.add(joint(0.17)); el.add(limb(0.18, 0.12, 1.22));
      const wr = new T.Group(); wr.position.y = -1.22; el.add(wr); J['wr'+s] = wr;
      const hand = mesh(new T.BoxGeometry(0.32, 0.68, 0.15), true); hand.position.y = -0.36; wr.add(hand);
      // ноги
      const hp = new T.Group(); hp.position.set(0.45*sx, -0.72, 0); root.add(hp); J['hp'+s] = hp;
      hp.add(joint(0.3)); hp.add(limb(0.31, 0.2, 1.9));
      const kn = new T.Group(); kn.position.y = -1.9; hp.add(kn); J['kn'+s] = kn;
      kn.add(joint(0.2)); kn.add(limb(0.21, 0.13, 1.85));
      const an = new T.Group(); an.position.y = -1.85; kn.add(an); J['an'+s] = an;
      const foot = mesh(new T.BoxGeometry(0.34, 0.22, 0.85), true); foot.position.set(0, -0.12, 0.25); an.add(foot);
    });
    return J;
  }

  const R = (a, b) => a + Math.random()*(b-a);
  const deg = Math.PI/180;
  // позы в градусах: [x, y, z]; для левой стороны «наружу» = +z
  const PRESETS = {
    stand: [
      { spine:[0,5,4], chest:[0,-6,-5], neck:[4,10,0], shL:[0,0,12], shR:[0,0,-8], elL:[-12,0,0], elR:[-20,0,0], hpL:[-4,0,2], hpR:[8,0,-8], knL:[4,0,0], knR:[22,0,0] },
      { spine:[-8,-8,-4], chest:[-4,10,6], neck:[-6,-20,6], shL:[-10,0,30], shR:[-30,20,-25], elL:[-100,0,0], elR:[-110,0,0], wrL:[0,0,0], hpL:[6,0,8], hpR:[-6,0,-2], knL:[14,0,0], knR:[2,0,0] },
      { spine:[6,20,0], chest:[4,15,0], neck:[10,30,0], shL:[-20,0,50], shR:[0,0,-50], elL:[-90,0,0], elR:[-95,0,0], hpL:[-2,10,6], hpR:[-2,-10,-6], knL:[2,0,0], knR:[2,0,0] },
      { spine:[0,0,8], chest:[2,0,-10], neck:[0,0,10], shL:[-170,0,10], shR:[0,0,-15], elL:[-25,0,0], elR:[-10,0,0], hpL:[0,0,3], hpR:[10,0,-12], knL:[0,0,0], knR:[25,0,0] }
    ],
    sit: [
      { chair:true, spine:[8,0,0], chest:[6,0,0], neck:[10,0,0], shL:[-35,0,12], shR:[-35,0,-12], elL:[-60,0,0], elR:[-60,0,0], hpL:[-88,0,6], hpR:[-88,0,-6], knL:[90,0,0], knR:[90,0,0] },
      { chair:true, spine:[-12,10,0], chest:[-6,10,0], neck:[8,-25,0], shL:[10,0,20], shR:[-40,0,-30], elL:[-20,0,0], elR:[-120,0,0], hpL:[-95,0,4], hpR:[-80,20,-20], knL:[60,0,0], knR:[120,0,0] },
      { spine:[25,0,0], chest:[15,0,0], neck:[-10,0,0], shL:[-50,0,25], shR:[-50,0,-25], elL:[-40,0,0], elR:[-40,0,0], hpL:[-70,0,30], hpR:[-70,0,-30], knL:[130,0,0], knR:[130,0,0] },
      { spine:[30,0,0], chest:[20,0,0], neck:[20,0,0], shL:[-40,0,10], shR:[-40,0,-10], elL:[-40,0,0], elR:[-40,0,0], hpL:[-125,0,8], hpR:[-125,0,-8], knL:[145,0,0], knR:[145,0,0], anL:[-30,0,0], anR:[-30,0,0] },
      { spine:[-25,0,0], chest:[-5,0,0], neck:[20,0,0], shL:[35,0,25], shR:[35,0,-25], elL:[-5,0,0], elR:[-5,0,0], hpL:[-88,0,10], hpR:[-110,0,-10], knL:[5,0,0], knR:[100,0,0] }
    ],
    action: [
      { spine:[15,0,0], chest:[5,15,0], neck:[-10,-10,0], shL:[45,0,10], shR:[-60,0,-10], elL:[-40,0,0], elR:[-80,0,0], hpL:[-50,0,4], hpR:[25,0,-4], knL:[40,0,0], knR:[60,0,0] },
      { spine:[-10,-25,0], chest:[-10,-25,0], neck:[0,40,0], shL:[-90,0,60], shR:[0,0,-70], elL:[-10,0,0], elR:[-60,0,0], hpL:[-10,0,25], hpR:[-5,0,-30], knL:[20,0,0], knR:[15,0,0] },
      { spine:[35,0,0], chest:[15,0,0], neck:[-30,0,0], shL:[-120,0,20], shR:[-120,0,-20], elL:[-20,0,0], elR:[-20,0,0], hpL:[-70,0,10], hpR:[15,0,-8], knL:[85,0,0], knR:[30,0,0] },
      { spine:[-15,10,-15], chest:[-10,10,-10], neck:[-15,0,-15], shL:[-160,0,40], shR:[-170,0,-30], elL:[-30,0,0], elR:[-40,0,0], hpL:[0,0,10], hpR:[-60,0,-5], knL:[5,0,0], knR:[90,0,0] }
    ]
  };
  const NOISE = { spine:[8,12,6], chest:[6,10,6], neck:[10,25,8], head:[6,10,6], shL:[20,15,15], shR:[20,15,15], elL:[20,0,0], elR:[20,0,0], wrL:[15,15,15], wrR:[15,15,15], hpL:[8,8,5], hpR:[8,8,5], knL:[10,0,0], knR:[10,0,0], anL:[8,0,0], anR:[8,0,0] };
  const LIMIT = { elL:[-150,0], elR:[-150,0], knL:[0,150], knR:[0,150] };

  let J = null, chairMesh = null;
  function newPose(kind){
    lastKind = kind = kind || 'any';
    scene.remove(content); content = new T.Group(); scene.add(content);
    J = buildMannequin(); content.add(J.root);
    const k = kind === 'any' ? ['stand','stand','sit','action'][Math.floor(Math.random()*4)] : kind;
    const list = PRESETS[k], p = list[Math.floor(Math.random()*list.length)];
    // иногда меняем местами левую и правую сторону
    const flip = Math.random() < 0.5;
    Object.keys(NOISE).forEach(name => {
      let src = name;
      if (flip && /[LR]$/.test(name)) src = name.slice(0,-1) + (name.endsWith('L') ? 'R' : 'L');
      const base = (p[src] || [0,0,0]).slice();
      if (flip && src !== name){ base[1] = -base[1]; base[2] = -base[2]; }
      if (flip && !/[LR]$/.test(name)){ base[1] = -base[1]; base[2] = -base[2]; }
      const nz = NOISE[name];
      let x = base[0] + R(-nz[0], nz[0]), y = base[1] + R(-nz[1], nz[1]), z = base[2] + R(-nz[2], nz[2]);
      if (LIMIT[name]) x = Math.min(Math.max(x, LIMIT[name][0]), LIMIT[name][1]);
      J[name] && J[name].rotation.set(x*deg, y*deg, z*deg);
    });
    J.root.rotation.y = R(0, Math.PI*2);
    // ставим на пол
    content.updateMatrixWorld(true);
    const box = new T.Box3().setFromObject(J.root);
    J.root.position.y -= box.min.y;
    if (p.chair){
      J.root.updateMatrixWorld(true);
      const pv = new T.Vector3(0, -0.82, -0.35).applyMatrix4(J.root.matrixWorld);
      const h = pv.y;
      if (h > 0.3){
        chairMesh = mesh(new T.BoxGeometry(2.0, h, 1.9), true);
        chairMesh.position.set(pv.x, h/2, pv.z); chairMesh.rotation.y = J.root.rotation.y;
        content.add(chairMesh);
      }
    }
    frame(true);
  }

  /* --- камера и свет --- */
  function frame(randomize){
    content.updateMatrixWorld(true);
    const box = new T.Box3().setFromObject(content);
    const sphere = box.getBoundingSphere(new T.Sphere());
    const c = sphere.center, r = Math.max(sphere.radius, 1);
    const wide = $('wide').checked;
    camera.fov = wide ? 80 : 35; camera.updateProjectionMatrix();
    const dist = r / Math.sin(camera.fov*deg/2) * (wide ? 0.7 : 0.95);
    let az = Math.atan2(camera.position.x - controls.target.x, camera.position.z - controls.target.z);
    let el = 15*deg;
    if (randomize){
      az = R(0, Math.PI*2);
      const a = angle;
      el = (a === 'low' ? R(-28, -12) : a === 'high' ? R(35, 65) : a === 'eye' ? R(0, 10) : R(-25, 55)) * deg;
    }
    const target = c.clone();
    if (angle === 'low' && randomize) target.y = Math.max(target.y, 0.3);
    controls.target.copy(target);
    const camY = Math.max(target.y + Math.sin(el)*dist, 0.25);
    camera.position.set(target.x + Math.sin(az)*Math.cos(el)*dist, camY, target.z + Math.cos(az)*Math.cos(el)*dist);
    camera.near = dist/50; camera.far = dist*20; camera.updateProjectionMatrix();
    controls.update();
    placeLamp(c, r);
  }
  function placeLamp(c, r){
    c = c || controls.target; r = r || 5;
    const az = +$('lampAz').value*deg, el = +$('lampEl').value*deg, d = 14;
    sun.position.set(c.x + Math.sin(az)*Math.cos(el)*d, c.y + Math.sin(el)*d, c.z + Math.cos(az)*Math.cos(el)*d);
    sun.target.position.copy(c);
    lampDot.position.copy(sun.position).sub(c).setLength(r*1.25).add(c);
    const dir = sun.position.clone().sub(sun.target.position).normalize();
    matTones.uniforms.uDir.value.copy(dir); floorTones.uniforms.uDir.value.copy(dir);
    // свет снизу: пол не должен его загораживать
    floor.visible = el > 0;
  }
  ['lampAz','lampEl'].forEach(id => $(id).oninput = () => { placeLamp(); updateCaptions(); });
  $('wide').onchange = () => { frame(false); updateCaptions(); };
  document.querySelectorAll('#angleSeg button').forEach(b => b.onclick = () => { segPick('angleSeg', b); angle = b.dataset.v; frame(true); updateCaptions(); });
  $('toon').onchange = e => { toon = e.target.checked; refreshMaterials(); };
  $('newScene').onclick = () => { newShapes(); restartTimer(); };
  document.querySelectorAll('#poseBtns button').forEach(b => b.onclick = () => { segPick('poseBtns', b); newPose(b.dataset.kind); restartTimer(); });

  function resize(){
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); renderer.domElement.style.width = w+'px'; renderer.domElement.style.height = h+'px';
    camera.aspect = w/h;
    const panel = $('panel'), shift = panel.classList.contains('closed') || w < 700 ? 0 : Math.round(panel.offsetWidth/2);
    if (shift) camera.setViewOffset(w + 2*shift, h, 2*shift, 0, w, h); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);
  (function loop(){ requestAnimationFrame(loop); if (host.offsetParent !== null){ controls.update(); renderer.render(scene, camera); } })();

  return {
    mode(m){
      resize();
      if (m === curMode && content.children.length) return;
      curMode = m;
      if (m === 'shapes') newShapes(); else newPose(lastKind);
    },
    newShapes, newPose, resize
  };
})();

/* ---------- старт ---------- */
renderDay();
if (!document.querySelector('.tab.on')) setTab('mannequin');
window.__app = { three, goDay, setTab };
})();
