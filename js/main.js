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
    let loop_counter = 2;
    let vertices = [];
    do{
        vertices.push({
          'type': 'moveTo',
          'x': [
            canvas_properties['width-half'],
            math['mountain-left-x'],
            math['mountain-right-x'],
          ][loop_counter],
          'y': [
            math['mountain-middle-y'],
            math['mountain-left-y'],
            math['mountain-right-y'],
          ][loop_counter],
        });
        vertices.push({
          'x': [
            canvas_properties['width-half'],
            math['mountain-left-x'],
            math['mountain-right-x'],
          ][loop_counter] + [
            math['mountain-right-width'],
            math['mountain-left-width'],
            math['mountain-right-width'],
          ][loop_counter],
          'y': canvas_properties['height-half'],
        });
        vertices.push({
          'x': [
            canvas_properties['width-half'],
            0,
            math['mountain-right-x'],
          ][loop_counter] - [
            math['mountain-left-width'],
            math['mountain-left-width'],
            math['mountain-right-width'],
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
    for(let tree in trees){
        canvas_buffer.fillRect(
          canvas_properties['width'] * trees[tree][0] - math['stump-width'] * 2,
          trees[tree][1],
          math['stump-width'] * trees[tree][2],
          math['stump-width'] * trees[tree][2]
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
              'y': trees[loop_counter][1] - math['tree-height'] * trees[loop_counter][2],
            },
            {
              'x': canvas_properties['width'] * trees[loop_counter][0] + math['tree-width'] * trees[loop_counter][2],
              'y': trees[loop_counter][1] + 1,
            },
            {
              'x': canvas_properties['width'] * trees[loop_counter][0] - math['tree-width'] * trees[loop_counter][2],
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
              'endAngle': core_tau,
              'radius': canvas_properties['height'] / (40 - 20 * loop_counter),
              'startAngle': 0,
              'type': 'arc',
              'x': canvas_properties['width'] * trees[0][0],
              'y': trees[0][1] - math['tree-height'],
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
              'endAngle': core_tau,
              'radius': math['wreathe-red'],
              'startAngle': 0,
              'type': 'arc',
              'x': canvas_properties['width'] * trees[0][0] + math['wreathe-red'] * (
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
              'y': trees[0][1] - math['tree-height'] + math['wreathe-red'] * (
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
    let loop_counter = 1;
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
      'globals': {
        'gradient_ground': 0,
        'gradient_sky': 0,
        'math': [],
        'trees': [],
      },
      'title': 'SnowyMountains.htm',
    });
    canvas_init();

    canvas_properties['clearColor'] = '#fff';
}

function resize_logic(){
    // Precalculate stuff.
    math = {
      'mountain-left-width': canvas_properties['width-half'] * .7,
      'mountain-left-x': canvas_properties['width-half'] * .4,
      'mountain-left-y': canvas_properties['height-half'] * .25,
      'mountain-middle-y': canvas_properties['height-half'] * .4,		// 10	middle mountain distance from top
      'mountain-right-width': canvas_properties['width-half'] * .9,
      'mountain-right-x': canvas_properties['width-half'] * 1.6,
      'mountain-right-y': canvas_properties['height-half'] * .3,
      'stump-width': canvas_properties['width'] / 100,
      'tree-height': canvas_properties['height'] / 7,
      'tree-width': canvas_properties['width'] / 45,
      'wreathe-red': canvas_properties['height'] / 100,
    };

    trees = [];

    let tree_y_offset = canvas_properties['height-half'] * .75;

    // Create 300 trees.
    let loop_counter = 299;
    do{
        let tree_y = 0;

        if(loop_counter > 200){
            tree_y = core_random_integer({
              'max': canvas_properties['height-half'] * 1.1,
            }) + tree_y_offset;

        }else if(loop_counter > 10){
            tree_y = core_random_integer({
              'max': canvas_properties['height-half'] * .7,
            }) + tree_y_offset;

        }else{
            tree_y = core_random_integer({
              'max': canvas_properties['height-half'] * .2,
            }) + tree_y_offset;
        }

        trees.push([
          Math.random(),
          tree_y,
          -(canvas_properties['height-half'] / 2 - tree_y) / (canvas_properties['height-half'] * .35),
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
    core_sort_property({
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
      'y': math['mountain-middle-y'],
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
