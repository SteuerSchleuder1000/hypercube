"use strict";



let getGeometry = () => {

    let g = new THREE.Geometry()

    let vertices = []
    let faces = []

    // loop through cells:
    for (let i in cells){ // go through each cell -> calculate area where u = u0 (canvas slice)
        if (!checkCell(cells[i])){ continue } // checks if edges in cell cross u0

        let cell = cells[i]
        let points = [] // all vertex points in this cells
        

        // check all vertex connections of cell (8 vertices -> 12 connections)
        //          4 -----  7
        //          | \      | \
        //          |   5  ----  6
        //          |   |    |   |
        //          0 --|--- 3   |
        //            \ |     \  |
        //              1 ------ 2

        let getPoints = (level)=>{
            for (let j=0; j<4; j++) {
                let idx1, idx2;
                if (level == 0) {
                    idx1 = cell[j]
                    idx2 = cell[(j+1)%4]
                } else if (level == 1) {
                    idx1 = cell[j+4]
                    idx2 = cell[(j+1)%4 + 4]
                } else if (level == 2) {
                    idx1 = cell[j]
                    idx2 = cell[j+4]
                }
                let point, isOnU0;

                // get the crossing point = [x,y,z,u0] or both points if both on u = u0
                [point, isOnU0] = checkPoint(tesseract[idx1], tesseract[idx2])
                if (isOnU0) { points.push(tesseract[idx1], tesseract[idx2]) }
                else if (point) { points.push(point)}
            }
        }
        getPoints(0) // get point connections [0-1, 1-2, 2-3, 3-1]
        getPoints(1) // get point connections [4-5, 5-6, 6-7, 7-4]
        getPoints(2) // get point connections [0-4, 1-5, 2-6, 3-7]
        

        
        const numPoints = points.length;
        if (numPoints == 0) {
            console.log('error no points in cell crossing?')
            for (let idx of cell) {
                console.log(tesseract[idx][3])
            }
            continue
        }

        let center = [0, 0, 0, 0] // calculate center point of area
        for (let p of points) {
            for (let i in p) { center[i] += p[i]/numPoints }
        }

        
        
        let p0 = points[0]
        let v0 = normalize(v_v(p0, center))
        let points_new = []


        while (points_new.length < points.length) {

            let top = {angle: -Infinity, point: null, v: null}

            for (let j=0; j< points.length; j++){

                let p1 = points[j];
                if (p0 == p1) continue;

                let v1 = normalize(v_v(p1, p0));
                let a = dot(v0, v1);

                if (a > top.angle) {
                    top = {angle: a, point: p1, v: v1};
                }
            }

            points_new.push(top.point);

            v0 = top.v
            p0 = top.point
        }
        points = points_new

        
        let idx0 = vertices.length // first idx of points = center
        
        vertices.push(new THREE.Vector3(center[0]*renderWidth, center[1]*renderWidth, center[2]*renderWidth))
        
        
        for (let j=0; j< numPoints; j++) {
            let p = points[j]
            let v = new THREE.Vector3(p[0]*renderWidth,p[1]*renderWidth, p[2]*renderWidth)
            vertices.push(v)

            
            let idx1 = idx0+1+j
            let idx2 = idx0+1+(j+1)%numPoints
            

            let face = new THREE.Face3(idx0, idx1, idx2)
            face.color = new THREE.Color(colors[i])
            faces.push(face)

            // face['colorName'] = colorNames[i]
            // let rgb = colorsRGB[i]
            // let inc = 10*j
            // let color = `rgb(${rgb[0]+inc},${rgb[1]+inc},${rgb[2]+inc})`
        }

    } // cells

    g.vertices = vertices
    g.faces = faces
    
    g.computeFaceNormals();
    g.computeVertexNormals();

    return g;
}



// checks if cell crosses u0
function checkCell(cell) {

    let idx = cell[0]
    let checkU = tesseract[idx][3] > u0 // check if first element is greater u0

    for (let idx of cell) {
        let point = tesseract[idx]
        if (point[3] == u0) return true; // if an element is exactly u0 returns true
        if ((point[3] > u0) != checkU) return true;
    }
    return false;
}   


let checkPoint = (p1, p2)=> { // return (point, isSameU)
    if (p1[3] == u0 && p2[3] == u0){ return [null, true]} // check if both u == u0
    if ((p1[3] <u0) == (p2[3] <u0)) { return [null, false]} // check if both points same u side

    let d = (p1[3]-u0)/(p1[3]-p2[3]) // ratio
    let p12 = [ p1[0] + d*(p2[0]-p1[0]), // x
                p1[1] + d*(p2[1]-p1[1]), // y
                p1[2] + d*(p2[2]-p1[2]), // z
                u0]                      // u
    return [p12, false]
}
