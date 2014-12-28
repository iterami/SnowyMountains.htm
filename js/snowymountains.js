function create_snowflake(){
    snowflakes.push([
      random_number(width),// X
      0,// Y
      snowflake_size,// Width
      snowflake_size,// Height
      random_number(4),// Y speed
    ]);
}

function draw(){
    // Draws over previous canvas frame, thereby clearing it too.
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );

    loop_counter = snowflakes.length - 1;
    canvas.fillStyle = '#fff';
    do{
        // Draw snowflake.
        canvas.fillRect(
          snowflakes[loop_counter][0],
          snowflakes[loop_counter][1],
          snowflakes[loop_counter][2],
          snowflakes[loop_counter][3]
        );
    }while(loop_counter--);

    window.requestAnimationFrame(draw);
}

function init(){
    resize();

    create_snowflake();

    window.requestAnimationFrame(draw);
    setInterval(
      'logic()',
      35
    );
}

function logic(){
    // Add 2 randomly placed snowflakes.
    snowflake_size = random_number(3) + 3;
    var loop_counter = 1;
    do{
        create_snowflake();
    }while(loop_counter--);

    loop_counter = snowflakes.length - 1;
    canvas.fillStyle = '#fff';
    do{
        if(snowflakes[loop_counter][1] > height){
            // Remove snowflake that reached bottom of screen.
            snowflakes.splice(
              loop_counter,
              1
            );

        }else{
            // Update snowflake position.
            snowflakes[loop_counter][0] += Math.random() * 2 - 1;
            snowflakes[loop_counter][1] += Math.random() * 4 + snowflakes[loop_counter][4];
        }
    }while(loop_counter--);
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function resize(){
    height = window.innerHeight;
    document.getElementById('buffer').height = height;
    document.getElementById('canvas').height = height;
    y = height / 2;

    width = window.innerWidth;
    document.getElementById('buffer').width = width;
    document.getElementById('canvas').width = width;
    x = width / 2;

    update_background();
}

// TODO: Improve clarity.
function update_background(){
    a = y * .75;
    k = y * .35;
    var j = 0;
    var math = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    var trees = [];

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
    trees.sort(function(i,n){
        return parseFloat(n[2]) - parseFloat(i[2]);
    });

    buffer.clearRect(
      0,
      0,
      width,
      height
    );

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
    math = [
      width / 100,
      width / 45,
      x * .4,
      y * .4,
      x * 1.6,
      height / 100,
      x * .9,
      x * .7,
    ];

    // Draw mountains with gradient fillstyle.
    j = y * .25;
    k = y * .3;
    buffer.beginPath();
    loop_counter = 2;
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

    // Draw ground gardient.
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
    loop_counter = trees.length - 1;
    do{
        buffer.fillRect(
          width * trees[loop_counter][0] - math[0] * 2,
          trees[loop_counter][1],
          math[0] * trees[loop_counter][2],
          math[0] * trees[loop_counter][2]
        );
    }while(loop_counter--);

    // Draw tree leaves.
    loop_counter = trees.length - 1;
    do{
        buffer.beginPath();
        buffer.moveTo(
          width * trees[loop_counter][0],
          trees[loop_counter][1] - (height / 7) * trees[loop_counter][2]
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
          trees[0][1] - (height / 7),
          height / (40 - 20 * loop_counter),
          0,
          Math.PI * 2,
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
              -3.5,
              -2.5,
              0,
              2.5,
              3.5,
              2.5,
              0,
              -2.5,
            ][loop_counter]
          ),
          trees[0][1] - (height / 7) + math[5] * (
            [
              0,
              -2.5,
              -3.5,
              -2.5,
              0,
              2.5,
              3.5,
              2.5,
            ][loop_counter]
          ),
          math[5],
          0,
          Math.PI * 2,
          false
        );
        buffer.closePath();
        buffer.fill();
    }while(loop_counter--);
}

var a = 0;
var buffer = document.getElementById('buffer').getContext('2d');
var canvas = document.getElementById('canvas').getContext('2d');
var height = 0;
var k = 0;
var snowflakes = [];
var snowflake_size = 0;
var width = 0;
var x = 0;
var y = 0;

window.onload = init;

window.onresize = resize;
