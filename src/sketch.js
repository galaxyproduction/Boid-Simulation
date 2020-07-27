const canvasSize = 800;
const boidCount = 200;
let boids = [];
let boundary;
const capacity = 2;
let quadtree; 

let alignSlider, cohesionSlider, separationSlider; 

function setup() {
    createCanvas(canvasSize, canvasSize);
    colorMode(HSL);

    separationSlider = createSlider(0, 2, 1.1, 0.1);
    alignSlider = createSlider(0, 2, 0.2, 0.1);
    cohesionSlider = createSlider(0, 2, 1, 0.1);

    boundary = new Rectangle(width / 2, height / 2, width / 2, width / 2, height / 2);
    quadtree = new Quadtree(boundary, capacity);

    for (let i = 0; i < boidCount; i++) {
        boids.push(new Boid());
    }
}

function draw() {
    background(color(0, 0, 20));

    for (let boid of boids) {
        quadtree.insert(boid);
        let neighborRange = new Rectangle(boid.position.x, boid.position.y, boid.perceptionRadius, boid.perceptionRadius);
        let neighbors = quadtree.query(neighborRange);
        //if(neighbors.length == 0) console.log(neighborRange);

        boid.flock([separationSlider.value(), alignSlider.value(), cohesionSlider.value()], boids);
        boid.update();
        boid.edges();
        boid.draw();

    }

    quadtree.draw();

    quadtree = new Quadtree(boundary, capacity);
}