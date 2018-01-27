import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);

class ThreeDee {
  constructor(app) {
    this.app = app
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, app.width / app.height, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setSize (app.width, app.height);
    document.body.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera);
    this.camera.position.z = 25;
    this.controls.update();

    this.makeStars();

    new THREE.TextureLoader().load(
      '../assets/space.jpg',
      (texture) => {
        this.buildSpace(texture)
      }
    );

    new THREE.TextureLoader().load(
      '../assets/92k-moon-color-map-3d-model.jpg',
      (texture) => {
        this.buildMoon(texture);
      }
    );

    new THREE.FontLoader().load('../assets/Adine_Kirnberg_Regular.json', (f) => {
      this.buildFont(f, 'Dark');
      this.buildFont(f, 'Dreamzz');
      this['Dark'].position.x = -20;
      this['Dreamzz'].position.y = -10;
      this['Dreamzz'].position.x = -10;
    });
  }

  makeStars() {
    const POINTS = 10000;
    const sprite = new THREE.TextureLoader().load('../assets/star.png');
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array( POINTS * 3 );
    const sizes = new Float32Array( POINTS );

    for (let i = 0; i < POINTS; i++) {
      const vertex = new THREE.Vector3();
      vertex.x = THREE.Math.randFloatSpread(300);
      vertex.y = THREE.Math.randFloatSpread(300);
      vertex.z = THREE.Math.randFloatSpread(300);

      vertex.toArray(positions, i * 3);

      sizes[i] = 1;
    }

    geo.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.addAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      map: sprite,
      transparent: true,
      blending: THREE.AdditiveBlending
    })

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles)

    this.setupRaycaster();
  }

  setupRaycaster() {
    this.ray = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersected = null;

    document.addEventListener('mousemove', this.handleMouseMove.bind(this))
  }

  buildSpace(texture) {
    const geo = new THREE.SphereGeometry(900,32,32);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide
    })

    this.space = new THREE.Mesh(geo, mat);
    this.scene.add(this.space)
  }

  buildMoon(texture) {
    const geo = new THREE.SphereGeometry(100, 32, 32);
    const mat = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 0,
      bumpmap: texture
    });
    this.moon = new THREE.Mesh(geo, mat);
    this.moon.position.set(500, 300, -600);
    this.scene.add(this.moon);

    this.buildLight();
  }

  buildLight() {
    this.moonLight  = new THREE.PointLight();
    this.moonLight.position.set(500, 300, 600);
    this.scene.add(this.moonLight);

    //this.lightHelper = new THREE.PointLightHelper(this.moonLight, 150);
    //this.scene.add(this.lightHelper)
  }

  buildFont(font, text) {
    const geo = new THREE.TextGeometry(text, {
      font: font,
      size: 10,
      height: 5
    });
    const mat = new THREE.MeshPhongMaterial({
      color: 'deeppink',
      shininess: 250
    });

    this[text] = new THREE.Mesh(geo, mat);
    this.scene.add(this[text]);
  }

  handleMouseMove(e) {
    this.mouse.x = (e.clientX / this.app.width) * 2 - 1;
    this.mouse.y = - (e.clientY / this.app.height) * 2 + 1;
  }

  handleMouseDown() {
    if (this.intersected) {
      if (this.intersected == this.Dark) {
        window.location.href = "https://www.instagram.com/darkdreamzzlifestyle/";
      } else if (this.intersected == this.Dreamzz) {
        window.location.href = "https://www.depop.com/darkdreamzz/";
      }
    }
  }

  resize() {
    this.camera.aspect = this.app.width / this.app.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.app.width, this.app.height);
  }

  animate() {
    this.controls.update();
    this.moon.rotation.y += .005;
    this.particles.rotation.x -= .001;
    this.particles.rotation.y += .001;

    this.ray.setFromCamera(this.mouse, this.camera);

    const intersect = this.ray.intersectObjects(this.scene.children)
      .find(obj => obj.object.uuid != this.space.uuid);

    if (intersect) {
      if (this.intersected && this.intersected != intersect) {
        this.intersected.material.color.b = 1;
      }

      if (intersect.object == this.particles) {
        this.app.plink();
      }

      this.intersected = intersect.object
      this.intersected.material.color.b = 3;
    } else if (this.intersected) {
      this.intersected.material.color.b = 1;
      this.intersected = null;
    }
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    this.animate();

    this.renderer.render(this.scene, this.camera);
  }

}

export default ThreeDee;
