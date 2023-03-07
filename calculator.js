// This maps operations to keys
const Operation = {
   None: "",
   Plus: "plus",
   Minus: "minus",
   Multiply: "multiply",
   Divide: "divide",
};

const CLEARED_DISPLAY = "0.";

// Initial values of global variables are set in doClear()
//
// The numeric value of the current calculation in progress
let Accumulator;
//
// The operation currently in progress
let CurrentOperation;
//
// A string version of what is showing on the display
let DisplayString;
//
// Is an entry in progress
let EntryInProgress;
//
// Has the decimal point been entered for the current entry
let PointEntered;

// Clear the calculator
function doClear() {
   Accumulator = 0;
   CurrentOperation = Operation.None;
   DisplayString = CLEARED_DISPLAY;
   clearEntry();
   updateDisplay();
}

// Reset entry specific state when starting a new operation
function clearEntry() {
   EntryInProgress = false;
   PointEntered = false;
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

// function containsDecimalPoint(string) {
//    return string.includes(".");
// }

/* Respond to a key being pressed that enters a digit.  This includes
 * the decimal point. Basically, anything that adds to the value on
 * the display.
 */
function digitEntered(event) {
   let div = event.currentTarget;
   console.log(`Digit entered: ${div.textContent}`);

   if (!EntryInProgress) {
      console.log("Starting new entry");

      if (div.id == "number0") {
         DisplayString = CLEARED_DISPLAY;

      } else if (div.id == "point") {
         DisplayString = CLEARED_DISPLAY;
         console.assert(!PointEntered);
         PointEntered = true;

      } else {
         DisplayString = div.textContent;
         DisplayString += ".";
      }

      EntryInProgress = true;

   } else {
      console.log("Continuing entry in progress");

      if (PointEntered && div.id == "point") {
          // Can only have a single decimal point
         disallowed("Can only have a single decimal point in a number");
         return;
      }

      if (!PointEntered) {
         // strip decimal point
         DisplayString = DisplayString.slice(0, -1);
      }

      // Typically, we add entered keys to the display text
      // The exception is that we don't want extraneous leading 0's
      if (DisplayString == "0" && div.id != "point") {
         DisplayString = "";
      }

      DisplayString += div.textContent;

      if (div.id == "point") {
         PointEntered = true;
      }

      if (!PointEntered) {
         // add decimal point back if needed
         DisplayString += ".";
      }
   }

   // XXX add something to limit how many characters we support

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
         // This is a little confusing, b/c of the decimal point

         // Is the last char a decimal point
         if (DisplayString.slice(-1) == ".") {
            if (PointEntered) {
               // Don't change the display, but effectively undo entering the point
               PointEntered = false;
               return;
            } else {
               // remove decimal point
               DisplayString = DisplayString.slice(0, -1);
            }
         }

         // remove last char
         DisplayString = DisplayString.slice(0, -1);


         // we don't like an empty display
         if (DisplayString == "") {
            DisplayString = "0";
         }

         // finally, add back decimal point if needed
         if (!DisplayString.includes(".")) {
            DisplayString += ".";
         }

         updateDisplay();
         break;

      default:
         // This shouldn't happen
         console.warn(`Unknown special key: ${div.id}`);
   }
}

// Given an object and a value, return the key with that value.
// There could be multiple such keys, only the first is returned.
// If none is found, return null.
// function getKeyFromValue(object, value) {
//    for (const [k, v] of Object.entries(object)) {
//       if (v == value) {
//          return k;
//       }
//    }
//    // If we get this far, not found
//    return null;
// }

// Return a string representation of the numeric accumulator
// XXX eventually account for scientific notation?
// XXX account for max number of chars
function accumulatorToString() {
   accumulatorString = Accumulator.toString();

   // add trailing decimal point if needed
   if (!accumulatorString.includes(".")) {
      accumulatorString += ".";
   }

   return accumulatorString;
}

/* Respond to an operation key being pressed.
 * This includes the equals sign.
 */
function operationEntered(event) {
   let div = event.currentTarget;
   console.log(`Operation key entered: ${div.textContent}`);

   // First, do any previous operation
   if (CurrentOperation != Operation.None) {
      let a = Accumulator;
      // XXX may later need to check for error cases, not a number
      let b = Number(DisplayString);
      // XXX deal with div by 0
      Accumulator = operate(a, b, CurrentOperation);
      DisplayString = accumulatorToString();
      updateDisplay();
   } else {
      Accumulator = Number(DisplayString);
   }

   if (div.id == "equals") {
      DisplayString = accumulatorToString();
      CurrentOperation = Operation.None;
      updateDisplay();
   } else {
      // CurrentOperation = getKeyFromValue(Operation, div.id);
      // console.assert(CurrentOperation != null);
      CurrentOperation = div.id;
   }

   clearEntry();
}

/* Perform an operation on two operands, and return the answer.
 */
function operate(a, b, operation) {
   console.log(`${a} ${operation} ${b}`);
   switch (operation) {
      case Operation.Plus:
         return a + b;
      case Operation.Minus:
         return a - b;
      case Operation.Multiply:
         return a * b;
      case Operation.Divide:
         return a / b;
      default:
         // this shouldn't happen
         console.warn(`Unknown operation: ${operation}`);
   }
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
