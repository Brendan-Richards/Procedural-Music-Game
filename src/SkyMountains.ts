import { arraysEqual } from '@tensorflow/tfjs-core/dist/util';
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
        //tileLayerPrint(layer);

        let topLeft = {x:0, y:0}
        let bounds = getSectionBounds(topLeft, map);
        skySection(scene, layer, map, tileset, bounds);

        while(bounds.topRight.x < map.width){
            bounds = getSectionBounds(bounds.topRight, map);
            //console.log('bounds:', bounds);
            skySection(scene, layer, map, tileset, bounds);
            
        }
        
    }
    else{

    }
    

}

const skySection = (scene: MountainScene, 
                    layer: Phaser.Tilemaps.DynamicTilemapLayer, 
                    map: Phaser.Tilemaps.Tilemap, 
                    tileset: Phaser.Tilemaps.Tileset, 
                    bounds: object) => {
    //console.log('making skysection with bounds:', bounds);
    scene.add.rectangle(bounds.topLeft.x * 64, 
                        bounds.topLeft.y * 64, 
                        (bounds.topRight.x - bounds.topLeft.x) * 64,
                        (bounds.bottomLeft.y - bounds.topLeft.y) * 64,
                        '0xff000',
                        0.2).setOrigin(0,0);

    // first rectangle in bottom right corner of section
    const corner = scene.add.rectangle((bounds.bottomRight.x - 1) * 64, 
        (bounds.bottomLeft.y - 1) * 64, 
        Math.floor(Math.random() * (bounds.topRight.x - bounds.topLeft.x - 6) + 5) * 64,
        Math.floor(Math.random() * 20 + 5) * 64,
        '0xff00', 0.5).setOrigin(1,1);

    const totalArea = (bounds.topRight.x - bounds.topLeft.x) * (bounds.bottomLeft.y - bounds.topLeft.y);
    const sectionArea = totalArea * 0.2;
    let currentArea = 0;
    let currentPlatforms = [corner];

    while(currentArea < sectionArea){
        currentArea += makePlatform(scene, layer, map, tileset, bounds, currentPlatforms);
    }

}

const makePlatform = (scene: MountainScene, 
                      layer: Phaser.Tilemaps.DynamicTilemapLayer, 
                      map: Phaser.Tilemaps.Tilemap, 
                      tileset: Phaser.Tilemaps.Tileset, 
                      bounds: object,
                      currentPlatforms) => {
    
    //platform tile bounds
    let x1: number, x2: number, y1: number, y2: number;
    [x1, x2, y1, y2] = getPlatformCoordinates(bounds, currentPlatforms);

    scene.add.rectangle(x1 * 64, y1 * 64, (x2-x1) * 64, (y2-y1) * 64, '0xff00', 0.5).setOrigin(0,0);   

    return (x2-x1) * (y2-y1);
}


const getPlatformCoordinates = (bounds, currentPlatforms): Array<number> => {
    const buffer = 1;

    const left = bounds.topLeft.x + buffer;
    const right = bounds.topRight.x - buffer;
    const top = bounds.topLeft.y + buffer;
    const bottom = bounds.bottomLeft.y - buffer;

    let x1 = Math.floor(Math.random() * (right-3-left)) + left;
    let x2 = Math.floor(Math.random() * (right-3-x1)) + x1 + 3;
    let y1 = Math.floor(Math.random() * (bottom-1-top)) + top;
    let y2 = Math.floor(Math.random() * (bottom-1-y1)) + y1 + 1;

    while(!validPlatform(x1, x2, y1, y2, currentPlatforms)){
        x1 = Math.floor(Math.random() * (right-3-left)) + left;
        x2 = Math.floor(Math.random() * (right-3-x1)) + x1 + 3;
        y1 = Math.floor(Math.random() * (bottom-1-top)) + top;
        y2 = Math.floor(Math.random() * (bottom-1-y1)) + y1 + 1;
    }
    console.log('valid coordinates:', [x1, x2, y1, y2]);

    currentPlatforms.push({x1: x1, x2: x2, y1: y1, y2: y2});

    return [x1, x2, y1, y2];
}

const validPlatform = (x1: number, x2: number, y1: number, y2: number, currentPlatforms): boolean => {

    for(let i=0; i<currentPlatforms.length; i++){
        const platform = currentPlatforms[i];

        console.log('checking coordinates for overlap');
        console.log('platform:', platform);
        console.log('new coordinates:', {x1: x1, x2: x2, y1: y1, y2: y2});
        //if the bounds of the two rectangles overlap
        const overlapX = platform.x1 <= x2 && platform.x2 >= x1;
        const overlapY = platform.y1 <= y2 && platform.y2 >= y1;
        if(overlapX && overlapY){
            console.log('bad platform');
            return false; 
        }
    }

    return true;
}

const getSectionBounds = (topLeft: {x: number, y: number}, map: Phaser.Tilemaps.Tilemap) => {

    const minSectionWidth = 10;
    const maxSectionWidth = 30;
    const lowestPlatformHeight =  map.height * 0.7;

    let bottomLeft = {x: topLeft.x, y: lowestPlatformHeight};
    for(let i=0; i<lowestPlatformHeight; i++){
        if(map.hasTileAt(topLeft.x, i)){
            bottomLeft.y = i;
            break;
        }
    }

    let count = 1;

    while(true){
        let bottomRight = {x: map.width, y: bottomLeft.y};
        for(let i=bottomLeft.x; i<map.width; i++){
            if(map.hasTileAt(i, bottomLeft.y) || (i - bottomLeft.x) > maxSectionWidth){
                bottomRight.x = i;
                break;
            }
        }
    
        let topRight = {x: bottomRight.x, y: topLeft.y};

        // console.log({
        //     topLeft: topLeft, 
        //     topRight: topRight, 
        //     bottomLeft: bottomLeft, 
        //     bottomRight: bottomRight
        // });

        count += 1
        if(topRight.x - topLeft.x < minSectionWidth && topRight.x !== map.width){
            bottomLeft.y -= 1;
            continue;
        }
    
        return {
            topLeft: topLeft, 
            topRight: topRight, 
            bottomLeft: bottomLeft, 
            bottomRight: bottomRight
        };
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