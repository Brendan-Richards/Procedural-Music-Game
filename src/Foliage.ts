import MountainScene from './MountainScene';


const flatFoliage = (scene: MountainScene, x1: number, x2: number, y: number) => {
    console.log('called flatFoliage with params:', x1, x2, y);
    //untis of trees per tile block
    const maxTreeDensity = 0.75;
    const numTiles = (x2-x1)/64;
    const numTrees = Math.floor(Math.random() * maxTreeDensity * numTiles);

    console.log('numTiles:', numTiles, 'numTrees:', numTrees);

    let treeCoordinates: [number[]] = [];
    let currentTreeTypes: string[] = [];

    for(let i=0; i < numTrees; i++){

        if(currentTreeTypes.length===11){
            break;
        }

        let location = 0;
        let validLocation = false;
        const buffer = 30;
        while(!validLocation){
            location = Math.floor(Math.random() * (x2-x1-buffer)) + x1;
            if(location + 120 > x2){// location is too close to right edge of flat section
                continue;
            }
            validLocation = true;
            for(let j=0; j<treeCoordinates.length; j++){ 
                if(location < treeCoordinates[j][1] && location > treeCoordinates[j][0] ||
                   location + buffer < treeCoordinates[j][1] && location + buffer > treeCoordinates[j][0]){
                    validLocation = false;
                    break;
                }
            }
        }
        treeCoordinates.push([location-2, location+buffer]);
        createTree(scene, location, y - scene.maxGameHeight, 1, 1, currentTreeTypes);
        console.log('putting tree at x:', location, 'y:', y);
    }   

    placeBushes(scene, x1, x2, y);
}


const placeBushes = (scene: MountainScene, x1: number, x2: number, y: number) => {
    //number of shrubs to place here
    const maxShrubs = 5;
    const numShrubs = Math.floor(Math.random() * maxShrubs);
    //console.log('placing', numShrubs, 'shrubs');
    const flatWidth = (x2-x1);
    //console.log('flatWidth:', flatWidth);

    //minimum width to place shrubs is 190 because shrub0.png has width of ~190
    if(flatWidth >= 190){
        for(let i=0; i<numShrubs; i++){
            let shrubName = 'shrub' + (Math.floor(Math.random() * 8)).toString();
            let shrubWidth = scene.cache.json.get('environmentAtlas').frames[shrubName].spriteSourceSize.w;

            while(shrubWidth >= flatWidth){
                shrubName = 'shrub' + (Math.floor(Math.random() * 8)).toString();
                shrubWidth = scene.cache.json.get('environmentAtlas').frames[shrubName].spriteSourceSize.w;
            }

            //console.log('shrub name:', shrubName);
            //console.log(shrubWidth);
            const locationX = Math.floor(Math.random() * (x2-shrubWidth-x1)) + x1;
            const sh = scene.add.image(locationX, y, 'environmentAtlas', shrubName).setOrigin(0,1);
            //console.log('placed shrub at:', locationX, y);

        }
    }
}

const createTree = (scene: MountainScene, x: number, y: number, scrollFactorX: number, scrollFactorY: number, otherTrees: string[]): void => {
        const scrollAmount = scene.maxGameHeight - scene.cameras.main.height;
        const offsetY = scrollFactorY * scrollAmount + scene.cameras.main.height;

        const randomOffsetY = Math.floor(Math.random() * 20) + 5;
        let treeType = 'tree_premade';
        let maxTreeNum = 11;

        if(Math.random() < 0.15){
            treeType = 'tree_micro';
            maxTreeNum = 4;
        }

        let treeNum = Math.floor(Math.random() * maxTreeNum).toString();

        while(treeType==='tree_premade' && otherTrees.includes(treeType + treeNum)){
            treeNum = Math.floor(Math.random() * maxTreeNum).toString();
        }

        scene.add.image(x, offsetY + y + randomOffsetY, 'environmentAtlas', treeType + treeNum)
            .setScrollFactor(scrollFactorX, scrollFactorY)
            .setOrigin(0,1);

        otherTrees.push(treeType + treeNum);
}


const verticalFoliage = () => {

}

export {flatFoliage, verticalFoliage};