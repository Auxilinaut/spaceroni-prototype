/**
 * InfiniShip | HTML5 Canvas :: A procedural spaceship generator
 * ======================================================================
 * 
 * This is a remake of Dave Bollinger's "Pixel Spaceships", remade and 
 * fully commented.
 * 
 * I tried to organize things inside and comment/explain everything, but I'm 
 * a little bit bad with programming so, sorry if I messed up something.
 * 
 * The original script was made for Processing, in 2006, by Dave. But this 
 * version has also used "mtheall" HTML5 Canvas (from 2013) version as reference 
 * for some structure and methods.
 * 
 * This version is intended to work the same way as Bollinger's original script, 
 * and it tries to follow the same rules for the ship's cell grid.
 * 
 * This one has the following options:
 * - Render everything monochrome;
 * - Return a single ship as a base64 encoded PNG;
 * - Return a sprite sheet as a base64 encoded PNG;
 * - Return the ship as an image resource, so you can do whatever you want;
 * 
 * NOTE: Some of the creative output (images) generated by this script remains 
 * property of Dave Bollinger, as this script follows his basic concept. Even 
 * though the possible combination of ships is huge, Dave still has copyright 
 * over his artistic output, so use this carefully.
 * 
 * You are welcome (and highly encouraged) to fork, remix, create your 
 * own way to generate sprites and use this as reference to build your own 
 * generator. :)
 * 
 * @author Fabio Y. Goto <lab@yuiti.com.br>
 */

/**
 * Main object, defines the Canvas element, gets the context object for drawing 
 * inside the canvas and initializes all basic variables and arrays.
 * 
 * @param {Bool} monochrome boolean, if declared <TRUE>, makes it generate 
 * Monochrome ships. Default: <FALSE> 
 */
function InfiniShip(monochrome) 
{
    /**
     * If monochrome is on or off.
     * @var bool
     */
    this.monochrome = (monochrome === true) ? true : false;
    
    /**
     * Empty cell flag.
     * @var int 
     */
    this.S_EMPTY = 0;
    
    /**
     * Solid cell flag.
     * @var int
     */
    this.S_SOLID = 1;
    
    /**
     * Main body cell flag.
     * @var int
     */
    this.S_SHAPE = 2;
    
    /**
     * Cockpit cell flag.
     * @var int
     */
    this.S_CABIN = 3;
    
    /**
     * Ship width, in pixels.
     * @var int
     */
    this.SHIP_W = 12;
    
    /**
     * Ship height, in pixels.
     * @var int
     */
    this.SHIP_H = 12;
    
    /**
     * Pseudo-random integer, to be used a seed when defining the ship's shape.
     * @var int
     */
    this.mainseed = this.generateSeed();
    
    /**
     * Pseudo-random integer, to be used a seed when defining the ship's color.
     * @var int
     */
    this.clrsseed = this.generateSeed();
    
    /**
     * Array containing saturation values, to be used when defining colors.
     * @var array
     */
    this.sats = new Array(
        40, 60, 80, 100, 80, 60, 80, 100, 120, 100, 80, 60
    );
    
    /**
     * Array containing brightness values, to be used when defining colors.
     * @var array
     */
    this.bris = new Array(
        40, 70, 100, 130, 160, 190, 220, 220, 190, 160, 130, 100, 70, 40
    );
    
    /**
     * Array containing the cell data for solid cells in the ship's sprite. 
     */
    this.solidCell = new Array(
        this.cell(5, 2), this.cell(5, 3), this.cell(5, 4), 
        this.cell(5, 5), this.cell(5, 9)
    );
    
    /**
     * Array containing the cell data for body cells in the ship's sprite.
     */
    this.shapeCell = new Array(
        this.cell(4, 1), this.cell(5, 1), this.cell(4, 2), this.cell(3, 3), 
        this.cell(4, 3), this.cell(3, 4), this.cell(4, 4), this.cell(2, 5), 
        this.cell(3, 5), this.cell(4, 5), this.cell(1, 6), this.cell(2, 6), 
        this.cell(3, 6), this.cell(1, 7), this.cell(2, 7), this.cell(3, 7), 
        this.cell(1, 8), this.cell(2, 8), this.cell(3, 8), this.cell(1, 9), 
        this.cell(2, 9), this.cell(3, 9), this.cell(4, 9), this.cell(3, 10), 
        this.cell(4, 10), this.cell(5, 10)
    );
    
    /**
     * Array containing the cell data for cockpit cells in the ship's sprite.
     */
    this.cabinCell = new Array(
        this.cell(4, 6), this.cell(5, 6), this.cell(4, 7), this.cell(5, 7), 
        this.cell(4, 8), this.cell(5, 8)
    );
    
    /**
     * Main element (Canvas). 
     */
    this.main = document.createElement('canvas');
    
    /**
     * Context object. 
     */
    this.context = this.main.getContext('2d');
}



/* SEED GENERATION AND NUMBER OPERATIONS 
 * ====================================================================== */
    
/**
 * Calculates the pixel index value.
 * 
 * @param {Int} x X position of the pixel
 * @param {Int} y Y position of the pixel
 * @return {Int}
 */
InfiniShip.prototype.cell = function(x, y) 
{
    return (y * this.SHIP_W) + x;
};

/**
 * Generates the seeds for defining the ship's shape and color.
 * 
 * It tries to use something similar to the original script's seed generator.
 * 
 * @return {Int}
 */
InfiniShip.prototype.generateSeed = function() 
{
    return Math.floor(Math.random() * 4 * 1024 * 1024 * 1024);
};



/* COLORS AND IMAGE RESOURCE TREATMENT
 * ====================================================================== */

/**
 * Defines the color of a single pixel, inside the image resource provided.
 * 
 * @param {Object} image
 * @param {Int} x
 * @param {Int} y
 * @param {Object} color
 */
InfiniShip.prototype.draw = function(image, x, y, color) 
{
    // Defining the pixel index inside the resource (not to be confused with 
    // the cell index) from the <cell()> function.
    index = (y * image.width + x) * 4;
    // Defining its color
    image.data[index + 0] = color.r;
    image.data[index + 1] = color.g;
    image.data[index + 2] = color.b;
    image.data[index + 3] = color.a;
};

/**
 * Returns a formatted object containing the RGBA color values for a specific 
 * color.
 * 
 * @param {Int} R Red color channel (0 ~ 255)
 * @param {Int} G Green color channel (0 ~ 255)
 * @param {Int} B Blue color channel (0 ~ 255)
 * @param {Int} A Alpha channel (0 ~ 255)
 * @return {Object}
 */
InfiniShip.prototype.colors = function(R, G, B, A) 
{
    return {
        r: R, 
        g: G, 
        b: B, 
        a: A
    };
};

/**
 * Converts the HSV (Hue, Saturation and Brightness) values from a color 
 * into its RGB counterpart, returning them in a formatted object, with its 
 * RGBA values.
 * 
 * @param {Float} h Hue value (0 ~ 360)
 * @param {Float} s Saturation value (0 ~ 1)
 * @param {Float} v Brightness value (0 ~ 1)
 * @return {Object}
 */
InfiniShip.prototype.HSVRGB = function(h, s, v) 
{
    // Declaring variables for color data
    var r, g, b, i, f, p, q, t;
    // If saturation equals zero, returns a shade of gray
    if (s == 0) {
        return {
            r: Math.floor(v * 255), 
            g: Math.floor(v * 255), 
            b: Math.floor(v * 255), 
            a: 255
        };
    }
    // Defining color values
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    // Defining final RGB values
    switch (i % 6) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
    }
    // Returning
    return {
        r: Math.floor(r * 255), 
        g: Math.floor(g * 255), 
        b: Math.floor(b * 255), 
        a: 255
    };
};

/**
 * Returns a formatted object, with the RGBA values for the colors for a 
 * pixel in the desired coordinates, in the ship's body.
 * 
 * @param {Int} x X position of the pixel
 * @param {Int} y Y position of the pixel
 * @return {Object}
 */
InfiniShip.prototype.shapeColor = function(x, y) 
{
    // Defining saturation
    var s = this.sats[y] / 255.0;
    // Defining brightness
    var v = this.bris[x] / 255.0;
    // Defining hue
    if (y < 6) {
        var h = (this.clrsseed >> 8) & 0xFF;
    } else if (y < 9) {
        var h = (this.clrsseed >> 16) & 0xFF;
    } else {
        var h = (this.clrsseed >> 24) & 0xFF;
    }
    // Returning values
    return this.HSVRGB(360 * h / 256, s, v);
};

/**
 * Returns a formatted object, with the RGBA values for the colors for a 
 * pixel in the desired coordinates, in the ship's coockpit.
 * 
 * @param {Int} x X position of the pixel
 * @param {Int} y Y position of the pixel
 * @return {Object}
 */
InfiniShip.prototype.cabinColor = function(x, y) 
{
    // Defining saturation
    var s = this.sats[y] / 255.0;
    // Defining brightness value
    var v = (this.bris[x] + 40) / 255.0;
    // Defining the hue
    var h = this.clrsseed & 0xFF;
    // Returning
    return this.HSVRGB(360 * h / 256, s, v);
};



/* SHIP GENERATION
 * ====================================================================== */

/**
 * Generates a single ship and returns it as an image resource object.
 * 
 * @return {Object}
 */
InfiniShip.prototype.generateSingle = function() 
{
    // Aliases for width and height
    var w = this.SHIP_W;
    var h = this.SHIP_H;
    
    // Aliases for cell data arrays
    var solid = this.solidCell;
    var shape = this.shapeCell;
    var cabin = this.cabinCell;
    
    // Generating image resource
    var imgs = this.context.createImageData(w, h);
    
    // Initializing ship cell array
    var ship = new Array();
    
    // Marking all pixels as transparent initially
    for (var y = 0; y < h; ++y) {
        for (var x = 0; x < w; ++x) {
            this.draw(imgs, x, y, this.colors(255, 255, 255, 0));
        }
    }
    
    // Marking all cells as empty, to start
    for (var i = 0; i < (w * h); ++i) {
        ship[i] = this.S_EMPTY;
    }
    
    // Initializing always solid cells
    for (var i = 0; i < solid.length; ++i) {
        ship[solid[i]] = this.S_SOLID;
    }
    
    // Marking body cells
    for (var i = 0; i < shape.length; ++i) {
        if (this.mainseed & (1 << i)) {
            ship[shape[i]] = this.S_SHAPE;
        } else {
            ship[shape[i]] = this.S_EMPTY;
        }
    }
    
    // Marking the cockpit cells
    for (var i = 0; i < cabin.length; ++i) {
        if (this.shipseed & (1 << (shape.length + i))) {
            ship[cabin[i]] = this.S_SOLID;
        } else {
            ship[cabin[i]] = this.S_CABIN;
        }
    }
    
    // Defining border cells
    for (var y = 0; y < h; ++y) {
        for (var x = 0; x < w / 2; ++x) {
            // If the cell is a body cell
            if (ship[this.cell(x, y)] == this.S_SHAPE) {
                // Top
                if (y > 0 && ship[this.cell(x, y - 1)] == this.S_EMPTY) {
                    ship[this.cell(x, y - 1)] = this.S_SOLID;
                }
                // Left
                if (x > 0 && ship[this.cell(x - 1, y)] == this.S_EMPTY) {
                    ship[this.cell(x - 1, y)] = this.S_SOLID;
                }
                // Right
                if (x < (w / 2 - 1) && ship[this.cell(x + 1, y)] == this.S_EMPTY) {
                    ship[this.cell(x + 1, y)] = this.S_SOLID;
                }
                // Bottom
                if (y < h && ship[this.cell(x, y + 1)] == this.S_EMPTY) {
                    ship[this.cell(x, y + 1)] = this.S_SOLID;
                }
            }
        }
    }
    
    // Coloring pixels inside the image resource
    for (var y = 0; y < h; ++y) {
        for (var x = 0; x < w / 2; ++x) {
            // Defining base color
            var color = this.colors(0, 0, 0, 0);
            // Defining color values
            switch (ship[this.cell(x, y)]) {
                case (this.S_EMPTY):
                    // If empty, just uses the base color.
                    break;
                case (this.S_SOLID):
                    // Black border
                    color = this.colors(0, 0, 0, 255);
                    break;
                case (this.S_SHAPE):
                    // Defining body color if monochrome (white) 
                    if (this.monochrome) {
                        color = this.colors(255, 255, 255, 255);
                    } else {
                        // Defining default body color
                        color = this.shapeColor(x, y);
                    }
                    break;
                case (this.S_CABIN):
                    // Defining cockpit color if monochrome (white)
                    if (this.monochrome) {
                        color = this.colors(255, 255, 255, 255);
                    } else {
                        // Defining default cockpit color
                        color = this.cabinColor(x, y);
                    }
                    break;
            }
            // Defining Pixel
            this.draw(imgs, x, y, color);
            // Drawing mirrored pixel
            this.draw(imgs, (w - x) - 1, y, color);
        }
    }
    
    // Returning
    return imgs;
};



/* IMAGE GENERATION
 * ====================================================================== */

/**
 * Generates a single ship, as a base64 encoded PNG image, then embeds it 
 * before the closing body tag.
 * 
 * Image size is 16px square.
 */
InfiniShip.prototype.makeShip = function() 
{
    // Defining the main (Canvas) size, for drawing a single ship
    this.main.width = this.SHIP_W + 4;
    this.main.height = this.SHIP_H + 4;
    
    // Creating a new image object to serve as wrapper
    var wrap = new Image();
    
    // Generating ship
    ship = this.generateSingle();
    
    // Inserting pixels into the image
    this.context.putImageData(ship, 2, 2);
    
    // Defining wrapper source
    wrap.src = this.main.toDataURL();
    
    // Embedding into the document
    document.body.appendChild(wrap);
};

/**
 * Generates a sprite sheet containing the specified number of ships on 
 * the horizontal (<numX>) and vertical (<numY>). The image size is 
 * automatically calculated and each ship occupies 16px square inside the 
 * image.
 * 
 * The default values for both horizontal and vertical quantities is 8.
 * 
 * The image is returned as a base64 encoded PNG image placed inside an 
 * image tag.
 * 
 * @param {Int} h Quantity of ships, horizontally (default: 8)
 * @param {Int} v Quantity of ships, vertically (default: 8)
 */
InfiniShip.prototype.makeMultiple = function(numX, numY) 
{
    // Checking h and v
    numX = (numX > 0) ? numX : 8;
    numY = (numY > 0) ? numY : 8;
    
    // Calculating image dimensions
    this.main.width = (this.SHIP_W + 4) * numX;
    this.main.height = (this.SHIP_H + 4) * numY;
    
    // Creating a new image object to serve as wrapper
    var wrap = new Image();
    
    // Generating ships and inserting them inside the image
    for (var y = 0; y < (this.main.height - 12); y += 16) {
        for (var x = 0; x < (this.main.width - 12); x += 16) {
            // Creating ship
            ship = this.generateSingle();
            
            // Inserting into image
            this.context.putImageData(ship, x + 2, y + 2);
            
            // Redefining seed so different ships are created
            this.mainseed = this.generateSeed();
            this.clrsseed = this.generateSeed();
        }
    }
    
    // Defining wrapper source
    wrap.src = this.main.toDataURL();
    
    // Embedding into the document
    wrap.style.visibility = "hidden";
    wrap.setAttribute("id", "sheet");
    document.body.appendChild(wrap);
};
