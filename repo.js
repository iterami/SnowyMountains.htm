'use strict';

function draw_snowflake(entity){
    canvas.fillRect(
      entity.x,
      entity.y,
      entity.size,
      entity.size
    );
}

function move_snowflake(entity){
    entity.x += Math.random() * 2 - 1;
    entity.y += Math.random() * 4 + entity.speed;

    if(entity.y > canvas_properties.height){
        entity_remove({
          'entities': [
            entity.id,
          ],
        });
    }
}

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

    const vertices = [];
    for(let i = 0; i < 3; i++){
        vertices.push([
          'moveTo',
          [
            canvas_properties.width_half,
            math.mountain_left_x,
            math.mountain_right_x,
          ][i],
          [
            math.mountain_middle_y,
            math.mountain_left_y,
            math.mountain_right_y,
          ][i],
        ],[
          'lineTo',
          [
            canvas_properties.width_half,
            math.mountain_left_x,
            math.mountain_right_x,
          ][i] + [
            math.mountain_right_width,
            math.mountain_left_width,
            math.mountain_right_width,
          ][i],
          canvas_properties.height_half,
        ],[
          'lineTo',
          [
            canvas_properties.width_half,
            0,
            math.mountain_right_x,
          ][i] - [
            math.mountain_left_width,
            math.mountain_left_width,
            math.mountain_right_width,
          ][i],
          canvas_properties.height_half,
        ]);
    }
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
    for(const tree of trees){
        canvas.fillRect(
          canvas_properties.width * tree[0] - math.stump_width * 2,
          tree[1],
          math.stump_width * tree[2],
          math.stump_width * tree[2]
        );
    }

    for(const tree of trees){
        canvas_draw_path({
          'properties': {
            'fillStyle': tree[3],
          },
          'vertices': [
            [
              'moveTo',
              canvas_properties.width * tree[0],
              tree[1] - math.tree_height * tree[2],
            ],
            [
              'lineTo',
              canvas_properties.width * tree[0] + math.tree_width * tree[2],
              tree[1] + 1,
            ],
            [
              'lineTo',
              canvas_properties.width * tree[0] - math.tree_width * tree[2],
              tree[1] + 1,
            ],
          ],
        });
    }

    canvas_setproperties({
      'fillStyle': '#fff',
    });
    entity_group_modify({
      'groups': [
        'snowflake',
      ],
      'todo': draw_snowflake,
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
    for(let i = 0; i < 2; i++){
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
    }

    entity_group_modify({
      'groups': [
        'snowflake',
      ],
      'todo': move_snowflake,
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
    for(let i = 0; i < treecount; i++){
        const tree_y = core_random_integer(canvas_properties.height_half * (i > treecount * .7 ? 1.1 : .7)) + tree_y_offset;
        trees.push([
          Math.random(),
          tree_y,
          -(canvas_properties.height_half / 2 - tree_y) / (canvas_properties.height_half * .35),
          '#' + core_random_integer(5) + (core_random_integer(5) + 4) + core_random_integer(5),
        ]);
    }
    core_sort_property({
      'array': trees,
      'clone': false,
      'property': 2,
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
