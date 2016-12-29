'use strict';

function draw_logic(){
    // Draw sky gradient.
    var gradient = canvas_buffer.createLinearGradient(
      canvas_x,
      10,
      canvas_x,
      canvas_y
    );
    gradient.addColorStop(
      0,
      '#ccc'
    );
    gradient.addColorStop(
      1,
      '#003'
    );
    canvas_buffer.fillStyle = gradient;
    canvas_buffer.fillRect(
      0,
      0,
      canvas_width,
      canvas_y
    );

    // Precalculate stuff.
    var math = [
      canvas_width / 100,
      canvas_width / 45,
      canvas_x * .4,
      canvas_y * .4,
      canvas_x * 1.6,
      canvas_height / 100,
      canvas_x * .9,
      canvas_x * .7,
      canvas_height / 7,
    ];

    // Draw mountains with gradient fillstyle.
    var j = canvas_y * .25;
    var k = canvas_y * .3;
    var loop_counter = 2;
    var vertices = [];
    do{
        vertices.push({
          'type': 'moveTo',
          'x': [
            canvas_x,
            math[2],
            math[4],
          ][loop_counter],
          'y': [
            math[3],
            j,
            k,
          ][loop_counter],
        });
        vertices.push({
          'x': [
            canvas_x,
            math[2],
            math[4],
          ][loop_counter] + [
            math[6],
            math[7],
            math[6],
          ][loop_counter],
          'y': canvas_y,
        });
        vertices.push({
          'x': [
            canvas_x,
            0,
            math[4],
          ][loop_counter] - [
            math[7],
            math[7],
            math[6],
          ][loop_counter],
          'y': canvas_y,
        });
    }while(loop_counter--);
    canvas_draw_path(vertices);

    // Draw ground gradient.
    gradient = canvas_buffer.createLinearGradient(
      canvas_x,
      math[3],
      canvas_x,
      canvas_y * .65
    );
    gradient.addColorStop(
      0,
      '#eee'
    );
    gradient.addColorStop(
      1,
      '#730'
    );
    canvas_buffer.fillStyle = gradient;
    canvas_buffer.fill();

    // Draw tree trunks.
    canvas_buffer.fillStyle = '#930';
    for(var tree in trees){
        canvas_buffer.fillRect(
          canvas_width * trees[tree][0] - math[0] * 2,
          trees[tree][1],
          math[0] * trees[tree][2],
          math[0] * trees[tree][2]
        );
    }

    // Draw tree leaves.
    loop_counter = trees.length - 1;
    do{
        canvas_draw_path(
          [
            {
              'type': 'moveTo',
              'x': canvas_width * trees[loop_counter][0],
              'y': trees[loop_counter][1] - math[8] * trees[loop_counter][2],
            },
            {
              'x': canvas_width * trees[loop_counter][0] + math[1] * trees[loop_counter][2],
              'y': trees[loop_counter][1] + 1,
            },
            {
              'x': canvas_width * trees[loop_counter][0] - math[1] * trees[loop_counter][2],
              'y': trees[loop_counter][1] + 1,
            },
          ],
          {
            'fillStyle': trees[loop_counter][3],
          }
        );
    }while(loop_counter--);

    // Draw wreathe on top of closest tree.
    loop_counter = 1;
    do{
        canvas_draw_path(
          [
            {
              'endAngle': math_tau,
              'radius': canvas_height / (40 - 20 * loop_counter),
              'startAngle': 0,
              'type': 'arc',
              'x': canvas_width * trees[0][0],
              'y': trees[0][1] - math[8],
            },
          ],
          {
            'fillStyle': [
              trees[0][3],
              '#0d0',
            ][loop_counter],
          }
        );
    }while(loop_counter--);

    // Draw red ornaments on top of wreathe.
    canvas_buffer.fillStyle = '#f00';
    loop_counter = 7;
    do{
        canvas_draw_path(
          [
            {
              'endAngle': math_tau,
              'radius': math[5],
              'startAngle': 0,
              'type': 'arc',
              'x': canvas_width * trees[0][0] + math[5] * (
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
              'y': trees[0][1] - math[8] + math[5] * (
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
            },
          ]
        );
    }while(loop_counter--);

    canvas_buffer.fillStyle = '#fff';
    // Draw snowflakes.
    for(var snowflake in snowflakes){
        canvas_buffer.fillRect(
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
          'size': random_integer(2) + 3,
          'speed': random_integer(4),
          'x': random_integer(canvas_width),
          'y': 0,
        });
    }while(loop_counter--);

    for(var snowflake in snowflakes){
        if(snowflakes[snowflake]['y'] > canvas_height){
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

function resize_logic(){
    trees = [];

    var a = canvas_y * .75;
    var k = canvas_y * .35;
    var j = 0;

    // Create 300 trees.
    var loop_counter = 299;
    do{
        if(loop_counter > 200){
            j = random_integer(canvas_y * 1.1) + a;

        }else if(loop_counter > 10){
            j = random_integer(canvas_y * .7) + a;

        }else{
            j = random_integer(canvas_y * .2) + a;
        }

        trees.push([
          Math.random(),
          j,
          -(canvas_y / 2 - j) / k,
          '#' + random_integer(5)
            + (random_integer(5) + 4)
            + random_integer(5),
        ]);
    }while(loop_counter--);

    // Sort trees so closer trees are drawn on top.
    sort_property({
      'array': trees,
      'property': 2,
    });
}

var snowflakes = [];
var trees = [];

window.onload = function(){
    document.body.style.background = '#fff';

    canvas_init();
};
