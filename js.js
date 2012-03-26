
var maxRadius,
distans,
ballsArr = [],
FPS = 50,
numBalls = 20,
speed = 4,
_current = 0,
_cur_color = 0,
velocity = 1,
turbo = 1,
keys = [],
patterns = [],
isConnected = false,
isRemovable = false,
infoUI = null,
statsUI = null,
notUi = null,
letters = {},
timeStart,
_scores,
_time,
aLoop,
startImg,
startInterval,
fontImg,
_txtC, _txtCtx,
scroffset = 0;



var Ball = function(_x, _y, _r, _vx, _vy, _alpha, _c){
    this.x = _x; 
    this.y = _y; 
    this.vx = _vx; 
    this.vy = _vy; 
    this.r = _r;
    this.alpha = _alpha;
    this.c = _c;
    this.t = new Date().getTime(); 
    this.move = function(){
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
    }
}

var player = {
    x: 0,
    y: 0,
    img: null,
    size: 16,
    vx :6, // speedX
    vy :3, // speedY
    dx: 3, //velX
    dy: -3, //velY
    angle: 0,
    dist: 0
}


$(document).ready(function() {
    width = $(document).width();
    height = $(document).height();
    _scores = 0;
    loadPatterns();
    
    c = $('#area').get(0);
    ctx = c.getContext('2d');
    c.width = width;
    c.height = height;
    maxRadius = ~~(width * 0.04);
    player.dist = ~~((width * height) / 4000); //5734);
    FPS = 1000/FPS;
    
    infoUI = $('#info');
    statsUI = $('#stats');
    notUi = $('#notification');
    
    playerImg = new Image();
    playerImg.src = "assets/player_.png";
    player.img = playerImg;
    player.x = ~~(Math.random()*width);
    player.y = ~~(Math.random()*height);
    player.dx = Math.decimal((Math.random()*player.vx)-(player.vx/2));
    player.dy = Math.decimal((Math.random()*player.vy)-(player.vy/2));
    if(player.dx > -0.5 && player.dx < 0.5) player.dx = 1;
    if(player.dy > -0.5 && player.dy < 0.5) player.dy = -1;
    //_debug("player.dx: "+player.dx+" | player.dy: "+player.dy);
    
    $('#debug-btn').click(function(){
        $('#debug-window').toggle();
    });  
    
    
    fontImg = new Image();
    fontImg.src = 'assets/32x32_font.png';
    
    
    startImg = new Image();
    startImg.onload = function() {
        frontScreen();
    }
    startImg.src = 'assets/startscreen.jpg';
    
    
//    frontScreen();
   
    
})

var startGame = function(){
    $(document).bind('keydown', keyDownHandler);
    $(document).bind('keyup', keyUpHandler);
    
    
    // ---------------------------
    drawBg();
    initBalls();
    drawBalls();
    drawPlayer();
    drawCurrent();
    
    ballsArr[_current].t = new Date().getTime();
    
    animeLoop();
}




var clearCanvas = function(){
    ctx.clearRect(0, 0, width, height);
}


var loadPatterns = function(){
    for (var i = 0; i < 10; i++) {
        patterns[i] = new Image();
        patterns[i].src = 'assets/npattern0'+i+'.png';
    }
}

var drawBg = function(){
    
}

var keyDownHandler = function(evt){
    // console.log(evt.which);
    keys[evt.which] = true;
    
    //37 - left
    //38 - up
    //39 - right
    //40 - down
    
    

    if (keys[17]) {//37
        turbo = 5;
    } else {
        turbo = 1;
    }

    if (keys[88]) {//88
        velocity = 5 * turbo;
    } else if (keys[67]) {//67
        velocity = -5 * turbo;
    }
    
    
    if (keys[32]) {//17
        killBall(distans);
    }


    
}


var keyUpHandler = function(evt){
    delete keys[evt.which];
    
    if (keys[17] != true) {
        turbo = 1;
    }
    
    if (keys[88] != true) {
        velocity = 1;
    } else if (keys[67] != true) {
        velocity = -1;
    }
}


var initBalls = function(){
    for (var i = 0; i < numBalls; i++) {
        createBall(i);
    }
    timeStart = new Date().getTime();
}

var createBall = function(_i){
    var x = Math.random()*(width - (2 * maxRadius))+maxRadius;
    var y = Math.random()*(height - (2 * maxRadius))+ maxRadius;
    var r = (Math.random()*maxRadius) + 20;
    var vx = (Math.random() * speed) - (speed/2);
    var vy = (Math.random() * speed) - (speed/2);
    var alpha = (Math.random() * 0.7)+0.2;
    var c = ~~(Math.random()*10);
    var _ball = new Ball(x, y, r, vx, vy, alpha, c);
    ballsArr[_i] = _ball;
}

var drawBalls = function(){
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    for (var i = 0; i < numBalls; i++) {
        var ptrn = ctx.createPattern(patterns[ballsArr[i].c],'repeat');
        ctx.fillStyle = ptrn;
        ctx.save();
        ctx.translate(ballsArr[i].x, ballsArr[i].y);
        ctx.rotate(ballsArr[i].x * (Math.PI/180));
        ctx.beginPath();
        ctx.arc(0, 0, ballsArr[i].r, 0, Math.PI *2, true);
		ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

var moveBalls = function(){
    var l = ballsArr.length;
    for (var  i = 0;  i < l;  i++) {
        var _this = ballsArr[i];
        _this.move(velocity);
        
        if (_this.y + _this.r >= height || _this.y - _this.r <= 0) {
            _this.vy *= -1;
        }
        if (_this.x + _this.r >= width || _this.x - _this.r <= 0) {
            _this.vx *= -1;
        }
        if (_this.x - _this.r < 0) {
            _this.x = _this.r;
        }
        if (_this.y - _this.r < 0) {
            _this.y = _this.r;
        }
        if (_this.x + _this.r > width) {
            _this.x = width - _this.r;
        }
        if (_this.y + _this.r > height) {
            _this.y = height - _this.r;
        }
    }
    
    player.x = player.x + (velocity * player.dx);
    player.y = player.y + (velocity * player.dy);
    
    if (player.x + player.size > width || player.x  < 0) {
        player.dx = - player.dx;
    }
    if (player.y + player.size > height || player.y < 0) {
        player.dy = -player.dy;
    }
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.size > width) player.x = width - player.size;
    if (player.y + player.size > height) player.y = height - player.size;
}
    
var drawPlayer = function(){
  
    if ((player.dx < 0 && player.dy > 0) || (player.dx < 0 && player.dy < 0)) {
        player.angle -= 10 ;
    } else {
        player.angle += 10 ;
    }
   
    ctx.save();
    ctx.translate(player.x  + (player.size / 2), player.y + (player.size / 2));
    ctx.rotate(player.angle * (Math.PI/180));
    ctx.drawImage(player.img, -player.img.width/2, -player.img.height / 2);
    ctx.restore();
}    
    
var drawConnectionLine = function(){
    var _this = ballsArr[_current];

    distans = Math.sqrt(Math.pow((parseInt(_this.x) - (player.x + player.size/2)),2)+Math.pow((parseInt(_this.y) - (player.y + player.size/2)),2));
    
    infoUI.html(Math.decimal(distans, 1));
    
    if (distans < player.dist) {
        
        var _r = (1 - distans/player.dist) * 4;
        isConnected = true;
        if(distans <= _this.r){
            ctx.strokeStyle = "rgba(255, 255, 255," + (1 - distans/player.dist) + " )";
            ctx.fillStyle = "rgba(255, 255, 255," + (1 - distans/player.dist) + " )";
            isRemovable = true;
        } else {
            ctx.strokeStyle = "rgba(0, 0, 0," + (1 - distans/player.dist) + " )";
            ctx.fillStyle = 'rgba(0, 0, 0,' + (1 - distans/player.dist) + " )";
            isRemovable = false;
        }
        ctx.beginPath();  
        ctx.arc(player.x + (player.size/2), player.y + (player.size/2), _r, 0, Math.PI*2, true);
        ctx.arc(_this.x, _this.y, _r, 0, Math.PI*2, true);
        ctx.fill();
        ctx.closePath();
		ctx.beginPath();
        ctx.moveTo(~~(player.x+(player.size/2)),~~(player.y+(player.size/2)));  
        ctx.lineTo(~~(_this.x),~~(_this.y)); 
		ctx.stroke();  
		ctx.closePath();
    } else {
        isConnected = false;
        isRemovable = false;
    }
}
    
var drawHelper = function(){
    var l = {
        x1: player.x + (player.size/2),
        y1: player.y + (player.size/2),
        x2: player.x + player.dx + (player.size/2),
        y2: player.y + player.dy + (player.size/2)
    }
    
    var m = (l.y2 - l.y1)/(l.x2 - l.x1);
    var b = (-1 * m * l.x1) + l.y1;

    if (m < 0) {
        l.x1 = 0
        l.y1 = b;
        l.y2 = 0;
        l.x2 = -b/m;
    } else {
        l.x1 = 0;
        l.y1 = b;
        l.y2 = height;
        l.x2 = (l.y2 - b)/m;
    }
    ctx.strokeStyle = "rgba(0,0,0,0.2)";//"#000000";
    ctx.fillStyle = "#000000";
    ctx.beginPath();  
    ctx.moveTo(l.x1, l.y1);  
    ctx.lineTo(l.x2, l.y2); 
	ctx.stroke();  
    ctx.closePath();
   
}    

var drawCurrent = function(){
    var _this = ballsArr[_current];
    ctx.strokeStyle = 'hsla(' + _cur_color + ', 73%, 58%, 1)';  
    ctx.lineWidth = 5;
    ctx.beginPath();  
    ctx.arc(_this.x, _this.y, _this.r, 0, Math.PI*2,true);  
    ctx.closePath();
    ctx.stroke();  
    _cur_color++;
}

var killBall = function(_dist){
    if (isConnected && isRemovable) {
        var _t = Math.decimal((new Date().getTime() - ballsArr[_current].t)/1000, 2);
        var _d = Math.decimal(_dist, 1);
        
        if (ballsArr.length > 0) {
            var j = '<div class="note"> time: '+ _t +'s. distance: ' + _d + 'px.</div>';
            $(j).fadeTo(0, 0).prependTo(notUi).fadeTo(800, 1);
            if (_t < 0.4) {
                _t = 0.4;
            }
            _scores += Math.floor((2500/_t) + (500/_d));
            changeCurrent();
        }
    }
}

var changeCurrent = function(){
    if (ballsArr.length > 1) {
        var deadBall = ballsArr.shift();
        ballsArr[_current].t = new Date().getTime();
        numBalls = ballsArr.length;
    } else {
        clearInterval(aLoop);
        endGame();
    }
}


var drawStats = function(){
    _time = (new Date().getTime() - timeStart)/1000;
    var _txt = "balls: " + ballsArr.length + " | time: " + Math.decimal(_time, 1);
    if (isInteger(Math.decimal(_time, 1))) {
        _txt += '.0';
    }
    _txt += ' | score: ' + _scores;
    statsUI.html(_txt);
}


var animeLoop = function(){
    clearCanvas();
    moveBalls();
    drawBalls();
    drawPlayer();
	
    drawHelper();
   drawConnectionLine();
    drawCurrent();
    drawStats();
    
    aLoop = setTimeout(animeLoop, FPS);
}


var lObj = function(posX,ch){
    this.posX = posX;
    this.ch = ch;
    return this;
}


var frontScreen = function(){
    
    $(document).bind('keydown', clickHandler);
    
    var _x = (width - startImg.width)/2;
    var _y = (height - startImg.height)/2;
    
    ctx.save();
    ctx.translate(_x, _y);
    ctx.drawImage(startImg, 0, 0);
    ctx.restore();
    
    scrtxt="BALLSY GAME * CONTROLS: X,C - MOVE * X,C+CTRL - FAST MOVE * SPACE - REMOVE A BALL * WERDAN # 2011 * PRESS -ENTER- TO START * ";
 
    _txtC = document.createElement('canvas');
    _txtCtx = _txtC.getContext('2d');
    _txtC.width = startImg.width;
    _txtC.height = 32;
    _txtC.id = 'textCanvas';
    $('body').append(_txtC);
    $(_txtC).css({
        'position':'absolute',
        'left': _x,
        'top': _y + 700
    })
 
    for(var i=0; i<=33; i++) {
        letters[i] = new lObj();
        letters[i].posX = (33*32)+i*32;
        letters[i].ch = scrtxt.charCodeAt(scroffset);
        scroffset++;
    }
    startInterval = setInterval('goText()',9);
}

var goText = function(){
    ctx.save();
    ctx.translate((width - startImg.width)/2, (height - startImg.height)/2);
    ctx.drawImage(startImg, 0, 0);
    ctx.restore();
    
    _txtCtx.clearRect(0,0,_txtC.width, _txtC.height);
    
    var i;
    scrxpos=0;

    for(i=0; i<=33; i++){
        _txtCtx.drawImage(fontImg, ((letters[i].ch-32))*32, 0, 32, 32, letters[i].posX, 0, 32, 32);
        letters[i].posX -= 1;
        if(letters[i].posX <= -32){
            letters[i].posX = 33*32;
            letters[i].ch = scrtxt.charCodeAt(scroffset);
            scroffset++;
            if(scroffset > scrtxt.length-1)
                scroffset = 0;
        }
    }
}

var clickHandler = function(evt){
    if (evt.which == 13) {
        clearInterval(startInterval);
        $(document).unbind();
        $('#textCanvas').remove();
        startGame();
    }
}

var isInteger = function(x){
    if (x == Math.floor(x))
        return true;
    return false;
}

Math.decimal = function(n, k) {
    if (k === undefined) {
        k = 2;
    }
    var factor = Math.pow(10, k+1);
    n = Math.round(Math.round(n*factor)/10);
    return n/(factor/10);
}




var _debug = function(_t){
    $("#debug-window").append(_t + "<br/>");
}    

var endGame = function(){
    ctx.clearRect(0,0,width,height);
    $('#stats').empty();
    $('#info').empty();
    $('#notification').empty();
    $(document).unbind();
    var windowBody = "<div id='modal'><h2>GAME OVER</h2><div style='top:40px'>Score: " + Math.decimal(_scores,0) + "</div><div style='top:80px'>Time: " + Math.decimal(_time, 0) + "</div><div class='btn' style='top:190px'>AGAIN ?</div></div>";
    $('body').append(windowBody);
    $('.btn').click(function(evt){
        window.location.reload();
        return false;
    })
    
    
}





