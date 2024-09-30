let capture;
let state = 1;

// tracking colors
let r = 0, g = 0, b = 0;
let threshold = 20;

// location of selected color
let xPos = 0, yPos = 0;

// points and scores
let points = 0;

// images
let mouse;
let sprout, leaves = [];
let maple, maples = [];
let mushroom, mushrooms = [];

function preload() {
    mouse = loadImage('images/mouse.png');
    sprout = loadImage('images/sprout.png');
    maple = loadImage('images/maple.png');
    mushroom = loadImage('images/mushroom.png');
}

function setup() {
    pixelDensity(1);
    let c = createCanvas(500, 400);
    c.parent('#container');

    // sprout array
    for (let i = 0; i < 15; i++) {
        let temp = new Leaf(random(2, width - 2));
        leaves.push(temp);
    }

    // maple leaf array
    for (let i = 0; i < 2; i++) {
        let temp = new Maple(random(2, width - 2));
        maples.push(temp);
    }

    // mushroom array
    for (let i = 0; i < 3; i++) {
        let temp = new Mush(random(2, width - 2));
        mushrooms.push(temp);
    }

    // webcam setup
    capture = createCapture({
        video: {
            mandatory: {
                minWidth: 500,
                minHeight: 400,
                maxWidth: 500,
                maxHeight: 400
            }
        }
    });
    capture.hide();
}

function draw() {
    // reset game
    let button = document.querySelector('#reset');
    button.addEventListener('click', () => {
        state = 1;
        points = 0;
    });

    // if player loses
    if (points < 0) {
        background(179, 186, 168);
        textAlign(CENTER);
        text('GAME OVER', width / 2, height / 2);
    }
    else {
        state = 1;
    }

    if (state === 1) {
        textAlign(LEFT);
        capture.loadPixels();

        if (capture.pixels.length > 0) {
            let best = [];

            for (let i = 0; i < capture.pixels.length; i += 4) {
                let match = dist(r, g, b, capture.pixels[i], capture.pixels[i + 1], capture.pixels[i + 2]);
                if (match < threshold) {
                    best.push(i);
                }
            }

            // draw the video
            imageMode(CORNER);
            image(capture, 0, 0);

            // do we have a best match?  it's possible that no pixels met our threshold
            if (best.length > 0) {
                // average up all of our locations
                let xSum = 0;
                let ySum = 0;
                for (let i = 0; i < best.length; i++) {
                    xSum += (best[i] / 4) % 500;
                    ySum += (best[i] / 4) / 500;
                }

                // average our sums to get our 'centroid' point
                xPos = xSum / best.length;
                yPos = ySum / best.length;
            }
        }

        // draw sprouts
        for (let i = 0; i < leaves.length; i++) {
            leaves[i].display();
        }

        // draw maple leaves
        for (let i = 0; i < maples.length; i++) {
            maples[i].display();
        }

        // draw mushrooms
        for (let i = 0; i < mushrooms.length; i++) {
            mushrooms[i].display();
        }

        // draw character
        imageMode(CENTER);
        image(mouse, xPos, yPos, 187.667, 100);

        // display threshold
        noStroke();
        fill(255);
        rectMode(CORNER);
        rect(0, 0, 220, 30);
        fill(0);
        text("Threshold:" + int(threshold) + " - hit 'A' and 'D' to adjust", 10, 20);

        // display points
        text('Points: ' + points, 400, 20);

        if (points < 0) {
            state = 0;
        }
    }
}

function mousePressed() {
    // memorize the color the user is clicking on
    r = red(get(mouseX, mouseY));
    g = green(get(mouseX, mouseY));
    b = blue(get(mouseX, mouseY));

    console.log("Looking for: R=" + r + "; G=" + g + "; B=" + b);
}

function keyPressed() {
    if (key == 'A' || key == 'a') {
        threshold--;
        console.log("Threshold is now: " + threshold);
    }
    if (key == 'D' || key == 'd') {
        threshold++;
        console.log("Threshold is now: " + threshold);
    }
}

class Leaf {
    constructor(x) {
        this.x = x;
        this.y = random(-100, 0);
    }

    display() {
        // leaf falling rate
        this.y += random(2, 5);

        // leaf falls out of canvas
        if (this.y > 400) {
            this.x = random(500);
            this.y = random(-100, 0);
        }

        // user collected leaf
        if (dist(this.x, this.y, xPos, yPos) < 40) {
            this.y = random(-100, 0);
            points++;
        }

        imageMode(CENTER);
        image(sprout, this.x, this.y, 50, 50);
    }
}

class Maple {
    constructor(x) {
        this.x = x;
        this.y = random(-100, 0);
    }

    display() {
        // leaf falling rate
        this.y += 4;

        // leaf falls out of canvas
        if (this.y > 400) {
            this.x = random(500);
            this.y = random(-100, 0);
        }

        // user collected leaf
        if (dist(this.x, this.y, xPos, yPos) < 20) {
            this.y = random(-100, 0);
            points += 5;
        }

        imageMode(CENTER);
        image(maple, this.x, this.y, 50, 50);
    }
}

class Mush {
    constructor(x) {
        this.x = x;
        this.y = random(-100, 0);
    }

    display() {
        // mush falling rate
        this.y += 5;

        // mush falls out of canvas
        if (this.y > 400) {
            this.x = random(500);
            this.y = random(-100, 0);
        }

        // user collected mush
        if (dist(this.x, this.y, xPos, yPos) < 20) {
            this.y = random(-100, 0);
            points -= 5;
        }

        imageMode(CENTER);
        image(mushroom, this.x, this.y, 50, 50);
    }
}


