function openPage(pageName,elmnt,color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
}

const placeInformation = (scene) => {
    //let canvas = document.getElementsByTagName("p");

    //wrap canvas in a div
    let canvas = scene.game.canvas;
    let wrapper = document.createElement('div');
    wrapper.id = 'canvasWrapper';
    document.body.insertBefore(wrapper, canvas);
    wrapper.appendChild(canvas);

    //put info div after canvas
    let infoDiv = document.getElementById("info");
    document.body.insertBefore(wrapper, infoDiv);
    //document.body.setAttribute('style', 'overflow-y: scroll;');
    // document.style.overflow = 'scroll';
    
    //set properties of info div
    infoDiv.setAttribute('style', 'height: 500px;');

    const {aboutDiv, controlsDiv, attributionDiv} = getDivs();
    const {aboutButton, controlsButton, attributionButton} = getButtons();

    const donateButton = `<form id='donate' action="https://www.paypal.com/donate" method="post" target="_top">
                            <input type="hidden" name="cmd" value="_donations" />
                            <input type="hidden" name="business" value="X46PPCXDMDJBL" />
                            <input type="hidden" name="currency_code" value="USD" />
                            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                            <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />	
                        </form>`;

    const donateDiv = document.createElement('div');
    donateDiv.innerHTML = donateButton;

    aboutDiv.appendChild(aboutContent());
    aboutDiv.appendChild(donateDiv);
    controlsDiv.appendChild(controlsContent());
    attributionDiv.appendChild(attributionContent());

    const linkDiv = document.createElement('div');
    linkDiv.id = 'linkDiv';
    linkDiv.appendChild(aboutButton);
    linkDiv.appendChild(controlsButton);
    linkDiv.appendChild(attributionButton);
    infoDiv.appendChild(linkDiv);

    const contentDiv = document.createElement('div');
    contentDiv.id = 'contentDiv';
    contentDiv.appendChild(aboutDiv);
    contentDiv.appendChild(controlsDiv);
    contentDiv.appendChild(attributionDiv);
    infoDiv.appendChild(contentDiv);

    document.getElementById("defaultOpen").click();
}

const aboutContent = () => {
    const paragraph = document.createElement('p');
    paragraph.innerHTML = `Shade is a fast paced, 1 on 1, multiplayer dueling game. It was created by Brendan Richards using the Phaser javascript game engine. It features randomized, procedural level generation, meaning the level you face your opponents in will never be the same twice. Please report any bugs/issues to quend00@gmail.com. The game is available to play for free but if you enjoy it please consider donating to its creator by clicking on the following button. If you don't enjoy the game feel free to berate me in the comments. Enjoy!`;
    return paragraph;
}

const controlsContent = () => {
    const container = document.createElement('div');
    // container.id = 'flex-container';
    
    const left = document.createElement('div');
    left.className = 'control';
    left.innerText = `Move Left: A`;
    const right = document.createElement('div');
    right.className = 'control';
    right.innerText = `Move Right: D`;
    const jump = document.createElement('div');
    jump.className = 'control';
    jump.innerText = `Jump: Spacebar`;
    const changeWeapon = document.createElement('div');
    changeWeapon.className = 'control';
    changeWeapon.innerText = `Change Weapon: E`;

    const attack1 = document.createElement('div');
    attack1.className = 'control';
    attack1.innerText = `Sword Attack 1: Left Click`;
    const attack2 = document.createElement('div');
    attack2.className = 'control';
    attack2.innerText = `Sword Attack 2: Right Click`;
    const down = document.createElement('div');
    down.className = 'control';
    down.innerText = `Downward Sword Attack: S + Left Click (while in air)`;

    const bowAttack = document.createElement('div');
    bowAttack.className = 'control';
    bowAttack.innerText = `Shoot Bow: Left Click (Hold and Release)`;

    container.appendChild(left);
    container.appendChild(right);
    container.appendChild(jump);
    container.appendChild(changeWeapon);
    container.appendChild(attack1);
    container.appendChild(attack2);
    container.appendChild(down);
    container.appendChild(bowAttack);

    return container;
}

const attributionContent = () => {
    const container = document.createElement('div');

    const p1 = document.createElement('p');

    const text = `<p>Created by: Brendan Richards</p>
    <p>Suggestions from: Rachel Gelfand, Austin Harris</p>

    <p>Background image modified from: <a target="_blank" href="https://edermunizz.itch.io/pixel-art-snowy-forest">https://edermunizz.itch.io/pixel-art-snowy-forest</a></p>
    
    <p>Level Terrain modified from: <a target="_blank" href="https://opengameart.org/content/minimalist-pixel-tileset">https://opengameart.org/content/minimalist-pixel-tileset</a></p>
    
    <p>character assets modified from: <a target="_blank" href="https://rvros.itch.io/animated-pixel-hero">https://rvros.itch.io/animated-pixel-hero</a></p>
    
    <p>Sound effects obtained from:</p>
    <p><a target="_blank" href="https://www.zapsplat.com">https://www.zapsplat.com</a></p>
    <p><a target="_blank" href="https://freesound.org/people/berglindsi/sounds/402977">https://freesound.org/people/berglindsi/sounds/402977</a></p>
    <p><a target="_blank" href="https://freesound.org/people/Dymewiz/sounds/114388">https://freesound.org/people/Dymewiz/sounds/114388</a></p>
    <p><a target="_blank" href="https://freesound.org/people/EverHeat/sounds/205563">https://freesound.org/people/EverHeat/sounds/205563</a></p>
    <p><a target="_blank" href="https://freesound.org/people/DaleT92/sounds/207806">https://freesound.org/people/DaleT92/sounds/207806</a></p>
    <p><a target="_blank" href="https://freesound.org/people/cmusounddesign/sounds/119878">https://freesound.org/people/cmusounddesign/sounds/119878</a></p>
    <p><a target="_blank" href="https://freesound.org/people/Aris621/sounds/435238">https://freesound.org/people/Aris621/sounds/435238</a></p>
    `;

    p1.innerHTML = text;

    return p1;
}

const getButtons = () => {
    const aboutButton = document.createElement('button');
    aboutButton.className = 'tablink';
    aboutButton.textContent = 'About';
    aboutButton.id = 'defaultOpen';
    aboutButton.addEventListener('click', () => {
        openPage('about', aboutButton, '#F1F1F1');
    });

    const controlsButton = document.createElement('button');
    controlsButton.className = 'tablink';
    controlsButton.textContent = 'Controls';
    controlsButton.addEventListener('click', () => {
        openPage('controls', controlsButton, '#F1F1F1');
    });

    const attributionButton = document.createElement('button');
    attributionButton.className = 'tablink';
    attributionButton.textContent = 'Credits';
    attributionButton.addEventListener('click', () => {
        openPage('attribution', attributionButton, '#F1F1F1');
    });

    return {aboutButton: aboutButton, controlsButton: controlsButton, attributionButton: attributionButton};
}

const getDivs = () => {
    const aboutDiv = document.createElement('div');
    aboutDiv.className = 'tabcontent';
    // aboutDiv.innerHTML = '<h3>about content</h3>';
    aboutDiv.id = 'about';
  
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'tabcontent';
    // controlsDiv.innerHTML = '<h3>controls content</h3>';
    controlsDiv.id = 'controls';

    const attributionDiv = document.createElement('div');
    attributionDiv.className = 'tabcontent';
    // attributionDiv.innerHTML = '<h3>attribution content</h3>';
    attributionDiv.id = 'attribution';

    return {aboutDiv: aboutDiv, controlsDiv: controlsDiv, attributionDiv: attributionDiv};
}

export default placeInformation;