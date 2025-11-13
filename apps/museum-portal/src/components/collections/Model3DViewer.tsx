import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export interface Model3DViewerProps {
  url: string;
  type: 'gltf' | 'obj';
}

export const Model3DViewer: React.FC<Model3DViewerProps> = ({ url, type }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!url || !mountRef.current) return;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let frameId: number;
    let modelObj: THREE.Object3D | null = null;

    const width = 400;
    const height = 300;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2.5;
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // Load model
    const loader = type === 'obj' ? new OBJLoader() : new GLTFLoader();
    const onLoad = (obj: any) => {
      modelObj = type === 'obj' ? obj : obj.scene;
      if (scene && modelObj) scene.add(modelObj);
      animate();
    };
    const onError = (err: any) => {
      // eslint-disable-next-line no-console
      console.error('Error loading 3D model:', err);
    };
    loader.load(url, onLoad, undefined, onError);

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    function animate() {
      frameId = requestAnimationFrame(animate);
      if (modelObj) modelObj.rotation.y += 0.01;
      renderer!.render(scene!, camera!);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (renderer) renderer.dispose();
      if (scene && modelObj) scene.remove(modelObj);
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, [url, type]);

  return <div ref={mountRef} style={{ width: 400, height: 300, border: '1px solid #ccc', marginBottom: 16 }} />;
};
