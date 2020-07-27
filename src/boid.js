// Boids Algorithm
// Hunter Wilkins
// https://hunterwilkins.dev
// https://github.com/galaxyproduction/Boid-Simulation

class Boid {
    constructor() {
        this.position = createVector(random(width), random(height)); // Create random positon 
        this.velocity = p5.Vector.random2D(); // Random initial velocity vector
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.perceptionRadius = 100; // How far this boid can see its neighbors around it
        this.maxSpeed = 5;
        this.maxForce = 1;

        this.size = 8; // Size to draw the boids
        this.color = color(random(0, 255), 100, 50); // Random hsl color
    }

    // Wraps the boids around the screen
    edges() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }

        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    // Runs the flocking algorithm
    flock(weights, boids) {
        let neighbors = [];
        for(let b of boids) {
            if(b != this && this.position.dist(b.position) < this.perceptionRadius){
                neighbors.push(b);
            }
        }

        if(boids.length > 0) {
            let separation = this.separation(boids);
            let alignment = this.alignment(boids);
            let cohesion = this.cohesion(boids);

            separation.mult(weights[0]);
            alignment.mult(weights[1]);
            cohesion.mult(weights[2]);

            this.acceleration.add(separation);
            this.acceleration.add(alignment);
            this.acceleration.add(cohesion);
        }

        this.acceleration.add(p5.Vector.random2D());
    }

    // Moves the boid and resets the acceleration back to 0
    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }

    // Steers away to avoid the average position of the boids around it
    separation(neighbors) {
        let steering = createVector();
        for (let other of neighbors) {
            //if (other != this) {
                let diff = p5.Vector.sub(this.position, other.position);
                let d = this.position.dist(other.position);
                diff.div(d == 0 ? 0.00001 : d * d);
                steering.add(diff);
            //}
        }

        steering.div(neighbors.length);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxForce);

        return steering;
    }

    // Steers to match the average direction of the boids around it
    alignment(neighbors) {
        let avgVelocity = createVector();
        for (let other of neighbors) {
            //if (other != this) {
                avgVelocity.add(other.velocity);
            //}
        }

        avgVelocity.div(neighbors.length);
        avgVelocity.setMag(this.maxSpeed);
        avgVelocity.sub(this.velocity);
        avgVelocity.limit(this.maxForce);

        return avgVelocity;
    }

    // Steers towards the average position of the boids around it
    cohesion(neighbors) {
        let avgPosition = createVector();
        for (let other of neighbors) {
            //if (other != this) {
                avgPosition.add(other.position);
            //}
        }

        avgPosition.div(neighbors.length);
        avgPosition.sub(this.position);
        avgPosition.setMag(this.maxSpeed);
        avgPosition.sub(this.velocity);
        avgPosition.limit(this.maxForce);

        return avgPosition;
    }

    // Draws the boid
    // Uncomment comments to draw boid as a triangle, and comment out draw circle
    draw() {
        // const viewAngle = atan(this.velocity.y / this.velocity.x == 0 : 0.001 ? this.velocity.x);
        noStroke();
        fill(this.color);
        // triangle(this.position.x, this.position.y,
        //     this.position.x + this.size * cos(viewAngle + TWO_PI / 3), this.position.y + this.size * sin(viewAngle + TWO_PI / 3),
        //     this.position.x + this.size * cos(viewAngle + TWO_PI / 6), this.position.y + this.size * sin(viewAngle + TWO_PI / 6));
        circle(this.position.x, this.position.y, this.size);
    }
}