import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";


export default function ThreeText() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer, scene, camera, line, uniforms;

    // vertex Shader
    const vertexShader = `
      uniform float amplitude;
      attribute vec3 displacement;
      attribute vec3 customColor;
      varying vec3 vColor;

      void main() {
        vec3 newPosition = position + amplitude * displacement;
        vColor = customColor;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
      }
    `;

    // fragment Shader
    const fragmentShader = `
      uniform vec3 color;
      uniform float opacity;
      varying vec3 vColor;

      void main() {
        gl_FragColor = vec4( vColor * color, opacity );
      }
    `;

    // Load font
    const loader = new FontLoader();
    loader.load("https://threejs.org/examples/fonts/helvetiker_bold.typeface.json", (font) => {
      init(font);
    });

    function init(font) {
      camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.z = 400;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050505);

      uniforms = {
        amplitude: { value: 5.0 },
        opacity: { value: 0.3 },
        color: { value: new THREE.Color(0xffffff) },
      };

      const shaderMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
      });

      const geometry = new TextGeometry("Boyifan", {
        font,
        size: 50,
        depth: 15,
        curveSegments: 10,
        bevelThickness: 5,
        bevelSize: 1.5,
        bevelEnabled: true,
        bevelSegments: 10,
      });

      geometry.center();

      const count = geometry.attributes.position.count;

      const displacement = new THREE.Float32BufferAttribute(count * 3, 3);
      geometry.setAttribute("displacement", displacement);

      const customColor = new THREE.Float32BufferAttribute(count * 3, 3);
      geometry.setAttribute("customColor", customColor);

      const color = new THREE.Color(0xffffff);

      for (let i = 0; i < customColor.count; i++) {
        color.setHSL(i / customColor.count, 0.5, 0.5);
        color.toArray(customColor.array, i * customColor.itemSize);
      }

      line = new THREE.Line(geometry, shaderMaterial);
      line.rotation.x = 0.2;
      scene.add(line);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      containerRef.current.appendChild(renderer.domElement);

      window.addEventListener("resize", onWindowResize);

      renderer.setAnimationLoop(animate);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      render();
    }

    function render() {
      const time = Date.now() * 0.001;

      line.rotation.y = 0.5 * time;

      uniforms.amplitude.value = Math.sin(0.5 * time);
      uniforms.color.value.offsetHSL(0.0005, 0, 0);

      const attributes = line.geometry.attributes;
      const array = attributes.displacement.array;

      for (let i = 0; i < array.length; i += 3) {
        array[i] += 0.3 * (0.5 - Math.random());
        array[i + 1] += 0.3 * (0.5 - Math.random());
        array[i + 2] += 0.3 * (0.5 - Math.random());
      }

      attributes.displacement.needsUpdate = true;

      renderer.render(scene, camera);
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", onWindowResize);
      renderer?.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
    />
  );
}
