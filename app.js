import { Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xE3ECF6) });

// Create grid and axes
viewer.grid.setGrid();
viewer.axes.setAxes();

async function loadIfc() {
		// Load the model
    const model = await viewer.IFC.loadIfcUrl('./04.ifc');

		// Add dropped shadow and post-processing efect
    await viewer.shadowDropper.renderShadow(model.modelID);
    viewer.context.renderer.postProduction.active = true;
}

loadIfc('../../../IFC/04.ifc');

window.ondblclick = async () => await viewer.IFC.selector.pickIfcItem();
window.onmousemove = async () => await viewer.IFC.selector.prePickIfcItem();