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
        for(var i=2*(x/3);i<y-1;i++){
            if(i%17==0){
                Minecraft.makeTree(i);

            }
            if(i%11==0){
                Minecraft.makeGrass(i);
            }
            if(i%13==0){
                Minecraft.makeRock(i);
            }
            if(i%37==0){
                Minecraft.makeCloud1(i);
            }
            if(i%27==0){
                Minecraft.makeCloud2(i);
            }
            if(i%21==0){
                Minecraft.makeCloud3(i);
            }
        }



    },

    makeTerrain: function(){
        // we create the "floor "
        for (var i = Minecraft.matrix.length - 1; i >= 2 * (x / 3); i--) {
            for (var j = 0; j < Minecraft.matrix[i].length; j++) {
                if (i === Minecraft.matrix.length - 1 || i>=1.3*2/3*x) { //bottom row is all dirt...(We should write it so that 1/5 of the bottom 1/3 is always dirt...).
                    Minecraft.matrix[i][j] = "dirt";

                } else { //****This is how we randomize the terrain****
                    if (Minecraft.matrix[i + 1][j] == "dirt") { //if the cell below the current cell has dirt...

                        var rand = Math.round(Math.random()); //generate either 0 or 1...

                        if (rand > 0 && i > 2 * (x / 3)) {     // if the number is 1 and the row is higher than 2/3 of the matrix...

                            Minecraft.matrix[i][j] = "dirt"; //put dirt in the current cell.

                        } else {
                            Minecraft.matrix[i][j] = "grass"; //if the number is 0, make the current cell grass.
                        }//The bug: if x is not divisible by 5, we still get dirt on the topmost row. It should always be grass.

                    }
                }

            }
        }

    },
    // first we choose the place of the tree(we choose the j(input e) , and then we do that to create the tree :

    makeTree:function(t){
        var test=0;
        var treePlace=2 *(x/3);
        while(test==0 && t<y){
            if(Minecraft.matrix[treePlace][t]=="grass") {
                test++;
            }
            else if(Minecraft.matrix[treePlace][t]=="dirt"){
                treePlace--;
            }
            else{
                treePlace++;
            }
        }
        treePlace--;
        Minecraft.matrix[treePlace][t]="tree";
        Minecraft.matrix[treePlace-1][t]="tree";
        Minecraft.matrix[treePlace-2][t]="tree";
        Minecraft.matrix[treePlace-3][t]="leaf";
        Minecraft.matrix[treePlace-4][t]="leaf";
        Minecraft.matrix[treePlace-3][t-1]="leaf";
        Minecraft.matrix[treePlace-4][t-1]="leaf";
        Minecraft.matrix[treePlace-3][t+1]="leaf";
        Minecraft.matrix[treePlace-4][t+1]="leaf";
        Minecraft.matrix[treePlace-5][t]="leaf";
        Minecraft.matrix[treePlace-5][t-1]="leaf";
        Minecraft.matrix[treePlace-5][t+1]="leaf";

    },

    // then we can do more than 1 tree

    makeGrass:function(g){

        for(var treePlace=2 *(x/3);treePlace<x;treePlace++) {
            if (Minecraft.matrix[treePlace][g] == "grass") {
                // Case 3
                if (Minecraft.matrix[treePlace][g - 1] == "grass" && Minecraft.matrix[treePlace][g + 1] == "grass" && Minecraft.matrix[treePlace - 1][g] != "tree" && Minecraft.matrix[treePlace - 1][g - 1] != "tree" && Minecraft.matrix[treePlace - 1][g + 1] != "tree") {
                    Minecraft.matrix[treePlace - 1][g] = "leaf";
                    Minecraft.matrix[treePlace - 1][g + 1] = "leaf";
                    Minecraft.matrix[treePlace - 1][g - 1] = "leaf";
                    Minecraft.matrix[treePlace - 2][g] = "leaf";

                }
                // Case 2 left
                if (Minecraft.matrix[treePlace][g + 1] == "grass" && Minecraft.matrix[treePlace - 1][g] != "tree" && Minecraft.matrix[treePlace - 1][g + 1] != "tree" && Minecraft.matrix[treePlace][g - 1] != "grass") {
                    Minecraft.matrix[treePlace - 1][g] = "leaf";
                    Minecraft.matrix[treePlace - 1][g + 1] = "leaf";
                    Minecraft.matrix[treePlace - 2][g] = "leaf";

                }
                // Case 2 right
                if (Minecraft.matrix[treePlace][g - 1] == "grass" && Minecraft.matrix[treePlace - 1][g] != "tree" && Minecraft.matrix[treePlace - 1][g - 1] != "tree" && Minecraft.matrix[treePlace][g + 1] != "grass") {
                    Minecraft.matrix[treePlace - 1][g] = "leaf";
                    Minecraft.matrix[treePlace - 1][g - 1] = "leaf";
                    Minecraft.matrix[treePlace - 2][g] = "leaf";

                }

                // Case 1
                if (Minecraft.matrix[treePlace][g - 1] != "grass" && Minecraft.matrix[treePlace][g + 1] != "grass" && Minecraft.matrix[treePlace - 1][g] != "tree") {
                    Minecraft.matrix[treePlace - 1][g] = "leaf";
                    Minecraft.matrix[treePlace - 2][g] = "leaf";


                }
            }

        }

    },

    makeRock:function(r){
        for(var treePlace=2 *(x/3);treePlace<x;treePlace++) {
            if (Minecraft.matrix[treePlace][r] == "grass") {
                // Case 2 left
                if (Minecraft.matrix[treePlace][r + 1] == "grass" && Minecraft.matrix[treePlace - 1][r] != "tree" && Minecraft.matrix[treePlace - 1][r] != "leaf" && Minecraft.matrix[treePlace - 1][r + 1] != "tree"  && Minecraft.matrix[treePlace - 1][r + 1] != "leaf" && Minecraft.matrix[treePlace][r - 1] != "grass") {
                    Minecraft.matrix[treePlace - 1][r] = "rock";
                    Minecraft.matrix[treePlace - 1][r + 1] = "rock";
                    // Minecraft.matrix[treePlace - 2][r] = "rock";
                }
                // Case 2 right
                if (Minecraft.matrix[treePlace][r - 1] == "grass" && Minecraft.matrix[treePlace - 1][r] != "tree" && Minecraft.matrix[treePlace - 1][r] != "leaf" && Minecraft.matrix[treePlace - 1][r - 1] != "tree" && Minecraft.matrix[treePlace - 1][r - 1] != "leaf" && Minecraft.matrix[treePlace][r + 1] != "grass") {
                    Minecraft.matrix[treePlace - 1][r] = "rock";
                    Minecraft.matrix[treePlace - 1][r - 1] = "rock";
                    // Minecraft.matrix[treePlace - 2][r] = "rock";
                }
                // Case 1
                if (Minecraft.matrix[treePlace][r - 1] != "grass" && Minecraft.matrix[treePlace][r + 1] != "grass" && Minecraft.matrix[treePlace - 1][r] != "tree"  && Minecraft.matrix[treePlace - 1][r] != "leaf" && Minecraft.matrix[treePlace - 2][r] != "tree"  && Minecraft.matrix[treePlace - 2][r] != "leaf") {
                    Minecraft.matrix[treePlace - 1][r] = "rock";
                    Minecraft.matrix[treePlace - 2][r] = "rock";
                }
            }
        }

    },

    makeCloud1:function(c){
        var cloud_x=(x/5);

        Minecraft.matrix[cloud_x][c]="white";
        Minecraft.matrix[cloud_x][c+1]="white";
        Minecraft.matrix[cloud_x][c+2]="white";
        Minecraft.matrix[cloud_x+1][c+1]="white";
        Minecraft.matrix[cloud_x+1][c+2]="white";
        Minecraft.matrix[cloud_x+1][c+3]="white";

    },

    makeCloud2:function(n){
        var cloud_x=(x/5);
        Minecraft.matrix[cloud_x][n]="white";
        Minecraft.matrix[cloud_x][n+1]="white";
        Minecraft.matrix[cloud_x][n+2]="white";
        Minecraft.matrix[cloud_x][n+3]="white";
        Minecraft.matrix[cloud_x][n+4]="white";
        Minecraft.matrix[cloud_x-1][n-1]="white";
        Minecraft.matrix[cloud_x-1][n]="white";
        Minecraft.matrix[cloud_x-1][n+1]="white";
        Minecraft.matrix[cloud_x-1][n+2]="white";
        Minecraft.matrix[cloud_x-1][n+3]="white";
        Minecraft.matrix[cloud_x+1][n+2]="white";
        Minecraft.matrix[cloud_x-2][n+1]="white";

    },

    makeCloud3:function(z) {
        var cloud_x=(x/5);
        Minecraft.matrix[cloud_x][z]="white";
        Minecraft.matrix[cloud_x][z+1]="white";
        Minecraft.matrix[cloud_x][z+2]="white";
        Minecraft.matrix[cloud_x][z+3]="white";
        Minecraft.matrix[cloud_x-1][z+1]="white";
        Minecraft.matrix[cloud_x+1][z+2]="white";
    },




    renderStartMatrix : function () {
    for (var i = 0; i < Minecraft.matrix.length; i++) {
        for (var j = 0; j < Minecraft.matrix[i].length; j++) {
            Minecraft.cells.eq(i * y + j).addClass(Minecraft.matrix[i][j]);
        }
    }

    },


};


var x = 15;
var y = 500;

Minecraft.init(x, y);