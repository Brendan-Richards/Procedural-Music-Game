import { FeedbackCombFilter } from 'tone';
import MountainScene from './MountainScene';


const tileIds = {
    blank: [20],
    leftTopWalls: [10, 33, 59],
    rightTopWalls: [12, 35, 63],
    leftIceTopWalls: [100, 123, 149],
    rightIceTopWalls: [102, 125, 153],
    leftWalls: [19, 46],
    leftIceWalls: [109, 136],
    rightIceWalls: [111, 138],
    rightWalls: [21, 48],
    flatGround: [11],
    platformSingleCenter: [25],
    platformSingleLeft: [24],
    platformSingleRight: [26],
    platformBottomCenter: [38],
    platformbottomLeft: [37],
    platformBottomRight: [39],
    flatGroundWallStartLeft: [55],
    flatGroundWallStartRight: [57],
    slideLeft: [51],
    slideRight: [53],
    slideLeftEdge: [59],
    slideRightEdge: [63],
    slideCornerLeft: [60],
    slideCornerRight: [62]
}

export default (scene: MountainScene, layer: Phaser.Tilemaps.DynamicTilemapLayer, 
                map: Phaser.Tilemaps.Tilemap, tileset: Phaser.Tilemaps.Tileset) => {
    
    console.log('creating sky mountains');
    let chestLocationType = 'outside';
    // if(Math.random() < 0.5){
    //     chestLocationType = 'inside';
    // }

    if(chestLocationType==='outside'){
        let chestLocation = {x: Math.floor(Math.random() * scene.maxGameWidth), y: Math.floor(Math.random() * scene.maxGameHeight)};
        console.log('map', map);
        console.log('layer', layer);
        tileLayerPrint(layer);
    }
    else{

    }
    

}


//adapted from: https://gist.github.com/lbn/3d6963731261f76330af
function tileLayerPrint(layer: Phaser.Tilemaps.DynamicTilemapLayer) {
    let mat = layer.layer.data;
    let shape = [mat.length, mat[0].length];

    function col(mat: Phaser.Tilemaps.Tile[][], i: number): number[] {
        return mat.map(row => row[i].index);
    }

    let colMaxes: number[] = [];
    for (let i = 0; i < shape[1]; i++) {
        colMaxes.push(Math.max.apply(null, col(mat, i).map(n => n.toString().length)));
    }

    mat.forEach(row => {
        console.log.apply(null, row.map((tile, j) => {
            return new Array(colMaxes[j]-tile.index.toString().length+1).join(" ") + tile.index.toString() + "  ";
        }));
    });
}