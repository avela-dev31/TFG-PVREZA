import { Suspense, useMemo, useState, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

const AvatarEquipado = ({ altura, peso, modeloCamiseta }) => {
    const { scene } = useGLTF(`/models/${modeloCamiseta}`);
    const sceneClone = useMemo(() => scene.clone(), [scene]);

    const escalaAltura = altura / 170;
    const ratioPeso = (peso - 70) / 70;
    const grosorFinal = Math.max(0.6, Math.min(1.8, 1 + ratioPeso * 0.8));

    return (
        <Center>
            <group scale={[grosorFinal, escalaAltura, grosorFinal]}>
                <primitive object={sceneClone} />
            </group>
        </Center>
    );
};

const CameraSetup = ({ modeloCamiseta }) => {
    const { camera, scene } = useThree();
    const hasAdjusted = useRef(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const box = new THREE.Box3().setFromObject(scene);
            if (box.isEmpty()) return;
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const dist = maxDim * 1.0;
            camera.position.set(center.x, center.y, center.z + dist);
            camera.lookAt(center);
            camera.updateProjectionMatrix();
            hasAdjusted.current = true;
        }, 100);
        return () => clearTimeout(timer);
    }, [modeloCamiseta, camera, scene]);

    return null;
};

const RotateHint = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div style={{
            position: 'absolute', bottom: '70px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '8px 18px',
            fontSize: '12px', letterSpacing: '1.5px', borderRadius: '20px',
            pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '8px',
            animation: 'fadeOut 0.5s 3.5s forwards',
        }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6" /><path d="M23 20v-6h-6" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            ARRASTRA PARA ROTAR
        </div>
    );
};

const AvatarCreator = ({ altura, peso, modeloCamiseta = 'camiseta_azul.glb', onAvatarGuardado }) => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 35 }}
                gl={{ powerPreference: 'high-performance' }}
            >
                <Suspense fallback={null}>
                    <Environment preset="city" />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 5, 5]} intensity={0.3} />
                    <AvatarEquipado
                        altura={altura}
                        peso={peso}
                        modeloCamiseta={modeloCamiseta}
                    />
                    <CameraSetup modeloCamiseta={modeloCamiseta} />
                    <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={15} blur={2.5} far={4} />
                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        minPolarAngle={Math.PI / 6}
                        maxPolarAngle={Math.PI / 1.5}
                        autoRotate
                        autoRotateSpeed={1.5}
                        target={[0, 0, 0]}
                    />
                </Suspense>
            </Canvas>
            <RotateHint />
            {onAvatarGuardado && (
                <button
                    onClick={() => onAvatarGuardado(null)}
                    style={{
                        position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                        padding: '14px 40px', backgroundColor: '#000', color: '#fff', border: 'none',
                        cursor: 'pointer', fontSize: '13px', letterSpacing: '3px', fontWeight: '600',
                    }}
                >
                    CONFIRMAR REGISTRO
                </button>
            )}
        </div>
    );
};

export default AvatarCreator;
