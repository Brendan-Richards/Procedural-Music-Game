const tileIds = {
    blank: [70],
    leftTopWalls: [10, 24, 38, 52, 66],
    rightTopWalls: [11, 25, 39, 53, 67],
    leftWalls: [2, 16, 30, 44, 58, 6, 20, 34, 48, 62],
    leftWallDecorations: [1, 15, 29, 43, 57, 5, 19, 33, 47, 61, 9, 23, 37, 51, 65],
    rightWallDecorations: [4, 18, 32, 46, 60, 8, 22, 36, 50, 64, 12, 26, 40, 54, 68],
    rightWalls: [3, 17, 31, 45, 59, 7, 21, 35, 49, 63],
    flatGround: [69],
    bottomRow: [71, 72, 73, 74, 75, 76, 77, 78],
    platformSingleCenter: [25],
    platformSingleLeft: [24],
    platformSingleRight: [26],
    platformBottomCenter: [38],
    platformBottomLeft: [37],
    platformBottomRight: [39],
    flatGroundWallStartLeft: [69],
    flatGroundWallStartRight: [69],
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

const setBottomRow = (layer: Phaser.Tilemaps.DynamicTilemapLayer, map: Phaser.Tilemaps.Tilemap) => {
    let x = 0;
    for(let x = 0; x < map.width; x += tileIds.bottomRow.length){
        layer.putTilesAt(tileIds.bottomRow, x, map.height-1);
    }
}

const buildWall = (layer: Phaser.Tilemaps.DynamicTilemapLayer, 
                   map: Phaser.Tilemaps.Tilemap,
                   tileset: Phaser.Tilemaps.Tileset,
                   y1: number, y2: number, x: number, direction: string, wallType: string) => {
    const tileWidth = 16;
    const tileHeight = 16;
    
    //build the climbable wall blocks
    for(let y = y1 + 1; y < y2 - 1; y++){
        let idx = direction==='left' ? randomChoice(tileIds.leftWalls) : randomChoice(tileIds.rightWalls);
        let decorationIdx = direction==='left' ? randomChoice(tileIds.leftWallDecorations) : randomChoice(tileIds.rightWallDecorations);
        
        const wallTile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, tileWidth, tileHeight, tileWidth, tileHeight);
        const wallDecoration = new Phaser.Tilemaps.Tile(layer.layer, decorationIdx, 0, 0, tileWidth, tileHeight, tileWidth, tileHeight);

        wallTile.properties = tileset.getTileProperties(idx);
        //console.log('putting wall tile at x:', x, 'y:', y);
        map.putTileAt(wallTile, x, y, true, layer);
        if(direction==='left'){
            map.putTileAt(wallDecoration, x-1, y, true, layer);
        }
        else{
            map.putTileAt(wallDecoration, x+1, y, true, layer);
        }
    }

    //place top and bottom of wall
    if(y2-y1 === 1 && wallType==='island'){
        const idx = direction==='left' ? tileIds.platformSingleLeft[0] : tileIds.platformSingleRight[0];
        const tile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, tileWidth, tileHeight, tileWidth, tileHeight);
        tile.properties = tileset.getTileProperties(idx);
        map.putTileAt(tile, x, y1, true, layer);        
    }
    else{
        // top wall tile
        let idx = direction==='left' ? randomChoice(tileIds.leftTopWalls) : randomChoice(tileIds.rightTopWalls);
        let decorationIdx = direction==='left' ? randomChoice(tileIds.leftWallDecorations) : randomChoice(tileIds.rightWallDecorations);

        let tile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, tileWidth, tileHeight, tileWidth, tileHeight);
        const wallDecoration = new Phaser.Tilemaps.Tile(layer.layer, decorationIdx, 0, 0, tileWidth, tileHeight, tileWidth, tileHeight);

        tile.properties = tileset.getTileProperties(idx);
        map.putTileAt(tile, x, y1, true, layer); 
        
        if(direction==='left'){
            map.putTileAt(wallDecoration, x-1, y1, true, layer);
        }
        else{
            map.putTileAt(wallDecoration, x+1, y1, true, layer);
        }
    
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


export {buildWall, buildFlat, terrainFill, setBottomRow};