function draw(){
    // draws over previous canvas frame, thereby clearing it too
    canvas.drawImage(
        get('buffer'),
        0,
        0
    );

    // add 2 randomly placed snowflakes
    flake_size = random_number(3) + 3;
    i = 1;
    do{
        snowflakes.push([
            random_number(width),// x
            0,// y
            flake_size,// width
            flake_size,// height
            random_number(4)// y speed
        ]);
    }while(i--);

    i = snowflakes.length - 1;
    canvas.fillStyle = '#fff';
    do{
        if(snowflakes[i][1] > height){
            // remove snowflake that reached bottom of screen
            snowflakes.splice(i, 1);

        }else{
            // update snowflake position
            snowflakes[i][0] += Math.random() * 2 - 1;
            snowflakes[i][1] += Math.random() * 4 + snowflakes[i][4];

            // draw snowflake
            canvas.fillRect(
                snowflakes[i][0],
                snowflakes[i][1],
                snowflakes[i][2],
                snowflakes[i][3]
            );
        }
    }while(i--);
}

function get(i){
    return document.getElementById(i);
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function resize(){
    width = window.innerWidth;
    get('buffer').width = width;
    get('canvas').width = width;

    height = window.innerHeight;
    get('buffer').height = height;
    get('canvas').height = height;

    x = width / 2;
    y = height / 2;

    update_background();
}

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
        0
    ];
    var trees = [];

    // create 300 trees
    i = 299;
    do{
        if(i > 200){
            j = random_number(y * 1.1) + a;

        }else if(i > 10){
            j = random_number(y * .7) + a;

        }else{
            j = random_number(y * .2) + a;
        }
        trees.push([
            Math.random(),
            j,
            -(y / 2 - j) / k,
            '#' + random_number(5) + (random_number(5) + 4) + random_number(5)
        ]);
    }while(i--);

    // sort trees so closer trees are drawn on top
    trees.sort(function(i,n){
        return parseFloat(n[2]) - parseFloat(i[2]);
    });

    buffer.clearRect(
        0,
        0,
        width,
        height
    );

    // draw sky gradient
    i = buffer.createLinearGradient(
        x,
        10,
        x,
        y
    );
    i.addColorStop(0, '#ccc');
    i.addColorStop(1, '#003');
    buffer.fillStyle = i;
    buffer.fillRect(
        0,
        0,
        width,
        y
    );

    // precalculate stuff
    math = [
        width / 100,
        width / 45,
        x * .4,
        y * .4,
        x * 1.6,
        height / 100,
        x * .9,
        x * .7
    ];

    // draw mountains with gradient fillstyle
    i = 2;
    j = y * .25;
    k = y * .3;
    buffer.beginPath();
    do{
        buffer.moveTo(
            [
                x,
                math[2],
                math[4]
            ][i],
            [
                math[3],
                j,
                k
            ][i]
        );
        buffer.lineTo(
            ([
                x,
                math[2],
                math[4]
            ][i]) + ([
                math[6],
                math[7],
                math[6]
            ][i]),
            y
        );
        buffer.lineTo(
            ([
                x,
                0,
                math[4]
            ][i]) - ([
                math[7],
                math[7],
                math[6]
            ][i]),
            y
        );
    }while(i--);
    buffer.closePath();

    // draw ground gardient
    i = buffer.createLinearGradient(
        x,
        math[3],
        x,
        y * .65
    );
    i.addColorStop(0, '#eee');
    i.addColorStop(1, '#730');
    buffer.fillStyle = i;
    buffer.fill();

    // draw tree trunks
    i = trees.length - 1;
    buffer.fillStyle = '#930';
    do{
        buffer.fillRect(
            width * trees[i][0] - math[0] * 2,
            trees[i][1],
            math[0] * trees[i][2],
            math[0] * trees[i][2]
        );
    }while(i--);

    // draw tree leaves
    i = trees.length - 1;
    do{
        buffer.beginPath();
        buffer.moveTo(
            width * trees[i][0],
            trees[i][1] - (height / 7) * trees[i][2]
        );
        buffer.lineTo(
            width * trees[i][0] + math[1] * trees[i][2],
            trees[i][1] + 1
        );
        buffer.lineTo(
            width * trees[i][0] - math[1] * trees[i][2],
            trees[i][1] + 1
        );
        buffer.closePath();
        buffer.fillStyle = trees[i][3];
        buffer.fill();
    }while(i--);

    // draw wreathe on top of closest tree
    i = 1;
    do{
        buffer.fillStyle = [
            trees[0][3],
            '#0d0'
        ][i];
        buffer.beginPath();
        buffer.arc(
            width * trees[0][0],
            trees[0][1] - (height / 7),
            height / (40 - 20 * i),
            0,
            Math.PI * 2,
            false
        );
        buffer.closePath();
        buffer.fill();
    }while(i--);

    // draw red ornaments on top of wreathe
    buffer.fillStyle = '#f00';
    i = 7;
    buffer.beginPath();
    do{
        buffer.arc(
            width * trees[0][0] + math[5] * ([-3.5, -2.5, 0, 2.5, 3.5, 2.5, 0, -2.5][i]),
            trees[0][1] - (height / 7) + math[5] * ([0, -2.5, -3.5, -2.5, 0, 2.5, 3.5, 2.5][i]),
            math[5],
            0,
            Math.PI * 2,
            false
        );
    }while(i--);
    buffer.closePath();
    buffer.fill();

    // draw 'Merry Christmas!' in Czech
    buffer.fillStyle = '#090';
    buffer.font = '42pt sans-serif';
    buffer.fillText(
        'Veselé Vánoce!',
        5,
        47
    );
}

var a = 0;
var buffer = get('buffer').getContext('2d');
var canvas = get('canvas').getContext('2d');
var flake_size = 0;
var height = 0;
var i = 0;
var k = 0;
var snowflakes = [];
var width = 0;
var x = 0;
var y = 0;

resize();

setInterval('draw()', 35);

window.onresize = resize;
