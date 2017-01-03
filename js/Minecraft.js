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
        for (var i = Minecraft.matrix.length - 1; i >= 2 * (x / 3); i--) {
            for (var j = 0; j < Minecraft.matrix[i].length; j++) {
                if (i === 2 * (x / 3)) {
                    Minecraft.matrix[i][j] = "grass";
                }
                else {
                    Minecraft.matrix[i][j] = "dirt";
                }
            }
        }
        for (var i = 2 * (x/3) + 1; i > x/3; i--){
            
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
var y = 25;

Minecraft.init(x, y);