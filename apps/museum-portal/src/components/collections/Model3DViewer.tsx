import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export interface Model3DViewerProps {
  url: string;
  type?: 'gltf' | 'glb' | 'obj';
  width?: number;
  height?: number;
  autoRotate?: boolean;
  controls?: boolean;
}

export const Model3DViewer: React.FC<Model3DViewerProps> = ({ 
  url, 
  type = 'glb',
  width = 600,
  height = 400,
  autoRotate = true,
  controls = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const modelRef = useRef<THREE.Object3D | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const blobUrlRef = useRef<string | null>(null); // Store blob URL for cleanup

  useEffect(() => {
    if (!url || !mountRef.current) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    // Initialize Three.js
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    // Store refs
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Determine loader based on type or file extension
    const fileExtension = url.toLowerCase().split('.').pop();
    const modelType = type || (fileExtension === 'obj' ? 'obj' : fileExtension === 'glb' ? 'glb' : 'gltf');
    
    const loader = modelType === 'obj' ? new OBJLoader() : new GLTFLoader();

    // Helper function to fetch file and create blob URL (to handle CORS)
    const fetchModelFile = async (fileUrl: string): Promise<string> => {
      try {
        // Check if URL is from Google Storage (CORS issue)
        const isGoogleStorage = fileUrl.includes('storage.googleapis.com') || fileUrl.includes('googleapis.com');
        
        if (isGoogleStorage) {
          // Try to use API proxy endpoint first (if available)
          // Extract file path from Google Storage URL
          const urlMatch = fileUrl.match(/storage\.googleapis\.com\/([^?]+)/);
          if (urlMatch) {
            const filePath = urlMatch[1];
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://museum-system-api-160202770359.asia-southeast1.run.app/api/v1';
            const proxyUrl = `${API_BASE}/media/proxy?url=${encodeURIComponent(fileUrl)}`;
            
            try {
              const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
              const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: token ? {
                  'Authorization': `Bearer ${token}`,
                } : {},
              });

              if (response.ok) {
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                blobUrlRef.current = blobUrl;
                return blobUrl;
              }
            } catch (proxyError) {
              console.log('Proxy endpoint not available, trying direct fetch:', proxyError);
            }
          }
          
          // Fallback: Try direct fetch (might work if CORS is configured on bucket)
          const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
          const response = await fetch(fileUrl, {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
            headers: token ? {
              'Authorization': `Bearer ${token}`,
            } : {},
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch model: ${response.status} ${response.statusText}`);
          }

          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          blobUrlRef.current = blobUrl;
          return blobUrl;
        }
        
        // For non-Google Storage URLs, return as-is
        return fileUrl;
      } catch (error: any) {
        console.error('Error fetching model file:', error);
        // If fetch fails, try direct load (might work if CORS is configured)
        return fileUrl;
      }
    };

    // Load model
    const onLoad = (result: any) => {
      if (!isMounted) return;

      // Remove previous model if exists
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRef.current);
      }

      const model = modelType === 'obj' ? result : result.scene;
      
      if (!model) {
        setError('Model không hợp lệ');
        setLoading(false);
        return;
      }

      // Center and scale model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;

      model.scale.multiplyScalar(scale);
      model.position.sub(center.multiplyScalar(scale));

      // Add model to scene
      scene.add(model);
      modelRef.current = model;
      rotationRef.current = { x: 0, y: 0 };

      setLoading(false);
      animate();
    };

    const onProgress = (progress: any) => {
      if (progress.lengthComputable) {
        const percentComplete = (progress.loaded / progress.total) * 100;
        console.log(`Loading: ${percentComplete.toFixed(0)}%`);
      }
    };

    const onError = (err: any) => {
      if (!isMounted) return;
      console.error('Error loading 3D model:', err);
      
      // Provide more helpful error message for CORS issues
      let errorMsg = err.message || 'Lỗi không xác định';
      if (err.message?.includes('CORS') || err.message?.includes('Failed to fetch') || url.includes('storage.googleapis.com')) {
        errorMsg = 'Lỗi CORS: Không thể tải file từ Google Storage. Vui lòng kiểm tra cấu hình CORS trên server hoặc liên hệ admin.';
      }
      
      setError(`Không thể tải model 3D: ${errorMsg}`);
      setLoading(false);
    };

    // Fetch file first (to handle CORS), then load with Three.js loader
    fetchModelFile(url)
      .then((modelUrl) => {
        if (!isMounted) return;
        // Load the model using the blob URL or original URL
        loader.load(modelUrl, onLoad, onProgress, onError);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to fetch model file:', err);
        // Try direct load as fallback
        loader.load(url, onLoad, onProgress, onError);
      });

    // Animation loop
    function animate() {
      if (!isMounted) return;
      
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (modelRef.current && autoRotate && !isDraggingRef.current) {
        modelRef.current.rotation.y += 0.005;
      }
      
      if (modelRef.current && isDraggingRef.current) {
        modelRef.current.rotation.y = rotationRef.current.y;
        modelRef.current.rotation.x = rotationRef.current.x;
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }

    // Mouse controls
    const handleMouseDown = (e: MouseEvent) => {
      if (!controls) return;
      isDraggingRef.current = true;
      setIsDragging(true);
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !controls || !modelRef.current) return;
      
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;
      
      rotationRef.current.y += deltaX * 0.01;
      rotationRef.current.x += deltaY * 0.01;
      
      // Limit vertical rotation
      rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x));
      
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    // Touch controls for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (!controls || e.touches.length !== 1) return;
      isDraggingRef.current = true;
      setIsDragging(true);
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !controls || !modelRef.current || e.touches.length !== 1) return;
      
      const deltaX = e.touches[0].clientX - lastMousePosRef.current.x;
      const deltaY = e.touches[0].clientY - lastMousePosRef.current.y;
      
      rotationRef.current.y += deltaX * 0.01;
      rotationRef.current.x += deltaY * 0.01;
      
      rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x));
      
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    // Add event listeners
    if (mountRef.current) {
      mountRef.current.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      mountRef.current.addEventListener('touchstart', handleTouchStart);
      mountRef.current.addEventListener('touchmove', handleTouchMove);
      mountRef.current.addEventListener('touchend', handleTouchEnd);
    }

    // Start animation
    animate();

    // Cleanup
    return () => {
      isMounted = false;
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousedown', handleMouseDown);
        mountRef.current.removeEventListener('touchstart', handleTouchStart);
        mountRef.current.removeEventListener('touchmove', handleTouchMove);
        mountRef.current.removeEventListener('touchend', handleTouchEnd);
      }
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRef.current);
      }
      
      // Clean up blob URL to free memory
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      
      if (renderer) {
        renderer.dispose();
      }
      
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [url, type, width, height, autoRotate, controls]);

  return (
    <div className="relative w-full">
      <div 
        ref={mountRef} 
        className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50"
        style={{ 
          width: '100%', 
          height: height,
          maxWidth: width,
          cursor: controls ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Đang tải model 3D...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90">
          <div className="text-center p-4">
            <p className="text-red-600 font-medium mb-2">Lỗi tải model</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      )}
      {!loading && !error && controls && (
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          Kéo để xoay • Scroll để zoom
        </div>
      )}
    </div>
  );
};
