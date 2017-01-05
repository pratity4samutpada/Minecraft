var Minecraft = {

    selected: "",
    leaf: 0,
    tree: 0,
    rock: 0,
    dirt: 0,
    grass: 0,
    maxInventory: 10,

    init: function (x, y) {
        Minecraft.drawGrid(x, y);
        Minecraft.buildMatrix(x, y);
        Minecraft.makeStartMatrix();
        Minecraft.renderStartMatrix();
        Minecraft.populateMenu();
        Minecraft.drawMiniMap(x, y);
        Minecraft.renderMiniMap();
        Minecraft.setupScroll();

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
                if (i != x - 1) {
                    $(cell).click(Minecraft.changeCell);
                }

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

    changeCell: function () {

        if (Minecraft.selected == "axe") {
            Minecraft.axe($(this));
        }
        if (Minecraft.selected == "shovel") {
            Minecraft.shovel($(this));
        }
        if (Minecraft.selected == "pickaxe") {
            Minecraft.pickaxe($(this));
        }

        else if (Minecraft.selected !== "axe" && Minecraft.selected !== "shovel" && Minecraft.selected !== "pickaxe") {
            Minecraft.placeResource($(this))
        }

    },

    placeResource: function (target) {
        if (Minecraft[Minecraft.selected] > 0 && Minecraft.checkResourcePosition(target)) {
            Minecraft.matrix[target.data("i")][target.data("j")] = Minecraft.selected;
            target.addClass(Minecraft.selected);
            Minecraft.subtractInventory(Minecraft.selected);
            Minecraft.renderMiniMap();
        } else {
            Minecraft.wrongTool(Minecraft.selected);
        }

    },

    checkResourcePosition: function (target) {
        var checkSiblings = (Minecraft.matrix[target.data("i") + 1][target.data("j")] != undefined) || (Minecraft.matrix[target.data("i")][target.data("j") + 1] != undefined) || (Minecraft.matrix[target.data("i")][target.data("j") - 1] != undefined);
        return (checkSiblings && Minecraft.matrix[target.data("i")][target.data("j")] === undefined );


    },

    checkToolPosition: function (target) {
        if (target.data("i") === 0 || Minecraft.matrix[target.data("i") - 1][target.data("j")] == "white") {
            return true
        } else {
            return (Minecraft.matrix[target.data("i") - 1][target.data("j")] === undefined);
        }

    },


    axe: function (target) {
        if (target.hasClass("tree") && Minecraft.checkToolPosition(target)) {
            Minecraft.matrix[target.data("i")][target.data("j")] = undefined;
            target.removeClass("tree");
            Minecraft.addInventory("tree");
            Minecraft.renderMiniMap();
        }
        else if (target.hasClass("leaf") && Minecraft.checkToolPosition(target)) {
            Minecraft.matrix[target.data("i")][target.data("j")] = undefined;
            target.removeClass("leaf");
            Minecraft.addInventory("leaf");
            Minecraft.renderMiniMap();

        } else {
            Minecraft.wrongTool(Minecraft.selected);
        }
    },

    shovel: function (target) {
        if (target.hasClass("grass") && Minecraft.checkToolPosition(target)) {
            Minecraft.matrix[target.data("i")][target.data("j")] = undefined;
            target.removeClass("grass");
            Minecraft.addInventory("grass");
            Minecraft.renderMiniMap();
        }
        else if (target.hasClass("dirt") && Minecraft.checkToolPosition(target)) {
            Minecraft.matrix[target.data("i")][target.data("j")] = undefined;
            target.removeClass("dirt");
            Minecraft.addInventory("dirt");
            Minecraft.renderMiniMap();
        }

        else {
            Minecraft.wrongTool(Minecraft.selected);
        }

    }
    ,

    pickaxe: function (target) {
        if (target.hasClass("rock") && Minecraft.checkToolPosition(target)) {
            Minecraft.matrix[target.data("i")][target.data("j")] = undefined;
            target.removeClass("rock");
            Minecraft.addInventory("rock");
            Minecraft.renderMiniMap();

        } else {
            Minecraft.wrongTool(Minecraft.selected);
        }

    }
    ,

    addInventory: function (resource) {
        Minecraft[resource]++;
        Minecraft.updateCounter(resource);
    }
    ,

    subtractInventory: function (resource) {
        Minecraft[resource]--;
        Minecraft.updateCounter(resource);
    }
    ,

    updateCounter: function (resource) {
        $('#' + resource + " span.counter").text(Minecraft[resource]);

    }
    ,

    wrongTool: function (tool) {
        $('#' + tool).removeClass("selected").addClass("wrongTool");
        setTimeout(function () {
            $('#' + tool).addClass("selected").removeClass("wrongTool");
        }, 100);
    }
    ,

    makeStartMatrix: function () {
        Minecraft.makeTerrain();
        for (var i = 2 * (x / 3); i < y - 1; i++) {
            if (i % 17 == 0) {
                Minecraft.makeTree(i);

            }
            if (i % 11 == 0) {
                Minecraft.makeGrass(i);
            }
            if (i % 13 == 0) {
                Minecraft.makeRock(i);
            }
            if (i % 37 == 0) {
                Minecraft.makeCloud1(i);
            }
            if (i % 27 == 0) {
                Minecraft.makeCloud2(i);
            }
            if (i % 13 == 0) {
                Minecraft.makeCloud3(i);
            }
        }


    }
    ,

    makeTerrain: function () {
        // we create the "floor "
        for (var i = Minecraft.matrix.length - 1; i >= 2 * (x / 3); i--) {
            for (var j = 0; j < Minecraft.matrix[i].length; j++) {
                if (i === Minecraft.matrix.length - 1 || i >= 1.3 * 2 / 3 * x) {
                    Minecraft.matrix[i][j] = "dirt";

                } else { //****This is how we randomize the terrain****
                    if (Minecraft.matrix[i + 1][j] == "dirt") {

                        var rand = Math.round(Math.random());

                        if (rand > 0 && i > 2 * (x / 3)) {

                            Minecraft.matrix[i][j] = "dirt";

                        } else {
                            Minecraft.matrix[i][j] = "grass";
                        }

                    }
                }

            }
        }

    }
    ,
// first we choose the place of the tree(we choose the j(input e) , and then we do that to create the tree :

    makeTree: function (t) {
        var test = 0;
        var treePlace = 2 * (x / 3);
        while (test == 0 && t < y) {
            if (Minecraft.matrix[treePlace][t] == "grass") {
                test++;
            }
            else if (Minecraft.matrix[treePlace][t] == "dirt") {
                treePlace--;
            }
            else {
                treePlace++;
            }
        }
        treePlace--;
        Minecraft.matrix[treePlace][t] = "tree";
        Minecraft.matrix[treePlace - 1][t] = "tree";
        Minecraft.matrix[treePlace - 2][t] = "tree";
        Minecraft.matrix[treePlace - 3][t] = "leaf";
        Minecraft.matrix[treePlace - 4][t] = "leaf";
        Minecraft.matrix[treePlace - 3][t - 1] = "leaf";
        Minecraft.matrix[treePlace - 4][t - 1] = "leaf";
        Minecraft.matrix[treePlace - 3][t + 1] = "leaf";
        Minecraft.matrix[treePlace - 4][t + 1] = "leaf";
        Minecraft.matrix[treePlace - 5][t] = "leaf";
        Minecraft.matrix[treePlace - 5][t - 1] = "leaf";
        Minecraft.matrix[treePlace - 5][t + 1] = "leaf";

    }
    ,

// then we can do more than 1 tree

    makeGrass: function (g) {

        for (var treePlace = 2 * (x / 3); treePlace < x; treePlace++) {
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

    }
    ,

    makeRock: function (r) {
        for (var treePlace = 2 * (x / 3); treePlace < x; treePlace++) {
            if (Minecraft.matrix[treePlace][r] == "grass") {
                // Case 2 left
                if (Minecraft.matrix[treePlace][r + 1] == "grass" && Minecraft.matrix[treePlace - 1][r] != "tree" && Minecraft.matrix[treePlace - 1][r] != "leaf" && Minecraft.matrix[treePlace - 1][r + 1] != "tree" && Minecraft.matrix[treePlace - 1][r + 1] != "leaf" && Minecraft.matrix[treePlace][r - 1] != "grass") {
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
                if (Minecraft.matrix[treePlace][r - 1] != "grass" && Minecraft.matrix[treePlace][r + 1] != "grass" && Minecraft.matrix[treePlace - 1][r] != "tree" && Minecraft.matrix[treePlace - 1][r] != "leaf" && Minecraft.matrix[treePlace - 2][r] != "tree" && Minecraft.matrix[treePlace - 2][r] != "leaf") {
                    Minecraft.matrix[treePlace - 1][r] = "rock";
                    Minecraft.matrix[treePlace - 2][r] = "rock";
                }
            }
        }

    }
    ,

    makeCloud1: function (c) {
        var cloud_x = (x / 5);

        Minecraft.matrix[cloud_x][c] = "white";
        Minecraft.matrix[cloud_x][c + 1] = "white";
        Minecraft.matrix[cloud_x][c + 2] = "white";
        Minecraft.matrix[cloud_x + 1][c + 1] = "white";
        Minecraft.matrix[cloud_x + 1][c + 2] = "white";
        Minecraft.matrix[cloud_x + 1][c + 3] = "white";

    }
    ,

    makeCloud2: function (n) {
        var cloud_x = (x / 5);
        Minecraft.matrix[cloud_x][n] = "white";
        Minecraft.matrix[cloud_x][n + 1] = "white";
        Minecraft.matrix[cloud_x][n + 2] = "white";
        Minecraft.matrix[cloud_x][n + 3] = "white";
        Minecraft.matrix[cloud_x][n + 4] = "white";
        Minecraft.matrix[cloud_x - 1][n - 1] = "white";
        Minecraft.matrix[cloud_x - 1][n] = "white";
        Minecraft.matrix[cloud_x - 1][n + 1] = "white";
        Minecraft.matrix[cloud_x - 1][n + 2] = "white";
        Minecraft.matrix[cloud_x - 1][n + 3] = "white";
        Minecraft.matrix[cloud_x + 1][n + 2] = "white";
        Minecraft.matrix[cloud_x - 2][n + 1] = "white";

    }
    ,

    makeCloud3: function (z) {
        var cloud_x = (x / 5);
        Minecraft.matrix[cloud_x][z] = "white";
        Minecraft.matrix[cloud_x][z + 1] = "white";
        Minecraft.matrix[cloud_x][z + 2] = "white";
        Minecraft.matrix[cloud_x][z + 3] = "white";
        Minecraft.matrix[cloud_x - 1][z + 1] = "white";
        Minecraft.matrix[cloud_x + 1][z + 2] = "white";
    }
    ,


    populateMenu: function () {
        var tools = ["axe", "pickaxe", "shovel"];
        var resources = ["dirt", "grass", "rock", "leaf", "tree"];
        var menu = $("#menu");
        menu.addClass("active");
        var menuBigContainer = $("<div/>").addClass("bigToolContainer").appendTo(menu)
        for (var i = 0; i < tools.length; i++) {
            var container = $("<div/>").addClass("toolContainer").appendTo(menuBigContainer);
            var tool = $("<div/>").addClass("tool").attr("id", tools[i]).appendTo(container);
            tool.click(Minecraft.selectTool);
        }
        for (var i = 0; i < resources.length; i++) {
            var container = $("<div/>").addClass("toolContainer").appendTo(menuBigContainer);
            var resource = $("<div/>").addClass(resources[i] + " tool").attr("id", resources[i]).appendTo(container);
            var counter = $("<span/>").addClass("counter").text(0).appendTo(resource);
            resource.click(Minecraft.selectTool);
        }


    }
    ,

    selectTool: function () {
        var targ = $(this);
        Minecraft.selected = targ.attr("id");
        $(".selected").removeClass("selected");
        targ.addClass("selected");


    },

    setupScroll: function () {
        var gridContainer = $("#gridContainer"), x;
        $(".scroll").hover(function () {
            if ($(this).hasClass("scrollRight")) {
                x = ((gridContainer.width() / 5)) + gridContainer.scrollLeft();
                gridContainer.animate({
                    scrollLeft: x,
                })
            } else {
                x = ((gridContainer.width() / 5)) - gridContainer.scrollLeft();
                gridContainer.animate({
                    scrollLeft: -x,
                })
            }
        })


    }
    ,
    renderMiniMap: function () {
        Minecraft.miniCell
            .removeClass("leaf")
            .removeClass("rock")
            .removeClass("tree")
            .removeClass("grass")
            .removeClass("dirt");

        for (var i = 0; i < Minecraft.matrix.length; i++) {
            for (var j = 0; j < Minecraft.matrix[i].length; j++) {
                Minecraft.miniCell.eq(i * y + j).addClass(Minecraft.matrix[i][j]);
            }

        }
    }
    ,
    drawMiniMap: function (x, y) {
        // we create our grid
        for (var i = 0; i < x; i++) {
            var row = $("<div/>");
            row.addClass("row");
            $("#miniMap").append(row);
            for (var j = 0; j < y; j++) {
                var cell = $("<div/>");
                cell.addClass("miniMapCell");
                row.append(cell);


            }
        }

        Minecraft.miniCell = $(".miniMapCell");
        for (var i = 0; i < Minecraft.matrix.length; i++) {
            for (var j = 0; j < Minecraft.matrix[i].length; j++) {
                Minecraft.miniCell.eq(i * y + j)
                    .data("i", i)
                    .data("j", j);
            }
        }

    }
    ,


    renderStartMatrix: function () {
        for (var i = 0; i < Minecraft.matrix.length; i++) {
            for (var j = 0; j < Minecraft.matrix[i].length; j++) {
                Minecraft.cells.eq(i * y + j).addClass(Minecraft.matrix[i][j]);
            }
        }

    }


};


var x = 15;
var y = 200;
Minecraft.init(x, y);