$(function(){
  generateTOC();

  $(window).on("load", function() {
    // convert hidden anchor to real one just on startup
    document.location.hash = document.location.hash.replace(/^#\//, '#');
    console.log(document.location.hash);

    $("#content").scroll(triggerTOCUpdate);
    setInterval(updateTOC, 100);
    triggerTOCUpdate();
  });

});

///////////////////////////////////////////////////////

var needUpdate = true;
var allHeadings = [];
var allTOCHeadings = [];
var activeHeadingIndex = 0;
var oldActiveHeadingIndex = 0;
var activeHeadingLastPos = 0;

var pointerYOffset = 10;

function generateTOC() {
  // get the element to place the toc
  var toc = $('#toc');
  // iterate through all headings in body
  $.each($("#content").find('h1,h2,h3,h4'), function(index, item) {
    // add unique id to original item
    $(item).attr('id',encodeURIComponent($(item).text().trim().replace(/ /g,"_")));
    // generate entry for toc
    var thisEntry = $("<a href='#" + $(item).attr('id') + "'></a>");
    var thisTOCHeading = $("<" + $(item).get(0).tagName + ">").text($(item).text());
    thisEntry.html(thisTOCHeading);
    // add entry to toc
    toc.append(thisEntry);
    // remember heading elements
    allHeadings.push($(item));
    allTOCHeadings.push(thisTOCHeading);
  });

  // only do something if there is content
  if (allHeadings.length && allTOCHeadings.length) {
    setEntryActive(0);
  } else {
    toc.html("No headings found");
  }
}

function triggerTOCUpdate() {
    needUpdate = true;
}

function updateTOC() {
  // check if we scrolled
  if (needUpdate && allHeadings.length && allTOCHeadings.length) {
    // check if active entry moved
    var relativeMovement = activeHeadingLastPos - allHeadings[activeHeadingIndex].offset().top;
    // remember if active heading has to be reset
    var changedActive = false;

    // scrolling up
    if (relativeMovement < 0) {
      while(activeHeadingIndex >= 1 && allHeadings[activeHeadingIndex].offset().top > pointerYOffset) {
        // go to previous heading
        activeHeadingIndex = activeHeadingIndex - 1;
        changedActive = true;
      }
    }

    // scrolling down
    else {
      while(activeHeadingIndex < allHeadings.length-1 && allHeadings[activeHeadingIndex+1].offset().top <= pointerYOffset) {
        // go to next heading
        activeHeadingIndex = activeHeadingIndex + 1;
        changedActive = true;
      }
    }

    // actually change the active heading if new index was selected
    if (changedActive) {
      // scroll the toc
      setEntryActive(activeHeadingIndex);
      // update url anchor in a hidden way to not trigger scrolling
      document.location.hash = "#/" + allHeadings[activeHeadingIndex].attr('id');
    }

    // remember position of this heading
    activeHeadingLastPos = allHeadings[activeHeadingIndex].offset().top;

    needUpdate = false;
  }
}

function setEntryActive(index) {

  allTOCHeadings[oldActiveHeadingIndex].removeClass('active');
  oldActiveHeadingIndex = activeHeadingIndex;

  allTOCHeadings[activeHeadingIndex].addClass('active');
  var absoluteTOCElementPosition = $("#toc").scrollTop() + allTOCHeadings[activeHeadingIndex].position().top - pointerYOffset;
  $('#toc').animate({scrollTop: absoluteTOCElementPosition}, 100);
}
