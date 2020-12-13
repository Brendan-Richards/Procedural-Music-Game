
import MountainScene from 'MountainScene';

const createTileMap = (scene: MountainScene): void => {
      
    const map = scene.make.tilemap({ key: "map" });

    const tileset = map.addTilesetImage("blackPixel", "blackPixelTiles", 16, 16, 1, 2);

    const groundLayer = map.createDynamicLayer("tiles", tileset);
    groundLayer.setPosition(0,-1*(groundLayer.height - scene.maxGameHeight));

    groundLayer.setDepth(5);

    scene.matter.world.convertTilemapLayer(groundLayer);  
}

export default createTileMap;