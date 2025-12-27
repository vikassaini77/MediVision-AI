import { useEffect, useRef } from 'react';

const AnimatedMedicalBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const drawECGLine = (yOffset: number, amplitude: number, speed: number, opacity: number) => {
      ctx.beginPath();
      ctx.strokeStyle = `hsla(190, 85%, 50%, ${opacity})`;
      ctx.lineWidth = 1.5;

      const segments = 120;
      const width = canvas.width;

      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * width;
        const phase = (time * speed + i * 0.15) % (Math.PI * 2);
        
        let y = yOffset;
        
        // Create ECG-like pattern
        const segmentPhase = phase % (Math.PI * 2);
        if (segmentPhase > 2.8 && segmentPhase < 3.0) {
          y -= amplitude * 3; // P wave
        } else if (segmentPhase > 3.1 && segmentPhase < 3.2) {
          y += amplitude * 0.5; // Q
        } else if (segmentPhase > 3.2 && segmentPhase < 3.35) {
          y -= amplitude * 8; // R wave (tall spike)
        } else if (segmentPhase > 3.35 && segmentPhase < 3.5) {
          y += amplitude * 2; // S wave
        } else if (segmentPhase > 3.8 && segmentPhase < 4.2) {
          y -= amplitude * 2; // T wave
        } else {
          y += Math.sin(phase * 0.5) * amplitude * 0.3; // baseline variation
        }

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'hsla(210, 15%, 18%, 0.3)';
      ctx.lineWidth = 0.5;

      const gridSize = 40;
      
      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawPulsingCircles = () => {
      const circles = [
        { x: canvas.width * 0.15, y: canvas.height * 0.25, maxRadius: 80 },
        { x: canvas.width * 0.85, y: canvas.height * 0.75, maxRadius: 100 },
        { x: canvas.width * 0.5, y: canvas.height * 0.1, maxRadius: 60 },
      ];

      circles.forEach((circle, index) => {
        const phase = (time * 0.5 + index * 1.5) % 3;
        const radius = circle.maxRadius * (phase / 3);
        const opacity = 0.15 * (1 - phase / 3);

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(190, 85%, 50%, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };

    const animate = () => {
      ctx.fillStyle = 'hsl(210, 20%, 6%)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid();
      drawPulsingCircles();
      
      // Draw multiple ECG lines at different positions
      drawECGLine(canvas.height * 0.3, 8, 0.8, 0.15);
      drawECGLine(canvas.height * 0.5, 6, 0.6, 0.1);
      drawECGLine(canvas.height * 0.7, 10, 1.0, 0.12);

      time += 0.016;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default AnimatedMedicalBackground;
