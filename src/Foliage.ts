import MountainScene from './MountainScene';


const flatFoliage = (scene: MountainScene, x1: number, x2: number, y: number) => {
    //console.log('called flatFoliage with params:', x1, x2, y);
    //untis of trees per tile block
    const maxTreeDensity = 0.75;
    const numTiles = (x2-x1)/64;
    const numTrees = Math.floor(Math.random() * maxTreeDensity * numTiles);

    //console.log('numTiles:', numTiles, 'numTrees:', numTrees);

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
        //console.log('putting tree at x:', location, 'y:', y);
    }   

    placeShrubs(scene, x1, x2, y);
    placeFlatBushes(scene, x1, x2, y);
}

const placeFlatBushes = (scene: MountainScene, x1: number, x2: number, y: number) => {
    const flatWidth = (x2-x1);
    
    //determine bush type
    let bushType = 'bush_top';
    if(Math.random() < 0.85){
        if(Math.random() < 0.5){
            bushType = 'full_bush';
        }
        else{
            bushType = 'half_bush';
        }
    }

    if(bushType==='bush_top'){
        const maxBushes = 2;
        const numBushes = Math.floor(Math.random() * maxBushes);
       //console.log('placing', numBushes, 'bushes');
        for(let i=0; i<numBushes; i++){
            let bushName = bushType + (Math.floor(Math.random() * 5)).toString();
            let bushWidth = scene.cache.json.get('environmentAtlas').frames[bushName].spriteSourceSize.w;
    
            const locationX = Math.floor(Math.random() * (x2-x1-bushWidth)) + x1;
            const bush = scene.add.image(locationX, y, 'environmentAtlas', bushName).setOrigin(0,1);
        }

    }
    else{
        const maxBushes = 2;
        const numBushes = Math.floor(Math.random() * maxBushes);       
        //console.log('placing', numBushes, 'bushes');
        for(let i=0; i<numBushes; i++){
            let bushName = bushType + (Math.floor(Math.random() * (bushType==='full_bush' ? 24 : 12))).toString();
            let bushWidth = scene.cache.json.get('environmentAtlas').frames[bushName].spriteSourceSize.w;
    
            const locationX = Math.floor(Math.random() * (x2-x1-bushWidth)) + x1;
            const bush = scene.add.image(locationX, y, 'environmentAtlas', bushName).setOrigin(0,1);
        }
    }     
}


const placeShrubs = (scene: MountainScene, x1: number, x2: number, y: number) => {
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

        const tree = scene.add.image(x, offsetY + y + randomOffsetY, 'environmentAtlas', treeType + treeNum)
            .setScrollFactor(scrollFactorX, scrollFactorY)
            .setOrigin(0,1);

        tree.setAngle(Math.floor(Math.random() * 10) - 5);

        otherTrees.push(treeType + treeNum);
}


const verticalFoliage = (scene: MountainScene, y1: number, y2: number, x: number, left: boolean) => {
    //console.log('y1:', y1, 'y2:', y2, 'x:', x);

    // //determine bush type
    let bushType: string;
    if(Math.random() < 2){
        bushType = 'full_bush';
    }
    else{
        bushType = 'half_bush';
    }

    //units of bushes per tile block
    const maxBushDensity = 0.4;
    const maxNumTiles = Math.abs(y2-y1)/64;
    const maxNumBushes = Math.floor(maxBushDensity * maxNumTiles);
    const numBushes = Math.floor(Math.random() * maxNumBushes);

    for(let i=0; i<numBushes; i++){
        if(left){
            let bushName = bushType + (Math.floor(Math.random() * 24)).toString();
            const locationY = Math.max(y1, y2) - Math.floor(Math.random() * Math.abs(y2-y1)) + 50; 
            const randomOffsetX = Math.floor(Math.random() * 50) + 30;
            //console.log('placing bush at:', x + randomOffsetX, locationY);
            const bush = scene.add.image(x + randomOffsetX, locationY, 'environmentAtlas', bushName).setOrigin(0.5,1);
            bush.setAngle(Math.floor(Math.random() * -100) - 40);
            //bush.setDepth(10);
            // bush.setFixedRotation().setCollisionCategory(0);
            // bush.setIgnoreGravity(true);
        }
        else{
            let bushName = bushType + (Math.floor(Math.random() * 24)).toString();
            const locationY = Math.max(y1, y2) - Math.floor(Math.random() * Math.abs(y2-y1-70)) + 70; 
            const randomOffsetX = 34 - Math.floor(Math.random() * 50);
            //console.log('placing bush at:', x + randomOffsetX, locationY);
            const bush = scene.add.image(x + randomOffsetX, locationY, 'environmentAtlas', bushName).setOrigin(0.5,1);
            bush.setAngle(Math.floor(Math.random() * 100) + 40);
            //bush.setDepth(10);
        }
    }     
}


export {flatFoliage, verticalFoliage};