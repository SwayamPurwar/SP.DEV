"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";

type BrandLogoProps = {
	className?: string;
	variant?: BrandLogoVariant;
};

export type BrandLogoVariant = "monogram" | "crystal" | "orbital";

// One-line switch for trying different 3D logo styles.
const ACTIVE_LOGO_VARIANT: BrandLogoVariant = "orbital";

export default function BrandLogo({ className, variant }: BrandLogoProps) {
	const containerRef = useRef<HTMLSpanElement | null>(null);
	const resolvedVariant = variant || ACTIVE_LOGO_VARIANT;

	useEffect(() => {
		if (!containerRef.current) return;

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
		camera.position.set(0, 0.2, 4);

		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(64, 64);
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		containerRef.current.appendChild(renderer.domElement);

		const ambient = new THREE.AmbientLight(0xffffff, 0.8);
		scene.add(ambient);

		const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
		keyLight.position.set(2.4, 2, 3.2);
		scene.add(keyLight);

		const rimLight = new THREE.PointLight(0x9ecbff, 0.7, 14);
		rimLight.position.set(-2.6, -1.2, 2.8);
		scene.add(rimLight);

		const group = new THREE.Group();
		scene.add(group);

		const metallic = new THREE.MeshPhysicalMaterial({
			color: 0xd7dbe1,
			roughness: 0.24,
			metalness: 0.72,
			clearcoat: 0.74,
			clearcoatRoughness: 0.2,
		});

		const wireMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.32 });
		const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xcfd6df, transparent: true, opacity: 0.55 });
		const accent = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			emissive: 0x8ea9c6,
			emissiveIntensity: 0.55,
			metalness: 0.35,
			roughness: 0.24,
		});

		let ring: THREE.Mesh | null = null;
		let accentNode: THREE.Mesh | null = null;

		const addMeshWithEdges = (mesh: THREE.Mesh, target: THREE.Object3D = group) => {
			target.add(mesh);
			const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), wireMaterial);
			edges.position.copy(mesh.position);
			edges.rotation.copy(mesh.rotation);
			edges.scale.copy(mesh.scale);
			target.add(edges);
		};

		if (resolvedVariant === "crystal") {
			const core = new THREE.Mesh(new THREE.OctahedronGeometry(1, 0), metallic);
			core.scale.set(0.92, 1.02, 0.92);
			addMeshWithEdges(core);

			ring = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.055, 16, 64), ringMaterial);
			ring.rotation.x = Math.PI * 0.44;
			ring.rotation.y = Math.PI * 0.2;
			group.add(ring);

			accentNode = new THREE.Mesh(new THREE.IcosahedronGeometry(0.18, 0), accent);
			accentNode.position.set(1.02, 0.72, 0.24);
			group.add(accentNode);
		}

		if (resolvedVariant === "orbital") {
			const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.78, 0), metallic);
			addMeshWithEdges(core);

			const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.04, 14, 64), ringMaterial);
			ringA.rotation.x = Math.PI * 0.34;
			ringA.rotation.y = Math.PI * 0.22;
			group.add(ringA);

			const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.04, 14, 64), ringMaterial.clone());
			(ringB.material as THREE.MeshBasicMaterial).opacity = 0.45;
			ringB.rotation.x = Math.PI * 0.67;
			ringB.rotation.y = Math.PI * 0.02;
			group.add(ringB);

			ring = ringA;
			accentNode = new THREE.Mesh(new THREE.IcosahedronGeometry(0.14, 0), accent);
			accentNode.position.set(1.08, 0.02, 0.34);
			group.add(accentNode);
		}

		if (resolvedVariant === "monogram") {
			const monoGroup = new THREE.Group();
			group.add(monoGroup);

			const addBar = (w: number, h: number, x: number, y: number) => {
				const bar = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.18), metallic);
				bar.position.set(x, y, 0);
				addMeshWithEdges(bar, monoGroup);
			};

			const sX = -0.7;
			addBar(0.66, 0.14, sX, 0.5);
			addBar(0.66, 0.14, sX, 0.0);
			addBar(0.66, 0.14, sX, -0.5);
			addBar(0.14, 0.42, sX - 0.26, 0.26);
			addBar(0.14, 0.42, sX + 0.26, -0.24);

			const pX = 0.7;
			addBar(0.14, 1.18, pX - 0.28, 0.0);
			addBar(0.56, 0.14, pX, 0.5);
			addBar(0.56, 0.14, pX, 0.12);
			addBar(0.14, 0.38, pX + 0.24, 0.32);

			monoGroup.rotation.y = -0.2;
			monoGroup.rotation.x = 0.12;
			monoGroup.scale.set(1.02, 1.02, 1.02);

			ring = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.04, 14, 72), ringMaterial);
			ring.rotation.x = Math.PI * 0.39;
			ring.rotation.y = Math.PI * 0.1;
			group.add(ring);

			accentNode = new THREE.Mesh(new THREE.IcosahedronGeometry(0.12, 0), accent);
			accentNode.position.set(1.32, 0.88, 0.08);
			group.add(accentNode);
		}

		let raf = 0;
		let last = performance.now();

		const renderLoop = (now: number) => {
			const dt = Math.min((now - last) / 1000, 0.05);
			last = now;

			if (!prefersReducedMotion) {
				group.rotation.y += dt * (resolvedVariant === "monogram" ? 0.42 : 0.62);
				group.rotation.x = Math.sin(now * 0.0012) * 0.1;
				if (ring) ring.rotation.z += dt * 0.75;
			}

			renderer.render(scene, camera);
			raf = requestAnimationFrame(renderLoop);
		};

		raf = requestAnimationFrame(renderLoop);

		const onEnter = () => {
			if (prefersReducedMotion) return;
			if (accentNode) accentNode.scale.setScalar(1.16);
			group.position.y = 0.05;
		};

		const onLeave = () => {
			if (accentNode) accentNode.scale.setScalar(1);
			group.position.y = 0;
		};

		containerRef.current.addEventListener("mouseenter", onEnter);
		containerRef.current.addEventListener("mouseleave", onLeave);

		return () => {
			cancelAnimationFrame(raf);
			containerRef.current?.removeEventListener("mouseenter", onEnter);
			containerRef.current?.removeEventListener("mouseleave", onLeave);

			group.traverse((obj) => {
				if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
					if (obj.geometry) {
						obj.geometry.dispose();
					}
					if (obj.material) {
						if (Array.isArray(obj.material)) {
							obj.material.forEach((mat) => mat.dispose());
						} else {
							obj.material.dispose();
						}
					}
				}
			});

			scene.remove(group);
			renderer.dispose();
			renderer.domElement.remove();
		};
	}, [resolvedVariant]);

	return (
		<span
			ref={containerRef}
			className={["brand-logo", "brand-logo-three", className].filter(Boolean).join(" ")}
			role="img"
			aria-label="SP monogram 3D logo"
		/>
	);
}

