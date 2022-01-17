


let camera, scene, renderer;
let geometry, material, mesh;
let b = false

init();

function init() {
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        10
    );
    camera.position.z = 1;
    

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffaa00)

    if (b) {
        geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        material = new THREE.MeshNormalMaterial();
        
        mesh = new THREE.Mesh(geometry, material);
    }
    
    else {
        geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array( [
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
    
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0, -1.0,  1.0
        ] );
        for (let i in vertices) {
            vertices[i] /= 5
        }
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        material.side = THREE.DoubleSide;
        mesh = new THREE.Mesh( geometry, material );
    }
    
    

    
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animation);
    document.body.appendChild(renderer.domElement);
}

function animation(time) {
  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;

  renderer.render(scene, camera);
}
