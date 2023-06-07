import { Color, LineBasicMaterial, MeshBasicMaterial } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xf0faff) });
viewer.grid.setGrid();
viewer.axes.setAxes();
init();

async function init() {
	await viewer.IFC.setWasmPath('./');
	const model = await viewer.IFC.loadIfcUrl('./04.ifc');

    viewer.dimensions.active = true;
    viewer.dimensions.previewActive = true;

    window.ondblclick = () => {
        viewer.dimensions.create();
    }

    window.onkeydown = (event) => {
        if(event.code === 'Delete') {
            viewer.dimensions.delete();
        }
    }
}