# Canvas Optimization

The **Canvas Optimization** project is a 2D game built on the HTML canvas element, designed to optimize rendering and improve performance in environments with large maps and multiple objects. It uses various optimization techniques to ensure a smooth and efficient experience. Below, I explain the main features and optimization strategies implemented:

### Features:

1. **Canvas and Efficient Rendering**:
   The project utilizes the `HTMLCanvasElement` to render graphics efficiently. The screen is cleared and rendered every frame within the animation loop, using the `clearRect` and `save/restore` techniques to ensure no elements overlap.

2. **Map with Chunks**:
   The map is divided into **chunks** that are dynamically loaded and rendered. Instead of loading the entire map at once, only the **chunks visible** around the player are rendered, saving resources and improving performance, especially in large maps. Each **chunk** contains a set of tiles (terrain blocks) that are drawn individually.

   - **Optimization with Chunks**: Only the **chunks near** the player are kept active and rendered, limiting the number of tiles drawn. This reduces the amount of processing and memory required.

3. **Player Movement and Gun Rotation**:
   The player is controlled using the arrow keys (W, A, S, D), and the gun rotation is based on the mouse position, allowing for smooth and dynamic control. The movement is updated based on keyboard input, and the gun’s rotation is updated in real-time, considering the mouse position.

4. **Dynamic Camera**:
   The **camera** follows the player, keeping the focus on their position. It is centered on the player, automatically adjusting its coordinates, ensuring the player is always visible on screen without the need to manually move the screen.

   - **Optimization with Camera**: By keeping the camera centered on the player, the code avoids rendering areas outside of the player’s view, saving resources.

5. **Layers**:
   Rendering is organized into layers, each containing a set of objects that can be drawn separately, such as the map, the player, or other elements. The layers are drawn in sequence, allowing background and foreground elements to overlap efficiently.

   - **Optimization with Layers**: Organizing objects into layers allows the code to better control which objects need to be rendered each frame, optimizing performance.

### Optimization Techniques:

1. **Use of Chunks for Large Maps**:
   The map is divided into fixed-size **chunks**. By calculating which chunks are near the player, the system can precisely determine which chunks need to be loaded and rendered. This prevents the overhead of rendering the entire map at once.

2. **Conditional Rendering with Active Chunks**:
   The code calculates which chunks are active (visible) based on the player's position and only renders those chunks, improving performance. The number of active chunks can be adjusted via the `chunksToRender` variable.

3. **Camera Centering**:
   The camera always moves to follow the player, eliminating the need for manual movement or excessive position calculations, minimizing the amount of computation required each frame.

4. **Efficient Gun Rotation**:
   The gun's rotation is performed around the player based on the mouse position, and transformations are applied only when the mouse position changes. This reduces the need for constant calculations on every movement.

### Conclusion:
**Canvas Optimization** combines resource management techniques, such as dividing the map into chunks and centering the camera, to optimize rendering in 2D games. The player movement and gun rotation are smooth and responsive, while map rendering is efficient through the use of layers and dynamic chunk rendering. This ensures smooth performance even in large-scale environments, without compromising the user experience.


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
