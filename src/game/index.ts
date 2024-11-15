class Game {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  map: Map;
  player: Player;
  layers: Layers;
  camera: Camera;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Failed to get 2D context');
    this.context = context;
    const chunksToRender = 1
    this.map = new Map(context, chunksToRender);
    this.player = new Player(this, this.context, 0, 0, 10);
    this.camera = new Camera(this.canvas.width, this.canvas.height, this.player);
    this.layers = new Layers([this.map, this.player]);
    this.gameLoop();
    this.bindInput();
  }

  bindInput() {
    window.addEventListener('keydown', (event) => {
      this.player.handleInput(event.key.toLowerCase(), true);
    });

    window.addEventListener('keyup', (event) => {
      this.player.handleInput(event.key.toLowerCase(), false);
    });

    window.addEventListener('mousemove', (event) => {
      this.player.handleMouse(event);
    })
  }

  gameLoop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    this.player.update();
    this.camera.update();
    this.map.update(this.player);
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.save();
    this.context.translate(-this.camera.x, -this.camera.y);
    this.layers.render();
    this.context.restore();
  }
}

class Camera {
  x: number;
  y: number;
  width: number;
  height: number;
  player: Player;

  constructor(width: number, height: number, player: Player) {
    this.width = width;
    this.height = height;
    this.player = player;
    this.x = player.x - width / 2;
    this.y = player.y - height / 2;
  }

  update() {
    this.x = this.player.x - this.width / 2;
    this.y = this.player.y - this.height / 2;
  }
}

class Layers {
  layers: Renderable[];

  constructor(layers: Renderable[]) {
    this.layers = layers;
  }

  render() {
    for (const layer of this.layers) layer.render();
  }
}

interface Renderable {
  render(): void;
}

class Tile {
  x: number;
  y: number;
  size: number;
  chunk: Chunk;

  constructor(x: number, y: number, size: number, chunk: Chunk) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.chunk = chunk;
  }

  render(context: CanvasRenderingContext2D) {
    context.fillStyle = 'white';
    context.fillRect(this.coordinates.x, this.coordinates.y, this.size, this.size);
    context.strokeStyle = 'lightgray';
    context.strokeRect(this.coordinates.x, this.coordinates.y, this.size, this.size);
    context.fillStyle = 'black';
    context.font = '10px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`(${this.x},${this.y})`, this.coordinates.x + this.size / 2, this.coordinates.y + this.size / 2);
  }

  get coordinates() {
    return {
      x: this.chunk.x + this.x * this.size,
      y: this.chunk.y + this.y * this.size
    };
  }
}

class Chunk {
  x: number;
  y: number;
  map: Map;
  tileSize: number;
  chunkSize: number;
  tiles: Tile[];

  constructor(x: number, y: number, tileSize: number, chunkSize: number, map: Map) {
    this.x = x;
    this.y = y;
    this.map = map;
    this.tileSize = tileSize;
    this.chunkSize = chunkSize;
    this.tiles = this.createTiles();
  }

  createTiles() {
    const tiles = [];
    for (let tx = 0; tx < this.chunkSize; tx++) {
      for (let ty = 0; ty < this.chunkSize; ty++) {
        tiles.push(new Tile(tx, ty, this.tileSize, this));
      }
    }
    return tiles;
  }

  render(context: CanvasRenderingContext2D) {
    for (const tile of this.tiles) tile.render(context);

    context.save();
    context.strokeStyle = 'red';
    context.lineWidth = 1;
    context.strokeRect(this.x, this.y, this.tileSize * this.chunkSize, this.tileSize * this.chunkSize);

    context.font = '10px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(`(${this.coordinates.x}, ${this.coordinates.y})`, this.x + (this.tileSize * this.chunkSize / 2), this.y);
    context.restore();
  }

  get coordinates() {
    return {
      x: this.x * this.tileSize * this.chunkSize,
      y: this.y * this.tileSize * this.chunkSize,
    };
  }
}

class Map {
  context: CanvasRenderingContext2D;
  chunksToRender: number;
  tileSize: number;
  chunkSize: number;
  chunks: Chunk[];
  activeChunks: Chunk[];

  constructor(context: CanvasRenderingContext2D, chunksToRender: number) {
    this.context = context;
    this.chunksToRender = chunksToRender;
    this.tileSize = 32;
    this.chunkSize = 10;
    this.chunks = this.createChunks();
    this.activeChunks = [];
  }

  createChunks() {
    const fackeChunks = 5
    const chunks = [];
    for (let cx = -fackeChunks; cx <= fackeChunks; cx++) {
      for (let cy = -fackeChunks; cy <= fackeChunks; cy++) {
        chunks.push(new Chunk(cx * this.chunkSize * this.tileSize, cy * this.chunkSize * this.tileSize, this.tileSize, this.chunkSize, this));
      }
    }
    return chunks;
  }

  update(player: Player) {
    const playerChunkX = Math.floor(player.x / (this.chunkSize * this.tileSize));
    const playerChunkY = Math.floor(player.y / (this.chunkSize * this.tileSize));
    this.activeChunks = this.chunks.filter(chunk => {
      const chunkX = Math.floor(chunk.x / (this.chunkSize * this.tileSize));
      const chunkY = Math.floor(chunk.y / (this.chunkSize * this.tileSize));
      return Math.abs(chunkX - playerChunkX) <= this.chunksToRender && Math.abs(chunkY - playerChunkY) <= this.chunksToRender;
    });
  }

  render() {
    for (const chunk of this.activeChunks) chunk.render(this.context);
  }
}

class Player {
  game: Game;
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  speed: number;
  keys: Set<string>;
  angle: number;
  mouseX: number;
  mouseY: number;

  constructor(game: Game, context: CanvasRenderingContext2D, x: number, y: number, size: number) {
    this.game = game;
    this.context = context;
    this.x = x;
    this.y = y;
    this.size = size;
    this.dx = 0;
    this.dy = 0;
    this.speed = 10;
    this.keys = new Set();
    this.angle = 0;
    this.mouseX = 0;
    this.mouseY = 0;
  }

  handleInput(key: string, isPressed: boolean) {
    if (isPressed) {
      this.keys.add(key);
    } else {
      this.keys.delete(key);
    }
  }

  handleMouse(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;

    const screenPosition = this.getScreenPosition()
    const dx = this.mouseX - screenPosition.x;
    const dy = this.mouseY - screenPosition.y;

    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < 0) {
      angle += 360;
    }
    this.angle = angle * Math.PI / 180;
  }

  getScreenPosition() {
    const x = this.context.canvas.width / 2
    const y = this.context.canvas.height / 2
    return { x, y }
  }

  update() {
    if (this.keys.has('w')) this.dy = -this.speed;
    if (this.keys.has('s')) this.dy = this.speed;
    if (this.keys.has('a')) this.dx = -this.speed;
    if (this.keys.has('d')) this.dx = this.speed;

    this.x += this.dx;
    this.y += this.dy;

    this.dx = 0;
    this.dy = 0;
  }

  render() {
    // Player
    this.context.save();
    this.context.fillStyle = 'blue';
    this.context.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    this.context.restore();

    // Gun
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.rotate(this.angle);
    const gunLength = 50;
    const gunWidth = 10;
    this.context.fillStyle = 'red';
    this.context.fillRect(0, -gunWidth / 2, gunLength, gunWidth);
    this.context.restore();
  }
}

export default Game;
