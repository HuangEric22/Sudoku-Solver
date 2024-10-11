document.addEventListener("DOMContentLoaded", function() {
    const gridSize = 9;
    const solveGrid = document.getElementById("solve-grid");
    //const solveCell = document.getElementById("solve-cell");
    const resetBoard = document.getElementById("reset-grid");
    const uploadImage = document.getElementById("upload-image");
    const grid = document.getElementById("grid");
    solveGrid.addEventListener("click", solveSudoku);
    resetBoard.addEventListener("click", reset);
    //solveCell.addEventListener('click', solveCellFunc)

    //create the grid and cells
    for (let r = 0; r < gridSize; r++) {
        const newRow = document.createElement("tr");
        for (let c = 0; c < gridSize; c++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${r}-${c}`;

            input.addEventListener('input', function() {
                if (input.value === "") {
                    input.classList.remove("filled"); // Remove filled class if empty
                } else {
                    input.classList.add("filled"); // Add filled class if a number is entered
                }
            });
                        
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        grid.appendChild(newRow);
    }
});

async function reset() {
    
    const gridSize = 9;
    
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const cellId = `cell-${r}-${c}`;
            const cell = document.getElementById(cellId);
            cell.classList.remove("user-input", "solved", "filled");
            cell.value = "";
        }
    }

    solveGrid.disabled = false; // Enable the "Solve Puzzle" button
    resetGrid.disabled = false; // Enable the "Reset" button
}

async function solveSudoku() {
    const gridSize = 9;
    sudokuArray = [];

    //disables the solve puzzle button if the puzzle is in the processing of being solved
    const solveGrid = document.getElementById("solve-grid");
    const resetGrid = document.getElementById("reset-grid");

    solveGrid.disabled = true;
    resetGrid.disabled = true;

    //creates and fill and array with the inputted array
    for (let r = 0; r < gridSize; r++) {
        sudokuArray[r] = [];
        for (let c = 0; c < gridSize; c++) {
            const cellId = `cell-${r}-${c}`;
            cell = document.getElementById(cellId);
            const cellVal = document.getElementById(cellId).value;
            //marks non-empty cells as user inputs
            if (cell.value !== "") {
                cell.classList.add("user-input");
            }
            sudokuArray[r][c] = cellVal !== "" ? parseInt(cellVal) : 0;
        }
    }

    //checks if the user inputted a valid puzzle
    if (!isValidSudoku(sudokuArray)) {
        alert("The Puzzle You Entered is Not Valid!");
        console.log("The Puzzle You Entered is Not Valid!");
        sudokuArray = [];
        solveGrid.disabled = false; //Enable the button when the function returns a value
        resetGrid.disabled = false;
        //removes all entries from the user-input list when given an invalid input
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cellId = `cell-${r}-${c}`;
                const cell = document.getElementById(cellId);
                cell.classList.remove("user-input", "solved");
            }
        }
        return false;
    }

    //Solving the puzzle

    if (solveSudokuHelper(sudokuArray)) {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cellId = `cell-${r}-${c}`;
                const cell = document.getElementById(cellId);

                if (!cell.classList.contains("user-input")) {
                    cell.value = sudokuArray[r][c];
                    cell.classList.add("solved"); 
                    await sleep(25);
                }
            }
        }
    } else {
        console.log("No solution exists for the given Sudoku puzzle.");
        solveGrid.disabled = false; //Enable the button when the function returns a value
        resetGrid.disabled = false;
        return false;
    }

    solveGrid.disabled = false; //Enable the button when the function returns a value
    resetGrid.disabled = false;
}

function solveSudokuHelper(grid) {
    const gridSize = 9;

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === 0) {
                for (let num = 1; num <= gridSize; num++) {
                    if (isValid(grid, r, c, num)) {
                        grid[r][c] = num;

                        if (solveSudokuHelper(grid)) {
                            return true;
                        }

                        grid[r][c] = 0;
                    }
                }

                return false; //no valid number found for the cell
            }
        }
    }
    return true; //every cell can be populated with a valid number
}

function isValid(grid, r, c, num) {
    const gridSize = 9;

    for (let i = 0; i < gridSize; i++) {
        //if the same number is found in the same row or column then the number is not valid
        if (grid[r][i] === num || grid[i][c] === num) {
            return false;
        }
    }

    const row = Math.floor(r / 3) * 3;
    const col = Math.floor(c / 3) * 3;

    for (let i = row; i < row + 3; i++) {
        for (let j = col; j < col + 3; j++) {
            if (grid[i][j] === num) {
                return false;
            }
        }
    }
    //if the number passes all of the tests, it is a valid digit, so return true
    return true;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function hasDuplicate(arr) {
    const seen = new Set();

    for (const num of arr) {
        if (num !== 0) {
            // Skip checking zeros (assuming 0 represents an empty cell)
            if (seen.has(num)) {
                return true; // Duplicate found
            }
            seen.add(num);
        }
    }

    return false; // No duplicate found
}

function hasDuplicateInRow(grid, row) {
    return hasDuplicate(grid[row]);
}

function hasDuplicateInColumn(grid, col) {
    const column = [];
    for (let i = 0; i < grid.length; i++) {
        column.push(grid[i][col]);
    }
    return hasDuplicate(column);
}

function isValidSudoku(grid) {
    const gridSize = 9;

    // Check rows and columns
    for (let i = 0; i < gridSize; i++) {
        if (hasDuplicateInRow(grid, i) || hasDuplicateInColumn(grid, i)) {
            return false;
        }
        for (let j = 0; j < gridSize; j++) {
            const cellId = `cell-${i}-${j}`;
            const cell = document.getElementById(cellId);

            if (
                cell.classList.contains("user-input") &&
                (grid[i][j] < 1 || grid[i][j] > gridSize)
            ) {
                return false;
            }
        }
    }

    // Check 3x3 subgrids
    for (let row = 0; row < gridSize; row += 3) {
        for (let col = 0; col < gridSize; col += 3) {
            if (hasDuplicateInSubgrid(grid, row, col)) {
                return false;
            }
        }
    }

    return true;
}

function hasDuplicateInSubgrid(grid, startRow, startCol) {
    const subgrid = [];

    for (let row = startRow; row < startRow + 3; row++) {
        for (let col = startCol; col < startCol + 3; col++) {
            subgrid.push(grid[row][col]);
        }
    }

    return hasDuplicate(subgrid);
}

async function fillGrid(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cellId = `cell-${i}-${j}`;
            const cell = document.getElementById(cellId);
            
            if (board[i][j] > 0) {
                sleep(25);
                cell.classList.add("filled");
                cell.value = board[i][j];
            }
            else {
                board[i][j] = "";    
            }
        }
    }
}