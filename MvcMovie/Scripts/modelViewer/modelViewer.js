/// <reference path="../three/three.js" />

$(document).ready(function() {
    $(window).on('load', threeStart);
});

function threeStart() {
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

    $(document).keydown(handleKeyDown);
    $(document).keyup(handleKeyUp);
    $canvas.mousedown(handleMouseDown);
    $(document).mouseup(handleMouseUp);
    $(document).mousemove(handleMouseMove);

    camera.moveSpeed = 0.01;
    camera.useQuaternion = true;
    var cameraOrientation = camera.quaternion;

    function handleMouseMove() {
        if (!mouseDown) {
            return;
        }

        var camera = new THREE.

        var newMousePosition = new THREE.Vector2(event.clientX, event.clientY);
        var mouseMoveVector = THREE.Vector2.prototype.subVectors(newMousePosition, lastMousePosition);

        var oldCoord = mouseToTrackball(lastMousePosition.x, lastMousePosition.y, width, height);
        var newCoord = mouseToTrackball(newMousePosition.x, newMousePosition.y, width, height);

        var q = new THREE.Quaternion.getRotation(oldCoord, newCoord).normalize();
        cameraOrientation = new THREE.Quaternion().multiplyQuaternions(q, cameraOrientation);
        lastMousePosition = newMousePosition;
    }

    function handleKeys() {
        if (currentlyPressedKeys[65]) {
            camera.translateX(-camera.moveSpeed);
        }
        if (currentlyPressedKeys[68]) {
            camera.translateX(camera.moveSpeed);
        }
        if (currentlyPressedKeys[87]) {
            camera.translateY(camera.moveSpeed);
        }
        if (currentlyPressedKeys[83]) {
            camera.translateY(-camera.moveSpeed);
        }
        if (mouseDown) {
            var axis = THREE.Vector3(cameraOrientation.x, cameraOrientation.y, cameraOrientation.z);
            var angle = cameraOrientation.w;
            camera.rotateOnAxis(axis, angle);
        }
    }

    function render() {
        requestAnimationFrame(render);
        handleKeys();
        //cube.rotation.x += 0.01;
        //cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    render();
}

var currentlyPressedKeys = {};

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

var lastMousePosition = new THREE.Vector2();
var mouseDown = false;

function handleMouseDown(event) {
    mouseDown = true;
    lastMousePosition.set(event.clientX, event.clientY);
}

function handleMouseUp(event) {
    mouseDown = false;
}

THREE.Quaternion.getRotation = function (from, to) {
    var from = new THREE.Vector3(from.x, from.y, from.z).normalize();
    var to = new THREE.Vector3(to.x, to.y, to.z).normalize();

    var axis = new THREE.Vector3();
    axis.crossVectors(from, to);
    var angle = Math.acos(from.dot(to));

    var q = new THREE.Quaternion();
    q = q.setFromAxisAngle(axis, angle);

    return q;
}

mouseToTrackball = function (px, py, w, h) {
    var x = (px * 2) / w;
    var y = (py * 2) / h;

    x = x - 1;
    y = 1 - y;

    var z2 = 1 - (x * x) - (y * y);
    var z = z2 > 0 ? Math.sqrt(z2) : 0;

    return new THREE.Vector3(x, y, z).normalize();
}