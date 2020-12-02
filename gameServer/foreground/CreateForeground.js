//import createSkyMountains from './SkyMountains';
const placeTerrain =  require('./PlaceTerrain');
const fs = require('fs');

const createTileMap = () => {

    let map = null;

    try {
        const jsonString = fs.readFileSync('./foreground/blackPixelMap.json');
        map = JSON.parse(jsonString);
    } catch(err) {
        console.log('Error parsing base tilemap JSON string:', err);
        return;
    }

    const mapData = map.layers[0].data;
    const width = map.layers[0].width;
    const height = map.layers[0].height;
    // console.log('width:', width);
    // console.log('height:', height);

    // console.log('length of mapData before:', mapData.length);

    // for(let y=height-10, x=0; x<width; x++){
    //     const id = idx(x, y, width);
    //     //console.log('setting id:', id, 'to 41');
    //     mapData[id] = 41;
    // }

    // console.log('length of mapData after:', mapData.length);
    const collisionPoints = [{x: 0, y: 16 * height}, {x: 0, y: 16 * (height-1)}];
    createMountains(15, height, width, mapData, collisionPoints);
    if(collisionPoints[collisionPoints.length-1].x < width * 16){
        collisionPoints.push({x: (width) * 16, y: (height - 1) * 16});
    }
    collisionPoints.push({x: width * 16, y: height * 16});

    placeTerrain.setBottomRow(mapData, height, width);
    // //createSkyMountains(scene, groundLayer, map, tileset);

    //saveTileMap(mapData);

    return [map, collisionPoints];
}

const saveTileMap = mapData => {
    const file = fs.createWriteStream('tileMapArray.txt');
    file.on('error', (err)  => { /* error handling */ });
    let count = 1
    mapData.forEach(num => { 
        const sep = count % 80 === 0 ? '\n' : ', ';
        const space = num.toString().length === 2 ? '' : ' ';  
        file.write(space + num + sep); 
        count += 1;
    });
    file.end();
}

const createMountains = (startX, mapHeight, mapWidth, mapData, collisionPoints) => {
    
    let x = startX;
    let prevType = 'flat';
    const maxWallHeight = 15;
    const maxFlatLength = 3;
    const maxMountainHeight = mapHeight - Math.floor(mapHeight*0.7);
   // const maxMountainHeight = 95;
    let y = mapHeight - 1;
    // console.log('initial y:', y);
    // console.log('max mountain height:', maxMountainHeight);

    while(x < mapWidth){// make one mountain
        let mountainHeight = y - 1 - Math.floor(Math.random() * (y - maxMountainHeight - 1));
        //let mountainEndHeight = map.height - 1 - Math.floor(Math.random() * (map.height - mountainHeight - 1));
        let mountainEndHeight = mapHeight - 1;

        // console.log('mountainHeight:', mountainHeight);
        // console.log('mountainEndHeight:', mountainEndHeight);

        let params;
        params = buildMountainUp(mountainHeight, maxWallHeight, maxFlatLength, prevType, x, y, mapWidth, mapHeight, mapData, collisionPoints);
        
       // params.x += 3;
        params = buildMountainDown(mountainEndHeight, maxWallHeight, params.prevType, maxFlatLength, params.x, params.y, mapWidth, mapHeight, mapData, collisionPoints);
        x = params.x;
        y = params.y;
        prevType = params.prevType;

        const inBetweenLength = Math.floor(Math.random() * 10) + 10;
        x += inBetweenLength;
    }
};

const buildMountainUp = (mountainHeight, maxWallHeight, maxFlatLength, prevType, x, y, mapWidth, mapHeight, mapData, collisionPoints) => {

    let reachedTop = false;

    while(!reachedTop){

        if(x >= mapWidth){
            break;
        }

        if(prevType==='flat'){// make a vertical wall
            let wallHeight = Math.floor(Math.random() * (maxWallHeight-4)) + 4;

            //console.log('building up wallHeight before:', wallHeight);

            if(y + 1 - wallHeight <= mountainHeight){
                wallHeight = y - mountainHeight + 1;
                reachedTop = true;
            }

            placeTerrain.buildWall(mapData, y - (wallHeight - 1), y + 1, x, 'left', 'ground', mapWidth);
            placeTerrain.terrainFill(mapData, x, x + 1, y + 1, mapHeight, mapWidth);

            collisionPoints.push({x: x * 16, y: y * 16});
            collisionPoints.push({x: x * 16, y: (y - (wallHeight - 1)) * 16});
            
            if(x + 1 >= mapWidth){
                collisionPoints.push({x: (mapWidth) * 16, y: (y - (wallHeight - 1)) * 16});
            }

            prevType = 'wall';
            y -= (wallHeight - 1);
            x += 1;
        }
        else{// make a flat section
            const flatLength = Math.floor(Math.random() * (maxFlatLength-1)) + 1;

            //console.log('building up flat length:', flatLength);

            placeTerrain.buildFlat(mapData, x, x + flatLength, y, 'top', false, mapWidth);
            placeTerrain.terrainFill(mapData, x, x + flatLength + 1, y + 1, mapHeight, mapWidth);

            if(x + flatLength >= mapWidth){
                collisionPoints.push({x: (mapWidth) * 16, y: y * 16});
            }

            prevType = 'flat';
            x += flatLength;
        }
        
        if(reachedTop){
            break;
        }
    }
    return {x:x, y:y, prevType:prevType};
}

const buildMountainDown = (mountainEndHeight, maxWallHeight, prevType, maxFlatLength, x, y, mapWidth, mapHeight, mapData, collisionPoints) => {

    let reachedTop = false;


    while(!reachedTop){

        if(x >= mapWidth){
            break;
        }

        if(prevType==='flat'){// make a vertical wall
            let wallHeight = Math.floor(Math.random() * (maxWallHeight-2)) + 2;
            //console.log('wallHeight:',wallHeight)
            //console.log('building down wallHeight before:', wallHeight);

            if(y + wallHeight > mountainEndHeight){
                wallHeight = mountainEndHeight - y + 1;
                reachedTop = true;
            }

            placeTerrain.buildWall(mapData, y, y + wallHeight, x, 'right', 'ground', mapWidth);

            collisionPoints.push({x: (x + 1) * 16, y: y * 16});
            collisionPoints.push({x: (x + 1) * 16, y: (y + wallHeight - 1) * 16});

            prevType = 'wall';
            y += wallHeight - 1;
            x += 1;
        }
        else{// make a flat section
            const flatLength = Math.floor(Math.random() * (maxFlatLength-1)) + 1;

            //console.log('building down flat length:', flatLength);

            placeTerrain.buildFlat(mapData, x, x + flatLength, y, 'top', false, mapWidth);
            placeTerrain.terrainFill(mapData, x, x + flatLength + 1, y + 1, mapHeight, mapWidth);

            if(x + flatLength >= mapWidth){
                collisionPoints.push({x: (mapWidth) * 16, y: y * 16});
            }

            prevType = 'flat';
            x += flatLength;
    
        }
        
        if(reachedTop){
            break;
        }
    }
    return {x:x, y:y, prevType:prevType};        
}

exports.createTileMap = createTileMap;