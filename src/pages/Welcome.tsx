import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from '../i18n';

// Neural network node type
interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  brightness: number;
}

const NODE_COUNT = 45;
const CONNECTION_DISTANCE = 180;

function createNodes(width: number, height: number): NeuralNode[] {
  return Array.from({ length: NODE_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    radius: 1.5 + Math.random() * 2.5,
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.02,
    brightness: 0.3 + Math.random() * 0.7,
  }));
}

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<NeuralNode[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const nodes = nodesRef.current;
    const mouse = mouseRef.current;

    ctx.clearRect(0, 0, width, height);

    // Update nodes
    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;
      node.pulsePhase += node.pulseSpeed;

      // Bounce off edges
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      // Subtle mouse attraction
      const dx = mouse.x - node.x;
      const dy = mouse.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 250 && dist > 0) {
        node.vx += (dx / dist) * 0.01;
        node.vy += (dy / dist) * 0.01;
      }

      // Dampen velocity
      node.vx *= 0.999;
      node.vy *= 0.999;
    }

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          const pulse = Math.sin(nodes[i].pulsePhase + nodes[j].pulsePhase) * 0.5 + 0.5;
          const finalOpacity = opacity * (0.6 + pulse * 0.4);

          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${finalOpacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;
      const r = node.radius * (1 + pulse * 0.3);
      const alpha = node.brightness * (0.4 + pulse * 0.6);

      // Glow
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4);
      gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha * 0.3})`);
      gradient.addColorStop(0.5, `rgba(99, 102, 241, ${alpha * 0.1})`);
      gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196, 181, 253, ${alpha})`;
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (nodesRef.current.length === 0) {
        nodesRef.current = createNodes(canvas.width, canvas.height);
      }
    };

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouse);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[#0c0a1d]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-[#0c0a1d] to-violet-950/80" />

      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-3xl" />

      {/* Neural network canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ opacity: 0.8 }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-2xl blur-xl animate-pulse-slow" />
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <Brain className="w-10 h-10 text-violet-300" strokeWidth={1.5} />
            </div>
            <Sparkles className="w-4 h-4 text-violet-400/80 absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold mb-6 tracking-tight leading-none">
          <span className="bg-gradient-to-r from-violet-200 via-white to-indigo-200 bg-clip-text text-transparent">
            SYN
          </span>
          <span className="bg-gradient-to-r from-indigo-200 via-violet-400 to-violet-300 bg-clip-text text-transparent">
            APSE
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-violet-100/80 mb-3 font-light tracking-wide">
          {t('welcome.mainSubtitle')}
        </p>

        {/* Description */}
        <p className="text-sm md:text-base text-white/40 mb-12 max-w-xl mx-auto leading-relaxed">
          {t('welcome.description')}
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate('/dashboard')}
          className="group relative inline-flex items-center justify-center px-10 py-4 text-base font-semibold rounded-full overflow-hidden transition-all duration-500 hover:scale-105 cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40"
        >
          <span className="relative z-10 flex items-center gap-3">
            <span>{t('welcome.launchExperience')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2.5 text-sm text-violet-200/80 hover:bg-white/10 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            {t('welcome.features.generativeAI')}
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2.5 text-sm text-indigo-200/80 hover:bg-white/10 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            {t('welcome.features.predictiveAnalysis')}
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2.5 text-sm text-white/60 hover:bg-white/10 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {t('welcome.features.virtualCoach')}
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-10 text-xs text-white/20 tracking-widest uppercase">
          Sales & Network AI for Pharma Strategy Excellence
        </p>
      </div>
    </div>
  );
};

export default Welcome;
