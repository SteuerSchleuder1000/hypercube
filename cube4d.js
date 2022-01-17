var camera, scene, renderer, geometry, material, mesh;

var vertices
var faces = []
let ffaces = {}

let u0 = 0
let isPaused = false
let pause = (e)=> { 
    isPaused = !isPaused
    e.target.classList.toggle('highlighted')
}
document.getElementById('pauseBtn').onclick = pause


let isMouseDown = false
let clickPosition = {x: 0, y: 0, phi: 0, theta: 0}
let cameraPos = {phi: 0, theta: 0}
let f_angle = 0.01
let renderWidth = 1;



function onMouseMove(e) {

    if (isMouseDown) {
        // console.log(e.screenX, e.screenY)
        let dx = e.screenX - clickPosition.x
        // let dy = e.screenY - clickPosition.y

        let phi = clickPosition.phi + dx * f_angle
        // let theta = clickPosition.theta + dy * f_angle

        camera.position.x = 250* Math.cos(phi)
        camera.position.z = 250* Math.sin(phi)
        camera.lookAt(0,0,0)

    }
}

let click_down = (e)=>{ 
    isMouseDown = true 
    clickPosition.x = e.screenX
    clickPosition.z = e.screenY
}

let click_up = (e)=> {
    isMouseDown = false
    let dx = e.screenX - clickPosition.x
    // let dy = e.screenY - clickPosition.y

    clickPosition.phi = clickPosition.phi + dx * f_angle
    // clickPosition.theta = clickPosition.theta + dy *f_angle
}

let slider = (e)=> {
    let val = parseFloat(e.target.value)
    // u0 = width*(val/100 - 0.5)
    // set val
}



document.getElementById('myRange').oninput = slider

let wireFrame = (e)=> { 
    material.wireframe = !material.wireframe 
    e.target.classList.toggle('highlighted')
}
document.getElementById('wireframe').onclick = wireFrame

window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'mousedown', click_down, false );
window.addEventListener( 'mouseup', click_up, false );


/*

u0 fix
rotation fix -> check formula
axis in 3d
theta rotation

*/


let points = []



let width = 100
let dist_max = 1.4*10
let tesseract = [
    [0, 0, 0, 0], // z0 u0
    [1, 0, 0, 0], // z0 u0
    [1, 1, 0, 0], // z0 u0
    [0, 1, 0, 0], // z0 u0
    [0, 0, 1, 0], // z1 u0
    [1, 0, 1, 0], // z1 u0
    [1, 1, 1, 0], // z1 u0
    [0, 1, 1, 0], // z1 u0
    [0, 0, 1, 1], // z1 u1
    [1, 0, 1, 1], // z1 u1
    [1, 1, 1, 1], // z1 u1
    [0, 1, 1, 1], // z1 u1
    [0, 0, 0, 1], // z0 u1
    [1, 0, 0, 1], // z0 u1
    [1, 1, 0, 1], // z0 u1
    [0, 1, 0, 1]  // z0 u1
]

for (let i in tesseract) {
    for (let j in tesseract[i]) {
        tesseract[i][j] -= 0.5
        tesseract[i][j] *= width
    }

}


let clone = (m)=>{
    let c = []
    for (let row of m) {c.push(Array.from(row))}
    return c
}
let t_clone = clone(tesseract)
let reset = (e)=>{ 
    tesseract = clone(t_clone)
    // if (e) { e.target.classList.toggle('highlighted') }
}
document.getElementById('reset').onclick = reset

// cell wise updates -> 
// wor

let cells = [ // notation order important!
    [0, 1, 2, 3, 4, 5, 6, 7],       // 0 white
    [12, 13, 14, 15, 0, 1, 2, 3],   // 1 green
    [0, 1, 5, 4, 12, 13, 9, 8],     // 2 d blue
    [1, 2, 6, 5, 13, 14, 10, 9],    // 3 l blue
    [3, 0, 4, 7, 15, 12, 8, 11],    // 4 grey
    [2, 3, 7, 6, 14, 15, 11, 10],   // 5 lila
    [4, 5, 6, 7, 8, 9, 10 , 11],    // 6 red
    [8, 9, 10, 11, 12, 13, 14, 15], // 7 black
    
]


let colors = [
    0xf5f5f5, // 0 white
    0x99cc00, // 1 light green
    0x3a4664, // 2 dark blue
    0x6897bb, // 3 light blue
    0x808080, // 4 grey
    0xb097c9, // 5 lila
    0xc34d57, // 6 red
    0x000000, // 7 black
]

let colorNames = ['white', 'green', 'lightBlue', 'darkBlue', 'grey', 'lila', 'red', 'black']






let dist = (v1, v2)=> {
    let d = 0
    for (let i in v1) { d += Math.pow(v1[i]- v2[i], 2) }
    return Math.sqrt(d)
}

let v_length = (v)=> {
    let s = v.reduce((a,b)=>a+b**2, 0)
    return Math.sqrt(s)
}

let dot = (v1, v2)=> {
    let v = 0
    for (let i=0; i< v1.length; i++) { v += v1[i]*v2[i] }
    return v
}

// 3d cross product
let cross = (v1, v2)=> {
    let v = [
        v1[1]*v2[2]-v1[2]*v2[1],
        v1[2]*v2[0]-v1[0]*v2[2],
        v1[0]*v2[1]-v1[1]*v2[0]
    ]
    // let v = [
    //     parseFloat((v1[1]*v2[2]-v1[2]*v2[1]).toFixed(10)),
    //     parseFloat((v1[2]*v2[0]-v1[0]*v2[2]).toFixed(10)),
    //     parseFloat((v1[0]*v2[1]-v1[1]*v2[0]).toFixed(10))
    // ]
   
    return v
}

// returns v1 - v2
let v_v = (v1, v2)=> { 
    let v = []
    for (let i=0; i< v1.length; i++) { v.push(v1[i]-v2[i]) }
    return v
}

// matrix multiplication
let mxm = (a, b) => {
    let aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  

    for (let r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols);
      for (let c = 0; c < bNumCols; ++c) {
        m[r][c] = 0; 

        for (let i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] * b[i][c];
        }
      }
    }
    return m;
}



let a = Math.PI* 0.001
let rotXY =    [[Math.cos(a), Math.sin(-a), 0, 0],
                [Math.sin(a), Math.cos(a), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]]

let rotYZ=     [[1, 0, 0, 0],
                [0, Math.cos(a), Math.sin(a), 0],
                [0, Math.sin(-a), Math.cos(a), 0],
                [0, 0, 0, 1]]

let rotXZ=     [[Math.cos(a), 0, Math.sin(-a), 0],
                [0, 1, 0, 0],
                [Math.sin(a), 0, Math.cos(a), 0],
                [0, 0, 0, 1]] 

let rotXU=     [[Math.cos(a), 0, 0, Math.sin(a)],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [Math.sin(-a), 0, 0, Math.cos(a)]]

let rotYU=     [[1, 0, 0, 0],
                [0, Math.cos(a), 0, Math.sin(-a)],
                [0, 0, 1, 0],
                [0, Math.sin(a), 0, Math.cos(a)]]

let rotZU=     [[1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, Math.cos(a), Math.sin(-a)],
                [0, 0, Math.sin(a), Math.cos(a)]]


let rotation = [rotXY, rotXZ, rotYZ, rotXU, rotYU, rotZU]
let rotateAxis = [false, false, false, false, false, false]
let rotNames = ['XY', 'XZ', 'YZ', 'XU', 'YU', 'ZU']

// onRotationButtonClick
let rotClick = (e)=>{
    let idx = rotNames.indexOf(e.target.id)
    rotateAxis[idx] = !rotateAxis[idx]
    e.target.classList.toggle("highlighted");
}

for (let _id of rotNames) { document.getElementById(_id).onclick = rotClick }

// check if two 4d points cross u = u0 and return point at u = u0
let checkPoint = (p1, p2)=> { 
    if (p1[3] == u0 && p2[3] == u0){ return true}
    if ((p1[3] <u0) == (p2[3] <u0)) { return false }

    let d = (p1[3]-u0)/(p1[3]-p2[3])
    let p12 = [p1[0] + d*(p2[0]-p1[0]),
            p1[1] + d*(p2[1]-p1[1]),
            p1[2] + d*(p2[2]-p1[2]),
            u0]
    return p12
}

let checkCell = (cell)=> {
    let delta = 0
    let isPos = tesseract[cell[0]][3] > delta
    for (let p of cell) {
        if ((tesseract[p][3] > delta) != isPos && tesseract[p][3] != 0) { return true }
    }
    return false
}




// calculate normalized cross product
let calcN = (v1, v2)=>{
    let n = cross(v1, v2)
    let d = v_length(n)
    if (d == 0) { return 0}
    for (let i=0; i<3; i++) {
        n[i] = (n[i]/d)
    }
    return n
}

let superLog = false;
let temp = null
let addGeometry = () => {

    if (mesh) { scene.remove(mesh)}


    

    points = []
    vertices = []
    faces = []

    geometry = new THREE.Geometry()

    // cell wise

    for (let i in cells){ // go through each cell -> calculate area where u = u0 (real world)
        if (!checkCell(cells[i])){ continue } // checks if points cross u0

        let cell = cells[i]
        let points = []
        


        // check all vertex connections of cell (8 vertices -> 12 connections)
        // check first level idx [0...3]
        for (let j=0; j<4; j++) {
            let idx1 = cell[j]
            let idx2 = cell[(j+1)%4]
            let pt = checkPoint(tesseract[idx1], tesseract[idx2])
            if (pt == true) { points.push(tesseract[idx1], tesseract[idx2]) }
            else if (pt != false) { points.push(pt)}
        }

        // check second level idx [4...7]
        for (let j=0; j<4; j++) {
            let idx1 = cell[j+4]
            let idx2 = cell[(j+1)%4 + 4]
            let pt = checkPoint(tesseract[idx1], tesseract[idx2])
            if (pt == true) { points.push(tesseract[idx1], tesseract[idx2]) }
            else if (pt != false) { points.push(pt)}
        }

        // check level connections
        for (let j=0; j<4; j++) { 
            let idx1 = cell[j]
            let idx2 = cell[j+4]
            let pt = checkPoint(tesseract[idx1], tesseract[idx2])
            if (pt == true) { points.push(tesseract[idx1], tesseract[idx2]) }
            else if (pt != false) { points.push(pt)}
        }

        
        const numPoints = points.length;
        let center = [0, 0, 0, 0] // calculate center point of area
        for (let p of points) {
            for (let i in p) { center[i] += p[i]/numPoints }
        }


        // sorting points clockwise around center
        // let n = calcN(v_v(points[0], center), v_v(points[1], center)) // normalized 3d crossproduct 
        // if (n == 0) { n = calcN(v_v(points[0], center), v_v(points[2], center)) }

        // sorting points clockwise around center
        let n = 0;
        let j = 1;
        while (n==0) {
            if (j > points.length-1 ) { console.log('error'); return; }
            n = calcN(v_v(points[0], center), v_v(points[j], center));
            j += 1;
        }

        let minVal = 1e-28 // epsilon
        let sortClockwise = (v1, v2)=>{
            let c = cross(v_v(v1, center), v_v(v2, center))
            let d = dot(n, c)
            if (superLog) console.log(d, 'v1', v1, 'v2', v2);
            // if (Math.abs(d) < 1e-10) { d = 0}
            // if (i == 5) {console.log(colorNames[i],d, n, c)}
            
            if (d > minVal) { return 1}
            else if (d < -minVal) { return -1}
            else { 
                console.log(colorNames[i],d, n, c, v1, v2)
                return 0
            }   
        }

        let xAxis = v_v(points[0], center)
        let lx = v_length(xAxis)
        let yAxis = cross(n, xAxis)
        let sort2 = (v1, v2)=>{
            let x1 = dot(v1, xAxis)
            let y1 = dot(v1, yAxis)
            let a1 = Math.atan2(y1,x1)

            let x2 = dot(v2, xAxis)
            let y2 = dot(v2, yAxis)
            let a2 = Math.atan2(y2,x2)

            return a1-a2
        }

        
        let sort3 = (v1, v2)=>{
            let v11 = v_v(v1, center)
            let v22 = v_v(v2, center)
            let theta1 = Math.acos(dot(v11, xAxis)/(v_length(v11)*lx))
            let theta2 = Math.acos(dot(v22, xAxis)/(v_length(v22)*lx))
            // console.log(theta1, theta2)
            return theta2 - theta1
        }


        // points.sort(sort3)
        // points.sort(sortClockwise)

        let points_new = [points[0]]
        for (let x=0; x < numPoints; x++) {
            let p1 = points[x];
            let m = {value: 100000000, idx: -1}
            for (let y=0; y < points.length; y++) {
                if (x==y) {continue}
                let p2 = points[y]
                let d = Math.abs(v_length(v_v(p1, p2)))-Number.EPSILON
                if (d < m.value && !(p2 in points_new)) {
                    m = {value: d+Number.EPSILON, idx: y}
                }
            }
            points_new.push(points[m.idx])
        }
        // console.log(points_new)

        for (let j in points) { points[j] = points_new[j] }
        // points = points_new
        // let points_sorted = [points[0]]
        // let idx = 0
        // while( points_sorted.length < points.length)  {

        //     if (points.length <= 1) { break }

        //     let p1 = points[0]
        //     let best = {idx: null, dist: 1000}

        //     for (let j=1; j<points.length; j++) {
        //         let p2 = points[j]
        //         let c = cross(v_v(p1, center), v_v(p2, center))
        //         let d = dot(n, c)
        //         if (d > 0) {

        //             let l = dist(p1, p2)
        //             if (l < best.dist) {
        //                 best.idx = j
        //                 best.dist = l
        //             }
        //         }
        //     }

        //     if (best.idx == null) { console.log('ERROR'); break}
        //     points_sorted.push(points[best.idx])
        //     points.splice(0, 1)
        // }   


        // points = points_sorted

        // new approach -> get all points + center -> go through comparisson list
        // -> 


        // if (i == 5) {console.log(points)}
        // console.log('center',center)
        // console.log('points:',points)
        

       



        
        let idx0 = vertices.length // first idx of points = center
        // let width = WIDTH // render_width
        vertices.push(new THREE.Vector3(center[0]*renderWidth, center[1]*renderWidth, center[2]*renderWidth))
        
        ffaces[colorNames[i]] = []
        ffaces['v_'+i] = []
        for (let j=0; j< numPoints; j++) {
            let p = points[j]
            let v = new THREE.Vector3(p[0]*renderWidth,p[1]*renderWidth, p[2]*renderWidth)
            vertices.push(v)

            
            let idx1 = idx0+1+j
            let idx2 = idx0+1+(j+1)%numPoints
            

            let face = new THREE.Face3(idx0, idx1, idx2)
            face['colorName'] = colorNames[i]
            face.color = new THREE.Color(colors[i])
            faces.push(face)
            geometry.faces.push(face)

            ffaces[colorNames[i]].push(face)
        }


    } // cells

    geometry.vertices = vertices
    geometry.faces = faces
    
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();


    mesh = new THREE.Mesh( geometry, material )
    mesh.material.side = THREE.DoubleSide;

    
    scene.add( mesh );
}










function init() {

    let vPv = (v1, v2)=> {
        let v = []
        for (let i=0; i< v1.length; i++) { v.push(v1[i]+v2[i]) }
        return v
    }

    


    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffaa00)

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 300;
    camera.position.y = 200
    camera.rotation.x = -0.5
    camera.lookAt(0, 0,0)
    scene.add(camera);

    material = new THREE.MeshBasicMaterial({vertexColors: THREE.FaceColors, wireframe: false,});
    // material = new THREE.MeshPhongMaterial()

    

    addGeometry()
    



    // // create a point light
    // const pointLight = new THREE.PointLight(0xFFFFFF);

    // // set its position
    // pointLight.position.x = 300;
    // pointLight.position.y = 350;
    // pointLight.position.z = 330;

    // // add to the scene
    // scene.add(pointLight);

    // // create a point light
    // const pointLight2 = new THREE.PointLight(0xFFFFFF);

    // // set its position
    // pointLight2.position.x = -300;
    // pointLight2.position.y = -350;
    // pointLight2.position.z = 330;

    // add to the scene
    // scene.add(pointLight2);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

}





function animate() {


    if (!isPaused) {
        for (let i=0; i<6; i++) {
            if (rotateAxis[i]) {tesseract = mxm(tesseract, rotation[i])}
        }
        // rotation function ([axis], [degree])
        // tesseract = mxm(tesseract, rot[axis])
        // tesseract = mxm(tesseract, rot[0]) // XY
        // tesseract = mxm(tesseract, rot[1]) // XZ
        // tesseract = mxm(tesseract, rot[2]) // YZ
        // tesseract = mxm(tesseract, rot[3]) // XU
        // tesseract = mxm(tesseract, rot[4]) // YU
        // tesseract = mxm(tesseract, rot[5]) // ZU

        addGeometry()
    }
    
    
    requestAnimationFrame(animate);
    render();

}

function render() { renderer.render(scene, camera);}




init();
animate();

