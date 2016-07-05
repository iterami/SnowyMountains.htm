'use strict';

function draw_logic(){
    // Draw sky gradient.
    var gradient = buffer.createLinearGradient(
      x,
      10,
      x,
      y
    );
    gradient.addColorStop(
      0,
      '#ccc'
    );
    gradient.addColorStop(
      1,
      '#003'
    );
    buffer.fillStyle = gradient;
    buffer.fillRect(
      0,
      0,
      width,
      y
    );

    // Precalculate stuff.
    var math = [
      width / 100,
      width / 45,
      x * .4,
      y * .4,
      x * 1.6,
      height / 100,
      x * .9,
      x * .7,
      height / 7,
    ];

    // Draw mountains with gradient fillstyle.
    var j = y * .25;
    var k = y * .3;
    buffer.beginPath();
    var loop_counter = 2;
    do{
        buffer.moveTo(
          [
            x,
            math[2],
            math[4],
          ][loop_counter],
          [
            math[3],
            j,
            k,
          ][loop_counter]
        );
        buffer.lineTo(
          (
            [
              x,
              math[2],
              math[4],
            ][loop_counter]) + ([
              math[6],
              math[7],
              math[6],
            ][loop_counter]
          ),
          y
        );
        buffer.lineTo(
          (
            [
              x,
              0,
              math[4],
            ][loop_counter]) - ([
              math[7],
              math[7],
              math[6],
            ][loop_counter]
          ),
          y
        );
    }while(loop_counter--);
    buffer.closePath();

    // Draw ground gradient.
    gradient = buffer.createLinearGradient(
      x,
      math[3],
      x,
      y * .65
    );
    gradient.addColorStop(
      0,
      '#eee'
    );
    gradient.addColorStop(
      1,
      '#730'
    );
    buffer.fillStyle = gradient;
    buffer.fill();

    // Draw tree trunks.
    buffer.fillStyle = '#930';
    for(var tree in trees){
        buffer.fillRect(
          width * trees[tree][0] - math[0] * 2,
          trees[tree][1],
          math[0] * trees[tree][2],
          math[0] * trees[tree][2]
        );
    }

    // Draw tree leaves.
    loop_counter = trees.length - 1;
    do{
        buffer.beginPath();
        buffer.moveTo(
          width * trees[loop_counter][0],
          trees[loop_counter][1] - math[8] * trees[loop_counter][2]
        );
        buffer.lineTo(
          width * trees[loop_counter][0] + math[1] * trees[loop_counter][2],
          trees[loop_counter][1] + 1
        );
        buffer.lineTo(
          width * trees[loop_counter][0] - math[1] * trees[loop_counter][2],
          trees[loop_counter][1] + 1
        );
        buffer.closePath();
        buffer.fillStyle = trees[loop_counter][3];
        buffer.fill();
    }while(loop_counter--);

    // Draw wreathe on top of closest tree.
    loop_counter = 1;
    do{
        buffer.fillStyle = [
          trees[0][3],
          '#0d0',
        ][loop_counter];
        buffer.beginPath();
        buffer.arc(
          width * trees[0][0],
          trees[0][1] - math[8],
          height / (40 - 20 * loop_counter),
          0,
          tau,
          false
        );
        buffer.closePath();
        buffer.fill();
    }while(loop_counter--);

    // Draw red ornaments on top of wreathe.
    buffer.fillStyle = '#f00';
    loop_counter = 7;
    do{
        buffer.beginPath();
        buffer.arc(
          width * trees[0][0] + math[5] * (
            [
              -3.7,
              -2.7,
              0,
              2.7,
              3.7,
              2.7,
              0,
              -2.7,
            ][loop_counter]
          ),
          trees[0][1] - math[8] + math[5] * (
            [
              0,
              -2.7,
              -3.7,
              -2.7,
              0,
              2.7,
              3.7,
              2.7,
            ][loop_counter]
          ),
          math[5],
          0,
          tau,
          false
        );
        buffer.closePath();
        buffer.fill();
    }while(loop_counter--);

    buffer.fillStyle = '#fff';
    // Draw snowflakes.
    for(var snowflake in snowflakes){
        buffer.fillRect(
          snowflakes[snowflake]['x'],
          snowflakes[snowflake]['y'],
          snowflakes[snowflake]['size'],
          snowflakes[snowflake]['size']
        );
    }
}

function logic(){
    // Add 2 snowflakes.
    var loop_counter = 1;
    do{
        snowflakes.push({
          'size': random_number(2) + 3,
          'speed': random_number(4),
          'x': random_number(width),
          'y': 0,
        });
    }while(loop_counter--);

    for(var snowflake in snowflakes){
        if(snowflakes[snowflake]['y'] > height){
            // Remove snowflake that reached bottom of screen.
            snowflakes.splice(
              snowflake,
              1
            );

        }else{
            // Update snowflake position.
            snowflakes[snowflake]['x'] += Math.random() * 2 - 1;
            snowflakes[snowflake]['y'] += Math.random() * 4 + snowflakes[snowflake]['speed'];
        }
    }
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function resize_logic(){
    trees = [];

    var a = y * .75;
    var k = y * .35;
    var j = 0;

    // Create 300 trees.
    var loop_counter = 299;
    do{
        if(loop_counter > 200){
            j = random_number(y * 1.1) + a;

        }else if(loop_counter > 10){
            j = random_number(y * .7) + a;

        }else{
            j = random_number(y * .2) + a;
        }

        trees.push([
          Math.random(),
          j,
          -(y / 2 - j) / k,
          '#' + random_number(5)
            + (random_number(5) + 4)
            + random_number(5),
        ]);
    }while(loop_counter--);

    // Sort trees so closer trees are drawn on top.
    trees.sort(function(i, n){
        return parseFloat(n[2]) - parseFloat(i[2]);
    });
}

var snowflakes = [];
var tau = Math.PI * 2;
var trees = [];

window.onload = function(){
    document.body.style.background = '#fff';

    init_canvas();
};
