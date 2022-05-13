var columns = 9
var rows = 7

document.addEventListener('DOMContentLoaded', () => generatesGrid({columns, rows}))
window.generate.addEventListener('click', () => {
  const columns = document.querySelector('#columns').value
  const rows = document.querySelector('#rows').value
  if(!columns || !rows){
    alert('bro 👀')
    return
  }
  const initialCells = Object.values(document.querySelectorAll('.cell'))
  initialCells.forEach(cell => cell.remove())
  generatesGrid({columns, rows})
})

function generatesGrid({columns, rows}){
  const grid = document.querySelector('.grid')
  //CSS
  grid.style["grid-template-columns"] = `repeat(${columns}, 1fr)`
  grid.style["grid-template-rows"] = `repeat(${rows}, 1fr)`

  //Creates the article elements and appends them to the grid
  for(let i = 0; i < columns*rows; i++){
    const p = document.createElement('p').innerHTML = i+1
    const cell = document.createElement('article')
    cell.classList.add('cell')
    cell.append(p)
    grid.appendChild(cell)
  }

  storesHeaderAndStubColumn({columns, rows})
}

function storesHeaderAndStubColumn({columns, rows}){
  const cellsArray = Object.values(document.querySelectorAll('.cell'))
  const headerRow = cellsArray.slice(0, columns)
  // tableStubColumn = the first column at the left of the table
  const tableStubColumn = []
  for(let i = 0; i < columns*rows; i++){
    if(i > columns - 1){
      tableStubColumn.push(cellsArray[i])
      i += columns - 1
    }
  }
  console.log(tableStubColumn);
  //CSS
  headerRow.forEach(cell => cell.classList.add('headerRowCell'))
  tableStubColumn.forEach(cell => cell.classList.add('tableStubCell'))

  addListener({cellsArray, headerRow, tableStubColumn, columns})
}

function addListener({cellsArray, tableStubColumn, headerRow, columns}){

  cellsArray.forEach(cell => {
    cell.addEventListener('click', () => {
      // A first validation.
      // if the cell is either a stub cell or a header cell it does nothing
      if(tableStubColumn.includes(cell) || headerRow.includes(cell)){
          return
        }

      //styles validation
      cellsArray.forEach(cell => {
        if(cell.classList.contains('selectedCell')){
          cell.classList.remove('selectedCell')
        }
        if(cell.classList.contains('nearestStubCell')){
          cell.classList.remove('nearestStubCell')
        }
        if(cell.classList.contains('headerCell')){
          cell.classList.remove('headerCell')
        }
        if(cell.classList.contains('middleCell')){
          cell.classList.remove('middleCell')
        }
      })

      const indexOfSelectedCell = cellsArray.indexOf(cell);
      console.log('selectedCell', cell);
      console.log('indexOfSelectedCell', indexOfSelectedCell);
      // locates the nearest stub cell and stores it in nearestStubCell
      let nearestStubCell
      // iterates backwards from the selected cell and stops when a stub cell is located
        for(let i = indexOfSelectedCell; i > 0; i--){
          // if the current checked cell is within tableStubColumn array then that's the nearest stub cell
          if(tableStubColumn.includes(cellsArray[i])){
            nearestStubCell = cellsArray[i]
            i = 0
          }
        }
      console.log('nearestStubCell',nearestStubCell)
      const numberOfCellsBetweenSelectedCellAndNearestStubCell = indexOfSelectedCell - cellsArray.indexOf(nearestStubCell)
      const headerCell = headerRow[numberOfCellsBetweenSelectedCellAndNearestStubCell]
      console.log('headerCell', headerCell)

      //stores cells between the headerCell and the nearestStubCell
      const cellsBetweenSelectedCellAndNearestStubCell = []
      // iterates backwards. Starts from selected cell until it gets to the nearest stub cell
      // the iterator is subtracted one by one
      // the selected cell and the nearest stub cell are ignored
      for(let i = indexOfSelectedCell - 1; i > cellsArray.indexOf(nearestStubCell); i--){
        cellsBetweenSelectedCellAndNearestStubCell.push(cellsArray[i])
      }
      console.log('cellsBetweenSelectedCellAndNearestStubCell',cellsBetweenSelectedCellAndNearestStubCell);

      const cellsBetweenSelectedCellAndHeaderCell = []
      // iterates backwards. Starts from selected cell until it gets to header cell.
      // the iterator is subtracted according to the number of columns
      // the selected cell and the header cell are ignored
      const iteratorSubstract = columns
      let i = indexOfSelectedCell
      const indexOfHeaderCell = cellsArray.indexOf(headerCell)
      console.log(indexOfHeaderCell);
      while (i !== indexOfHeaderCell) {
        cellsBetweenSelectedCellAndHeaderCell.push(cellsArray[i])
        i-=iteratorSubstract
      }
      // removes first cell bcoz it's easier than fix the while loop
      cellsBetweenSelectedCellAndHeaderCell.shift()
      console.log('cellsBetweenSelectedCellAndHeaderCell',cellsBetweenSelectedCellAndHeaderCell);

      //CSS
      cell.classList.add('selectedCell')
      nearestStubCell.classList.add('nearestStubCell')
      headerCell.classList.add('headerCell')
      cellsBetweenSelectedCellAndNearestStubCell.forEach(cell => cell.classList.add('middleCell'))
      cellsBetweenSelectedCellAndHeaderCell.forEach(cell => cell.classList.add('middleCell'))
    })
  })
}

