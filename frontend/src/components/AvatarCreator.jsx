import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

const AvatarEquipado = ({ altura, peso, modeloCamiseta }) => {
    const { scene } = useGLTF(`/models/${modeloCamiseta}`);
    const sceneClone = useMemo(() => scene.clone(), [scene]);

    const escalaAltura = altura / 170;
    const ratioPeso = (peso - 70) / 70;
    const grosorFinal = Math.max(0.6, Math.min(1.8, 1 + ratioPeso * 0.8));

    return (
        <group position={[0, -1, 0]} scale={[grosorFinal, escalaAltura, grosorFinal]}>
            <primitive object={sceneClone} />
        </group>
    );
};

const AvatarCreator = ({ altura, peso, modeloCamiseta }) => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas
                camera={{ position: [0, 0, 4.5], fov: 40 }}
                gl={{ powerPreference: 'high-performance' }}
            >
                <Suspense fallback={null}>
                    <Environment preset="city" />
                    <ambientLight intensity={0.5} />
                    <AvatarEquipado
                        altura={altura}
                        peso={peso}
                        modeloCamiseta={modeloCamiseta}
                    />
                    <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={15} blur={2.5} far={4} />
                    <OrbitControls enableZoom={true} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default AvatarCreator;