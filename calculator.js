// A string version of what is showing on the display
let DisplayString = "";

// Clear the calculator
function doClear() {
   DisplayString = "0";
   updateDisplay();
}

// Update the calculator display with the current value
function updateDisplay() {
   document.querySelector('#display').textContent = DisplayString;
}

// The user pressed a key that is not allowed given the current state
function disallowed(msg) {
   console.warn(msg);
   // XXX add some kind of warning audio tone
}

function containsDecimalPoint(string) {
   return string.includes(".");
}

/* Respond to a key being pressed that enters a digit.  This includes
 * the decimal point. Basically, anything that adds to the value on
 * the display.
 */
function digitEntered(event) {
   // console.log(event);
   let div = event.currentTarget;
   // console.log(div);
   console.log(`Digit entered: ${div.textContent}`);
   // console.log(div.textContent);
   // console.log(div.id);

   // Typically, we add entered keys to the display text
   // The exception is that we don't want extraneous leading 0's
   if (DisplayString == "0" && div.id != "point") {
      DisplayString = "";
   }

   // Can only have a single decimal point
   if (div.id == "point" && containsDecimalPoint(DisplayString)) {
      disallowed("Can only have a single decimal point in a number");
      return;
   }

   // XXX add something to limit how many characters we support

   DisplayString += div.textContent;
   updateDisplay();
}

function addEventListeners() {
    document.querySelectorAll('.digit').forEach(
        div => div.addEventListener('click', digitEntered));
}

doClear();
addEventListeners();

console.log("Ready");
