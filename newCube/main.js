
let camera, scene, renderer;
let geometry, material, material2, mesh;
let tes;


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
    scene.background = new THREE.Color(0xffaa00);
    
    tes = getGeometry()
    geometry = new THREE.BufferGeometry();
    
    let vertices = new Float32Array(tesseract.length*3)
    let indices = []

    for (let j in tesseract){
        for (let i=0; i<3; i++) {
            vertices[j*3+i] = tesseract[j][i]*renderWidth
        }
        let a = j
        let b = (j+1)%(tesseract.length*3)
        let c = (j+2)%(tesseract.length*3)
        indices.push(a, b, c)
    }


    geometry.setIndex( indices );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    
    material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    material.side = THREE.DoubleSide
    material2 = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors, wireframe: false,});
    material2.side = THREE.DoubleSide;
    mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setAnimationLoop(animation);
    document.body.appendChild(renderer.domElement);

    // rotateAxis = rotateAxis = [true, false, true, true, false, true]
    setupControls()
    animate()
}

function animation(time) {
    if (isPaused) return;
  mesh.rotation.x = time / 2000;
  mesh.rotation.y = time / 1000;

  renderer.render(scene, camera);
}


function updateMesh() {
    if (mesh) { scene.remove(mesh)}

    tes = getGeometry()
    
    mesh = new THREE.Mesh( tes, material2 )
    scene.add( mesh );
}

function buff() {
    if (mesh) { scene.remove(mesh)}

    tes = getGeometry()
    let g = new THREE.BufferGeometry().fromGeometry( tes );
   
    const material3 = new THREE.MeshPhongMaterial( {
        side: THREE.DoubleSide,
        vertexColors: THREE.FaceColors
    } );
    mesh = new THREE.Mesh( g, material2 )
    scene.add( mesh );
}



function animate() {
    if (!isPaused) {
        for (let i in rotateAxis) {
            if (rotateAxis[i]) { tesseract = mxm(tesseract, rotation[i])}
        }
        updateMesh()
        // buff()
    }
    
    requestAnimationFrame(animate);
    render();
}

function render() { renderer.render(scene, camera);}

