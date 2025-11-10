//Author: Ali Rohman, S.Kom., M.Kom
//Dosen Pengampu MK: Pemodelan Geometrik

let scene, camera, renderer, arSource, arContext, markerRoot, model, rotationGizmo;
let isDragging = false;
let prevMouse = { x: 0, y: 0 };

// === Ambil elemen HTML (slider dan label) ===
const slider = document.getElementById('scaleSlider');
const scaleValue = document.getElementById('scaleValue');

// === Buat tombol toggle gizmo ===
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "👁️ Tampilkan Sumbu";
toggleBtn.style.position = "absolute";
toggleBtn.style.top = "20px";
toggleBtn.style.left = "50%";
toggleBtn.style.transform = "translateX(-50%)";
toggleBtn.style.padding = "8px 16px";
toggleBtn.style.border = "none";
toggleBtn.style.borderRadius = "8px";
toggleBtn.style.background = "rgba(0, 0, 0, 0.6)";
toggleBtn.style.color = "white";
toggleBtn.style.fontFamily = "sans-serif";
toggleBtn.style.cursor = "pointer";
document.body.appendChild(toggleBtn);

// === Inisialisasi scene & kamera ===
scene = new THREE.Scene();
camera = new THREE.Camera();
scene.add(camera);

// === Renderer ===
renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(new THREE.Color('lightgrey'), 0);
document.body.appendChild(renderer.domElement);

// === AR Source (kamera webcam) ===
arSource = new THREEx.ArToolkitSource({ sourceType: 'webcam' });
arSource.init(() => {
  setTimeout(() => {
    arSource.onResizeElement();
    arSource.copyElementSizeTo(renderer.domElement);
  }, 2000);
});

// === Resize handler ===
window.addEventListener('resize', () => {
  arSource.onResizeElement();
  arSource.copyElementSizeTo(renderer.domElement);
  if (arContext.arController !== null) {
    arSource.copyElementSizeTo(arContext.arController.canvas);
  }
});

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

  // X (merah)
  const torusX = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 8, 100),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  torusX.rotation.y = Math.PI / 2;
  gizmo.add(torusX);

  // Y (hijau)
  const torusY = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 8, 100),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  );
  gizmo.add(torusY);

  // Z (biru)
  const torusZ = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 8, 100),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
  );
  torusZ.rotation.x = Math.PI / 2;
  gizmo.add(torusZ);

  return gizmo;
}

// === Muat model GLB ===
const loader = new THREE.GLTFLoader();
loader.load(
  'kubus.glb',
  gltf => {
    model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(2, 2, 2);
    model.rotation.x = Math.PI / 2;

    // Tambahkan model ke marker
    markerRoot.add(model);

    // Tambahkan gizmo rotasi di sekitar model
    rotationGizmo = createRotationGizmo(1.5, 0.008);
    rotationGizmo.visible = false; // default: disembunyikan
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

renderer.domElement.addEventListener('mouseup', () => {
  isDragging = false;
});

renderer.domElement.addEventListener('mousemove', e => {
  if (!isDragging || !model) return;

  const deltaX = e.clientX - prevMouse.x;
  const deltaY = e.clientY - prevMouse.y;

  model.rotation.y += deltaX * 0.01;
  model.rotation.x += deltaY * 0.01;

  prevMouse.x = e.clientX;
  prevMouse.y = e.clientY;
});

// === Animasi utama ===
function animate() {
  requestAnimationFrame(animate);
  if (arSource.ready) arContext.update(arSource.domElement);
  renderer.render(scene, camera);
}
animate();
