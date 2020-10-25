import Phaser from 'phaser';
import MountainScene from 'MountainScene';
import {flatFoliage, verticalFoliage} from './Foliage';
import createSkyMountains from './SkyMountains';


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


const createTileMap = (scene: MountainScene, totalHeight: number): void => {
       
    const map = scene.make.tilemap({ key: "map" });

    //const tileset = map.addTilesetImage("snowRocks", "tiles");
    const tileset = map.addTilesetImage("iceRocks", "iceTiles");
    
    //console.log(tileset.getTileProperties(6));

    console.log('map height:', map.height, 'tiles');
    console.log('map width:', map.width, 'tiles');

    const groundLayer = map.createDynamicLayer("climbingSurfaces", tileset);
    groundLayer.setPosition(0,-1*(groundLayer.height - totalHeight));
    //console.log('map properties:', map);

    createMountains(scene, 15, groundLayer, map, tileset);
    createSkyMountains(scene, groundLayer, map, tileset);
    //createPlatforms(15, groundLayer, map, tileset);

    groundLayer.setDepth(5);

    groundLayer.setCollisionByProperty({ collides: true });


    groundLayer.forEachTile(tile => {
        if ([10, 33].includes(tile.index)){
            //tile.collideLeft = false;
            tile.collideRight = false;
            tile.collideDown = false;
        }
        else if([12, 35].includes(tile.index)){
            tile.collideLeft = false;
            tile.collideDown = false;
        }
    });

    scene.matter.world.convertTilemapLayer(groundLayer);
    
    //scene.matter.world.convertTilemapLayer(groundLayer);

   // this.scene.matter.world.createDebugGraphic();
    
    // const sectionTypes = [
    //     'mountain',
    //     'tower',
    //     'platforms',
    //     'ramps'
    // ];
    // const sectionSize = 30;

    
    
}

const randomChoice = (choices: Array<any>): any => {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

const createFloor = (layer: Phaser.Tilemaps.DynamicTilemapLayer, map: Phaser.Tilemaps.Tilemap): void => {
    for(let x=0; x< 100; x++ ){
        map.putTileAt(tileIds.flatGround[0],
            x, 
            layer.height-1,
            true,
            layer);
            // console.log(x, 97);
    }

}

const createMountains = (scene: MountainScene, startX: number, 
    layer: Phaser.Tilemaps.DynamicTilemapLayer, 
    map: Phaser.Tilemaps.Tilemap,
    tileset: Phaser.Tilemaps.Tileset): void => {

    let x = startX;
    let prevType = 'flat';
    const maxWallHeight = 20;
    const maxFlatLength = 5;
    const maxMountainHeight = map.height;
   // const maxMountainHeight = 95;
    let y = 1;

    //console.log('this.totalwidth:', this.totalWidth);
    while(x < map.width){// make one mountain
        const mountainHeight = Math.floor(Math.random() * (maxMountainHeight-y-4)) + y + 4;
        const mountainEndHeight = Math.floor(Math.random() * (mountainHeight-5)) + 1;
        //console.log('mountain height:', mountainHeight);
        //console.log('mountain end height:', mountainEndHeight);

        let mountainDone = false;
        let params;
        params = buildMountainUp(scene, mountainHeight, maxWallHeight, maxFlatLength, prevType, x, y, layer, map, tileset);
        params = buildMountainDown(scene, mountainHeight, mountainEndHeight, maxWallHeight, params.prevType, maxFlatLength, params.x, params.y, layer, map, tileset);
        x = params.x;
        y = params.y;
        prevType = params.prevType;

    }
};

const fillBelow = (x: number, y: number, layer: Phaser.Tilemaps.DynamicTilemapLayer, map: Phaser.Tilemaps.Tilemap): void => {
        let idx = tileIds.blank[0];
        for(let i=y-1; i>=0; i--){
            //console.log('setting blank at y=', this.mountainHeightMap(i));
            const myTile = new Phaser.Tilemaps.Tile(layer.layer,
                idx, 
                0, 0, 64, 64, 64, 64);
            map.putTileAt(myTile, x, mountainHeightMap(i, map), true, layer);                
        }

}

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
            let wallHeight = Math.floor(Math.random() * (maxWallHeight-1)) + 1;

            if(wallHeight + y >= mountainHeight){
                wallHeight = mountainHeight - y;
                reachedTop = true;
            }

            verticalFoliage(scene, mountainHeightMap(y-1, map)*64, mountainHeightMap(y+wallHeight-1, map)*64, x*64, true);

            //console.log('wall height:', wallHeight);

             //put block below wall
            let idx = tileIds.flatGroundWallStartLeft[0];
            const botTile = new Phaser.Tilemaps.Tile(layer.layer,
                idx, 
                0, 0, 64, 64, 64, 64);

            botTile.properties = tileset.getTileProperties(idx);
            map.putTileAt(botTile, x, mountainHeightMap(y-1, map), true, layer);

            //console.log('putting floor block at:', x, this.mountainHeightMap(y-1));

            //build the climbable wall blocks
            let icePlacements = 0;
            const iceProb = 0.1;
            for(let i=0; i < wallHeight - 1; i++){
                //idx = this.randomChoice(this.tileIds.leftWalls);
                idx = 19;

                if(icePlacements===0 && Math.random() < iceProb){
                    icePlacements = Math.random() * wallHeight - i;
                }
                
                if(icePlacements > 0){
                    idx = tileIds.leftIceWalls[0];
                    icePlacements -= 1;
                }
                
                const wallTile = new Phaser.Tilemaps.Tile(layer.layer,
                    idx, 
                    0, 0, 64, 64, 64, 64);

                wallTile.properties = tileset.getTileProperties(idx);

                map.putTileAt(wallTile, x, mountainHeightMap(y+i, map), true, layer);

                //console.log('putting left wall block at:', x, this.mountainHeightMap(y+i));    

            }

            //put the top block on the wall
            idx = randomChoice(tileIds.leftTopWalls);
            const topTile = new Phaser.Tilemaps.Tile(layer.layer,
                idx, 
                0, 0, 64, 64, 64, 64);
                
            topTile.properties = tileset.getTileProperties(idx);
            
            //console.log('toptile:', topTile);
            map.putTileAt(topTile, x, mountainHeightMap(y + wallHeight-1, map), true, layer);

            //console.log('putting top left wall block at:', x, this.mountainHeightMap(y+wallHeight-1));  
            
            //fill below this wall with blank tiles
            fillBelow(x, y-1, layer, map);

            prevType = 'wall';
            y += wallHeight-1;
            x += 1;
        }
        else{// make a flat section
            const flatLength = Math.floor(Math.random() * (maxFlatLength-1)) + 1;

            flatFoliage(scene, x*64, (x + flatLength)*64, scene.maxGameHeight-(64 * (y+1)));

            //console.log('flat length:', flatLength);
            let idx = tileIds.flatGround[0];
            const flatTile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, 64, 64, 64, 64);
            flatTile.properties = tileset.getTileProperties(idx);
            for(let i=0; i < flatLength; i++){
                map.putTileAt(flatTile, x + i, mountainHeightMap(y, map), true, layer);
                fillBelow(x + i, y, layer, map);
            }

            prevType = 'flat';
            x += flatLength;
            y += 1;
 
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

    let reachedBottom = false;

    while(!reachedBottom){

        if(x >= map.width){
            break;
        }

        if(prevType==='flat'){// make a vertical wall
            let wallHeight = Math.floor(Math.random() * (maxWallHeight-1)) + 1;

            if(y - wallHeight <= mountainEndHeight){
                wallHeight = y-mountainEndHeight;
                reachedBottom = true;
            }

            verticalFoliage(scene, mountainHeightMap(y+1, map)*64, mountainHeightMap(y-wallHeight, map)*64, x*64, false);
            //console.log('wall height:', wallHeight);


            //put the top block on the wall
            let idx = randomChoice(tileIds.rightTopWalls);
            const topTile = new Phaser.Tilemaps.Tile(layer.layer,
                idx, 
                0, 0, 64, 64, 64, 64);

            topTile.properties = tileset.getTileProperties(idx);
            map.putTileAt(topTile, x, mountainHeightMap(y, map), true, layer);

            //console.log('putting top left wall block at:', x, this.mountainHeightMap(y));   

            //build the climbable wall blocks
            for(let i=0; i < wallHeight - 1; i++){
                //idx = this.randomChoice(this.tileIds.leftWalls);
                idx = 21;
                const wallTile = new Phaser.Tilemaps.Tile(layer.layer,
                    idx, 
                    0, 0, 64, 64, 64, 64);

                wallTile.properties = tileset.getTileProperties(idx);
                map.putTileAt(wallTile, x, mountainHeightMap(y-1-i, map), true, layer);

                //console.log('putting left wall block at:', x, this.mountainHeightMap(y-1-i));    

            }                

            // //put block below wall
            idx = tileIds.flatGroundWallStartRight[0];
            const botTile = new Phaser.Tilemaps.Tile(layer.layer,
                idx, 
                0, 0, 64, 64, 64, 64);

            botTile.properties = tileset.getTileProperties(idx);
            map.putTileAt(botTile, x, mountainHeightMap(y-wallHeight, map), true, layer);

           // console.log('putting floor block at:', x, this.mountainHeightMap(y-wallHeight-1));

            fillBelow(x, y - wallHeight, layer, map);

            prevType = 'wall';
            y -= wallHeight;
            x += 1;
        }
        else{// make a flat section
            const flatLength = Math.floor(Math.random() * (maxFlatLength-1)) + 1;

            flatFoliage(scene, x*64, (x + flatLength)*64, scene.maxGameHeight-(64 * (y+1)));

            let idx = tileIds.flatGround[0];
            const flatTile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, 64, 64, 64, 64);
            flatTile.properties = tileset.getTileProperties(idx);
            for(let i=0; i < flatLength; i++){
                map.putTileAt(flatTile, x + i, mountainHeightMap(y, map), true, layer);
                fillBelow(x + i, y, layer, map);
            }

            prevType = 'flat';
            x += flatLength;
            //y -= 1;
        }
    }
    return {x:x, y:y, prevType:prevType};
}

const mountainHeightMap = (y: number, map: Phaser.Tilemaps.Tilemap) => {
    return map.height - 1 - y
}

export default createTileMap;