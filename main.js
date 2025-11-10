// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// // === SCENE ===
// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x111111);

// // === CAMERA ===
// const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
// camera.position.set(0, 2, 6);
// camera.lookAt(0, 1, 0);

// // === RENDERER ===
// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // === LIGHTING ===
// const ambient = new THREE.AmbientLight(0xffffff, 0.6);
// scene.add(ambient);
// const directional = new THREE.DirectionalLight(0xffffff, 1);
// directional.position.set(5, 10, 7);
// scene.add(directional);

// // === CONTROLS ===
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// // === MATERIAL ===
// const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
// const clothMat = new THREE.MeshStandardMaterial({ color: 0x3366ff });
// const darkMat = new THREE.MeshStandardMaterial({ color: 0x222222 });

// // === BODY PARTS ===
// const head = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), skinMat);
// head.position.y = 2.2;

// const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.2, 32), clothMat);
// body.position.y = 1.2;

// const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1, 16), darkMat);
// leftArm.rotation.z = Math.PI / 2;
// leftArm.position.set(-0.8, 1.3, 0);

// const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1, 16), darkMat);
// rightArm.rotation.z = Math.PI / 2;
// rightArm.position.set(0.8, 1.3, 0);

// const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.2, 16), darkMat);
// leftLeg.position.set(-0.25, 0.1, 0);

// const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.2, 16), darkMat);
// rightLeg.position.set(0.25, 0.1, 0);

// // === GROUP ALL TOGETHER ===
// const character = new THREE.Group();
// character.add(head, body, leftArm, rightArm, leftLeg, rightLeg);
// scene.add(character);

// // === FLOOR ===
// const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({ color: 0x333333 }));
// floor.rotation.x = -Math.PI / 2;
// scene.add(floor);

// // === ANIMATION ===
// let angle = 0;
// function animate() {
//   requestAnimationFrame(animate);
//   controls.update();

//   // animasi ayunan tangan & kaki
//   angle += 0.05;
//   leftArm.rotation.x = Math.sin(angle) * 0.5;
//   rightArm.rotation.x = -Math.sin(angle) * 0.5;
//   leftLeg.rotation.x = -Math.sin(angle) * 0.5;
//   rightLeg.rotation.x = Math.sin(angle) * 0.5;

//   renderer.render(scene, camera);
// }
// animate();

// // === HANDLE RESIZE ===
// window.addEventListener('resize', () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });
