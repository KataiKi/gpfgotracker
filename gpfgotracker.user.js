// ==UserScript==
// @name     Gamepress Tracker (FGO)
// @description Keep track of Fate/Grand ORder Walkthrough progress on GamePress
// @version  1.3
// @grant    GM.getValue
// @grant    GM.setValue
// @author   Katai
// @include  https://gamepress.gg/grandorder*walkthrough*
// @include  https://fgo.gamepress.gg/*walkthrough*
// @include  https://grandorder.gamepress.gg/p/*walkthrough*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @updateURL https://github.com/KataiKi/gpfgotracker/raw/main/gpfgotracker.user.js
// ==/UserScript==

/*jshint esversion: 9 */

var path = window.location.pathname;

var curstep = 0;
var curcount = 0;

var stepCounterElement;
var counterElement;


function jumpTo( step ) {
  
  if(step <= 0){
    return;
  }
  
  
  $(window).scrollTop(
    $("span").filter(function() {
      return $(this).html().startsWith(""+step) && $(this).parent().hasClass("walkcol1");
    }).parent().offset().top);
}

function jumpToElement( element, offset ) {
  console.log(element);
  $(window).scrollTop(element.offset().top + offset);
}

async function setStep(v) {
  
  if(v < 0)
    return;
  
  curstep = v;
  stepCounterElement.innerHTML = "Step: " + curstep;
  await GM.setValue(path + "curstep",curstep);
  jumpTo(curstep);
}

async function setCounter(v) {
  
  curcount = v;
  counterElement.innerHTML = v;
  await GM.setValue(path + "curcounter",v);
}


async function load() {

  curstep = (await GM.getValue(path + "curstep",1));
  curcount = (await GM.getValue(path + "curcounter",0));
  
  steplist = $("span").filter(function() {return $(this).html().match(/^\d/)});
  
  

  var wrapper = document.createElement('div');
  wrapper.setAttribute('style',
    `position:fixed;
    top:20px;
    left:320px;
    display:inline-block;
    z-index:100;`
  );

  var stepButtonUp = document.createElement('button');
  stepButtonUp.innerHTML="▲";
  stepButtonUp.onclick = function(){ setStep(curstep-1); document.activeElement.blur(); };
  stepButtonUp.setAttribute('style',
    `margin: 0 0 5px 0;
    padding: 5px;`
  );

  var stepButtonDown = document.createElement('button');
  stepButtonDown.innerHTML="▼";
  stepButtonDown.onclick = function(){ setStep(curstep+1); document.activeElement.blur(); };
  stepButtonDown.setAttribute('style',
    `margin: 0 0 5px 0;
    padding: 5px;`
  );

  stepCounterElement = document.createElement('button');
  stepCounterElement.innerHTML = "Step: " + curstep;
  stepCounterElement.setAttribute('style',
    `padding: 5px;
    cursor: pointer;
    margin: 0 0 5px 0;
    font-weight: normal !important;`
  );
  stepCounterElement.onclick = function(){ jumpTo(curstep); document.activeElement.blur(); };
  stepCounterElement.addEventListener('wheel', function(event) {
     if (event.deltaY < 0) {
      setStep(curstep-1);
     }
     else if (event.deltaY > 0) {
      setStep(curstep+1);
     }
  });

  wrapper.appendChild(stepButtonUp);
  wrapper.appendChild(stepCounterElement);
  wrapper.appendChild(stepButtonDown);

  document.body.appendChild(wrapper);
  jumpTo(curstep);

  var countWrapper = document.createElement('div');
  countWrapper.setAttribute('style', `text-align: right;`);

  counterElement = document.createElement('button');
  counterElement.innerHTML = curcount;
  counterElement.setAttribute('style',
    `padding: 5px;
    display: inline-block;
    cursor: pointer;
    margin: 0 5px 0 0;
    font-weight: normal !important;
    width: 30px;`       
  );
  counterElement.onclick = function(){ setCounter(curcount+1); document.activeElement.blur();};

  var countResetButton = document.createElement('button');
  countResetButton.innerHTML = "⟲";
  countResetButton.setAttribute('style',
    `padding: 5px;
    display: inline-block;
    cursor: pointer;
    margin: 0;
    width: auto`
  );
  countResetButton.onclick = function(){ setCounter(0); document.activeElement.blur();};


  countWrapper.appendChild(counterElement);
  countWrapper.appendChild(countResetButton);

  wrapper.appendChild(countWrapper);
}

load();
