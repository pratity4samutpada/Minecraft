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

    makeStartMatrix: function () {
                Minecraft.makeStartTerrain();
    },

    makeStartTerrain: function(){
        for (var i = Minecraft.matrix.length - 1; i >= 2 * (x / 3); i--) {
            for (var j = 0; j < Minecraft.matrix[i].length; j++) {
                if (i === Minecraft.matrix.length - 1) { //bottom row is all dirt...(We should write it so that 1/5 of the bottom 1/3 is always dirt...).
                    Minecraft.matrix[i][j] = "dirt";

                } else { //****This is how we randomize the terrain****
                    if (Minecraft.matrix[i + 1][j] == "dirt") { //if the cell below the current cell has dirt...

                        var rand = Math.round(Math.random()); //generate a random num between 0 and 1...

                        if (rand > 0 && i > 2 * (x / 3)) {     //and if the number is 1 and the row is not 1/3 of the matrix length...

                            Minecraft.matrix[i][j] = "dirt"; //put dirt in the current cell.

                        } else {
                            Minecraft.matrix[i][j] = "grass"; //if the number is 0, make the current cell grass.
                        }//The bug: if x is not divisible by 5, we still get dirt on the topmost row. It should always be grass.

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
var y = 20;

Minecraft.init(x, y);