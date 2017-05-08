MILKCRATE.ddd = {};

MILKCRATE.ddd.latLongToVector3_old = function(lat, lon, radius, heigth) {
        var phi = (lat)*Math.PI/180;
        var theta = (lon-180)*Math.PI/180;
 
        var x = (radius+heigth) * Math.cos(phi) * Math.cos(theta);
        var y = (radius+heigth) * Math.sin(phi);
        var z = (radius+heigth) * Math.cos(phi) * Math.sin(theta);

        return new THREE.Vector3(x,y,z);
    }

    MILKCRATE.ddd.latLongToVector3 = function(lat, lng, radius, h) {
    // convert latitude / longitude to angles between 0 and 2*phi
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (180 - lng) * Math.PI / 180;

    // Calculate the xyz coordinate from the angles
    var x = radius * Math.sin(phi) * Math.cos(theta);
    var y = radius * Math.cos(phi);
    var z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x,y,z);

  }

MILKCRATE.ddd.generate_point_at = function(mapped, parent, side){
  // Create points
  var point1 = MILKCRATE.ddd.create_point(side);
  // Position cube mesh to be right in front of you.
  point1.position.set(mapped.x, mapped.y, mapped.z);
  // Add cube mesh to your three.js scene
  parent.add(point1);
  point1.lookAt(new THREE.Vector3(0,0,0));
}

MILKCRATE.ddd.create_point = function(side){
  var geometry = new THREE.BoxGeometry(side, side, side);
  var material = new THREE.MeshNormalMaterial();
  return new THREE.Mesh(geometry, material);
}

MILKCRATE.ddd.get_average_point = function(points){
  var x = 0;
  var y = 0;
  var z = 0;
  for (var i = 0; i < points.length; i++) {
    x += points[i].x;
    y += points[i].y;
    z += points[i].z;
  }
  return new THREE.Vector3(x/points.length, y/points.length, z/points.length);
}

MILKCRATE.ddd.create_hotspot_mesh = function(points){

  //create a new mesh
  var geometry=new THREE.Geometry();
  //find the average of all points and push to verticies as 0
  var average_point = MILKCRATE.ddd.get_average_point(points);
  geometry.vertices.push(average_point);
  //push verticies
  MILKCRATE.ddd.push_points_to_verticies(points, geometry.vertices);
  //start at 1 to skip the average point
  for (var i = 0; i <= points.length; i++) {
    //set this point
    var this_index = i;
    //if it's the last point set next point to first point
    if(i == points.length){
      var next_index = 1;
    }else{
      var next_index = i+1;
    }
    //add poly from this point to next point to average
    geometry.faces.push(new THREE.Face3(this_index, next_index, 0));

  }
  return geometry;
}

MILKCRATE.ddd.create_hotspot = function(points, material){
  var geometry = MILKCRATE.ddd.create_hotspot_mesh(points);
  var reverse_hex_material = material;
  reverse_hex_material.side = THREE.DoubleSide;
  var hotspot = new THREE.Mesh(geometry, reverse_hex_material);
  return hotspot;
}

MILKCRATE.ddd.push_points_to_verticies = function(points, verticies){
  for (var i = 0; i < points.length; i++) {
    verticies.push(points[i]);
  }
}


MILKCRATE.ddd.convert_x_y_to_lat_lon = function(coords, width, height){
      // We just linearly convert the image coordinated to the angular latitude and longitude coordinates.
    // Then we center them so the (0,0) coordinate is at the center of the image
    var lat = 90 - 180 * (coords.y / height); // equirectangular projection
    var lon = 360 * (coords.x / width) -180;
    return {
      'lat':lat,
      'lon':lon
    }

}

MILKCRATE.ddd.normalize_canvas_style_point = function(point, x, y, width, height, map_width, map_height){
  //find top corner
    var corner_x = x * map_width / 100; //384
    var corner_y = y * map_height / 100;


    //normalize size
    var real_width = width * map_width / 100;
    var real_height = height * map_height / 100;

    //normalize
    var real_x = corner_x+(point.x * real_width / 100);
    var real_Y = corner_y+(point.y * real_height / 100);

    return new THREE.Vector2(real_x, real_Y);

}

    MILKCRATE.ddd.get_random_hex_color = function() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        }

    MILKCRATE.ddd.get_random_hex_material = function() {

        var mat = this.get_hex_material(this.get_random_hex_color());
        mat.transparent=true;
        mat.opacity=0.5;

        return mat;
    }

    MILKCRATE.ddd.get_hex_material = function(hex) {
        return new THREE.MeshBasicMaterial({
            color: hex
        });
      }

MILKCRATE.ddd.hex_string_to_hex = function(hexstring){
  return parseInt(hexstring.replace(/^#/, ''), 16);
};

MILKCRATE.ddd.get_world_coord = function(object_in){
    scene.updateMatrixWorld();
    var result = new THREE.Vector3();
    result.setFromMatrixPosition( object_in.matrixWorld );
    return result;
}