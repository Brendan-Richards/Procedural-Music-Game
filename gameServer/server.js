const express = require('express');
const app = express();
const server = require('http').Server(app);
//var io = require('socket.io')(3000);
const io = require('socket.io')(server);
const foreground = require('./foreground/CreateForeground');

const players = {};
const playerQueue = [];
let numRooms = 0;
const rooms = {};

app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected, adding to player list...');
    players[socket.id] = {status: 'startScreen'};

    socket.on('removeAttackBoxes', () => {
      io.to(players[socket.id].opponent).emit('removeAttackBoxes');        
    });
    socket.on('bloodAnimation', data => {
      io.to(players[socket.id].opponent).emit('bloodAnimation', data);
    });
    socket.on('playerSound', soundData => {
      io.to(players[socket.id].opponent).emit('opponentSound', soundData);
    });
    socket.on('playerSoundStop', soundData => {
      io.to(players[socket.id].opponent).emit('opponentSoundStop', soundData);
    });    
    socket.on('playerRecoil', () => {
      io.to(players[socket.id].opponent).emit('opponentRecoil');        
    });
    socket.on('findMatch', () => {
      console.log('adding', socket.id, 'to the player queue');
      playerQueue.push(socket.id);

      //remove for deployment
      /////////////////////////////
      // players['dfsdf'] = {};
      // playerQueue.push('dfsdf');
      ///////////////////////////////

      while(playerQueue.length > 1){
        const player1 = playerQueue.shift();
        const player2 = playerQueue.shift();
        startMatch(player1, player2);
      }

      //console.log('players:', players);
    });

    // socket.on('disconnect', function () {
    //     console.log('user disconnected');
    //     delete players[socket.id];
    //     io.emit('dconnect', socket.id);
    // });
    socket.on('ping', () => {
      io.to(socket.id).emit('ping');
    });
    socket.on('playerNewAnimation', (animationData) => {
        players[socket.id]['currentAnimation'] = animationData.animation;
        players[socket.id]['flipX'] = animationData.flipX;
        players[socket.id]['playerFriction'] = animationData.friction;

        io.to(players[socket.id].opponent).emit('opponentAnimationUpdate', players[socket.id]);
        //socket.broadcast.emit('opponentAnimationUpdate', players[socket.id]);
        //console.log('players:', players);
    });
    socket.on('playerDamaged', damageAmount => {
      io.to(players[socket.id].opponent).emit('opponentDamaged', damageAmount);
    });
    socket.on('createArrow', (arrowData) => {
      io.to(players[socket.id].opponent).emit('createArrow', arrowData);
      //socket.broadcast.emit('createArrow', arrowData);
    });
    socket.on('createMagic', (magicData) => {
      io.to(players[socket.id].opponent).emit('createMagic', magicData);
      //socket.broadcast.emit('createMagic', magicData);
    });
    socket.on('playerMovementUpdate', (moveData) => {
        players[socket.id].x = moveData.x;
        players[socket.id].y = moveData.y;
        players[socket.id].vx = moveData.vx;
        players[socket.id].vy = moveData.vy;
        
        // {
        //     x: moveData.x,
        //     y: moveData.y,
        //     vx: moveData.vx,
        //     vy: moveData.vy    
        // }
        io.to(players[socket.id].opponent).emit('opponentMovementUpdate', players[socket.id]);
        //console.log('sending player movement data for: ', socket.id);
        //socket.broadcast.emit('opponentMovementUpdate', players[socket.id]);
    });
});

const startMatch = (player1, player2) => {
    console.log('starting match');
    const [tileMap, collisionPoints] = foreground.createTileMap();

    tileMap.collisionPoints = collisionPoints;
    // numRooms += 1;
    // rooms['game' + numRooms.toString()] = {player1: player1, player2: player2};

    players[player1]['status'] = 'inMatch';
    players[player2]['status'] = 'inMatch';

    players[player1].opponent= player2;
    players[player2].opponent = player1;
    // players[player1]['opponent'] = player2;
    // players[player2]['opponent'] = player1;

    const positions = getInitialPlayerPositions(tileMap);
    //console.log('player 1 position:', positions.player1Position);
    //console.log('player 2 position:', positions.player2Position);

    //send the players the tilemap
    io.to(player1).emit('matchFound', {tileMap: tileMap, playerPosition: positions.player1Position, opponentPosition: positions.player2Position});
    io.to(player2).emit('matchFound', {tileMap: tileMap, playerPosition: positions.player2Position, opponentPosition: positions.player1Position});
    console.log('sent tilemap');
}

const getInitialPlayerPositions = (tileMap) => {

    //console.log('finding player positions with:', tileMap);

    let player1Position = {};
    let x = 5;
    let y = 0;
    while(y < tileMap.height){
      if(tileMap.layers[0].data[idx(x, y, tileMap.width)]!==0){
        y -= 2;
        break;
      }
      y += 1
    }
    player1Position.x = x * tileMap.tilewidth;
    player1Position.y = y * tileMap.tileheight;

    //console.log('determined player 1 position:', player1Position);

    let player2Position = {};
    x = tileMap.width - 5;
    y = 0;
    while(y < tileMap.height){
      if(tileMap.layers[0].data[idx(x, y, tileMap.width)]!==0){
        y -= 2;
        break;
      }
      y += 1
    }
    player2Position.x = x * tileMap.tilewidth;
    player2Position.y = y * tileMap.tileheight;
    // player2Position.x = player1Position.x + 50;
    // player2Position.y = player1Position.y;


    //console.log('determined player 2 position:', player2Position);

    return {player1Position: player1Position, player2Position: player2Position};
}

const idx = (x, y, width) => {
  return width * y + x;
}
 
server.listen(80, function () {
  console.log(`Listening on ${server.address().port}`);
});




//emit: disconnect, playerMovementUpdate