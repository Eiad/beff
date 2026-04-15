import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Cube {
  x: number;
  y: number;
  z: number;
  size: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  rotationSpeedX: number;
  rotationSpeedY: number;
  rotationSpeedZ: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function GeometricGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cubesRef = useRef<Cube[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const fov = 800;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeCubes();
    };

    const initializeCubes = () => {
      const cubes: Cube[] = [];
      const numCubes = 20;
      for (let i = 0; i < numCubes; i++) {
        cubes.push({
          x: (Math.random() - 0.5) * canvas.width * 0.8,
          y: (Math.random() - 0.5) * canvas.height * 0.8,
          z: Math.random() * -800 - 200,
          size: Math.random() * 60 + 40,
          rotationX: Math.random() * Math.PI * 2,
          rotationY: Math.random() * Math.PI * 2,
          rotationZ: Math.random() * Math.PI * 2,
          rotationSpeedX: (Math.random() - 0.5) * 0.005,
          rotationSpeedY: (Math.random() - 0.5) * 0.005,
          rotationSpeedZ: (Math.random() - 0.5) * 0.005,
        });
      }
      cubesRef.current = cubes;
    };

    const project = (point: Point3D, viewZ: number) => {
      const scale = fov / (fov + point.z - viewZ);
      return {
        x: point.x * scale + canvas.width / 2,
        y: point.y * scale + canvas.height / 2,
        depth: point.z,
      };
    };

    const rotateX = (p: Point3D, a: number): Point3D => ({
      x: p.x,
      y: p.y * Math.cos(a) - p.z * Math.sin(a),
      z: p.y * Math.sin(a) + p.z * Math.cos(a),
    });

    const rotateY = (p: Point3D, a: number): Point3D => ({
      x: p.x * Math.cos(a) + p.z * Math.sin(a),
      y: p.y,
      z: -p.x * Math.sin(a) + p.z * Math.cos(a),
    });

    const rotateZ = (p: Point3D, a: number): Point3D => ({
      x: p.x * Math.cos(a) - p.y * Math.sin(a),
      y: p.x * Math.sin(a) + p.y * Math.cos(a),
      z: p.z,
    });

    const getCubeVertices = (cube: Cube): Point3D[] => {
      const s = cube.size / 2;
      const vertices: Point3D[] = [
        { x: -s, y: -s, z: -s }, { x: s, y: -s, z: -s },
        { x: s, y: s, z: -s }, { x: -s, y: s, z: -s },
        { x: -s, y: -s, z: s }, { x: s, y: -s, z: s },
        { x: s, y: s, z: s }, { x: -s, y: s, z: s },
      ];
      return vertices.map((v) => {
        let p = rotateX(v, cube.rotationX);
        p = rotateY(p, cube.rotationY);
        p = rotateZ(p, cube.rotationZ);
        return { x: p.x + cube.x, y: p.y + cube.y, z: p.z + cube.z };
      });
    };

    const drawCube = (cube: Cube, mouse: { x: number; y: number }) => {
      const vertices = getCubeVertices(cube);
      const projected = vertices.map((v) => project(v, 0));
      const opacity = d3.scaleLinear().domain([-1000, -200]).range([0.03, 0.12]).clamp(true)(cube.z);
      const center = project({ x: cube.x, y: cube.y, z: cube.z }, 0);
      const dist = Math.sqrt((mouse.x - center.x) ** 2 + (mouse.y - center.y) ** 2);
      const boost = dist < 200 ? (200 - dist) / 200 * 0.1 : 0;
      const finalOpacity = Math.min(opacity + boost, 0.25);

      const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      ctx.strokeStyle = `rgba(0, 0, 0, ${finalOpacity})`;
      ctx.lineWidth = dist < 200 ? 1.5 : 1;

      for (const [i, j] of edges) {
        ctx.beginPath();
        ctx.moveTo(projected[i].x, projected[i].y);
        ctx.lineTo(projected[j].x, projected[j].y);
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;
      for (const cube of cubesRef.current) {
        cube.rotationX += cube.rotationSpeedX;
        cube.rotationY += cube.rotationSpeedY;
        cube.rotationZ += cube.rotationSpeedZ;
        const mx = (mouse.x / canvas.width - 0.5) * 0.5;
        const my = (mouse.y / canvas.height - 0.5) * 0.5;
        drawCube(cube, { x: mouse.x + mx * 100, y: mouse.y + my * 100 });
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" style={{ background: '#ffffff' }} />;
}
