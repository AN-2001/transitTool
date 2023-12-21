import * as THREE from 'three';

const Canvas = document.getElementById('background-canvas')
var { width, height } = Canvas.getBoundingClientRect();

const RenderSettings = {
    canvas: Canvas,
    antialias: true, 
    stencil: false,
};
const Scene = new THREE.Scene();
const Cam = new THREE.Camera(90, width / height, 0.1, 1000);
const Renderer = new THREE.WebGLRenderer(RenderSettings);
console.log(width, height);
Renderer.setSize(width, height);


const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({
    color: 0xff00ff,    
    specular: 0xffffff,    
    shininess: 100,
});
const cube = new THREE.Mesh( geometry, material );
Scene.add( cube );

var pointLight = new THREE.SpotLight({ color: 0xffffff, angle: Math.PI /2, intensity: 1 });
Scene.add(pointLight);

const Ambient = new THREE.AmbientLight();
Scene.add(Ambient);


onresize = function() {
    ({width, height}  = Canvas.getBoundingClientRect());
    Renderer.setSize( width, height );
}


function Render()
{
    requestAnimationFrame(Render);
    Renderer.render(Scene, Cam);
}

// Render();
