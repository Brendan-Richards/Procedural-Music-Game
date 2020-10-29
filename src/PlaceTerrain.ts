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
    platformBottomLeft: [37],
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

const randomChoice = (choices: Array<any>): any => {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

const buildWall = (layer: Phaser.Tilemaps.DynamicTilemapLayer, 
                   map: Phaser.Tilemaps.Tilemap,
                   tileset: Phaser.Tilemaps.Tileset,
                   y1: number, y2: number, x: number, direction: string, wallType: string) => {

    //build the climable wall blocks
    let icePlacements = 0;
    const iceProb = .1;
    for(let y = y1 + 1; y < y2 - 1; y++){
        //idx = this.randomChoice(this.tileIds.leftWalls);
        let idx = direction==='left' ? 19 : 21;

        if(icePlacements===0 && Math.random() < iceProb){
            icePlacements = Math.floor(Math.random() * (y2-y1));
        }

        if(icePlacements > 0){
            idx = direction==='left' ? tileIds.leftIceWalls[0] : tileIds.rightIceWalls[0];
            icePlacements -= 1;
        }
        
        const wallTile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, 64, 64, 64, 64);

        wallTile.properties = tileset.getTileProperties(idx);

        map.putTileAt(wallTile, x, y, true, layer);
    }

    //place top and bottom of wall
    if(y2-y1 === 1){
        const idx = direction==='left' ? tileIds.platformSingleLeft[0] : tileIds.platformSingleRight[0];
        const tile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, 64, 64, 64, 64);
        tile.properties = tileset.getTileProperties(idx);
        map.putTileAt(tile, x, y1, true, layer);        
    }
    else{
        // top wall tile
        let idx = direction==='left' ? randomChoice(tileIds.leftTopWalls) : randomChoice(tileIds.rightTopWalls);
        let tile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, 64, 64, 64, 64);
        tile.properties = tileset.getTileProperties(idx);
        map.putTileAt(tile, x, y1, true, layer);   
    
        // bottom wall tile
        if(wallType==='island'){
            idx = direction==='left' ? randomChoice(tileIds.platformBottomLeft) : randomChoice(tileIds.platformBottomRight);
        }
        else{
            idx = direction==='left' ? randomChoice(tileIds.flatGroundWallStartLeft) : randomChoice(tileIds.flatGroundWallStartRight);
        }
        tile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, 64, 64, 64, 64);
        tile.properties = tileset.getTileProperties(idx);
        map.putTileAt(tile, x, y2-1, true, layer); 
    }    
}

const buildFlat = (layer: Phaser.Tilemaps.DynamicTilemapLayer, 
    map: Phaser.Tilemaps.Tilemap,
    tileset: Phaser.Tilemaps.Tileset,
    x1: number, x2: number, y: number, type: string, heightOne: boolean) => {

    let idx = type==='top' ? tileIds.flatGround[0] : tileIds.platformBottomCenter[0];
    if(heightOne){
        idx = tileIds.platformSingleCenter[0];
    }
    
    for(let x = x1; x<x2; x++){
        const tile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, 64, 64, 64, 64);
        tile.properties = tileset.getTileProperties(idx);
        map.putTileAt(tile, x, y, true, layer);         
    }
}

const terrainFill = (layer: Phaser.Tilemaps.DynamicTilemapLayer, 
                     map: Phaser.Tilemaps.Tilemap,
                     tileset: Phaser.Tilemaps.Tileset,
                     x1: number, x2: number, y1: number, y2: number) => {
    
    map.fill(tileIds.blank[0], x1, y1, x2 - x1, y2 - y1);
};

export {buildWall, buildFlat, terrainFill};