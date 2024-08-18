import React from 'react';
import { useSpring, animated } from '@react-spring/web';

interface AnimatedNumberProps {
  number: number;
  inView: boolean;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ number, inView }) => {
  const { num } = useSpring({
    from: { num: 0 },
    num: inView ? number : 0,
    config: { mass: 1, tension: 280, friction: 120 },
  });

  return (
    <animated.span>
      {num.to((n) => (number % 1 === 0 ? n.toFixed(0) : n.toFixed(1)))}
    </animated.span>
  );
};

export default AnimatedNumber;
