import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const MorphText = () => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const from = 'chaotic'.split('');
    const to = 'clarity'.split('');
    const mapping = [0, 1, 2, 3, 5, 4, 6];

    const FADE_INDICES = [1, 3, 6]; // indices of 'h', 'o', 'last c' in 'chaotic'

    const container = wrapperRef.current;
    container.innerHTML = '';

    // Create hidden layout row to measure target positions
    const refRow = document.createElement('div');
    refRow.style.position = 'absolute';
    refRow.style.top = '50%';
    refRow.style.left = '50%';
    refRow.style.transform = 'translate(-50%, -50%)';
    refRow.style.visibility = 'hidden';
    refRow.style.display = 'flex';
    refRow.style.gap = '0.2em';
    refRow.style.fontSize = '6rem';
    refRow.style.fontWeight = 'bold';

    to.forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      refRow.appendChild(span);
    });

    container.appendChild(refRow);

    requestAnimationFrame(() => {
      const targetSpans = Array.from(refRow.children);
      const targetPositions = targetSpans.map((span) => {
        const rect = span.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      });

      container.removeChild(refRow);

      const center = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };

      from.forEach((char, i) => {
        const targetIndex = mapping[i];
        const target = targetPositions[targetIndex];
        const deltaX = target.x - center.x;
        const deltaY = target.y - center.y;

        const isFade = FADE_INDICES.includes(i);

        // ---------- FROM LETTER ----------
        const fromEl = document.createElement('span');
        fromEl.textContent = char;
        fromEl.style.position = 'absolute';
        fromEl.style.fontSize = '6rem';
        fromEl.style.fontWeight = 'bold';
        fromEl.style.color = '#2c1a35';
        fromEl.style.top = '50%';
        fromEl.style.left = '50%';
        fromEl.style.transform = 'translate(-50%, -50%)';
        container.appendChild(fromEl);

        gsap.set(fromEl, {
          x: gsap.utils.random(-200, 200),
          y: gsap.utils.random(-200, 200),
          rotation: gsap.utils.random(-180, 180),
          opacity: 1,
          scale: 1.5,
        });

        const fromAnim = gsap.to(fromEl, {
          scrollTrigger: {
            trigger: '#scrollTrigger',
            start: 'top top',
            end: '+=2500',
            scrub: true,
          },
          x: deltaX,
          y: deltaY,
          rotation: 0,
          scale: 1,
          ease: 'power3.out',
          ...(isFade ? { opacity: 0 } : {}),
        });

        if (!isFade) {
          // Manual morph
          ScrollTrigger.create({
            trigger: '#scrollTrigger',
            start: 'top top',
            end: '+=2500',
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress;
              fromEl.textContent = progress > 0.5 ? to[targetIndex] : from[i];
            },
          });
        } else {
          // ---------- TO LETTER (fade in layer) ----------
          const toEl = document.createElement('span');
          toEl.textContent = to[targetIndex];
          toEl.style.position = 'absolute';
          toEl.style.fontSize = '6rem';
          toEl.style.fontWeight = 'bold';
          toEl.style.color = '#2c1a35';
          toEl.style.top = '50%';
          toEl.style.left = '50%';
          toEl.style.transform = 'translate(-50%, -50%)';
          toEl.style.opacity = '0';
          container.appendChild(toEl);

          gsap.fromTo(
            toEl,
            { opacity: 0, x: deltaX, y: deltaY },
            {
              scrollTrigger: {
                trigger: '#scrollTrigger',
                start: 'top top',
                end: '+=2500',
                scrub: true,
              },
              opacity: 1,
              x: deltaX,
              y: deltaY,
              ease: 'power3.out',
            }
          );
        }
      });
    });
  }, []);

  return (
    <>
      <div
        ref={wrapperRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      />
      <div
        id="scrollTrigger"
        style={{
          height: '300vh',
        }}
      />
    </>
  );
};

export default MorphText;
