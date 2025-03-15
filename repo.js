'use strict';

function repo_drawlogic(){
    canvas_setproperties({
      'fillStyle': gradient_sky,
    });
    canvas.fillRect(
      0,
      0,
      canvas_properties['width'],
      canvas_properties['height-half']
    );

    let loop_counter = 2;
    const vertices = [];
    do{
        vertices.push([
          'moveTo',
          [
            canvas_properties['width-half'],
            math['mountain-left-x'],
            math['mountain-right-x'],
          ][loop_counter],
          [
            math['mountain-middle-y'],
            math['mountain-left-y'],
            math['mountain-right-y'],
          ][loop_counter],
        ],[
          'lineTo',
          [
            canvas_properties['width-half'],
            math['mountain-left-x'],
            math['mountain-right-x'],
          ][loop_counter] + [
            math['mountain-right-width'],
            math['mountain-left-width'],
            math['mountain-right-width'],
          ][loop_counter],
          canvas_properties['height-half'],
        ],[
          'lineTo',
          [
            canvas_properties['width-half'],
            0,
            math['mountain-right-x'],
          ][loop_counter] - [
            math['mountain-left-width'],
            math['mountain-left-width'],
            math['mountain-right-width'],
          ][loop_counter],
          canvas_properties['height-half'],
        ]);
    }while(loop_counter--);
    canvas_draw_path({
      'vertices': vertices,
    });

    canvas_setproperties({
      'fillStyle': gradient_ground,
    });
    canvas.fill();

    canvas_setproperties({
      'fillStyle': '#930',
    });
    for(const tree in trees){
        canvas.fillRect(
          canvas_properties['width'] * trees[tree][0] - math['stump-width'] * 2,
          trees[tree][1],
          math['stump-width'] * trees[tree][2],
          math['stump-width'] * trees[tree][2]
        );
    }

    loop_counter = trees.length - 1;
    do{
        canvas_draw_path({
          'properties': {
            'fillStyle': trees[loop_counter][3],
          },
          'vertices': [
            [
              'moveTo',
              canvas_properties['width'] * trees[loop_counter][0],
              trees[loop_counter][1] - math['tree-height'] * trees[loop_counter][2],
            ],
            [
              'lineTo',
              canvas_properties['width'] * trees[loop_counter][0] + math['tree-width'] * trees[loop_counter][2],
              trees[loop_counter][1] + 1,
            ],
            [
              'lineTo',
              canvas_properties['width'] * trees[loop_counter][0] - math['tree-width'] * trees[loop_counter][2],
              trees[loop_counter][1] + 1,
            ],
          ],
        });
    }while(loop_counter--);

    canvas_setproperties({
      'fillStyle': '#fff',
    });
    entity_group_modify({
      'groups': [
        'snowflake',
      ],
      'todo': function(entity){
          canvas.fillRect(
            entity['x'],
            entity['y'],
            entity['size'],
            entity['size']
          );
      },
    });
}

function repo_logic(){
    let loop_counter = 1;
    do{
        entity_create({
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

    entity_group_modify({
      'groups': [
        'snowflake',
      ],
      'todo': function(entity){
          entity['x'] += Math.random() * 2 - 1;
          entity['y'] += Math.random() * 4 + entity['speed'];

          if(entity['y'] > canvas_properties['height']){
              entity_remove({
                'entities': [
                  entity['id'],
                ],
              });
          }
      },
    });
}

function repo_init(){
    core_repo_init({
      'globals': {
        'gradient_ground': 0,
        'gradient_sky': 0,
        'math': [],
        'trees': [],
      },
      'title': 'SnowyMountains.htm',
    });
    entity_set({
      'type': 'snowflake',
    });
    canvas_init();

    canvas_properties['clearColor'] = '#fff';
}

function repo_resizelogic(){
    math = {
      'mountain-left-width': canvas_properties['width-half'] * .7,
      'mountain-left-x': canvas_properties['width-half'] * .4,
      'mountain-left-y': canvas_properties['height-half'] * .25,
      'mountain-middle-y': canvas_properties['height-half'] * .4,
      'mountain-right-width': canvas_properties['width-half'] * .9,
      'mountain-right-x': canvas_properties['width-half'] * 1.6,
      'mountain-right-y': canvas_properties['height-half'] * .3,
      'stump-width': Math.max(
        canvas_properties['width'] / 100,
        10
      ),
      'tree-height': canvas_properties['height'] / 7,
      'tree-width': Math.max(
        canvas_properties['width'] / 45,
        25
      ),
      'wreathe-red': canvas_properties['height'] / 100,
    };

    core_object_reset(trees);

    const tree_y_offset = canvas_properties['height-half'] * .75;

    const treecount = Math.floor(canvas_properties['width-half'] / 2);
    let loop_counter = treecount;
    do{
        const tree_y = core_random_integer({
          'max': canvas_properties['height-half'] * (loop_counter > treecount * .7 ? 1.1 : .7),
        }) + tree_y_offset;
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

    core_sort_property({
      'array': trees,
      'clone': false,
      'property': 2,
      'reverse': true,
    });

    gradient_ground = canvas_gradient({
      'args': [
        canvas_properties['width-half'],
        math['mountain-middle-y'],
        canvas_properties['width-half'],
        canvas_properties['height-half'] * .65,
      ],
      'stops': [
        {
          'color': '#eee',
        },
        {
          'color': '#730',
          'offset': 1,
        },
      ],
    });
    gradient_sky = canvas_gradient({
      'args': [
        canvas_properties['width-half'],
        10,
        canvas_properties['width-half'],
        canvas_properties['height-half'],
      ],
      'stops': [
        {
          'color': '#ccc',
        },
        {
          'color': '#003',
          'offset': 1,
        },
      ],
    });
}
