import {
	AmbientLight,
	AxesHelper,
	DirectionalLight,
	GridHelper,
	PerspectiveCamera,
	Scene,
	WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
import Stats from 'stats.js/src/Stats';

//Creates the Three.js scene
const scene = new Scene();

//Object to store the size of the viewport
const size = {
	width: window.innerWidth,
	height: window.innerHeight,
};

//Creates the camera (point of view of the user)
const camera = new PerspectiveCamera(75, size.width / size.height);
camera.position.z = 15;
camera.position.y = 13;
camera.position.x = 8;

//Creates the lights of the scene
const lightColor = 0xffffff;

const ambientLight = new AmbientLight(lightColor, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(lightColor, 1);
directionalLight.position.set(0, 10, 0);
directionalLight.target.position.set(-5, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

//Sets up the renderer, fetching the canvas of the HTML
const threeCanvas = document.getElementById('three-canvas');
const renderer = new WebGLRenderer({ canvas: threeCanvas, alpha: true });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Creates grids and axes in the scene
const grid = new GridHelper(50, 30);
scene.add(grid);

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 1;
scene.add(axes);

//Creates the orbit controls (to navigate the scene)
const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;
controls.target.set(-2, 0, 0);

// Stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);

//Animation loop
const animate = () => {
	stats.begin();
	controls.update();
	renderer.render(scene, camera);
	stats.end();
	requestAnimationFrame(animate);
};

animate();

//Adjust the viewport to the size of the browser
window.addEventListener('resize', () => {
	(size.width = window.innerWidth), (size.height = window.innerHeight);
	camera.aspect = size.width / size.height;
	camera.updateProjectionMatrix();
	renderer.setSize(size.width, size.height);
});

const models = [];

//Sets up the IFC loading
let ifcLoader = new IFCLoader();
ifcLoader.ifcManager.setWasmPath('../../../');

const input = document.getElementById('file-input');
input.addEventListener(
	'change',
	(changed) => {
		const ifcURL = URL.createObjectURL(changed.target.files[0]);
		ifcLoader.load(ifcURL, (ifcModel) => {
			models.push(ifcModel);
			scene.add(ifcModel);
		});
	},
	false,
);

// Sets up memory disposal
const button = document.getElementById('memory-button');
button.addEventListener(`click`, () => releaseMemory());

async function releaseMemory() {
	  // This releases all IFCLoader memory
		await ifcLoader.ifcManager.dispose();
		ifcLoader = null;
		ifcLoader = new IFCLoader();
		await ifcLoader.ifcManager.setWasmPath('../../../');

		// If you are storing the ifcmodels in an array or object, you must release them there as well
		// Otherwise, they won't be garbage collected
		models.length = 0;
}
