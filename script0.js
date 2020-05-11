function ver(){
  document.getElementById("liveFilter").style.visibility = "visible";
}
$(function() {
  liveFilter.build($("#liveFilter"), [1, 2]);
  


});

var liveFilter = function() {

  var wrapper,
    inputField,
    grid,
    gridRows,
    clearButton,
    zeroResults,
    datasource = [],
    columnsToIndex,

    //Create an array and populate it with key codes that should not cause shake effects
    noShakeCharacters = [8, 45, 46], //backspace, insert, delete

    //Create an array and populate it with key codes that don't trigger an action 
    characterExclusions = [13, 20, 27, 33, 34, 37, 39, 35, 36, 16, 17, 18, 144, 145], // enter, caps, esc, page up, page down, left, right, home, end, shift, ctrl, alt, num lock, scroll lock

    //Create the filter markup and set up events and datasources
    build = function(liveFilter, columns) {

      if (typeof liveFilter !== "undefined" && liveFilter.length > 0) {

        liveFilter.wrap('<div class="liveFilter"></div>').parent().prepend('<div class="liveFilterContainer"><div class="group"><input type="text" class="liveFilterInput" value="" placeholder="Ingrese nombre completo del alumno" /><a href="#" class="clearField" title="Clear Filter">x</a></div></div><div class="noResults"><strong>Lo siento.</strong> Aun sin resultados.</div>');

        wrapper = liveFilter.parent(),
          inputField = wrapper.find("input.liveFilterInput"),
          grid = liveFilter,
          gridRows = grid.find("tr:gt(0)"), // gt(0) prevents the first row (normally a TH) from being included.
          clearButton = wrapper.find(".clearField"),
          zeroResults = grid.prev(),
          columnsToIndex = columns;

        indexGrid();
        bindEvents();
      }
    },

    //This function (when called) creates the datasource that will be used to filter the grid
    indexGrid = function() {
      if (typeof columnsToIndex !== "undefined" && columnsToIndex.length > 0) {

        for (col = 0; col <= columnsToIndex.length - 1; col++) {
          gridRows.children("td:nth-child(" + columnsToIndex[col] + ")").each(function(i) {

            datasource[datasource.length++] = $(this).text();
          });
        }

      } else {

        gridRows.children("td:first-child").each(function(i) {

          datasource[i] = $(this).text();
        });
      }
    },

    //This function (when called) creates any relevant event listeners
    bindEvents = function() {

      inputField.on("keyup", function(key) {
        filterRows(key);
      });
      clearButton.on("click", function() {
        clearField();
        return false;
      });
    },

    //This function (when called) clears the field and resets the grid to it's default state
    clearField = function() {

      inputField.val('');
      clearButton.fadeOut(300);
      zeroResults.slideUp(300);
      gridRows.show();
      grid.show();
      document.getElementById("liveFilter").style.visibility = "hidden";
    },

    //This function (when called) filters the rows based on the data in the datasource array
    filterRows = function(key) {      

      if ($.inArray(key.keyCode, characterExclusions) === -1) {

        var liveFilterValue = inputField.val();

        if (liveFilterValue !== "") {

          clearButton.fadeIn(300);

          rowsToShow = [];

          var currentRow = 0,
            /*RE = new RegExp(liveFilterValue, "i");*/
            RE = liveFilterValue;

          // Check the value entered against a regular expression matched with the column data. If a match exists add the row to a new array      
          
          for (var i = 0; i < datasource.length; i++) {

/*if (datasource[i].match(RE)) {*/
            if (datasource[i]===RE) {
              console.log(datasource[i] +"and the RE is "+RE)
              rowsToShow.push(currentRow);
            }

            if (currentRow < gridRows.length - 1) {
              currentRow++;
            } else {
              currentRow = 0;
            }
          }

          // If there are matches, show the grid, hide all the rows and show the selected ones

          if (rowsToShow.length > 0) {

            grid.show();
            gridRows.hide();
            document.getElementById("liveFilter").style.visibility = "visible";
            

            if (zeroResults.is(":visible")) {
              zeroResults.slideUp(150);
            }

            for (var i = 0; i < rowsToShow.length; i++) {
              $(gridRows.get(rowsToShow[i])).show();
            }

            // If there are NO matches we hide the grid and display an error panel. If an incorrect value is entered while the error panel is visible it shakes itself assuming if it doesn't match any of the excluded values defined in the noShakeCharacters

          } else {

            grid.hide();

            // if the zeroResults panel is shown and the effects queue length is 0 and there are no illegal character presses

            if (zeroResults.is(":visible") && zeroResults.queue().length === 0 && $.inArray(key.keyCode, noShakeCharacters) == -1) {

              if (jQuery.ui) {
                zeroResults.effect('shake', {
                  times: 3,
                  distance: 5
                }, 500);
              }

            } else {
              zeroResults.slideDown(150);
            }
          }

          // If the value entered is blank, hide the clear field button, show the grid and all of its rows and hide the no results panel if it is visible

        } else {
          clearField();
        }
      }
    };

  return {
    build: build
  };
}();
