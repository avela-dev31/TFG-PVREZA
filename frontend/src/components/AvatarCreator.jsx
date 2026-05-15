import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';

const CuerpoBase = ({ escala }) => {
    const { scene } = useGLTF('/models/cuerpo_base.glb');
    const clone = useMemo(() => scene.clone(), [scene]);
    return (
        <group scale={escala}>
            <primitive object={clone} />
        </group>
    );
};

const Camiseta = ({ modelo, escala }) => {
    const { scene } = useGLTF(`/models/${modelo}`);
    const clone = useMemo(() => scene.clone(), [scene]);
    return (
        <group scale={escala}>
            <primitive object={clone} />
        </group>
    );
};

const AvatarCreator = ({ altura, peso, modeloCamiseta = 'camiseta_azul.glb', onAvatarGuardado }) => {
    const escalaAltura = altura / 170;
    const ratioPeso = (peso - 70) / 70;
    const grosorFinal = Math.max(0.6, Math.min(1.8, 1 + ratioPeso * 0.8));
    const escala = [grosorFinal, escalaAltura, grosorFinal];

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas
                camera={{ position: [0, 0, 4.5], fov: 40 }}
                gl={{ powerPreference: 'high-performance' }}
            >
                <Suspense fallback={null}>
                    <Environment preset="city" />
                    <ambientLight intensity={0.5} />
                    <group position={[0, -1, 0]}>
                        <CuerpoBase escala={escala} />
                        <Camiseta modelo={modeloCamiseta} escala={escala} />
                    </group>
                    <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={15} blur={2.5} far={4} />
                    <OrbitControls enableZoom={true} />
                </Suspense>
            </Canvas>
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
