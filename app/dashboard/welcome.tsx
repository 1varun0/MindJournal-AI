"use client"
import { Card, CardContent } from "../components/ui/card"
import { TrendingUp, Sparkles, Heart } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface WelcomeCardProps {
  entries: any[];
}

export function WelcomeCard({ entries }: WelcomeCardProps) {
  const totalEntries = entries.length;
  const [encouragingMessage, setEncouragingMessage] = useState("");
  const particlesContainerRef = useRef<HTMLDivElement>(null);

  // Encouraging messages library
  const encouragingMessages = [
    "Getting started is the most important step. Proud of you.",
    "Your consistency is building a brighter foundation. Keep going! ✨",
    "You are capable of amazing things. Remember to be kind to yourself today.",
    "What you are feeling is valid. Take a deep breath.",
    "You're doing great.",
    "One step at a time. Every entry matters.",
    "Your journey is unique and beautiful. Honor your progress.",
    "Strength grows in quiet moments of reflection.",
    "Be proud of how far you've come.",
    "Today is a new opportunity to nurture your mind.",
    "Your mental wellness matters. Thank you for showing up.",
    "Small steps lead to big transformations.",
    "You are worthy of this time for yourself.",
    "Embrace today with compassion and curiosity."
  ];

  // Create particles using React effects
  useEffect(() => {
    const createParticles = () => {
      const container = particlesContainerRef.current;
      if (!container) return;
      
      // Clear existing particles
      container.innerHTML = '';
      
      const particleCount = 12;
      const colors = [
        'rgba(200, 190, 240, 0.15)',
        'rgba(147, 197, 253, 0.12)',
        'rgba(216, 180, 254, 0.1)',
        'rgba(186, 230, 253, 0.08)'
      ];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        const size = Math.random() * 8 + 4;
        const startPosition = Math.random() * 100;
        const animationDuration = Math.random() * 25 + 20;
        const delay = Math.random() * -25;
        const color = colors[Math.floor(Math.random() * colors.length)];

        Object.assign(particle.style, {
          position: 'absolute',
          borderRadius: '50%',
          backgroundColor: color,
          filter: 'blur(1px)',
          bottom: '-20px',
          pointerEvents: 'none',
          width: `${size}px`,
          height: `${size}px`,
          left: `${startPosition}%`,
          animation: `floatUp ${animationDuration}s linear infinite`,
          animationDelay: `${delay}s`
        });

        container.appendChild(particle);
      }
    };

    // Add the CSS keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
      @keyframes floatUp {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 0.6;
        }
        90% {
          opacity: 0.4;
        }
        100% {
          transform: translateY(-100vh) rotate(360deg);
          opacity: 0;
        }
      }

      @keyframes gentleBreathing {
        0% {
          transform: scale(1);
          opacity: 0.9;
        }
        50% {
          transform: scale(1.01);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 0.9;
        }
      }

      @keyframes gradientShift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      .breathing-card {
        animation: gentleBreathing 6s ease-in-out infinite;
        background: linear-gradient(
          135deg,
          rgba(120, 119, 198, 0.08) 0%,
          rgba(147, 197, 253, 0.12) 25%,
          rgba(186, 230, 253, 0.08) 50%,
          rgba(216, 180, 254, 0.12) 75%,
          rgba(120, 119, 198, 0.08) 100%
        );
        background-size: 300% 300%;
      }
      
      .breathing-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          135deg,
          rgba(120, 119, 198, 0.05) 0%,
          rgba(147, 197, 253, 0.08) 25%,
          rgba(186, 230, 253, 0.05) 50%,
          rgba(216, 180, 254, 0.08) 75%,
          rgba(120, 119, 198, 0.05) 100%
        );
        background-size: 400% 400%;
        animation: gradientShift 15s ease infinite;
        z-index: -1;
      }

      @keyframes iconFloat {
        0%, 100% {
          transform: translateY(0px) scale(1);
        }
        50% {
          transform: translateY(-4px) scale(1.02);
        }
      }

      .welcome-card-icon {
        animation: iconFloat 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    createParticles();

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Select a random encouraging message
  useEffect(() => {
    const randomMessage = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
    setEncouragingMessage(randomMessage);
  }, []);

  return (
    <Card className="relative overflow-hidden border-0 backdrop-blur-xl shadow-2xl border border-white/20 breathing-card min-h-[300px]">
      {/* Animated Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div ref={particlesContainerRef} className="absolute inset-0" />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4">
          <Sparkles className="h-8 w-8 text-blue-400" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Heart className="h-6 w-6 text-purple-400" />
        </div>
      </div>

      <CardContent className="pt-8 pb-6 relative z-10 h-full flex flex-col justify-center">
        <div className="text-center">
          {/* Centered Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl welcome-card-icon">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          
          {/* Text Content */}
          <div className="space-y-3 mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome!
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Your mental wellness journey continues
            </p>
          </div>

          {/* Encouraging Message */}
          {encouragingMessage && (
            <div className="mt-4 px-4 py-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-white/30 dark:border-gray-700/30 backdrop-blur-sm max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium italic text-center">
                  "{encouragingMessage}"
                </p>
              </div>
            </div>
          )}

                    
        </div>
      </CardContent>
    </Card>
  );
}