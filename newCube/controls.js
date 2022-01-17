
isMouseDown = false
let f_angle = 0.01
clickPosition = {x:0, y:0, z:0, phi:0, theta:0}

function setupControls() {
    document.getElementById('pauseBtn').onclick = ()=>{isPaused=!isPaused}
    document.getElementById('uSlider').oninput = onSlider
    for (let name of rotationNames) {
        document.getElementById(name).onclick = onRotationButtonClick;
    }

    
    window.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener( 'mousedown', clickDown, false );
    window.addEventListener( 'mouseup', clickUp, false );    
}


function onMouseMove(e) {

    if (isMouseDown) {
        // console.log(e.screenX, e.screenY, clickPosition)
        if (clickPosition.y < 130) return
        let dx = e.screenX - clickPosition.x
        // let dy = e.screenY - clickPosition.y

        let phi = clickPosition.phi + dx * f_angle
        // let theta = clickPosition.theta + dy * f_angle

        camera.position.x = 1* Math.cos(phi)
        camera.position.z = 1* Math.sin(phi)
        camera.lookAt(0,0,0)

    }

}


let clickDown = (e)=>{ 
    isMouseDown = true 
    clickPosition.x = e.screenX
    clickPosition.y = e.screenY
}

let clickUp = (e)=> {
    isMouseDown = false
    let dx = e.screenX - clickPosition.x
    clickPosition.phi = clickPosition.phi + dx * f_angle
}

function onSlider(e) {
    let val = parseInt(e.target.value)
    u0 = (val -50)*2
    // console.log(val, u0)

    updateMesh()
}

let onRotationButtonClick = (e)=>{
    let idx = rotationNames.indexOf(e.target.id)
    rotateAxis[idx] = !rotateAxis[idx]
    e.target.classList.toggle("highlighted");
}

