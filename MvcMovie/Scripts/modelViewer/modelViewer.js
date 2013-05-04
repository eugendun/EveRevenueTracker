/// <reference path="../three/three.js" />

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
var scene = new THREE.Scene();

scene.add(camera);
camera.position.z = 5;
renderer.setSize(width, height);

var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(10, 50, 130);
scene.add(pointLight);

var geometry = new THREE.CubeGeometry(2, 2, 2);
geometry.dynamic = true;
var material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();
