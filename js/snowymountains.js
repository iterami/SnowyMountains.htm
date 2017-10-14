'use strict';

function draw_logic(){
    // Draw sky gradient.
    canvas_setproperties({
      'properties': {
        'fillStyle': gradient_sky,
      },
    });
    canvas_buffer.fillRect(
      0,
      0,
      canvas_properties['width'],
      canvas_properties['height-half']
    );

    // Draw mountains with gradient fillstyle.
    var loop_counter = 2;
    var vertices = [];
    do{
        vertices.push({
          'type': 'moveTo',
          'x': [
            canvas_properties['width-half'],
            math[2],
            math[3],
          ][loop_counter],
          'y': [
            math[10],
            math[8],
            math[9],
          ][loop_counter],
        });
        vertices.push({
          'x': [
            canvas_properties['width-half'],
            math[2],
            math[3],
          ][loop_counter] + [
            math[5],
            math[6],
            math[5],
          ][loop_counter],
          'y': canvas_properties['height-half'],
        });
        vertices.push({
          'x': [
            canvas_properties['width-half'],
            0,
            math[3],
          ][loop_counter] - [
            math[6],
            math[6],
            math[5],
          ][loop_counter],
          'y': canvas_properties['height-half'],
        });
    }while(loop_counter--);
    canvas_draw_path({
      'vertices': vertices,
    });

    // Draw ground gradient.
    canvas_setproperties({
      'properties': {
        'fillStyle': gradient_ground,
      },
    });
    canvas_buffer.fill();

    // Draw tree trunks.
    canvas_setproperties({
      'properties': {
        'fillStyle': '#930',
      },
    });
    for(var tree in trees){
        canvas_buffer.fillRect(
          canvas_properties['width'] * trees[tree][0] - math[0] * 2,
          trees[tree][1],
          math[0] * trees[tree][2],
          math[0] * trees[tree][2]
        );
    }

    // Draw tree leaves.
    loop_counter = trees.length - 1;
    do{
        canvas_draw_path({
          'properties': {
            'fillStyle': trees[loop_counter][3],
          },
          'vertices': [
            {
              'type': 'moveTo',
              'x': canvas_properties['width'] * trees[loop_counter][0],
              'y': trees[loop_counter][1] - math[7] * trees[loop_counter][2],
            },
            {
              'x': canvas_properties['width'] * trees[loop_counter][0] + math[1] * trees[loop_counter][2],
              'y': trees[loop_counter][1] + 1,
            },
            {
              'x': canvas_properties['width'] * trees[loop_counter][0] - math[1] * trees[loop_counter][2],
              'y': trees[loop_counter][1] + 1,
            },
          ],
        });
    }while(loop_counter--);

    // Draw wreathe on top of closest tree.
    loop_counter = 1;
    do{
        canvas_draw_path({
          'properties': {
            'fillStyle': [
              trees[0][3],
              '#0d0',
            ][loop_counter],
          },
          'vertices': [
            {
              'endAngle': math_tau,
              'radius': canvas_properties['height'] / (40 - 20 * loop_counter),
              'startAngle': 0,
              'type': 'arc',
              'x': canvas_properties['width'] * trees[0][0],
              'y': trees[0][1] - math[7],
            },
          ],
        });
    }while(loop_counter--);

    // Draw red ornaments on top of wreathe.
    canvas_setproperties({
      'properties': {
        'fillStyle': '#f00',
      },
    });
    loop_counter = 7;
    do{
        canvas_draw_path({
          'vertices': [
            {
              'endAngle': math_tau,
              'radius': math[4],
              'startAngle': 0,
              'type': 'arc',
              'x': canvas_properties['width'] * trees[0][0] + math[4] * (
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
              'y': trees[0][1] - math[7] + math[4] * (
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
          ],
        });
    }while(loop_counter--);

    // Draw snowflakes.
    canvas_setproperties({
      'properties': {
        'fillStyle': '#fff',
      },
    });
    core_group_modify({
      'groups': [
        'snowflake',
      ],
      'todo': function(entity){
          canvas_buffer.fillRect(
            core_entities[entity]['x'],
            core_entities[entity]['y'],
            core_entities[entity]['size'],
            core_entities[entity]['size']
          );
      },
    });
}

function logic(){
    // Add 2 snowflakes.
    var loop_counter = 1;
    do{
        core_entity_create({
          'properties': {
            'size': core_random_integer({
              'max': 2,
            }) + 3,
            'speed': core_random_integer({
              'max': 4,
            }),
            'x': core_random_integer({
              'max': canvas_properties['width'],
            }),
          },
          'types': [
            'snowflake',
          ],
        });
    }while(loop_counter--);

    // Update snowflake positions.
    core_group_modify({
      'groups': [
        'snowflake',
      ],
      'todo': function(entity){
          core_entities[entity]['x'] += Math.random() * 2 - 1;
          core_entities[entity]['y'] += Math.random() * 4 + core_entities[entity]['speed'];

          if(core_entities[entity]['y'] > canvas_properties['height']){
              core_entity_remove({
                'entities': [
                  entity,
                ],
              });
          }
      },
    });
}

function repo_init(){
    core_repo_init({
      'entities': {
        'snowflake': {},
      },
      'title': 'SnowyMountains.htm',
    });

    document.body.style.background = '#fff';

    canvas_init();
}

function resize_logic(){
    // Precalculate stuff.
    math = [
      canvas_properties['width'] / 100,
      canvas_properties['width'] / 45,
      canvas_properties['width-half'] * .4,
      canvas_properties['width-half'] * 1.6,
      canvas_properties['height'] / 100,
      canvas_properties['width-half'] * .9,
      canvas_properties['width-half'] * .7,
      canvas_properties['height'] / 7,
      canvas_properties['height-half'] * .25,
      canvas_properties['height-half'] * .3,
      canvas_properties['height-half'] * .4,
    ];

    trees = [];

    var a = canvas_properties['height-half'] * .75;
    var k = canvas_properties['height-half'] * .35;
    var j = 0;

    // Create 300 trees.
    var loop_counter = 299;
    do{
        if(loop_counter > 200){
            j = core_random_integer({
              'max': canvas_properties['height-half'] * 1.1,
            }) + a;

        }else if(loop_counter > 10){
            j = core_random_integer({
              'max': canvas_properties['height-half'] * .7,
            }) + a;

        }else{
            j = core_random_integer({
              'max': canvas_properties['height-half'] * .2,
            }) + a;
        }

        trees.push([
          Math.random(),
          j,
          -(canvas_properties['height-half'] / 2 - j) / k,
          '#' + core_random_integer({
              'max': 5,
            })
            + (core_random_integer({
              'max': 5,
            }) + 4)
            + core_random_integer({
              'max': 5,
            }),
        ]);
    }while(loop_counter--);

    // Sort trees so closer trees are drawn on top.
    sort_property({
      'array': trees,
      'property': 2,
      'reverse': true,
    });

    // Create gradients.
    gradient_ground = canvas_gradient({
      'height': canvas_properties['height-half'] * .65,
      'stops': [
        {
          'color': '#eee',
        },
        {
          'color': '#730',
          'offset': 1,
        },
      ],
      'width': canvas_properties['width-half'],
      'x': canvas_properties['width-half'],
      'y': math[10],
    });
    gradient_sky = canvas_gradient({
      'height': canvas_properties['height-half'],
      'stops': [
        {
          'color': '#ccc',
        },
        {
          'color': '#003',
          'offset': 1,
        },
      ],
      'width': canvas_properties['width-half'],
      'x': canvas_properties['width-half'],
      'y': 10,
    });
}

var gradient_ground = 0;
var gradient_sky = 0;
var math = [];
var trees = [];
