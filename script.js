// Author: Ali Rohman, S.Kom., M.Kom
// Dosen Pengampu MK: Pemodelan Geometrik

let scene, camera, renderer, arSource, arContext, markerRoot, model, rotationGizmo;
let isDragging = false;
let prevMouse = { x: 0, y: 0 };

// === Ambil elemen HTML (slider dan label) ===
const slider = document.getElementById('scaleSlider');
const scaleValue = document.getElementById('scaleValue');

// === Buat tombol toggle gizmo ===
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "👁️ Tampilkan Sumbu";
toggleBtn.classList.add("toggle-gizmo"); // gunakan styling dari CSS
document.body.appendChild(toggleBtn);

// === Inisialisasi scene & kamera ===
scene = new THREE.Scene();
camera = new THREE.Camera();
scene.add(camera);

// === Renderer ===
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color('lightgrey'), 0);
renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.width = "100vw";
renderer.domElement.style.height = "100vh";
document.body.appendChild(renderer.domElement);

// === AR Source (kamera webcam / HP) ===
arSource = new THREEx.ArToolkitSource({ sourceType: 'webcam' });
arSource.init(() => {
  setTimeout(() => {
    onResize();
  }, 2000);
});

// === Fungsi resize responsif ===
function onResize() {
  arSource.onResizeElement();
  arSource.copyElementSizeTo(renderer.domElement);
  if (arContext && arContext.arController) {
    arSource.copyElementSizeTo(arContext.arController.canvas);
  }
}

// === Event listener resize ===
window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', onResize);

// === AR Context (kalibrasi kamera) ===
arContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: 'camera_para.dat',
  detectionMode: 'mono',
});

arContext.init(() => {
  camera.projectionMatrix.copy(arContext.getProjectionMatrix());
});

// === Marker setup ===
markerRoot = new THREE.Group();
scene.add(markerRoot);

new THREEx.ArMarkerControls(arContext, markerRoot, {
  type: 'pattern',
  patternUrl: 'pattern-kubus.patt',
});

// === Tambahkan pencahayaan ===
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// === Fungsi membuat gizmo rotasi ===
function createRotationGizmo(radius = 1.5, tube = 0.008) {
  const gizmo = new THREE.Group();

  const createTorus = (color, rotation) => {
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, 8, 100),
      new THREE.MeshBasicMaterial({ color })
    );
    if (rotation) torus.rotation.copy(rotation);
    return torus;
  };

  gizmo.add(createTorus(0xff0000, new THREE.Euler(0, Math.PI / 2, 0))); // X - merah
  gizmo.add(createTorus(0x00ff00)); // Y - hijau
  gizmo.add(createTorus(0x0000ff, new THREE.Euler(Math.PI / 2, 0, 0))); // Z - biru

  return gizmo;
}

// === Muat model GLB ===
const loader = new THREE.GLTFLoader();
loader.load(
  'kubus.glb',
  gltf => {
    model = gltf.scene;
    model.position.set(0, -0.5, 0);
    model.scale.set(1, 1, 1);
    model.rotation.x = Math.PI / 2;

    // Tambahkan model ke marker
    markerRoot.add(model);

    // Tambahkan gizmo rotasi
    rotationGizmo = createRotationGizmo(1.5, 0.008);
    rotationGizmo.visible = false;
    model.add(rotationGizmo);

    console.log("✅ Model & gizmo rotasi berhasil dimuat!");
  },
  xhr => console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`),
  err => console.error("❌ Gagal memuat model:", err)
);

// === Tombol toggle gizmo ===
toggleBtn.addEventListener("click", () => {
  if (!rotationGizmo) return;
  rotationGizmo.visible = !rotationGizmo.visible;
  toggleBtn.textContent = rotationGizmo.visible
    ? "🙈 Sembunyikan Sumbu"
    : "👁️ Tampilkan Sumbu";
});

// === Kontrol slider ukuran ===
slider.addEventListener('input', () => {
  const s = parseFloat(slider.value);
  scaleValue.textContent = s.toFixed(1);
  if (model) model.scale.set(s, s, s);
});

// === Kontrol rotasi dengan mouse ===
renderer.domElement.addEventListener('mousedown', e => {
  isDragging = true;
  prevMouse.x = e.clientX;
  prevMouse.y = e.clientY;
});

renderer.domElement.addEventListener('mouseup', () => (isDragging = false));

renderer.domElement.addEventListener('mousemove', e => {
  if (!isDragging || !model) return;
  const deltaX = e.clientX - prevMouse.x;
  const deltaY = e.clientY - prevMouse.y;
  model.rotation.y += deltaX * 0.01;
  model.rotation.x += deltaY * 0.01;
  prevMouse.x = e.clientX;
  prevMouse.y = e.clientY;
});

// === Tambahkan dukungan kontrol rotasi sentuh (HP) ===
renderer.domElement.addEventListener('touchstart', e => {
  if (e.touches.length === 1) {
    isDragging = true;
    prevMouse.x = e.touches[0].clientX;
    prevMouse.y = e.touches[0].clientY;
  }
});

renderer.domElement.addEventListener('touchmove', e => {
  if (!isDragging || !model || e.touches.length !== 1) return;
  const deltaX = e.touches[0].clientX - prevMouse.x;
  const deltaY = e.touches[0].clientY - prevMouse.y;
  model.rotation.y += deltaX * 0.01;
  model.rotation.x += deltaY * 0.01;
  prevMouse.x = e.touches[0].clientX;
  prevMouse.y = e.touches[0].clientY;
});

renderer.domElement.addEventListener('touchend', () => (isDragging = false));

// === Animasi utama ===
function animate() {
  requestAnimationFrame(animate);
  if (arSource.ready) arContext.update(arSource.domElement);
  renderer.render(scene, camera);
}
animate();

