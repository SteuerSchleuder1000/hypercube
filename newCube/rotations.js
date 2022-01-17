

const a = Math.PI* 0.001
const rotXY =    [[Math.cos(a), Math.sin(-a), 0, 0],
                [Math.sin(a), Math.cos(a), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]]

const rotYZ=     [[1, 0, 0, 0],
                [0, Math.cos(a), Math.sin(a), 0],
                [0, Math.sin(-a), Math.cos(a), 0],
                [0, 0, 0, 1]]

const rotXZ=     [[Math.cos(a), 0, Math.sin(-a), 0],
                [0, 1, 0, 0],
                [Math.sin(a), 0, Math.cos(a), 0],
                [0, 0, 0, 1]] 

const rotXU=     [[Math.cos(a), 0, 0, Math.sin(a)],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [Math.sin(-a), 0, 0, Math.cos(a)]]

const rotYU=     [[1, 0, 0, 0],
                [0, Math.cos(a), 0, Math.sin(-a)],
                [0, 0, 1, 0],
                [0, Math.sin(a), 0, Math.cos(a)]]

const rotZU=     [[1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, Math.cos(a), Math.sin(-a)],
                [0, 0, Math.sin(a), Math.cos(a)]]


                
const rotation = [rotXY, rotXZ, rotYZ, rotXU, rotYU, rotZU]
const rotateAxis = [false, false, false, false, false, false]
const rotationNames = ['XY','XZ','YZ','XU','YU','ZU']