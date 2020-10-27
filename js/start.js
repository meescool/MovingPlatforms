//* Author: Marcela Estrada
// Date: 5/4/2020
//
// This program is a small video game built using three.js libraries
// So far the character can move using D:front, A:back, W:jump a little
// and S:crouch down.
// Due to the design and visual aspects of the game there is no use
// of lighting, and is relied on the use of several textures.
// Future plans for this game is the introduction of collisions,
// so that the character can collect coins and jump
// on the platforms

function init() {
  // listen to the resize events
  window.addEventListener('resize', onResize, false);

  var camera;
  var scene;
  var renderer;
  var controls;

  // movement of character
  var keyboard = {};
  var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };

  // initialize stats
  var stats = initStats();

  // creating textures and materials
  var textureGrass = new THREE.TextureLoader().load("../FinalProject/img/1.png");
  textureGrass.wrapS = THREE.RepeatWrapping;
  textureGrass.wrapT = THREE.RepeatWrapping;
  textureGrass.repeat.set(10, 10);

  materialT = new THREE.MeshBasicMaterial({map: textureGrass});

  var pink = new THREE.TextureLoader().load("../FinalProject/img/2.png");
  pink.wrapS = THREE.RepeatWrapping;
  pink.wrapT = THREE.RepeatWrapping;
  pink.repeat.set(1, 1);

  materialP = new THREE.MeshBasicMaterial({map: pink, transparent:true});

  var cloudTexture = new THREE.TextureLoader().load("../FinalProject/img/4.png");
  cloudTexture.wrapS = THREE.RepeatWrapping;
  cloudTexture.wrapT = THREE.RepeatWrapping;
  cloudTexture.repeat.set(1, 1);

  materialC = new THREE.MeshBasicMaterial({map: cloudTexture, transparent:true});

  var materialBall2 = new THREE.MeshBasicMaterial( {color: 0xffe845, opacity: 0.8, transparent:true} );

  // setting the scence
  var scene = new THREE.Scene();

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xd394ff )); // set background color
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  var planeGeometry = new THREE.PlaneGeometry(1000,1000,20,20);
  var planeMaterial = new THREE.MeshLambertMaterial({color:0xfff});
  var plane = new THREE.Mesh(planeGeometry, materialT);
  plane.receiveShadow = true;

  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;

  scene.add(plane);

  camera.position.x = -180;
  camera.position.y = 30;
  camera.position.z = 0;
  camera.lookAt(scene.position);

  // creating the character in the game
  function makeBall(w, h, d, materialBall, x, y, z) {
    var geometryBall = new THREE.SphereGeometry(w, h,d);
    const ball = new THREE.Mesh(geometryBall, materialBall);
    ball.position.x = x;
    ball.position.y = y;
    ball.position.z = z;
    ball.castShadow = true;
    ball.receiveShadow = true;
    scene.add(ball);
    return ball;

  }

  const balls = [
    //                           x , y, z
    makeBall(5, 32, 32, materialC, 8.2, 12, 3.7), // light blue
    makeBall(3, 32, 32, materialBall2, 3, 20, 3),
    makeBall(3, 32, 32, materialBall2, 12, 20, 3),
  ];

  // creating coins
  var materialCoin = new THREE.MeshBasicMaterial( {color: 0xffe845} );
  var geometryCoin = new THREE.CylinderBufferGeometry( 2, 2, 1, 32 )

  function makeCoin(geometryCoin, materialBall, x, y, z) {
    const coin = new THREE.Mesh(geometryCoin, materialCoin);
    coin.position.x = x;
    coin.position.y = y;
    coin.position.z = z;
    coin.rotation.x = 1;
    coin.castShadow = true;
    coin.receiveShadow = true;
    scene.add(coin);
    return coin;

  }

  const coins = [
    //                           x , y, z
    makeCoin(geometryCoin, materialCoin, 9, 30, 60), // light blue
    makeCoin(geometryCoin, materialCoin, 20, 15, 30),
    makeCoin(geometryCoin, materialCoin, 9, 30, 100),
  ];

  // creating paths for the game
  var geometry = new THREE.BoxGeometry(30, 10, 30);
  var material = new THREE.MeshPhongMaterial({color: 0x123e78});

  function makePath(geometry, material, x, y, z) {
    const path = new THREE.Mesh(geometry, material);
    path.position.x = x;
    path.position.z = z;
    path.position.y = y;
    path.castShadow = true;
    path.receiveShadow = true;
    scene.add(path);
    return path;

  }

  const paths = [
    //                           x , y, z
    makePath(geometry,materialP, 8.2, 0, 3.7), // light blue
    makePath(geometry,materialP, 8.2, 0, 50),
    makePath(geometry,materialP, 8.2, 20, 70),
    makePath(geometry,materialP, 8.2, 20, 120),
    makePath(geometry,materialP, 8.2, 20, 150),
    makePath(geometry,materialP, 8.2, 40, 200),
    makePath(geometry,materialP, 8.2, 40, 250),
    makePath(geometry,materialP, 8.2, 60, 250)
  ];

  document.getElementById("webgl-output").appendChild(renderer.domElement);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  var step = 0;
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // setting these so that the user can interact with the movement of the character
  function keyDown(event){
    keyboard[event.keyCode] = true;
  }

  function keyUp(event){
    keyboard[event.keyCode] = false;
  }


  window.addEventListener('keydown', keyDown);
  window.addEventListener('keyup', keyUp);

  var time = 0;

  render();
  function render() {

    stats.update();

    step += 0.03;
    time +=  0.01;

    // making coins rotate
    coins.forEach((coin, ndx) => {
      coin.rotation.x += player.turnSpeed;
    });

    // animating the character
    balls.forEach((ball, ndx) => {
      if(ndx == 0){
        ball.position.y = 10 + ( 10 * Math.abs(Math.sin(step)));
      }
      else {
        ball.position.y = 15 + ( 10 * Math.abs(Math.sin(step)));
      }

      // Keyboard movement inputs
      if(keyboard[68]){ // D key: move forward
        console.log("d");
        ball.position.x -= Math.sin(ball.rotation.y) * player.speed;
        ball.position.z -= -Math.cos(ball.rotation.y) * player.speed;
      }
      if(keyboard[65]){// A key: move backward
        ball.position.x += Math.sin(ball.rotation.y) * player.speed;
        ball.position.z += -Math.cos(ball.rotation.y) * player.speed;
      }

      if(keyboard[87]){ // W key: jump up
        ball.position.y += 10;
        ball.position.y -= Math.sin(ball.rotation.y) * player.speed;
        ball.position.z -= -Math.cos(ball.rotation.y) * player.speed;
      }

      if(keyboard[83]){ // S key: crouch down
        ball.position.y =10;
        ball.position.y -= Math.sin(ball.rotation.y) * player.speed;
        ball.position.z -= -Math.cos(ball.rotation.y) * player.speed;
      }

      // Keyboard turn inputs
      if(keyboard[37]){ // left arrow key
        camera.rotation.y -= player.turnSpeed;
      }
      if(keyboard[39]){ // right arrow key
        camera.rotation.y += player.turnSpeed;
      }
});

    // Setting movement for the platforms
    paths.forEach((path, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;

      var x = 0;
      switch(ndx){
        case 0:
        path.position.z = 10 + (10 * (Math.cos(time)));
        break;

        case 1:
        path.position.x = 10 + (10 * (Math.cos(time)));

        break;

        case 2:
        path.position.z =+ 60 + (10 * (Math.cos(time)));

        break;

        case 3:
        path.position.x = 10 + (10 * (Math.cos(time)));

        break;

        case 4:
        path.position.y = 50 + (10 * (Math.cos(time)));
        break;

        case 5:
        path.position.z =+ 150 + (10 * (Math.cos(time)));

        break;

        case 6:
        path.position.z =+ 100 + (10 * (Math.cos(time)));

        break;

        case 7:
        path.position.y = 10 + (10 * (Math.cos(time)));

        break;
      }
    });
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}
