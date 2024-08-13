window.initGame = (React, assetsUrl) => {
  const { useState, useEffect, useRef, Suspense, useMemo } = React;
  const { useFrame, useLoader, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  const BallModel = React.memo(function BallModel({ position = [0, 0, 0] }) {
    const geometry = useMemo(() => new THREE.SphereGeometry(0.5, 32, 32), []);
    const material = useMemo(() => new THREE.MeshStandardMaterial({ color: 'blue' }), []);

    return React.createElement('mesh', {
      geometry: geometry,
      material: material,
      position: position
    });
  });

  function Ball() {
    const ballRef = useRef();
    const { camera } = useThree();
    const speed = 0.1;

    useFrame(() => {
      if (ballRef.current) {
        const direction = new THREE.Vector3();
        if (keys['ArrowUp']) direction.z -= speed;
        if (keys['ArrowDown']) direction.z += speed;
        if (keys['ArrowLeft']) direction.x -= speed;
        if (keys['ArrowRight']) direction.x += speed;

        ballRef.current.position.add(direction);
        camera.position.copy(ballRef.current.position).setY(camera.position.y);
      }
    });

    return React.createElement(BallModel, { ref: ballRef });
  }

  function Maze() {
    // Maze walls can be defined here
    const walls = [
      { position: [0, 0, -5], scale: [10, 1, 1] },
      { position: [5, 0, 0], scale: [1, 1, 10] },
      { position: [-5, 0, 0], scale: [1, 1, 10] },
      { position: [0, 0, 5], scale: [10, 1, 1] },
    ];

    return React.createElement(
      React.Fragment,
      null,
      walls.map((wall, index) => 
        React.createElement('mesh', {
          key: index,
          position: wall.position,
          scale: wall.scale,
          geometry: new THREE.BoxGeometry(),
          material: new THREE.MeshStandardMaterial({ color: 'gray' })
        })
      )
    );
  }

  function Camera() {
    const { camera } = useThree();
    
    useEffect(() => {
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
    }, [camera]);

    return null;
  }

  const keys = {};

  useEffect(() => {
    const handleKeyDown = (event) => {
      keys[event.key] = true;
    };

    const handleKeyUp = (event) => {
      keys[event.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  function MazeGame() {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Camera),
      React.createElement('ambientLight', { intensity: 0.5 }),
      React.createElement('pointLight', { position: [10, 10, 10] }),
      React.createElement(Maze),
      React.createElement(Ball)
    );
  }

  return MazeGame;
};

console.log('3D Maze game script loaded');
