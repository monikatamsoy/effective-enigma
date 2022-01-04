import * as THREE from './libs/three/three.module.js';
import { GLTFLoader } from './libs/three/jsm/GLTFLoader.js';
import { LoadingBar } from './libs/LoadingBar.js';
import { OrbitControls } from './libs/three/jsm/OrbitControls.js';




class App {
    constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 10000 );
		this.camera.position.set( 0, 0.8, 7 );
        this.camera.lookAt(0,0,0)
        
		this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xaaaaaa );
        
		this.ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 4);
		this.scene.add(this.ambient);
        

        const light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add( light );
        
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.scene.add( directionalLight );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.physicallyCorrectLights = true;
        container.appendChild( this.renderer.domElement );
		
        this.mouse = new THREE.Vector2();
        this.mouse.x = this.mouse.y = -1;
        this.raycaster = new THREE.Raycaster();
        this.imageClicked = false;
        this.loadingBar = new LoadingBar();
        this.mc = new Hammer(container);
        this.init();
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        this.mc.on("pinch", function(e) {
            console.log(e.type)
        });
        window.addEventListener('resize', this.resize.bind(this) );
        document.addEventListener("mousemove", this.onMouseMove, false)
        document.addEventListener("click", this.onMouseClick, false);
        window.addEventListener("keydown", this.onKeyDown.bind(this), false);

	}	

    resize(){
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }


    onKeyDown(e){
        
            // this.controls.enabled = false;
            // this.controls.enablePan = false
            if(e.key == 'f') {
                this.scene.getObjectByName('image').position.z -= 0.4;
            }
            else if(e.key == 'n') {
                this.scene.getObjectByName('image').position.z += 0.4;
            
                
        }


    }
    
    init(){
        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );  
        this.loadCastle();
        this.loadImage();

        


    }

    onMouseMove = (e) => {
            if (this.imageClicked == true )
            {   
                this.scene.getObjectByName('image').position.x = this.mouse.x;
                var vec = new THREE.Vector3(); // create once and reuse
                var pos = new THREE.Vector3(); // create once and reuse
                
                vec.set(
                    ( e.clientX / window.innerWidth ) * 2 - 1,
                    - ( e.clientY / window.innerHeight ) * 2 + 1,
                    0 );
                    
                    vec.unproject( this.camera );
                    vec.sub( this.camera.position ).normalize();
                    var distance = - this.camera.position.z / vec.z;
                    pos.copy( this.camera.position ).add( vec.multiplyScalar( distance ) );
                    this.scene.getObjectByName('image').position.set(pos.x,pos.y,this.scene.getObjectByName('image').position.z)
                    
            } 
    } 
    onMouseClick = (e) => {
        
        e.preventDefault();
        
        this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
        
        // console.log(mouse)
        this.raycaster.setFromCamera( this.mouse, this.camera );

        var intersects = this.raycaster.intersectObject( this.scene.getObjectByName('image'));
        if (intersects[0] )
        {   
            this.imageClicked = !this.imageClicked
        } 
         
    
}


    loadImage() {
        const map = new THREE.TextureLoader().load( './assets/tower.png' );
        const material = new THREE.SpriteMaterial( { map: map } );

        this.image = new THREE.Sprite( material );
        this.image.position.set(5,-1,0)
        this.image.name = "image"
        this.scene.add( this.image );
    }

    loadCastle(){
        const loader = new GLTFLoader( ).setPath('./assets/');
        const self = this;
		
		// Load a glTF resource
		loader.load(
			// resource URL
			'castle.glb',
			// called when the resource is loaded
			function ( gltf ) {
                const bbox = new THREE.Box3().setFromObject( gltf.scene );
                // console.log(`min:${bbox.min.x.toFixed(2)},${bbox.min.y.toFixed(2)},${bbox.min.z.toFixed(2)} -  max:${bbox.max.x.toFixed(2)},${bbox.max.y.toFixed(2)},${bbox.max.z.toFixed(2)}`);
                
                // gltf.scene.traverse( ( child ) => {
                //     if (child.isMesh){
                //         child.material.metalness = 0.2;
                //     }
                // })
                gltf.scene.name = 'castle'    
                self.castle = gltf.scene;
                self.castle.rotateY(Math.PI/2)
                // self.castle.scale.set(0.5,0.5,0.5)
                self.castle.position.set(0,-3,-12)
                
				self.scene.add( self.castle );                
                self.loadingBar.visible = false;         
				
				self.renderer.setAnimationLoop( self.render.bind(self));
			},
			// called while loading is progressing
			function ( xhr ) {

				self.loadingBar.progress = (xhr.loaded / xhr.total);
				
			},
			// called when loading has errors
			function ( error ) {

				console.log( 'An error happened' )
                    
            }
        );
    }

    render( ) {   
        this.renderer.render( this.scene, this.camera );
    }
    
}

export {App};