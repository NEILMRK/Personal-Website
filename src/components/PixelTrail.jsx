/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { shaderMaterial, useTrailTexture } from '@react-three/drei'
import * as THREE from 'three'
import './PixelTrail.css'

const DotMaterial = shaderMaterial({ resolution: new THREE.Vector2(), mouseTrail: null, gridSize: 75, pixelColor: new THREE.Color('#5f5f5f') }, 'void main(){gl_Position=vec4(position.xy,0.,1.);}', `uniform vec2 resolution;uniform sampler2D mouseTrail;uniform float gridSize;uniform vec3 pixelColor;vec2 coverUv(vec2 uv){vec2 s=resolution.xy/max(resolution.x,resolution.y);return clamp((uv-.5)*s+.5,0.,1.);}void main(){vec2 uv=coverUv(gl_FragCoord.xy/resolution);vec2 center=(floor(uv*gridSize)+.5)/gridSize;float trail=texture2D(mouseTrail,center).r;gl_FragColor=vec4(pixelColor,trail);}`)

function Scene({ color }) { const size = useThree(s => s.size); const viewport = useThree(s => s.viewport); const material = useMemo(() => new DotMaterial(), []); const [trail, onMove] = useTrailTexture({ size: 512, radius: .055, maxAge: 330, interpolate: 4 }); useEffect(() => { material.uniforms.pixelColor.value.set(color); return () => material.dispose() }, [material, color]); useEffect(() => { if (trail) { trail.minFilter = THREE.NearestFilter; trail.magFilter = THREE.NearestFilter } }, [trail]); const scale = Math.max(viewport.width, viewport.height) / 2; return <mesh scale={[scale, scale, 1]} onPointerMove={onMove}><planeGeometry args={[2, 2]}/><primitive object={material} attach="material" resolution={[size.width * viewport.dpr, size.height * viewport.dpr]} mouseTrail={trail}/></mesh> }

export default function PixelTrail({ color = '#5f5f5f' }) { return <Canvas className="pixel-canvas" dpr={[1, 1.25]} gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}><Scene color={color}/></Canvas> }
