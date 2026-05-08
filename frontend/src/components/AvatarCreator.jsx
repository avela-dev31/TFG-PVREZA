/* eslint-disable react/prop-types */
import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';

// ==========================================
// EL NUEVO MODELO UNIFICADO (Rigging Profesional)
// ==========================================
const AvatarEquipado = ({ altura, peso, modeloCamiseta }) => {
    
    // 💥 AHORA CARGAMOS SOLO UN ARCHIVO: El que trae cuerpo + esqueleto + ropa
    const { scene } = useGLTF(`/models/${modeloCamiseta}`);
    
    // Clonamos la escena para evitar fallos de memoria al cambiar de modelo
    const modelCloned = useMemo(() => scene.clone(), [scene, modeloCamiseta]);

    // Matemáticas procedimentales
    const hBase = 170;
    const pBase = 70;
    const escalaAltura = altura / hBase; 
    const ratioPeso = (peso - pBase) / pBase;
    const grosorFinal = Math.max(0.6, Math.min(1.8, 1 + (ratioPeso * 0.8))); 

    return (
        // El escalado ahora afectará al ESQUELETO, y el esqueleto deformará la camiseta
        <group position={[0, -2, 0]} scale={[grosorFinal, escalaAltura, grosorFinal]}>
            {/* Solo necesitamos un primitive */}
            <primitive object={modelCloned} />
        </group>
    );
};

// ==========================================
// EL COMPONENTE CREADOR (Interfaz)
// ==========================================
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

export default AvatarCreator;