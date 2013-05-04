/// <reference path="../three/three.js" />
/// <reference path="../controls/TrackballControls.js" />

var $canvas = $("#modelViewerWebGLCanvas");
var params = { canvas: $canvas.get(0) };

var width = $canvas.width(),
    height = $canvas.height();

var view_angle = 45,
    aspect = width / height,
    near = 0.1,
    far = 10000;

var renderer = new THREE.WebGLRenderer(params);
var camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
camera.position.z = 5;
renderer.setClearColor('black');


var scene = new THREE.Scene();

var controls = new THREE.TrackballControls(camera, $canvas.get(0));
controls.rotateSpeed = 2.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;

controls.noZoom = false;
controls.noPan = false;

controls.staticMoving = true;
controls.dynamicDampingFactor = 0.3;

renderer.setSize(width, height);

var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(10, 50, 130);
scene.add(pointLight);

var ambientLight = new THREE.AmbientLight(0x0A0A0A);
scene.add(ambientLight);

//var diffuseLight = new THREE.Lig

var geometry = new THREE.CubeGeometry(2, 2, 2);
geometry.dynamic = true;
var material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

render();

function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}
