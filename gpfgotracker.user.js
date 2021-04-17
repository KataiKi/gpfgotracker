// ==UserScript==
// @name     Gamepress Tracker (FGO)
// @version  1
// @grant    GM.getValue
// @grant    GM.setValue
// @author   Katai
// @include  https://gamepress.gg/grandorder*walkthrough*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// ==/UserScript==

//console.log( await GM.getValue("curstep",1)  );

var path = window.location.pathname;

var curstep = 1;
var curcount = 0;

var stepCounter;
var counter;


function jumpTo( step ) {
  $(window).scrollTop(
    $("span").filter(function() {
			return $(this).html() === "Step " + step;
		}).offset().top);
}

async function step(v) {
	curstep = Math.max(1, curstep+v);
  stepCounter.innerHTML = "Step: " + curstep;
  await GM.setValue(path + "curstep",curstep)
  jumpTo(curstep);
}

async function reset() {
  curstep = 1;
  stepCounter.innerHTML = "Step: " + curstep;
  await GM.setValue(path + "curstep",curstep)
  jumpTo(curstep);
}

async function setCounter(v) {
  curcount = v;
  counter.innerHTML = v;
  await GM.setValue(path + "curcounter",v);
}


async function load() {
  
  curstep = (await GM.getValue(path + "curstep",1));
  curcount = (await GM.getValue(path + "curcounter",0));
  
  var wrapper = document.createElement('div');
  wrapper.setAttribute('style',
    `position:fixed;
    top:20px;     
    left:20px;
    display:inline-block;
    z-index:100;`
  );
  
  var buttonUp = document.createElement('button');
  buttonUp.innerHTML="▲";
  buttonUp.onclick = function(){ step(-1); document.activeElement.blur() };
  buttonUp.setAttribute('style',
    `margin: 0 0 5px 0;
		padding: 5px;`
  );
  
  var buttonDown = document.createElement('button');
  buttonDown.innerHTML="▼";
  buttonDown.onclick = function(){ step(1); document.activeElement.blur() };
  buttonDown.setAttribute('style',
    `margin: 0 0 5px 0;
		padding: 5px;`
  );
      
  stepCounter = document.createElement('button');
  stepCounter.innerHTML = "Step: " + curstep;
  stepCounter.setAttribute('style',
    `padding: 5px;
		cursor: pointer;
		margin: 0 0 5px 0;
		font-weight: normal !important;`
  );
  stepCounter.onclick = function(){ jumpTo(curstep), document.activeElement.blur() };
  
  
  wrapper.appendChild(buttonUp);
  wrapper.appendChild(stepCounter);
  wrapper.appendChild(buttonDown);
  
  
  document.body.appendChild(wrapper);
  
  jumpTo(curstep);
  
  var countWrapper = document.createElement('div');
  countWrapper.setAttribute('style', `text-align: right;`);
  
  counter = document.createElement('button');
  counter.innerHTML = curcount;
  counter.setAttribute('style',
    `padding: 5px;
		display: inline-block;
		cursor: pointer;
		margin: 0 5px 0 0;
		font-weight: normal !important;
		width: 30px;`              
  );
  counter.onclick = function(){ setCounter(curcount+1); document.activeElement.blur()}
  
  
  var buttonReset = document.createElement('button');
  buttonReset.innerHTML = "⟲";
  buttonReset.setAttribute('style',
    `padding: 5px;
		display: inline-block;
		cursor: pointer;
		margin: 0;
		width: auto`
  );
  buttonReset.onclick = function(){ setCounter(0); document.activeElement.blur()}
  
  
  countWrapper.appendChild(counter);
  countWrapper.appendChild(buttonReset);
  
  wrapper.appendChild(countWrapper);
}

load();
