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

    canvas_setproperties({
      'fillStyle': '#fff',
    });
    entity_group_modify({
      'groups': [
        'snowflake',
      ],
      'todo': function(entity){
          canvas.fillRect(
            entity_entities[entity]['x'],
            entity_entities[entity]['y'],
            entity_entities[entity]['size'],
            entity_entities[entity]['size']
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
          entity_entities[entity]['x'] += Math.random() * 2 - 1;
          entity_entities[entity]['y'] += Math.random() * 4 + entity_entities[entity]['speed'];

          if(entity_entities[entity]['y'] > canvas_properties['height']){
              entity_remove({
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
      'stump-width': canvas_properties['width'] / 100,
      'tree-height': canvas_properties['height'] / 7,
      'tree-width': canvas_properties['width'] / 45,
      'wreathe-red': canvas_properties['height'] / 100,
    };

    trees = [];

    const tree_y_offset = canvas_properties['height-half'] * .75;

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

    trees = core_sort_property({
      'array': trees,
      'property': 2,
      'reverse': true,
    });

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
