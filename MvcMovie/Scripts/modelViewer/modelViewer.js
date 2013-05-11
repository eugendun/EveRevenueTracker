/// <reference path="../three/three.js" />
/// <reference path="../controls/TrackballControls.js" />

$(function () {
    var $canvas = $("#modelViewerWebGLCanvas");
    var renderer, camera, control;
    var scene = new THREE.Scene();

    initRenderer();
    initCameraControl();
    initLight();
    loadGeometry();
    render();

    function initRenderer() {
        var params = { canvas: $canvas.get(0) };
        renderer = new THREE.WebGLRenderer(params);
        renderer.setClearColor('white');
        renderer.setSize($canvas.width(), $canvas.height());
    }

    function initCameraControl() {
        var view_angle = 45,
            aspect = $canvas.width() / $canvas.height(),
            near = 0.1,
            far = 10000;

        camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
        camera.position.z = 5;

        control = new THREE.TrackballControls(camera, $canvas.get(0));
        control.rotateSpeed = 2.0;
        control.zoomSpeed = 1.2;
        control.panSpeed = 0.8;

        control.noZoom = false;
        control.noPan = false;

        control.staticMoving = true;
        control.dynamicDampingFactor = 0.3;
    }

    function initLight() {
        var pointLight = new THREE.PointLight(0xFFFFFF);
        pointLight.position.set(10, 50, 130);
        scene.add(pointLight);

        var ambientLight = new THREE.AmbientLight(0x0B0B0B);
        scene.add(ambientLight);
    }

    function loadGeometry() {
        var geometry = new THREE.CubeGeometry(2, 2, 2);
        geometry.dynamic = true;
        var material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
    }

    function render() {
        requestAnimationFrame(render);
        control.update();
        renderer.render(scene, camera);
    }
});