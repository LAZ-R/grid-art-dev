import { APP_NAME, APP_VERSION } from "../app-properties.js";
import { getSvgIcon } from "./services/icons.service.js";
import { setHTMLTitle } from "./utils/UTILS.js";
import { requestWakeLock } from "./utils/wakelock.js";

/* ########################################################### */
/* ------------------------ VARIABLES ------------------------ */
/* ########################################################### */
const HEADER = document.getElementById('header');
const MAIN = document.getElementById('main');
const FOOTER = document.getElementById('footer');

const LETTERS_FOR_ID = ['A', 'B', 'C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ'];
let int_for_id = 1;
let rowNumber = 0;
let lastColumnIdentifier = '';

/* ########################################################### */
/* ------------------------ FUNCTIONS ------------------------ */
/* ########################################################### */

function divideIntoSquares(X, Y, minRatio) {
  let bestFit = {
    column_number: X,
    row_number: Y,
    square_width: 1,
    square_height: 1
  };

  // Test different possible numbers of columns (n_x) starting from a minimum of 5
  for (let n_x = 5; n_x <= X; n_x++) {
    let squareWidth = X / n_x;
    let n_y = Math.round(Y / squareWidth);
    
    // Ensure we have at least 5 rows
    if (n_y < 5) continue;
    
    let squareHeight = Y / n_y;

    // Check if the current grid satisfies the max tolerance condition of 1.25:1
    if (squareWidth / squareHeight <= minRatio && squareHeight / squareWidth <= minRatio) {
      // If this configuration uses fewer total divisions, store it
      if (n_x * n_y < bestFit.column_number * bestFit.row_number) {
        bestFit = {
          column_number: n_x,
          row_number: n_y,
          square_width: (squareWidth / X) * 100,  // Convert to percentage of X
          square_height: (squareHeight / Y) * 100  // Convert to percentage of Y
        };
      }
    }
  }

  return bestFit;
}

function getRandomHexColor() {
  // Génère un nombre aléatoire entre 0 et 16777215 (0xFFFFFF en hexadécimal)
  let randomColor = Math.floor(Math.random() * 16777215);
  
  // Convertit le nombre en une chaîne hexadécimale et l'ajoute avec un #
  return `#${randomColor.toString(16).padStart(6, '0')}`;
}

const divideDom = (result) => {
  document.documentElement.style = `
      --cell-width: ${result.square_width}svw;
      --cell-height: ${result.square_height}svh;
    `;

  let str = '';
  for (let index = 0; index < result.row_number; index++) {
    rowNumber = int_for_id;
    str += `<div id="row-${int_for_id}" class="row">`;
    for (let index2 = 0; index2 < result.column_number; index2++) {
      lastColumnIdentifier = LETTERS_FOR_ID[index2];
      let cellId = `${lastColumnIdentifier}${int_for_id}`;
      let cellBgColor = getRandomHexColor();
      str += `<div id="${cellId}" class="cell" style="background-color: ${cellBgColor}"><!--${cellId}<br>${cellBgColor}--></div>`;
    }
    str += `</div>`;
    int_for_id++;
  }
  document.getElementById('main').innerHTML = str;
}

// Fonction pour choisir un ID de cellule aléatoire
function getRandomCellID() {
  let maxColumnIndex = LETTERS_FOR_ID.indexOf(lastColumnIdentifier);

  // Choisir une colonne aléatoire (entre 0 et maxColumnIndex)
  const randomColumnIndex = Math.floor(Math.random() * (maxColumnIndex + 1));
  
  // Choisir une ligne aléatoire (entre 1 et maxRowIndex)
  const randomRowIndex = Math.floor(Math.random() * rowNumber) + 1;
  
  // Générer l'ID de la cellule
  const columnLetter = LETTERS_FOR_ID[randomColumnIndex];
  return `${columnLetter}${randomRowIndex}`;
}

const colorizeDom = () => {
  let list = document.getElementsByClassName('cell');
  //console.log(list[list.length - 1].id);
  //document.getElementById('main').style.opacity = 0;
  //setTimeout(() => { 
    for (let cell of list) {
      let cellBgColor = getRandomHexColor();
      cell.style = `background-color: ${cellBgColor}`;
      //cell.innerHTML = `${cell.id}<br>${cellBgColor}`;
    }
  //}, 200);
  /* setTimeout(() => {
    document.getElementById('main').style.opacity = 1;
  }, 400); */
}

const colorizeRandomCell = () => {
  let randomCellId = getRandomCellID();
  let cell = document.getElementById(randomCellId);
  let cellBgColor = getRandomHexColor();
  cell.style = `background-color: ${cellBgColor}`;
  //cell.innerHTML = `${cell.id}<br>${cellBgColor}`;
}

/* ########################################################### */
/* ------------------------ EXECUTION ------------------------ */
/* ########################################################### */

// Keep screen awake
requestWakeLock();
setHTMLTitle(APP_NAME);
  
// Exemple d'utilisation
const width = window.innerWidth;
const height = window.innerHeight;
const minRatio = 1.1;
const result = divideIntoSquares(width, height, minRatio);

//console.log(`INITIAL PARAMETERS\n \nviewport width: ${width}px\nveiwport height: ${height}px\nminimum square ratio: ${minRatio}`);
//console.log(`SUBDIVISION\n \nColumns count: ${result.column_number}\nRow count: ${result.row_number}\n \ncell width: ${result.square_width} svw\ncell height: ${result.square_height} svh`);

divideDom(result);
//setInterval(colorizeDom, 8000);
setInterval(colorizeRandomCell, 1000);