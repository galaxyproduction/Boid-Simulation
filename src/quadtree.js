class Quadtree {
    constructor(boundary, n) {
        this.boundary = boundary;
        this.capacity = n;
        this.points = [];
        this.hasDivided = false;
    }

    insert(point) {
        if (!this.boundary.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        } else {
            if (!this.hasDivided) {
                this.subdivide();
            }

            if (this.northeast.insert(point)) {
                return true;
            } else if (this.northwest.insert(point)) {
                return true;
            } else if (this.southeast.insert(point)) {
                return true;
            } else if (this.southwest.insert(point)) {
                return true;
            }
        }
    }

    query(range, found) {
        if(!found) {
            found = [];
        }

        if (!this.boundary.intersects(range)) {
            return;
        } else {
            for (let b of this.points) {
                if (range.contains(b)) {
                    found.push(b);
                }
            }

            if (this.hasDivided) {
                this.northeast.query(range, found);
                this.northwest.query(range, found);
                this.southeast.query(range, found);
                this.southwest.query(range, found);
            }

            return found;
        }
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let width = this.boundary.w / 2;
        let height = this.boundary.h / 2;

        let ne = new Rectangle(x + width, y - height, width, height);
        this.northeast = new Quadtree(ne, this.capacity);

        let nw = new Rectangle(x - width, y - height, width, height);
        this.northwest = new Quadtree(nw, this.capacity);

        let se = new Rectangle(x + width, y + height, width, height);
        this.southeast = new Quadtree(se, this.capacity);

        let sw = new Rectangle(x - width, y + height, width, height);
        this.southwest = new Quadtree(sw, this.capacity);

        this.hasDivided = true;
    }

    draw() {
        stroke(255);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);

        if (this.hasDivided) {
            this.northeast.draw();
            this.northwest.draw();
            this.southeast.draw();
            this.southwest.draw();
        }
    }
}