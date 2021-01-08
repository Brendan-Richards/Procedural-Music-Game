const Bot = {

    io: null,
    playerId: -1,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    playerHealth: 100,
    opponentHealth: 100,
    lastWallCollisionDirection: null,
    allowSound: true,
    matchEnded: false,
    magicDamageAmount: 40,
    arrowDamageAmount: 25,
    swordDamageAmount: 50,
    opponent: null,
    swordRecoil: 20,
    recoilDuration: 40,
    bothAttacking: false,
    maxArrows: 10,
    playerArrows: [],
    opponentArrows: [],
    inContactWithGround: true,
    lastGroundCollision: -1,
    lastWallCollision: -1,
    noFrictionWindow: 250,
    playerAttackBox: null,
    opponentAttackBox: null,
    currentOpponentAnimation: 'idle',
    currentOpponentDirection: 'right',
    lastSwordDamageTime: -1,
    trees: [],

 //set up player
    wallTolerance: 30,
    playerScaleFactor: 1,
    playerSpeed: 3.5,
    playerJumpHeight: 10,
    playerWallJumpHeight: -2*this.playerSpeed,
    playerFriction: 0,
    playerMaxSpeed: 7,
    ledgePosition: {},
    playerLastOnWallTime: -1,
    lastAttackTime: -1,
    attackStaminaPenalty: 10,
    attackReboundDistance: 15,
    minTimeBetweenWeaponChanges: 300, // in milliseconds
    lastWeaponChangeTime: 0,
    prevSwordSwing: '',
    prevMeeleeAttack: '',
    swordAttacks: ['idleSwing1', 'idleSwing2', 'runSwing', 'airSwing1', 'airSwing2', 'wallSwing'],
    bowAttacks: ['idleNotch', 'idleHoldLoop', 'idleRelease', 'runNotch', 'runHoldLoop', 'runRelease', 'jumpNotch', 'jumpHoldLoop', 'jumpRelease', 'fallNotch', 'fallHoldLoop', 'fallRelease'],
    meeleeAttacks: ['punch1', 'punch2', 'punch3', 'runPunch', 'groundKick', 'airKick'],
    magicAttacks: ['idleCastRed','runCastRed','jumpCastRed','fallCastRed','wallSlideCastRed','idleCastBlue','runCastBlue','jumpCastBlue','fallCastBlue','wallSlideCastBlue'],
    casts: ['idleCastRed','runCastRed','jumpCastRed','fallCastRed','wallSlideCastRed','idleCastBlue','runCastBlue','jumpCastBlue','fallCastBlue','wallSlideCastBlue'],
    equippedWeapon: 'sword',
    prevEquippedWeapon: '',
    weaponsFound: ['none', 'sword', 'bow', 'glove'],
    weaponsFound: ['sword', 'bow'],
    arrowSpeed: 9,
    magicSpeed: 7,
    mana: 100,
    madeMagic: false,
    magicType: 'red',
    arrowScale: 0.6,


    //flags
    playerCanJump: true,
    CTRLDown: false,
    setFlatSlide: false,
    playerRampSliding: false,
    playerFlatSliding: false,
    playerWallSliding: false,
    playerWallJumping: false,
    playerLedgeGrab: false,
    playerIceWallSliding: false,
    playerLedgeClimb: false,
    resetWallSlide: false,
    staminaActive: false,
    playerAttacking: false,
    inContactWithWall: false,
    downAttack: false,
    swordCollided: false,
    changedWeapon: false,
    playerKick: false,
    bowRelease: false,
    heavyAttack: false,
    stopCasting: false,
    holdingCast: false,
    bowKick: false,
    wallCollisionDirection: '',

     //movement logic
    flatSlideStartTime: -1,
    playerLastOnGroundTime: -1,
    playerGroundSlideDirection: '',
    wallJumpOffPosition: {x:0, y:0},
    prevJumpTime: -1,
    stopWallSlidingPosition: {x:0, y:0},
    stopWallSlidingDirection: '',
    currentPlayerAnimation: 'idle1',
    prevPlayerAnimation: '',
    currentPlayerDirection: 'right',
    prevPlayerDirection: '',
    lastLandingTime: -1,

    controlConfig: {
        leftControl: {
            isDown: false,
            isUp: true
        },
        rightControl: {
            isDown: false,
            isUp: true
        },
        downControl: {
            isDown: false,
            isUp: true
        },
        jumpControl: {
            isDown: false,
            isUp: true,
            timeDown: -1
        },
        attack: {
            isDown: false,
            isUp: true
        }
    }
        


};

exports.Bot = Bot;