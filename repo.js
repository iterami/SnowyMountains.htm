'use strict';

function repo_drawlogic(){
    canvas_setproperties({
      'fillStyle': gradient_sky,
    });
    canvas.fillRect(
      0,
      0,
      canvas_properties.width,
      canvas_properties.height_half
    );

    let loop_counter = 2;
    const vertices = [];
    do{
        vertices.push([
          'moveTo',
          [
            canvas_properties.width_half,
            math.mountain_left_x,
            math.mountain_right_x,
          ][loop_counter],
          [
            math.mountain_middle_y,
            math.mountain_left_y,
            math.mountain_right_y,
          ][loop_counter],
        ],[
          'lineTo',
          [
            canvas_properties.width_half,
            math.mountain_left_x,
            math.mountain_right_x,
          ][loop_counter] + [
            math.mountain_right_width,
            math.mountain_left_width,
            math.mountain_right_width,
          ][loop_counter],
          canvas_properties.height_half,
        ],[
          'lineTo',
          [
            canvas_properties.width_half,
            0,
            math.mountain_right_x,
          ][loop_counter] - [
            math.mountain_left_width,
            math.mountain_left_width,
            math.mountain_right_width,
          ][loop_counter],
          canvas_properties.height_half,
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
          canvas_properties.width * trees[tree][0] - math.stump_width * 2,
          trees[tree][1],
          math.stump_width * trees[tree][2],
          math.stump_width * trees[tree][2]
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
              canvas_properties.width * trees[loop_counter][0],
              trees[loop_counter][1] - math.tree_height * trees[loop_counter][2],
            ],
            [
              'lineTo',
              canvas_properties.width * trees[loop_counter][0] + math.tree_width * trees[loop_counter][2],
              trees[loop_counter][1] + 1,
            ],
            [
              'lineTo',
              canvas_properties.width * trees[loop_counter][0] - math.tree_width * trees[loop_counter][2],
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
            entity.x,
            entity.y,
            entity.size,
            entity.size
          );
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

    canvas_properties.clearColor = '#fff';
}

function repo_logic(){
    let loop_counter = 1;
    do{
        entity_create({
          'properties': {
            'size': core_random_integer(2) + 3,
            'speed': core_random_integer(4),
            'x': core_random_integer(canvas_properties.width),
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
          entity.x += Math.random() * 2 - 1;
          entity.y += Math.random() * 4 + entity.speed;

          if(entity.y > canvas_properties.height){
              entity_remove({
                'entities': [
                  entity.id,
                ],
              });
          }
      },
    });
}

function repo_resizelogic(){
    math = {
      'mountain_left_width': canvas_properties.width_half * .7,
      'mountain_left_x': canvas_properties.width_half * .4,
      'mountain_left_y': canvas_properties.height_half * .25,
      'mountain_middle_y': canvas_properties.height_half * .4,
      'mountain_right_width': canvas_properties.width_half * .9,
      'mountain_right_x': canvas_properties.width_half * 1.6,
      'mountain_right_y': canvas_properties.height_half * .3,
      'stump_width': Math.max(
        canvas_properties.width / 100,
        10
      ),
      'tree_height': canvas_properties.height / 7,
      'tree_width': Math.max(
        canvas_properties.width / 45,
        25
      ),
    };

    core_object_reset(trees);

    const tree_y_offset = canvas_properties.height_half * .75;

    const treecount = Math.floor(canvas_properties.width_half / 2);
    let loop_counter = treecount;
    do{
        const tree_y = core_random_integer(canvas_properties.height_half * (loop_counter > treecount * .7 ? 1.1 : .7)) + tree_y_offset;
        trees.push([
          Math.random(),
          tree_y,
          -(canvas_properties.height_half / 2 - tree_y) / (canvas_properties.height_half * .35),
          '#' + core_random_integer(5) + (core_random_integer(5) + 4) + core_random_integer(5),
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
        canvas_properties.width_half,
        math.mountain_middle_y,
        canvas_properties.width_half,
        canvas_properties.height_half * .65,
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
        canvas_properties.width_half,
        10,
        canvas_properties.width_half,
        canvas_properties.height_half,
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
