window.initPlayerMovement = (React) => {
  const { useRef, useEffect } = React;
  const { useFrame } = window.ReactThreeFiber;
  const THREE = window.THREE;

  function Player() {
    const playerRef = useRef();
    const speed = 0.1; // Movement speed
    const keys = { w: false, a: false, s: false, d: false };

    // Handle key down events
    const handleKeyDown = (event) => {
      if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
      }
    };

    // Handle key up events
    const handleKeyUp = (event) => {
      if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
      }
    };

    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);

    // Update player position based on key input
    useFrame(() => {
      if (playerRef.current) {
        const direction = new THREE.Vector3();
        if (keys.w) direction.z -= speed;
        if (keys.s) direction.z += speed;
        if (keys.a) direction.x -= speed;
        if (keys.d) direction.x += speed;

        // Normalize direction to maintain consistent speed if moving diagonally
        direction.normalize();
        playerRef.current.position.add(direction);
      }
    });

    // Render the player as a 3D box
    return React.createElement('mesh', { ref: playerRef, position: [0, 0.5, 0] },
      React.createElement('boxGeometry', { args: [1, 1, 1] }),
      React.createElement('meshStandardMaterial', { color: 'blue' })
    );
  }

  // Main component to return the Player
  function Game() {
    return React.createElement(Player);
  }

  return Game;
};

console.log('Player movement script loaded');
