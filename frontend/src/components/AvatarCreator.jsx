/* eslint-disable react/prop-types */
import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';

const CUERPO_BASE = '/models/cuerpo_base.glb';

const AvatarEquipado = ({ altura, peso, modeloCamiseta }) => {
    const { scene: sceneCuerpo } = useGLTF(CUERPO_BASE);
    const { scene: sceneCamiseta } = useGLTF(`/models/${modeloCamiseta}`);

    const cuerpoClone = useMemo(() => sceneCuerpo.clone(), [sceneCuerpo]);
    const camisetaClone = useMemo(() => sceneCamiseta.clone(), [sceneCamiseta, modeloCamiseta]);

    const hBase = 170;
    const pBase = 70;
    const escalaAltura = altura / hBase;
    const ratioPeso = (peso - pBase) / pBase;
    const grosorFinal = Math.max(0.6, Math.min(1.8, 1 + (ratioPeso * 0.8)));

    return (
        <group position={[0, -2, 0]} scale={[grosorFinal, escalaAltura, grosorFinal]}>
            <primitive object={cuerpoClone} />
            <primitive object={camisetaClone} />
        </group>
    );
};

const AvatarCreator = ({ altura, peso, modeloCamiseta }) => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas camera={{ position: [0, 1.5, 4.5], fov: 40 }}>
                <Suspense fallback={null}>
                    <Environment preset="city" />
                    <ambientLight intensity={0.5} />

                    <AvatarEquipado
                        altura={altura}
                        peso={peso}
                        modeloCamiseta={modeloCamiseta}
                    />

                    <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={15} blur={2.5} far={4} />
                    <OrbitControls enableZoom={true} target={[0, 1, 0]} />
                </Suspense>
            </Canvas>
        </div>
    );
};

useGLTF.preload(CUERPO_BASE);

export default AvatarCreator;
