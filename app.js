import { Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xf0faff) });
viewer.grid.setGrid();
viewer.axes.setAxes();

async function loadIfc(url) {
    await viewer.IFC.setWasmPath("./");
    const model = await viewer.IFC.loadIfcUrl(url);
    await viewer.shadowDropper.renderShadow(model.modelID);
}

loadIfc('./04.ifc');

window.ondblclick = () => viewer.IFC.selector.pickIfcItem();
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();
