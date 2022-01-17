
const colors = [
    0xf5f5f5, // 0 white
    0x99cc00, // 1 light green
    0x3a4664, // 2 dark blue
    0x6897bb, // 3 light blue
    0x808080, // 4 grey
    0xb097c9, // 5 lila
    0xc34d57, // 6 red
    0x000000, // 7 black
]

const colorsRGB = [
    [235,235,235],  // 0 white
    [153,204,0],    // 1 light green
    [58,70,100],    // 2 dark blue
    [104,151,187],  // 3 light blue
    [128,128,128],  // 4 grey
    [176,151,201],  // 5 lila
    [195,77,87],    // 6 red
    [0,0,0]         // 7 black
]

const colorNames = ['white', 'green', 'darkBlue', 'lightBlue', 'grey', 'lila', 'red', 'black']



// returns distance between two points
let dist = (v1, v2)=> {
    let d = 0
    for (let i in v1) { d += Math.pow(v1[i]- v2[i], 2) }
    return Math.sqrt(d)
}

// returns lengths of vector v
let v_length = (v)=> {
    let s = v.reduce((a,b)=>a+b**2, 0)
    return Math.sqrt(s)
}

// returns dot product of two vectors
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
   
    return v
}

// returns division v1 - v2
let v_v = (v1, v2)=> { 
    let v = []
    for (let i=0; i< v1.length; i++) { v.push(v1[i]-v2[i]) }
    return v
}

// normalizes and returns vector v
const normalize = (v)=>{
    let l = v_length(v)
    if (l==0) { return v}
    for(let i in v){
        v[i] /= l
    }
    return v
}

// returns subtraction of two THREE.Vector3 v1, v2
let v3_v3 = (v1, v2)=> { 
    return [v1.x -v2.x, v1.y-v2.y, v1.z-v2.z]
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

let vectorAngle = (v1, v2)=>{
    var dot = (v1[0] * v2[0]) + (v1[1] * v2[1]) + (v1[2] * v2[2]);

    var lengthv1 = v_length(v1); // see length
    var lengthv2 = v_length(v2); // see length
    
    var radians = Math.acos(dot / (lengthv1 * lengthv2));
    var angle = radians * 180 / Math.PI;
    return angle
}