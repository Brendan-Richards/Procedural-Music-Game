import MountainScene from './MountainScene';
import {buildWall, buildFlat ,terrainFill} from './PlaceTerrain';

export default (scene: MountainScene, layer: Phaser.Tilemaps.DynamicTilemapLayer, 
                map: Phaser.Tilemaps.Tilemap, tileset: Phaser.Tilemaps.Tileset) => {
    
    console.log('creating sky mountains');
    let chestLocationType = 'outside';
    // if(Math.random() < 0.5){
    //     chestLocationType = 'inside';
    // }

    let platformCoordinates;

    if(chestLocationType==='outside'){
        let chestLocation = {x: Math.floor(Math.random() * scene.maxGameWidth), y: Math.floor(Math.random() * scene.maxGameHeight)};
        console.log('map', map);
        console.log('layer', layer);
        //tileLayerPrint(layer);

        let topLeft = {x:0, y:0}
        let bounds = getSectionBounds(topLeft, map);
        platformCoordinates = [skySection(scene, bounds)];

        while(bounds.topRight.x < map.width){
            bounds = getSectionBounds(bounds.topRight, map);
            //console.log('bounds:', bounds);
            platformCoordinates.push(skySection(scene, bounds));
            
        }
        
    }
    else{

    }
    
    const allPlatformCoordinates = [];
    platformCoordinates.forEach(coordinates => {
        allPlatformCoordinates.push(...coordinates);
    });

    // console.log(allPlatformCoordinates);

    // allPlatformCoordinates.forEach(coordinates => {
    //     scene.add.rectangle(coordinates.x2 * 64, coordinates.y2 * 64, (coordinates.x2-coordinates.x1) * 64, (coordinates.y2-coordinates.y1) * 64, '0xff00', 0.5).setOrigin(1, 1);
    // });
    
    makePlatforms(scene, layer, map, tileset, allPlatformCoordinates)
}


const makePlatforms = (scene: MountainScene, layer: Phaser.Tilemaps.DynamicTilemapLayer, 
                        map: Phaser.Tilemaps.Tilemap, tileset: Phaser.Tilemaps.Tileset,
                        platformCoordinates: Array<object>) => {

    platformCoordinates.forEach(coordinates => {
        buildWall(layer, map, tileset, coordinates.y1, coordinates.y2, coordinates.x1, 'left', 'island');
        buildWall(layer, map, tileset, coordinates.y1, coordinates.y2, coordinates.x2 - 1, 'right', 'island');
        buildFlat(layer, map, tileset, coordinates.x1 + 1, coordinates.x2 - 1, coordinates.y1, 'top', coordinates.y2-coordinates.y1 <= 1);
        buildFlat(layer, map, tileset, coordinates.x1 + 1, coordinates.x2 - 1, coordinates.y2 - 1, 'bottom', coordinates.y2-coordinates.y1 <= 1);
        terrainFill(layer, map, tileset, coordinates.x1 + 1, coordinates.x2 - 1, coordinates.y1 + 1, coordinates.y2 - 1);
    })
    
}

const skySection = (scene: MountainScene, bounds: object) => {
    //console.log('making skysection with bounds:', bounds);
    // scene.add.rectangle(bounds.topLeft.x * 64, 
    //                     bounds.topLeft.y * 64, 
    //                     (bounds.topRight.x - bounds.topLeft.x) * 64,
    //                     (bounds.bottomLeft.y - bounds.topLeft.y) * 64,
    //                     '0xff000',
    //                     0.2).setOrigin(0,0);

    // first rectangle in bottom right corner of section
    const x2 = bounds.bottomRight.x - 1;
    const width = Math.floor(Math.random() * 0.5 * (bounds.topRight.x - bounds.topLeft.x - 6) + 5);
    const height = Math.floor(Math.random() * 15 + 5);
    const x1 = x2 - width;
    const y2 = bounds.bottomLeft.y - 1;
    const y1 = y2 - height;
    
    //scene.add.rectangle(x2 * 64, y2 * 64, width * 64, height * 64, '0xff00', 0.5).setOrigin(1,1);

    let currentPlatforms = [{x1: x1, x2: x2, y1: y1, y2: y2}];

    const worldTopBuffer = 5;

    while(currentPlatforms[currentPlatforms.length -1].y1 > worldTopBuffer){
        getPlatformCoordinates(bounds, currentPlatforms);
    }

    return currentPlatforms;
}

const getPlatformCoordinates = (bounds, currentPlatforms): Array<number> => {
    const buffer = 1;
    const maxPlatformSeperation = 4;
    const minPlatformSeperation = 1;
    const maxPlatformHeight = 15;
    const maxPlatformWidth = 15;
    const minPlatformHeight = 1;
    const minPlatformWidth = 3;

    const left = bounds.topLeft.x + buffer;
    const right = bounds.topRight.x - buffer;
    const top = bounds.topLeft.y + buffer;
    const bottom = bounds.bottomLeft.y - buffer;
    const boundCenterX = Math.round((right - left)/2) + left;

    const last = currentPlatforms[currentPlatforms.length-1];
    const lastCenterX = Math.round((last.x2 - last.x1)/2) + last.x1;
    
    let prevY1 = null;
    if(currentPlatforms.length > 1){
        prevY1 = currentPlatforms[currentPlatforms.length - 2].y1;
    }

    let x1: number, x2: number, y1: number, y2: number;

    if(lastCenterX >= boundCenterX){
        //make next platform up to the left
        const bottomRight = {
            x: last.x1 - (Math.floor(Math.random() * (maxPlatformSeperation - minPlatformSeperation)) + minPlatformSeperation), 
            y: Math.floor(Math.random() * 0.5 * (last.y2 - last.y1)) + last.y1
        };

        if(prevY1 && bottomRight.y > prevY1){
            bottomRight.y = prevY1 - buffer;
        }

        const width = Math.floor(Math.random() * Math.min(maxPlatformWidth - minPlatformWidth, bottomRight.x - left - buffer - 1)) + minPlatformWidth;
        const height = Math.floor(Math.random() * (maxPlatformHeight - minPlatformHeight)) + minPlatformHeight;

        x2 = bottomRight.x;
        y2 = bottomRight.y;
        x1 = x2 - width;
        y1 = y2 - height;

    }
    else{// lastCenterX < boundCenterX  
        //make next platform up to the right
        const bottomLeft = {
            x: last.x2 + (Math.floor(Math.random() * (maxPlatformSeperation - minPlatformSeperation)) + minPlatformSeperation), 
            y: Math.floor(Math.random() * 0.5 * (last.y2 - last.y1)) + last.y1
        };

        if(prevY1 && bottomLeft.y > prevY1){
            bottomLeft.y = prevY1 - buffer;
        }

        const width = Math.floor(Math.random() * Math.min(maxPlatformWidth - minPlatformWidth, right - bottomLeft.x - buffer - 1)) + minPlatformWidth;
        const height = Math.floor(Math.random() * (maxPlatformHeight - minPlatformHeight)) + minPlatformHeight;

        x1 = bottomLeft.x;
        x2 = x1 + width;
        y2 = bottomLeft.y;
        y1 = y2 - height;

    }

    if(y1 < 5){
        y1 = 5;
    }

    //console.log('coordinates:', [x1, x2, y1, y2]);

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
    const maxSectionWidth = 20;
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

        count += 1
        if(topRight.x - topLeft.x < minSectionWidth && topRight.x !== map.width){
            bottomLeft.y -= 1;
            continue;
        }

        if(bottomRight.x > map.width - minSectionWidth){
            bottomRight.x = map.width;
            topRight.x = map.width;
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