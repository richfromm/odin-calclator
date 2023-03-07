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
   let div = event.currentTarget;
   console.log(`Digit entered: ${div.textContent}`);

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

/* Respond to a special key being pressed.
 * So far this is just clear and backspace.
 */
function specialEntered(event) {
   let div = event.currentTarget;
   console.log(`Special key entered: ${div.textContent}`);
   switch (div.id) {
      case 'clear':
         doClear();
         break;
      case 'backspace':
         DisplayString = DisplayString.slice(0, -1);
         // we don't like an empty display
         if (DisplayString == "") {
            DisplayString = "0";
         }
         updateDisplay();
         break;
      default:
         // This shouldn't happen
         console.warn(`Unknown special key: ${div.id}`);
   }
}

/* Respond to an operation key being pressed.
 * This includes the equals sign.
 */
function operationEntered(event) {
   let div = event.currentTarget;
   console.log(`Operation key entered: ${div.textContent}`);
}

function addEventListeners() {
    document.querySelectorAll('.digit').forEach(
        div => div.addEventListener('click', digitEntered));
    document.querySelectorAll('.special').forEach(
        div => div.addEventListener('click', specialEntered));
    document.querySelectorAll('.operation').forEach(
        div => div.addEventListener('click', operationEntered));
}

doClear();
addEventListeners();

console.log("Ready");
