import MountainScene from './MountainScene';


const flatFoliage = (scene: MountainScene, x1: number, x2: number, y: number) => {
    console.log('called flatFoliage with params:', x1, x2, y);
    //untis of trees per tile block
    const maxTreeDensity = 1;
    const numTiles = (x2-x1)/64;
    const numTrees = Math.floor(Math.random() * maxTreeDensity * numTiles);

    console.log('numTiles:', numTiles, 'numTrees:', numTrees);

    let treeCoordinates: [number[]] = [];

    for(let i=0; i < numTrees; i++){
        let location = 0;
        let validLocation = false;
        while(!validLocation){
            location = Math.floor(Math.random() * (x2-x1)) + x1;
            validLocation = true;
            for(let j=0; j<treeCoordinates.length; j++){
                if(location < treeCoordinates[j][1] && location > treeCoordinates[j][0] ||
                   location + 23 < treeCoordinates[j][1] && location + 23 > treeCoordinates[j][0]){
                    validLocation = false;
                    break;
                }
            }
        }
        treeCoordinates.push([location-2, location+23]);
        straightPlainTree(scene, location, y - scene.maxGameHeight, 1, 1);
        console.log('putting tree at x:', location, 'y:', y);
    }
}

const straightPlainTree = (scene: MountainScene, x: number, y: number, scrollFactorX: number, scrollFactorY: number): void => {
    const scrollAmount = scene.maxGameHeight - scene.cameras.main.height;
    const offsetY = scrollFactorY * scrollAmount + scene.cameras.main.height;

    // y += scrollFactorY * this.scene.cameras.main.height;

    const stump = scene.add.image(x, offsetY + y , 'environmentAtlas', 'tree_skinny_stump_1')
        .setScrollFactor(scrollFactorX, scrollFactorY)
        .setOrigin(0,1);
    y -= stump.height;

    const stumpBodyOffset = 2;
    const maxBodyPieces = 4;
    const numBodyPieces = Math.floor(Math.random() * maxBodyPieces) + 1;
    for(let i = 0; i < numBodyPieces; i++){
        const body = scene.add.image(x + stumpBodyOffset, offsetY + y, 'environmentAtlas', 'tree_skinny_body')
            .setScrollFactor(scrollFactorX, scrollFactorY)
            .setOrigin(0,1); 
        y -= body.height; 
    }

    //console.log('putting tree top at:', x, y);
    const bodyTopOffset = -8;
    scene.add.image(x + bodyTopOffset, offsetY + y, 'environmentAtlas', 'tree_skinny_top')
        .setScrollFactor(scrollFactorX, scrollFactorY)
        .setOrigin(0,1);        
     
}

const verticalFoliage = () => {

}

export {flatFoliage, verticalFoliage};