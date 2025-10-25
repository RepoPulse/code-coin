"use client"

import { useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import * as THREE from "three"

function GitBranchVisualization() {
  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.Line[]>([])
  const nodesRef = useRef<THREE.Mesh[]>([])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.0001
      groupRef.current.rotation.y += 0.0002
    }

    // Animate lines with pulsing effect
    linesRef.current.forEach((line, index) => {
      if (line.material instanceof THREE.LineBasicMaterial) {
        const pulse = Math.sin(clock.getElapsedTime() * 2 + index) * 0.5 + 0.5
        line.material.opacity = 0.4 + pulse * 0.6
      }
    })

    // Animate nodes with rotation and scale
    nodesRef.current.forEach((node, index) => {
      node.rotation.x += 0.01
      node.rotation.y += 0.015
      const scale = 1 + Math.sin(clock.getElapsedTime() * 1.5 + index) * 0.3
      node.scale.set(scale, scale, scale)
    })
  })

  useEffect(() => {
    if (!groupRef.current) return

    // Clear previous geometry
    groupRef.current.children.forEach((child) => {
      if (child instanceof THREE.Line || child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose()
        if (child.material instanceof THREE.Material) {
          child.material.dispose()
        }
      }
    })
    linesRef.current = []
    nodesRef.current = []

    // Create realistic git tree structure with multiple levels
    const createBranch = (
      start: [number, number, number],
      end: [number, number, number],
      color: string,
      thickness = 2,
    ) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...start),
        new THREE.Vector3(...end),
      ])
      const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color,
          linewidth: thickness,
          opacity: 0.7,
          transparent: true,
        }),
      )
      groupRef.current?.add(line)
      linesRef.current.push(line)
    }

    const createNode = (position: [number, number, number], color: string, size = 0.15) => {
      const geometry = new THREE.IcosahedronGeometry(size, 4)
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.8,
        metalness: 0.6,
        roughness: 0.2,
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(...position)
      groupRef.current?.add(mesh)
      nodesRef.current.push(mesh)
    }

    // Main trunk (master/main branch)
    createBranch([0, -4, 0], [0, -2, 0], "#ff006e", 3)
    createBranch([0, -2, 0], [0, 0, 0], "#ff006e", 3)
    createBranch([0, 0, 0], [0, 2, 0], "#ff006e", 3)
    createBranch([0, 2, 0], [0, 4, 0], "#ff006e", 3)

    // First level branches (feature branches)
    createBranch([0, 2, 0], [2.5, 3, 1.5], "#00d9ff", 2)
    createBranch([0, 2, 0], [-2.5, 3, -1.5], "#00d9ff", 2)

    // Second level branches (sub-features)
    createBranch([2.5, 3, 1.5], [4, 4, 2.5], "#ffbe0b", 1.5)
    createBranch([2.5, 3, 1.5], [3.5, 3.5, 0.5], "#ffbe0b", 1.5)
    createBranch([-2.5, 3, -1.5], [-4, 4, -2.5], "#ffbe0b", 1.5)
    createBranch([-2.5, 3, -1.5], [-3.5, 3.5, -0.5], "#ffbe0b", 1.5)

    // Lower branches
    createBranch([0, 0, 0], [2, -1, 1], "#8338ec", 2)
    createBranch([0, 0, 0], [-2, -1, -1], "#8338ec", 2)

    // Sub-branches from lower
    createBranch([2, -1, 1], [3.5, -2.5, 2], "#fb5607", 1.5)
    createBranch([2, -1, 1], [2.5, -2, 0], "#fb5607", 1.5)
    createBranch([-2, -1, -1], [-3.5, -2.5, -2], "#fb5607", 1.5)
    createBranch([-2, -1, -1], [-2.5, -2, 0], "#fb5607", 1.5)

    // Create nodes at branch points
    createNode([0, 4, 0], "#ff006e", 0.2) // Main tip
    createNode([0, 2, 0], "#ff006e", 0.18)
    createNode([0, 0, 0], "#ff006e", 0.18)
    createNode([0, -2, 0], "#ff006e", 0.18)

    // Feature branch nodes
    createNode([2.5, 3, 1.5], "#00d9ff", 0.15)
    createNode([-2.5, 3, -1.5], "#00d9ff", 0.15)
    createNode([4, 4, 2.5], "#ffbe0b", 0.12)
    createNode([3.5, 3.5, 0.5], "#ffbe0b", 0.12)
    createNode([-4, 4, -2.5], "#ffbe0b", 0.12)
    createNode([-3.5, 3.5, -0.5], "#ffbe0b", 0.12)

    // Lower branch nodes
    createNode([2, -1, 1], "#8338ec", 0.15)
    createNode([-2, -1, -1], "#8338ec", 0.15)
    createNode([3.5, -2.5, 2], "#fb5607", 0.12)
    createNode([2.5, -2, 0], "#fb5607", 0.12)
    createNode([-3.5, -2.5, -2], "#fb5607", 0.12)
    createNode([-2.5, -2, 0], "#fb5607", 0.12)
  }, [])

  return (
    <group ref={groupRef}>
      <Environment preset="night" />
    </group>
  )
}

export function GitBranchScene() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} style={{ background: "transparent" }}>
        <GitBranchVisualization />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-slate-950" />
    </div>
  )
}
