import Phaser from 'phaser';
import MountainScene from 'MountainScene';
import {flatFoliage, verticalFoliage} from './Foliage';
import createSkyMountains from './SkyMountains';
import {buildWall, buildFlat, terrainFill} from './PlaceTerrain';


const createTileMap = (scene: MountainScene, totalHeight: number): void => {

    // const map = scene.make.tilemap({ key: "map" });

    // const tileset = map.addTilesetImage("dirtGrassCastle", "grassCastleTiles");

    // // const t1 = map.addTilesetImage("trees", "t1");
    // // const t2 = map.addTilesetImage("trees", "t2");
    // // const t3 = map.addTilesetImage("trees", "t3");
    // // const t4 = map.addTilesetImage("trees", "t4");
    // // const t5 = map.addTilesetImage("trees", "t5");
    // const groundLayer = map.createDynamicLayer("grass", tileset);
    // groundLayer.setPosition(0,-1*(groundLayer.height - totalHeight));

    // createMountains(scene, 15, groundLayer, map, tileset);

    // groundLayer.setDepth(5);

    // groundLayer.setCollisionByProperty({ collides: true });

    // scene.matter.world.convertTilemapLayer(groundLayer);  
       
    const map = scene.make.tilemap({ key: "map" });

    const tileset = map.addTilesetImage("iceRocks", "iceTiles");

    const groundLayer = map.createDynamicLayer("climbingSurfaces", tileset);
    groundLayer.setPosition(0,-1*(groundLayer.height - totalHeight));

   createMountains(scene, 15, groundLayer, map, tileset);
   createSkyMountains(scene, groundLayer, map, tileset);

    groundLayer.setDepth(5);

    groundLayer.setCollisionByProperty({ collides: true });

    groundLayer.forEachTile(tile => {
        if ([10, 33].includes(tile.index)){
            tile.collideRight = false;
            tile.collideDown = false;
        }
        else if([12, 35].includes(tile.index)){
            tile.collideLeft = false;
            tile.collideDown = false;
        }
    });

    scene.matter.world.convertTilemapLayer(groundLayer);  
}

const createMountains = (scene: MountainScene, startX: number, 
    layer: Phaser.Tilemaps.DynamicTilemapLayer, 
    map: Phaser.Tilemaps.Tilemap,
    tileset: Phaser.Tilemaps.Tileset): void => {

    let x = startX;
    let prevType = 'flat';
    const maxWallHeight = 15;
    const maxFlatLength = 5;
    const maxMountainHeight = map.height - Math.floor(map.height*0.7);
   // const maxMountainHeight = 95;
    let y = map.height - 1;
    console.log('initial y:', y);
    console.log('max mountain height:', maxMountainHeight);

    while(x < map.width){// make one mountain
        let mountainHeight = y - 1 - Math.floor(Math.random() * (y - maxMountainHeight - 1));
        let mountainEndHeight = map.height - 1 - Math.floor(Math.random() * (map.height - mountainHeight - 1));

        // console.log('mountainHeight:', mountainHeight);
        // console.log('mountainEndHeight:', mountainEndHeight);

        let params;
        params = buildMountainUp(scene, mountainHeight, maxWallHeight, maxFlatLength, prevType, x, y, layer, map, tileset);
        
       // params.x += 3;
        params = buildMountainDown(scene, mountainHeight, mountainEndHeight, maxWallHeight, params.prevType, maxFlatLength, params.x, params.y, layer, map, tileset);
        x = params.x;
        y = params.y;
        prevType = params.prevType;
    }
};

const buildMountainUp = (scene: MountainScene, mountainHeight: number, maxWallHeight: number, maxFlatLength: number, prevType: string, x: number, y: number, 
                   layer: Phaser.Tilemaps.DynamicTilemapLayer, 
                   map: Phaser.Tilemaps.Tilemap,
                   tileset: Phaser.Tilemaps.Tileset) => {

    let reachedTop = false;

    while(!reachedTop){

        if(x >= map.width){
            break;
        }

        if(prevType==='flat'){// make a vertical wall
            let wallHeight = Math.floor(Math.random() * (maxWallHeight-2)) + 2;

            //console.log('building up wallHeight before:', wallHeight);

            if(y + 1 - wallHeight <= mountainHeight){
                wallHeight = y - mountainHeight + 1;
                reachedTop = true;
            }

            //console.log('building up wallHeight after:', wallHeight);

            verticalFoliage(scene, (y - wallHeight)*64, (y + 1)*64, x*64, true);
            //console.log('calling buildWall with y1:', y - wallHeight 'y2:', y + 1, 'x:', x);
            buildWall(layer, map, tileset, y - (wallHeight - 1), y + 1, x, 'left', 'ground');
            terrainFill(layer, map, tileset, x, x + 1, y + 1, map.height);

            prevType = 'wall';
            y -= (wallHeight - 1);
            x += 1;
        }
        else{// make a flat section
            const flatLength = Math.floor(Math.random() * (maxFlatLength-1)) + 1;

            flatFoliage(scene, x*64, (x + flatLength)*64, 64 * (y));

            //console.log('building up flat length:', flatLength);

            buildFlat(layer, map, tileset, x, x + flatLength, y, 'top', false);
            terrainFill(layer, map, tileset, x, x + flatLength + 1, y + 1, map.height);

            prevType = 'flat';
            x += flatLength;
        }
        
        if(reachedTop){
            break;
        }
    }
    return {x:x, y:y, prevType:prevType};
}

const buildMountainDown = (scene: MountainScene, mountainHeight: number, mountainEndHeight: number, maxWallHeight: number, prevType: string, maxFlatLength: number, x: number, y: number, 
    layer: Phaser.Tilemaps.DynamicTilemapLayer, 
    map: Phaser.Tilemaps.Tilemap,
    tileset: Phaser.Tilemaps.Tileset) => {

    let reachedTop = false;


    while(!reachedTop){

        if(x >= map.width){
            break;
        }

        if(prevType==='flat'){// make a vertical wall
            let wallHeight = Math.floor(Math.random() * (maxWallHeight-2)) + 2;

            //console.log('building down wallHeight before:', wallHeight);

            if(y + wallHeight > mountainEndHeight){
                wallHeight = mountainEndHeight - y + 1;
                reachedTop = true;
            }

            //console.log('bulding down wallHeight after:', wallHeight);

            verticalFoliage(scene, (y)*64, (y + wallHeight - 1)*64, x*64, false);
            
            // console.log('calling buildWall with y1:', y 'y2:', y + wallHeight, 'x:', x);
            // console.log('y:', y);
            buildWall(layer, map, tileset, y, y + wallHeight, x, 'right', 'ground');

            prevType = 'wall';
            y += wallHeight - 1;
            x += 1;
        }
        else{// make a flat section
            const flatLength = Math.floor(Math.random() * (maxFlatLength-1)) + 1;

            flatFoliage(scene, x*64, (x + flatLength)*64, 64 * (y));

            //console.log('building down flat length:', flatLength);

            buildFlat(layer, map, tileset, x, x + flatLength, y, 'top', false);
            terrainFill(layer, map, tileset, x, x + flatLength + 1, y + 1, map.height);

            prevType = 'flat';
            x += flatLength;
            //y -= 1;
    
        }
        
        if(reachedTop){
            break;
        }
    }
    return {x:x, y:y, prevType:prevType};        
}

export default createTileMap;