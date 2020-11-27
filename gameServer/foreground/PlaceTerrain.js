const tileIds = {
    blank: [79, 80, 88, 89, 90, 91, 92 ,93, 94, 95, 96, 97],
    leftCorners: [13, 41],
    rightCorners: [14, 42],
    leftTopWalls: [10, 24, 38, 52, 66],
    rightTopWalls: [11, 25, 39, 53, 67],
    leftWalls: [2, 16, 30, 44, 58, 6, 20, 34, 48, 62],
    leftWallDecorations: [1, 15, 29, 43, 57, 5, 19, 33, 47, 61, 9, 23, 37, 51, 65],
    rightWallDecorations: [4, 18, 32, 46, 60, 8, 22, 36, 50, 64, 12, 26, 40, 54, 68],
    rightWalls: [3, 17, 31, 45, 59, 7, 21, 35, 49, 63],
    flatGround: [69, 70, 81, 82, 83],
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

const randomChoice = (choices) => {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

const idx = (x, y, width) => {
    return width * y + x;
}

const setBottomRow = (mapData, mapHeight, mapWidth) => {
    let x=0;

    while(x < mapWidth){
        mapData[idx(x, mapHeight-1, mapWidth)] = tileIds.bottomRow[x % tileIds.bottomRow.length];
        x += 1;
    }
}

const buildWall = (mapData, y1, y2, x, direction, wallType, maxWidth) => {
    const tileWidth = 16;
    const tileHeight = 16;
    
    //build the climbable wall blocks
    for(let y = y1 + 1; y < y2 - 1; y++){
        let tileIdx = direction==='left' ? randomChoice(tileIds.leftWalls) : randomChoice(tileIds.rightWalls);
        let decorationIdx = direction==='left' ? randomChoice(tileIds.leftWallDecorations) : randomChoice(tileIds.rightWallDecorations);
        
        // const wallTile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, tileWidth, tileHeight, tileWidth, tileHeight);
        // const wallDecoration = new Phaser.Tilemaps.Tile(layer.layer, decorationIdx, 0, 0, tileWidth, tileHeight, tileWidth, tileHeight);

        // wallTile.properties = tileset.getTileProperties(idx);
        //console.log('putting wall tile at x:', x, 'y:', y);
        //console.log('putting tileIdx:', tileIdx, 'at location x:', x, 'y:', y, 'index in array:', idx(x, y, maxWidth));
        mapData[idx(x, y, maxWidth)] = tileIdx;
        //map.putTileAt(wallTile, x, y, true, layer);
        if(direction==='left'){
            mapData[idx(x-1, y, maxWidth)] = decorationIdx;
            //map.putTileAt(wallDecoration, x-1, y, true, layer);
        }
        else{
            mapData[idx(x+1, y, maxWidth)] = decorationIdx;
            //map.putTileAt(wallDecoration, x+1, y, true, layer);
        }
    }

    //place top and bottom of wall
    if(y2-y1 === 1 && wallType==='island'){
        const tileIdx = direction==='left' ? tileIds.platformSingleLeft[0] : tileIds.platformSingleRight[0];
        mapData[idx(x, y1, maxWidth)] = tileIdx;
        // const tile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, tileWidth, tileHeight, tileWidth, tileHeight);
        // tile.properties = tileset.getTileProperties(idx);
        // map.putTileAt(tile, x, y1, true, layer);        
    }
    else{
        // top wall tile
        let tileIdx = direction==='left' ? randomChoice(tileIds.leftTopWalls) : randomChoice(tileIds.rightTopWalls);
        let decorationIdx = direction==='left' ? randomChoice(tileIds.leftWallDecorations) : randomChoice(tileIds.rightWallDecorations);

        mapData[idx(x, y1, maxWidth)] = tileIdx;
        // let tile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, tileWidth, tileHeight, tileWidth, tileHeight);
        // const wallDecoration = new Phaser.Tilemaps.Tile(layer.layer, decorationIdx, 0, 0, tileWidth, tileHeight, tileWidth, tileHeight);

        // tile.properties = tileset.getTileProperties(idx);
        // map.putTileAt(tile, x, y1, true, layer); 
        
        if(direction==='left'){
            mapData[idx(x-1, y1, maxWidth)] = decorationIdx;
            //map.putTileAt(wallDecoration, x-1, y1, true, layer);
        }
        else{
            mapData[idx(x+1, y1, maxWidth)] = decorationIdx;
            //map.putTileAt(wallDecoration, x+1, y1, true, layer);
        }
    
        // bottom wall tile
        if(wallType==='island'){
            tileIdx = direction==='left' ? randomChoice(tileIds.platformBottomLeft) : randomChoice(tileIds.platformBottomRight);
        }
        else{
            tileIdx = direction==='left' ? randomChoice(tileIds.flatGroundWallStartLeft) : randomChoice(tileIds.flatGroundWallStartRight);
        }
        // tile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, 64, 64, 64, 64);
        // tile.properties = tileset.getTileProperties(idx);
        // map.putTileAt(tile, x, y2-1, true, layer);
        mapData[idx(x, y2-1, maxWidth)] = tileIdx;
    
    }    
}

const buildFlat = (mapData, x1, x2, y, type, heightOne, maxWidth) => {

    let tileIdx = type==='top' ? randomChoice(tileIds.flatGround) : tileIds.platformBottomCenter[0];
    if(heightOne){
        tileIdx = tileIds.platformSingleCenter[0];
    }
    
    for(let x = x1; x<x2; x++){
        // const tile = new Phaser.Tilemaps.Tile(layer.layer, idx, 0, 0, 64, 64, 64, 64);
        // tile.properties = tileset.getTileProperties(idx);
        // map.putTileAt(tile, x, y, true, layer); 
        mapData[idx(x, y, maxWidth)] = tileIdx;        
    }
}

const terrainFill = (mapData, x1, x2, y1, y2, maxWidth) => {
    
    for(let x=x1; x < x2; x++){
        for(let y=y1; y < y2; y++){
            // const tile = new Phaser.Tilemaps.Tile(layer.layer, randomChoice(tileIds.blank), 0, 0, 16, 16, 16, 16);
            // map.putTileAt(tile, x, y, true, layer);
            mapData[idx(x, y, maxWidth)] = randomChoice(tileIds.blank);
        }
    }
    // map.fill(randomChoice(tileIds.blank), x1, y1, x2 - x1, y2 - y1);
};


exports.buildWall = buildWall;
exports.buildFlat = buildFlat;
exports.terrainFill = terrainFill;
exports.setBottomRow = setBottomRow;