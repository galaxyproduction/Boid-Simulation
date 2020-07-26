const canvasSize = 800;
const boidCount = 300;
let boids = [];

let alignSlider, cohesionSlider, separationSlider;

function setup() {
    createCanvas(canvasSize, canvasSize);
    colorMode(HSL);

    separationSlider = createSlider(0, 2, 1.1, 0.1);
    alignSlider = createSlider(0, 2, 1, 0.1);
    cohesionSlider = createSlider(0, 2, 1, 0.1);

    for (let i = 0; i < boidCount; i++) {
        boids.push(new Boid());
    }
}

function draw() {
    background(color(0, 0, 20));

    for (let boid of boids) {
        boid.flock([separationSlider.value(), alignSlider.value(), cohesionSlider.value()], boids);
        boid.update();
        boid.edges();
        boid.draw();
    }
}