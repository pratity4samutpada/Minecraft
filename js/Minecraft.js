var Minecraft = {

    init: function (x, y) {
        Minecraft.drawGrid(x, y);
        Minecraft.buildMatrix(x, y);
        Minecraft.makeStartMatrix();
        Minecraft.renderStartMatrix();

    },

    drawGrid: function (x, y) {
        // we create our grid 
        for (var i = 0; i < x; i++) {
            var row = $("<div/>");
            row.addClass("row");
            $("#grid").append(row);
            for (var j = 0; j < y; j++) {
                var cell = $("<div/>");
                cell.addClass("cell");
                row.append(cell);
            }
        }
    },

    buildMatrix: function (x, y) {
        //we create our matrix 
        Minecraft.matrix = new Array(x);
        Minecraft.cells = $(".cell");

        for (var i = 0; i < Minecraft.matrix.length; i++) {
            Minecraft.matrix[i] = new Array(y);
        }

        //We link our matrix to our grid
        for (var i = 0; i < Minecraft.matrix.length; i++) {
            for (var j = 0; j < Minecraft.matrix[i].length; j++) {
                Minecraft.cells.eq(i * y + j)
                    .data("i", i)
                    .data("j", j);
            }
        }

    },

    renderGrid: function () {


    },

    pickTool: function () {
    },

    changeCell: function () {
    },

    makeStartMatrix: function () { //I put the terrain generation in a separate function. Now we can write functions to make rocks and trees on top of the ground.
                Minecraft.makeTerrain();

    },

    makeTerrain: function(){
        for (var i = Minecraft.matrix.length - 1; i >= 2 * (x / 3); i--) {
            for (var j = 0; j < Minecraft.matrix[i].length; j++) {
                if (i === Minecraft.matrix.length - 1) { //bottom row is all dirt...(We should write it so that 1/5 of the bottom 1/3 is always dirt...).
                    Minecraft.matrix[i][j] = "dirt";

                } else { //****This is how we randomize the terrain****
                    if (Minecraft.matrix[i + 1][j] == "dirt") { //if the cell below the current cell has dirt...

                        var rand = Math.round(Math.random()); //generate either 0 or 1...

                        if (rand > 0 && i > Math.floor(2 * (x / 3))) {     // if the number is 1 and the row is higher than 2/3 of the matrix...

                            Minecraft.matrix[i][j] = "dirt"; //put dirt in the current cell.

                        } else {
                            Minecraft.matrix[i][j] = "grass"; //if the number is 0, make the current cell grass.
                        }//The bug: if x is not divisible by 3, we still get dirt on the topmost row. It should always be grass.
                        //The problem is with  "if (rand > 0 && i > Math.floor(2 * (x / 3)))"---If, for example,
                        // x = 17, it will be harder to calculate 1/3 of the grid.

                    }
                }

            }
        }
    },

    renderStartMatrix: function () {
        for (var i = 0; i < Minecraft.matrix.length; i++) {
            for (var j = 0; j < Minecraft.matrix[i].length; j++) {
                Minecraft.cells.eq(i * y + j).addClass(Minecraft.matrix[i][j]);
            }
        }

    }


};


var x = 15;
var y = 30;

Minecraft.init(x, y);