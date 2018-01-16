$(function(){
  generateTOC();
  $("#content").scroll(triggerTOCUpdate);
  setInterval(updateTOC, 100);
  triggerTOCUpdate();
});

///////////////////////////////////////////////////////

var needUpdate = true;
var allHeadings = [];
var allTOCHeadings = [];
var activeHeadingIndex = 0;
var oldActiveHeadingIndex = 0;
var activeHeadingLastPos = 0;

var pointerYOffset = 30;

function generateTOC() {
  // get the element to place the toc
  var toc = $('#toc');
  // iterate through all headings in body
  $.each($("#content").find('h1,h2,h3,h4'), function(index, item) {
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
  setEntryActive(0);
}

function triggerTOCUpdate() {
  needUpdate = true;
}

function updateTOC() {
  // check if we scrolled
  if (needUpdate) {
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
      setEntryActive(activeHeadingIndex);
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
