/**
 * Display the average amount of amplitude across a range
 * of frequencies using the p5.FFT class and its methods analyze()
 * and logAverages().
 * 
 * This example divides the frequency spectrum into the first 11 octave bands.
 * https://courses.physics.illinois.edu/phys193/labs/octave_bands.pdf
 */

var soundFile;
var soundFileMap = {};
var fft;

var description = 'loading';
var p;
var barsNumber;
var octaveBands;
var button;
var currentFft;

var SPIN_LEFT = -360;
var SPIN_RIGHT = 360;
var LEFT = -90;
var RIGHT = 90;
var UP = 180;
var DOWN = -180;
var sampling_count = 0;
var predict_mode = 0;
var send_commands_to_robot = 0;
var sampling_rate = 30;

var hits = 0;
var misses = 0;

jQuery.support.cors = true;

// save this file as sketch.js
// Sketch One
var s = function( p5o ) { // p could be any variable name
  p5o.changeSong = function(songTitle) {
    if (soundFile.isPlaying()){
      soundFile.stop();
    }
    soundFile = soundFileMap[songTitle];
  };
   p5o.preload = function() {
    p5o.soundFormats('mp3', 'ogg');
    soundFileMap["IceIceBaby.m4a"] = p5o.loadSound('IceIceBaby.m4a');
    soundFileMap["YouShookMeAllNightLong.m4a"] = p5o.loadSound('YouShookMeAllNightLong.m4a');
    soundFileMap["UptownFunk.m4a"] = p5o.loadSound('UptownFunk.m4a');
    soundFileMap["HighRatedGabruRemix.m4a"] = p5o.loadSound('HighRatedGabruRemix.m4a');
    soundFile = soundFileMap["YouShookMeAllNightLong.m4a"];
  };
   p5o.setup = function() {
    var canvas = p5o.createCanvas(500, 240); 
    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch-holder');
    p5o.fill(255, 40, 255);
    p5o.noStroke();
    p5o.textAlign(p5.CENTER);
  
    button = p5o.createImg('images/playpause.png');
    button.size(50,50)
    button.position(380, 80);
    button.mousePressed(playpause);
  
    fft = new p5.FFT();
  
    p = p5o.createP(description);
    p.parent('sketch-holder');
  
    octaveBands = fft.getOctaveBands(1);
    barsNumber = octaveBands.length;
    
  };
  p5o.draw = function() {
    sampling_count += 1;
    p5o.background(30,20,30);
    updateDescription(p5o);
  
    fft.analyze(); // analyze before calling fft.logAverages()
    var groupedFrequencies = fft.logAverages(octaveBands);
    
    if (soundFile.isPlaying()){
      setCurrentFFT(groupedFrequencies);
  
      if (predict_mode > 0  && sampling_count > sampling_rate) {
        // now predict move
        predict(currentFft);
        sampling_count = 0;
      }
    }
    
    // Generate the bars to represent the different frequency averages per group
    for (var i = 0; i < barsNumber; i++){
      p5o.noStroke();
      p5o.fill((i * 30) % 100 + 50, 195, ((i * 25) + 50) % 255);
  
      // Rectangle height represents the average value of this frequency range
      var h = -p5o.height + p5o.map(groupedFrequencies[i], 0, 255, p5o.height, 0);
      p5o.rect(((i+1) * p5o.width / barsNumber) - p5o.width/barsNumber, p5o.height, p5o.width/barsNumber, h);
  
      p5o.fill(255);
      var loFreq = octaveBands[i].lo;
      var hiFreq = octaveBands[i].hi;
      var labelLoFreq = loFreq.toFixed(0);
      var labelhiFreq = hiFreq.toFixed(0);
      var labelUnit = 'Hz';
      if (labelhiFreq > 1000) {
        labelLoFreq = (loFreq/1000).toFixed(1);
        labelhiFreq = (hiFreq/1000).toFixed(1);
        labelUnit = 'kHz';
      }
      p5o.text('<' 
          + labelhiFreq+labelUnit, (i+1) * p5o.width / barsNumber - p5o.width / barsNumber / 2, 30);
    }
  }
  // Change description text if the song is loading, playing or paused
  updateDescription = function (p5o) {
  if (!soundFile.isPlaying()) {
    description = 'Paused...';
    p.html(description);
  }
  else if (soundFile.isPlaying()){
    description = 'Playing!';
    p.html(description);
  }
  else {
    for (var i = 0; i < frameCount%3; i++ ) {

      // add periods to loading to create a fun loading bar effect
      if (frameCount%4 == 0){
        description += '.';
      }
      if (frameCount%25 == 0) {
        description = 'loading';

      }
    }
    p.html(description);
  }
}

};

var myp5 = new p5(s, 'sketch-holder');


var lines = [{x1:190,y1:100,x2:190,y2:100, spin:0}];

var mllines = [{x1:190,y1:100,x2:190,y2:100, spin:0}];

function resetLines() {
  $('#stepsBox').val('');
  $("#stepsBox").change();
  lines = [{x1:190,y1:100,x2:190,y2:100, spin:0}];
  predict_mode = 0;
}
function resetMLLines() {
  $('#fftBox').val('');
  hits = 0;
  misses = 0;
  mllines = [{x1:190,y1:100,x2:190,y2:100, spin:0}];
}
function addMove(x,y,spin) {
  var x1 = lines[lines.length-1].x2;
  var y1 = lines[lines.length-1].y2;
  var x2 = x1+x;
  var y2 = y1+y;
  line = {x1:x1, y1:y1, x2: x2, y2: y2, spin: spin};
  lines.push(line);
};

function addMLMove(x,y,spin) {
  var x1 = mllines[mllines.length-1].x2;
  var y1 = mllines[mllines.length-1].y2;
  var x2 = x1+x;
  var y2 = y1+y;
  mlline = {x1:x1, y1:y1, x2: x2, y2: y2, spin: spin};
  mllines.push(mlline);
};

// Sketch Dance moves
var ydmp5 = function( p ) { 

  p.setup = function() {
    p.createCanvas(380, 200);
  };

  p.draw = function() {
    p.background(100);
    p.fill(1);
    //lines = lines.slice((lines.length - 5), lines.length)
    for (var i = 0; i < lines.length; i ++) {
      if (lines[i].spin == 0) {
        if ((i+1) >= lines.length) {
          line_color = p.color(0, 0, 256);
        } else {
          line_color = p.color(0, 0, 0);
        }
        p.stroke(line_color);
        p.line(lines[i].x1 ,lines[i].y1, lines[i].x2, lines[i].y2);
      } else if (lines[i].spin == 1) {
        line_color = p.color(256, 0, 0);
        p.stroke(line_color);
        p.circle(lines[i].x1 ,lines[i].y1, 10);
      } else if (lines[i].spin == -1) {
        line_color = p.color(0, 256, 0);
        p.stroke(line_color);
        p.circle(lines[i].x1 ,lines[i].y1, 10);
      }
    }


  };

};
var myp6 = new p5(ydmp5, 'ydm');


// Sketch ML moves
var mldmp5 = function( p ) { 
  p.setup = function() {
    p.createCanvas(380, 200);
  };

  p.draw = function() {
    p.background(100);
    p.fill(1);
    for (var i = 0; i < mllines.length; i ++) {
      if (mllines[i].spin == 0) {
        if ((i+1) >= mllines.length) {
          line_color = p.color(0, 0, 200);
        } else {
          line_color = p.color(0, 0, 0);
        }
        p.stroke(line_color);
        p.line(mllines[i].x1 ,mllines[i].y1, mllines[i].x2, mllines[i].y2);
      } else if (mllines[i].spin == 1) {
        line_color = p.color(256, 0, 0);
        p.stroke(line_color);
        p.circle(mllines[i].x1 ,mllines[i].y1, 10);
      } else if (mllines[i].spin == -1) {
        line_color = p.color(0, 256, 0);
        p.stroke(line_color);
        p.circle(mllines[i].x1 ,mllines[i].y1, 10);
      }
    }


  };
};
var myp7 = new p5(mldmp5, 'mldm');

function playpause() {
  if (soundFile.isPlaying()){
    soundFile.pause();
  } else {
    soundFile.play();
  }
}

function getcurrentfft() {
  if (soundFile.isPlaying()){
    return currentFft;
  } else {
    return '';
  }
}

function setCurrentFFT(groupedFrequencies) {

  currentFft = ''; //getCurrentTimeOfSound();
   for (var i = 0; i < groupedFrequencies.length; i++) {
    currentFft += groupedFrequencies[i].toFixed(3);
    if (i+1 < groupedFrequencies.length) {
      currentFft += "," ;
    }
   }
}


// Helper function for drawing the group ranges
function calcFreqFromIndex(index) {
  var nyquist = sampleRate() / 2;
  var indexFrequency = Math.round((index * nyquist) / fft.bins);

  return (indexFrequency);
}

function predict(csv) {
  csv = csv.replace(/\r\n/gi, '\\u0A');
  $.ajax({
    url: URL_TRACKING_DEFAULT + '/predict?'+ jQuery.param({ experimentName: $('#experimentid').val()}),
    type: 'post',
    crossDomain: true,
    data: csv,
    success: function( data){
      var array = JSON.parse(data);
      doMove(array[0]);
    }
});
}


function send_to_robot(robot_move) {
  robot_url = URL_DANCEAPI_DEFAULT + '/camel/move/';
  robot_url += robot_move + '?';
  robot_url +=  jQuery.param({ P_NAME: $('#robot_name').val(), P_SPEED: $('#speed').val(), P_TURN_SPEED: $('#turnspeed').val(), P_DELAY: $('#delayms').val()} );
  $.ajax({
    url: robot_url ,
    type: 'post',
    crossDomain: true,
    success: function( data){
      console.log(data);
    }
});
}

function doMove(value) {
  if (value < SPIN_LEFT*0.7 && value > SPIN_LEFT*1.3) {
    hits = hits + 1;
    doMoveInBoundary("spinleft");
  } else 
  if (value > SPIN_RIGHT*0.7 && value < SPIN_RIGHT*1.3) {
    hits = hits + 1;
    doMoveInBoundary("spinright");
  } else
  if (value > RIGHT*0.7 && value < RIGHT*1.3) {
    hits = hits + 1;
    doMoveInBoundary("right");
  } else 
  if (value < LEFT*0.7 && value > LEFT*1.3) {
    hits = hits + 1;
    doMoveInBoundary("left");
  } else
  if (value < DOWN*0.7 && value > DOWN*1.3) {
    hits = hits + 1;
    doMoveInBoundary("down");
  } else 
  if (value > UP*0.7 && value < UP*1.3) {
    hits = hits + 1;
    doMoveInBoundary("up");
  } else {
    misses = misses + 1;
  }
  updateHitsmisses();
}

function updateHitsmisses() {
  $("#hitsvalue").html(hits);
  $("#missesvalue").html(misses);
}

function doMoveInBoundary(value) {
  boundary_x1 = 85;
  boundary_x2 = 305;
  boundary_y1 = 0;
  boundary_y2 = 180;

  var curx = mllines[mllines.length-1].x2;
  var cury = mllines[mllines.length-1].y2;

  if (value == "spinleft") {
    addMLMove(0,0,-1);
    if (send_commands_to_robot > 0) {
      send_to_robot("spinleft");
    }
  }
  if (value == "spinright") {
    addMLMove(0,0,1);
    if (send_commands_to_robot > 0) {
      send_to_robot("spinright");
    }
  }
  if (value == "right") {
    if ((curx + 35) > boundary_x2) {
      doMoveInBoundary("left");
    } else {
      addMLMove(35,0,0);
      if (send_commands_to_robot > 0) {
        send_to_robot("right");
      }
    }
  }
  if (value == "left") {
    if ((curx - 35) < boundary_x1) {
      doMoveInBoundary("right");
    } else {
      addMLMove(-35,0,0);
      if (send_commands_to_robot > 0) {
        send_to_robot("left");
      }
    }
  }
  if (value == "down") {
    if ((cury + 35) > boundary_y2) {
      doMoveInBoundary("up");
    } else {
      addMLMove(0,35,0);
      if (send_commands_to_robot > 0) {
        send_to_robot("down");
      }
    }
  }
  if (value == "up") {
    if ((cury - 35) < boundary_y1) {
      doMoveInBoundary("down");
    } else {
      addMLMove(0,-35,0);
      if (send_commands_to_robot > 0) {
        send_to_robot("up");
      }
    }
  } 

}
function trainData() {
  var header = '"octave1","octave2","octave3","octave4","octave5","octave6","octave7","octave8","octave9","octave10","octave11","quality"\n';
  var csv = header + $('#stepsBox').val();
  csv = csv.replace(/\r\n/gi, '\\u0A');
  $.ajax({
    url: URL_TRACKING_DEFAULT + '/train?' + jQuery.param({ experimentName: $('#experimentid').val()}),
    type: 'post',
    crossDomain: true,
    data: csv,
    success: function( data, textStatus, jQxhr ){
       alert('Service has been trained with your dance moves!');
       predict_mode = 1;
    },
    error: function( jqXhr, textStatus, errorThrown ){
        alert( errorThrown );
    }
});
}

function loadModel() {
  $.ajax({
    url: URL_TRACKING_DEFAULT + '/loadmodel?' + jQuery.param({ experimentName: $('#experimentid').val()}),
    type: 'post',
    crossDomain: true,
    success: function( data, textStatus, jQxhr ){
       alert('Loaded model');
       predict_mode = 1;
    },
    error: function( jqXhr, textStatus, errorThrown ){
        alert( errorThrown );
    }
});
}

function saveModel() {
  $.ajax({
    url: URL_TRACKING_DEFAULT + '/savemodel',
    type: 'post',
    crossDomain: true,
    success: function( data, textStatus, jQxhr ){
       alert('Model saved');
    },
    error: function( jqXhr, textStatus, errorThrown ){
        alert( errorThrown );
    }
});
}

function getCurrentTimeOfSound() {
  return soundFile.currentTime().toFixed(3);
}

