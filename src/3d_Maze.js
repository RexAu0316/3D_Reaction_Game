window.initGame = (React, assetsUrl) => {
  const { useEffect, useRef } = React;
  const { useFrame, useThree } = window.ReactThreeFiber;
  const THREE = window.THREE;

  const MazeWall = ({ position, scale }) => {
    return React.createElement('mesh', {
      position: position,
      scale: scale,
      geometry: new THREE.BoxGeometry(1, 1, 1),
      material: new THREE.MeshStandardMaterial({ color: 'gray' }),
      className: 'maze-wall' // Adding class for identification
    });
  };

    const Coin = ({ position }) => {
    return React.createElement('mesh', {
      position: position,
      geometry: new THREE.CircleGeometry(0.5, 32), // Circular geometry for the coin
      material: new THREE.MeshStandardMaterial({ color: 'gold', side: THREE.DoubleSide }), // Gold color for the coin
      rotation: [0, 0, 0] // Rotate the coin to lie flat on the ground
    });
  };

  function Player({ wallBoxes }) {
    const playerRef = useRef();
    const speed = 0.1;
    const keys = useRef({});

    useEffect(() => {
      const handleKeyDown = (event) => {
        keys.current[event.key] = true;
      };

      const handleKeyUp = (event) => {
        keys.current[event.key] = false;
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);

    const checkCollision = (nextPosition) => {
      const playerBox = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(...nextPosition),
        new THREE.Vector3(0.5, 1, 0.5)
      );

      return wallBoxes.some(wallBox => playerBox.intersectsBox(wallBox));
    };
    
    useFrame(() => {
      if (playerRef.current) {
        const direction = new THREE.Vector3();
        if (keys.current['ArrowUp']) direction.z -= speed;
        if (keys.current['ArrowDown']) direction.z += speed;
        if (keys.current['ArrowLeft']) direction.x -= speed;
        if (keys.current['ArrowRight']) direction.x += speed;

        // Calculate the new position based on direction
        const nextPosition = [
          playerRef.current.position.x + direction.x,
          playerRef.current.position.y,
          playerRef.current.position.z + direction.z,
        ];

        // Check for collisions before updating the player's position
        if (!checkCollision(nextPosition)) {
          playerRef.current.position.set(nextPosition[0], nextPosition[1], nextPosition[2]);
        }
      }
    });

    return React.createElement('mesh', {
      ref: playerRef,
      position: [8.5, 0.5, -8.5], // Centered position
      geometry: new THREE.BoxGeometry(0.5, 1, 0.5),
      material: new THREE.MeshStandardMaterial({ color: 'blue' })
    });
  }

  function Camera() {
    const { camera } = useThree();
    useEffect(() => {
      camera.position.set(0, 20, 20); // Adjusted for maze size
      camera.lookAt(0, 0, 0);
    }, [camera]);
    return null;
  }

  // Add this new ThirdPersonCamera component
function ThirdPersonCamera({ playerRef }) {
  const { camera } = useThree();
  const distance = 5; // Distance from the player
  const height = 3; // Height above the player

  useFrame(() => {
    if (playerRef.current) {
      // Update camera position based on the player's position
      camera.position.x = playerRef.current.position.x;
      camera.position.z = playerRef.current.position.z + distance; // Behind the player
      camera.position.y = playerRef.current.position.y + height; // Above the player
      camera.lookAt(playerRef.current.position); // Always look at the player's position
    }
  });

  return null; // This component does not render anything
}
  
  function Maze() {
    const wallHeight = 1; // Height of the walls
    const mazeLayout = [
      // ... (your original maze layout)
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    const wallPositions = [];
    const wallBoxes = []; // Array to hold the bounding boxes

    mazeLayout.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 1) { // Wall
          const position = [
            colIndex - mazeLayout[0].length / 2 + 0.5, // Center the maze
            wallHeight / 2,
            rowIndex - mazeLayout.length / 2 + 0.5,
          ];
          wallPositions.push({
            position: position,
            scale: [1, wallHeight, 1]
          });

          // Create bounding box for collision detection
          const wallBox = new THREE.Box3().setFromCenterAndSize(
            new THREE.Vector3(...position),
            new THREE.Vector3(1, wallHeight, 1)
          );
          wallBoxes.push(wallBox);
        }
      });
    });

    // Pass the wallBoxes to the Player component
    return React.createElement(
      React.Fragment,
      null,
      wallPositions.map((wall, index) =>
        React.createElement(MazeWall, {
          key: index,
          position: wall.position,
          scale: wall.scale
        })
      ),
      React.createElement(Player, { wallBoxes }), // Pass wallBoxes as props
      React.createElement(Coin, { position: [-8.5, 0.5, 10.5] }) // Add the coin at the specified position
    );
  }

// Update the MazeRunnerGame component to include the ThirdPersonCamera
function MazeRunnerGame() {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Camera), // Keep the original camera for initial setup if needed
    React.createElement(ThirdPersonCamera, { playerRef: playerRef }), // Pass playerRef
    React.createElement('ambientLight', { intensity: 0.5 }),
    React.createElement('pointLight', { position: [10, 10, 10] }),
    React.createElement(Maze)
  );
}

console.log('3D Maze Runner game script loaded');
