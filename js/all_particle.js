
var SEPARATION = 50, AMOUNTX = 130, AMOUNTY = 35;

var container,
    camera, scene, renderer,
    raycaster,
    mouse,
    wave_pause = true,
    green_pause = true,
    PI2_wave = Math.PI * 5,
    firstLoad = true;

var programFill = function ( context ) {
	context.beginPath();
	context.arc( 0, 0, 3, 0, PI2_wave, true );
	context.fill();
};
var programStroke = function ( context ) {
	context.lineWidth = 0.025;
	context.beginPath();
	context.arc( 0, 0, 0.3, 0, PI2_wave, true );
	context.stroke();
};


var particles, particle, count = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var INTERSECTED;


// 	wave start 波浪開始

init();

function init() {

  	container = document.getElementById('canvasHeader');
	if(container) {
    	container.className += container.className ? ' waves' : 'waves';
	}

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 20000 );

	camera.position.set( 0.65, 400, 400 );
	
	scene = new THREE.Scene();

	particles = new Array();

	var PI2_wave = Math.PI * 2;
	var material = new THREE.SpriteCanvasMaterial( {
		color: 0xcccccc, 
		program: function ( context ) {
			context.beginPath();
			context.arc( .5, .5, .15, 0, PI2_wave, true );
			context.fill();
		}

	} );

	var i = 0;
	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
			particle = particles[ i ++ ] = new THREE.Sprite( material );
			particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
			particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) - 10 );
			scene.add( particle );
		}
	}

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
  
	renderer = new THREE.CanvasRenderer({alpha: true});
  renderer.setClearColor( 0xffffff, 1);  //canvas bg color
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {
	// console.log('wave');
	if(wave_pause) return;
	requestAnimationFrame( animate );
	render();
}

var radius = 1200;
var theta = 0;

function render() {
  
	raycaster.setFromCamera( mouse, camera );
	
	var i = 0;
	for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
		for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
			particle = particles[ i++ ];
			particle.position.y = ( Math.sin( ( ix + count ) * 0.5 ) * 20 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 20 );
			particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 2 ) * 4 + ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 4;
		}
	}
	renderer.render( scene, camera );
	count += 0.08;

}


// 	green start 綠色圈圈開始

var PI2 = Math.PI * 2;
var HALF_PI = Math.PI / 2;

var isTouch = 'ontouchstart' in window;
var isSafari =  !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

function Canvas(options) {
  options = _.clone(options || {});
  this.options = _.defaults(options, this.options);
  
  this.el = this.options.el;
  this.ctx = this.el.getContext('2d');
  
  this.dpr = window.devicePixelRatio || 1;
  this.updateDimensions();
  window.addEventListener('resize', this.updateDimensions.bind(this), false);
  this.resetTarget();
  
  this.setupParticles();
  this.loop();
}

Canvas.prototype.updateDimensions = function() {
  // console.log('grenn_resize');
  this.width = this.el.width = _.result(this.options, 'width') * this.dpr;
  this.height = this.el.height = _.result(this.options, 'height') * this.dpr;
  this.el.style.width = _.result(this.options, 'width') + 'px';
  this.el.style.height = _.result(this.options, 'height') + 'px';
}


// Reset to center when we mouse out
Canvas.prototype.resetTarget = function() {
	this.target = new Vector(this.width / 1.3, this.height /1.5);  //設定圓心位置
}



Canvas.prototype.setupParticles = function() {
  this.particles = [];
  var index = -1;
  var between = PI2 / this.options.count;
  while(++index < this.options.count) {
    var x;
    var y;
    var angle;
    var max = Math.max(this.width, this.height);
    
    angle = (index + 1) * between;
    
    x = Math.cos(angle) * max;
    x += this.width / 2;

    y = Math.sin(angle) * max;
    y += this.height / 2;
    
    var particle = new Particle({
      x: x,
      y: y,
      radius: this.options.radius,
      size: this.options.size,
      angle: angle,
      color: this.options.color
    });
    
    this.particles.push(particle);
  }
}

Canvas.prototype.findClosest = function() {
  var index = -1;
  var pointsLength = this.particles.length;

  while(++index < pointsLength) {
    var closestIndex = -1;
    this.particles[index].closest = [];
    
    while(++closestIndex < pointsLength) {
      var closest = this.particles[closestIndex];
      var distance = this.particles[index].position.distanceTo(closest.position);
      if(distance < this.options.maxDistance) {
        var vector = new Vector(closest.position.x, closest.position.y);
        vector.opacity = 1 - (distance / this.options.maxDistance);
        vector.distance = distance;
        this.particles[index].closest.push(vector);
      }
    }
  }
}

Canvas.prototype.loop = function() {
//   this.clear();
  if(isTouch || isSafari) {
	  this.ghost();
  } else {
	  this.ghostGradient();
  }    
  if(this.options.maxDistance > 0) {
	  this.findClosest();
  }    
  this.draw();

  if(green_pause) return;
  window.requestAnimationFrame(_.bind(this.loop,this));
}

Canvas.prototype.clear = function() {
  this.ctx.clearRect(0, 0 , this.width, this.height);
}

Canvas.prototype.ghost = function() {
  this.ctx.globalCompositeOperation = "source-over";
  this.ctx.rect(0, 0 , this.width, this.height);
  if(typeof this.options.background === 'string') {
	  this.ctx.fillStyle = "rgb(" + this.options.background + ")";
  } else  {
    this.ctx.fillStyle = "rgb(" + this.options.background[0] + ")";
  }
    
  this.ctx.fill();
}

Canvas.prototype.ghostGradient = function() {
  var gradient;
  
  if(typeof this.options.background === 'string') {
    this.ctx.fillStyle = 'rgb(' + this.options.background + ')';   
  } else {
	 	var gradient = this.ctx.createRadialGradient(this.width/2, this.height/2, 0, this.width/2, this.height/2, Math.max(this.width, this.height)/2);
    
    var length = this.options.background.length;
    for(var i = 0; i < length; i++){
      gradient.addColorStop((i+1) / length, 'rgb(' + this.options.background[i] + ')');
    }
    this.ctx.fillStyle = gradient;
  }
  
  this.ctx.globalOpacity = 0.1;
  this.ctx.globalCompositeOperation = "darken";
  this.ctx.fillRect(0, 0 , this.width, this.height);
}

// Draw
Canvas.prototype.draw = function() {
  var index = -1;
  var length = this.particles.length;
  while(++index < length) {
    var point = this.particles[index];
    var color = point.color || this.options.color;
    point.update(this.target, index);
    
    this.ctx.globalAlpha = 0.3;
    this.ctx.globalCompositeOperation = "lighten";
    this.ctx.fillStyle = 'rgb(' + color + ')';
    this.ctx.beginPath();
    this.ctx.arc(point.position.x, point.position.y, point.size, 0, PI2, false);
    this.ctx.closePath();
    this.ctx.fill();
    
    if(this.options.maxDistance > 0) {
	    this.drawLines(point, color);
    }
  }  
}

// Draw connecting lines
Canvas.prototype.drawLines = function (point, color) {
  color = color || this.options.color;
  var index = -1;
  var length = point.closest.length;
  this.ctx.globalAlpha = 0.2;
  this.ctx.globalCompositeOperation = "screen";
  this.ctx.lineCap = 'round';
  while(++index < length) {
    this.ctx.lineWidth = (point.size * 2) *  point.closest[index].opacity;
    this.ctx.strokeStyle = 'rgba(' + color + ', ' + point.closest[index].opacity + ')';
    this.ctx.beginPath();
    this.ctx.moveTo(point.position.x, point.position.y);
    this.ctx.lineTo(point.closest[index].x, point.closest[index].y);
    this.ctx.stroke();
  }
}

function Particle(options) {
  options = _.clone(options || {});
  this.options = _.defaults(options, this.options);
  
  this.position = this.shift = new Vector(this.options.x, this.options.y);
  
  this.speed = this.options.speed || 0.01 + Math.random() * 0.04;
  
  this.angle = this.options.angle || 0;
    
  if(this.options.color) {
    var color = this.options.color.split(',');
	  var colorIndex = -1;
    while(++colorIndex < 3) {      
      color[colorIndex] = Math.round(parseInt(color[colorIndex], 10) + (Math.random()*100)-50);
      
      // Clamp
      color[colorIndex] = Math.min(color[colorIndex], 255);
      color[colorIndex] = Math.max(color[colorIndex], 0);
    }
    this.color = color.join(', ');
  } 
  
  // Size
  this.options.size = this.options.size || 7;
  this.size = 1 + Math.random() * this.options.size;
  this.targetSize = this.options.targetSize || this.options.size;
  
  this.orbit = this.options.radius * 0.5 + (this.options.radius * 0.5 * Math.random());
}

Particle.prototype.update = function(target, index) {
  this.angle += this.speed;

  this.shift.x += (target.x - this.shift.x) * this.speed;
  this.shift.y += (target.y - this.shift.y) * this.speed;

  this.position.x = this.shift.x + Math.cos(index + this.angle) * this.orbit;
  this.position.y = this.shift.y + Math.sin(index + this.angle) * this.orbit;
  
  if(!isSafari) {
    this.size += (this.targetSize - this.size) * 0.03;

    if(Math.round(this.size) === Math.round(this.targetSize)) {
      this.targetSize = 1 + Math.random() * this.options.size;
    }
  }
}

function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector.prototype.distanceTo = function(vector, abs) {
  var distance = Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
  return abs || false ? Math.abs(distance) : distance;
};

var newc= new Canvas({
  el: document.getElementById('canvas'),
  count: 30,
  speed: 1.5,
  radius: 15,
  width: function() { return window.innerWidth; },
  height: function() { return window.innerHeight*1.2; },
  size: 35,
  color: '30, 180, 1',
  maxDistance: 160,
  background: ['100, 100, 100']
});

var scroll_val = 0,
    scrolling = false,
    bodyHeight = window.innerHeight,
    $introduce = $('.introduce'),
    $agenda = (window.innerWidth >= 1366 )? $('.trans_for_agenda'): $('.agenda'),
    intro_top = $introduce.offset().top,
    intro_bottom = $introduce.height(),
    agenda_end = $agenda.offset().top + $agenda.height();

window.addEventListener('scroll', onWindowScroll, false);
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('blur', onWindowBlur, false);
window.addEventListener('focus', onWindowFocus, false);

// console.log(indexCtrl.load);

function onWindowResize(e){
  e.preventDefault();
  bodyHeight = window.innerHeight;
  intro_top = $introduce.offset().top,
  intro_bottom = $introduce.height()+ intro_top,
  agenda_end = $agenda.offset().top + $agenda.height();
}

function onWindowBlur(e) {
  // console.log('blur',scroll_val);
  green_pause = true;
  wave_pause = true;
}

function onWindowFocus(e) {
  console.log('focus',scroll_val);
  $(window).scrollTop( scroll_val+.1 );
}

function onWindowScroll(e) {
  e.preventDefault();
  scroll_val = this.scrollY;
  intro_top = $introduce.offset().top;
  
  //切換fixed背景
  if( scroll_val >= intro_top + 50){
    // console.log('in');
    $('.fix').addClass('indexPass');
  } else{
    // console.log('out');
    // var half = window.innerHeight/2;
    
    // if( scroll_val > half && scroll_val < window.innerHeight) {
    //   $('.index').find('h2,p').css({opacity:half/scroll_val });
    //   $('.index').find('.wording').css({marginTop: (half- scroll_val)/2});
    // }
    $('.fix').removeClass('indexPass');
  }

  if(scrolling) return;
  scrolling = true;
  
  intro_bottom = $introduce.height()+ intro_top;
  agenda_end = $agenda.offset().top + $agenda.height();
  // console.log(intro_top, scroll_val);
  
  if( scroll_val >= intro_top && scroll_val < intro_bottom ) { 
      if(wave_pause){
          // console.log('wave start');
          green_pause = true;
          wave_pause = false;
          animate();
      }
	} else if ( scroll_val >= intro_bottom && scroll_val < agenda_end ){
      // console.log('green start');
      if(green_pause){
        wave_pause = true;
        green_pause = false;
        newc.loop();
      }
	} else {
      wave_pause = true;
      green_pause = true;
      console.log('none start');
  }
  setTimeout(function(){
    scrolling = false;
  },80)

}