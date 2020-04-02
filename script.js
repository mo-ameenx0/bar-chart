/*
	Assumptions:
	1. The entered values are in pixels
	2. For bigger screens we can draw more bars 
	for small screens we draw less. (need to be figured out)
	3. Bar width = windowSize / 10
	4. The graph is a table. the table has 2 rows, and 2 columns
	this is when there is no bars to draw.
	|------|------|
	|y-axis| Bars |
	|------|------|
	|	   |x-axis|
	|------|------|
	The x-axis will include the bar name
	The y-axis will include the values
	Every axis is a set of cells
	5. All the values are rounded down using floor method



	to create a Bar Chart follow the following rules:
	1. Find the highest value.
	2. Divide the y-axis into 5 values:
		2.1. TopValue = HighestValue + (floor(HighestValue/3))
		2.2. FourthValue = TopValue - (floor(TopValue/3))
		2.3. MiddleValue = TopValue / 2
		2.4. SecondValue = TopValue/ 4
		2.5. LastValue = 0
	3. The length of all the cells must equal the bar height
	|-------|
	|  20px |
	|-------|	= 40px bar height
	|  20px |
	|-------|
	4. Every bar has a title that added as a cell in the x-axis.

	Algorithm:
	1. The values are entered as an array.
	2. number of rows = Math.floor(max/cellSize)
	3. number of columns = valuesArrayLength + (cell(valuesArrayLength/2)+1)(number of empty column to make a seperation)
*/

function main(){
	//TODO: manually insertion of values, and titles
	let values = enterValues();
	
	var initialWindowHeight = window.innerHeight;
	
	var max = findMax(values);
	var yAxisValues;

	//If the max value is less than half the window height.
	//half the window size is the fixed (initital) value.
	if(initialWindowHeight/2 >= max){
		yAxisValues = findYAxisValues(initialWindowHeight/2);
	}
	else{
		yAxisValues = findYAxisValues(max);
	}

	createBars(yAxisValues, values, max);
}

//Take the values from the second table.
function enterValues(){
	//zeros are inserted between values to make empty bars as a seperation
	return [30,0,100,0,50];
}

//Take the titles from the second table
//and create a row for all the titles.
function createTitlesRow(){
	//TODO: these titles will be taken from the second table
	//Empty string are inserted to make empty cells 
	var titles = ["val1", "", "val2", "", "val3"];

	var row = document.createElement("tr");

	for(i = 0; i < titles.length; i++){
		var titleCell = document.createElement("td");
		titleCell.innerText = titles[i];
		row.appendChild(titleCell);
	}

	return row;
}

function createBars(yAxisValues, values, max){
	var bars = [];
	
	var colors = generateColors(values.length);
	var cellSize = cellsSize();

	//We have (numberOfRows * numberOfColumns) cells in this diagram.
	var numberOfRows = Math.floor(max/cellSize.height);
	var numberOfColumns = values.length;

	//This determine when to insert a colored cell or empty cell.
	var numberOfCellsForEachBar = numberOfCells(values, cellSize.height);

	for(rows = 0; rows < numberOfRows; rows++){
		//Create a row to insert the tabledata into it.
		var row = document.createElement("tr");

		for(cellNumber = 0; cellNumber < numberOfColumns; cellNumber++){
			//Create two tabledata <td> one a colored cell, and one is empty cell. 
			var tableData = createBarCell(cellNumber, cellSize, colors);

			//Insert tableData if the number of cells for this specific bar 
			//is not less than 0
			if(numberOfCellsForEachBar[cellNumber] > 0){
				row.appendChild(tableData);
				numberOfCellsForEachBar[cellNumber] = numberOfCellsForEachBar[cellNumber] - 1;
			}
			
			//Insert emptyTableData (notColoredCell) if the number of cells for this 
			//specific bar reach zero which mean all the colored cells 
			//have been inserted and the bar is complete.
			else{
				var emptyTableData = document.createElement("td");
				emptyTableData.style.width = cellSize.width + "px";
				emptyTableData.style.height = cellSize.height + "px";
				emptyTableData.innerText = " ";

				row.appendChild(emptyTableData)
			}
		}
		//Insert the ready rows into the bars array.
		bars[rows] = row;
	}
	drawTheDiagram(bars);
}

//Append all the rows into the drawingTable.
function drawTheDiagram(bars){
	var table = document.getElementById("drawingTable");
	var numberOfChilds = bars.length; 

	var xAxisTitles = createTitlesRow();
	
	for(i = numberOfChilds - 1; i >= 0; i--){
		table.appendChild(bars[i]);
	}

	//Append the titles row.
	table.appendChild(xAxisTitles);
}


//Create the bar cells.
function createBarCell(cellNumber, cellSize, colors){
	//write the color as a rgb format
	color = "rgb("+colors[cellNumber][0]+","+colors[cellNumber][1]+","+colors[cellNumber][2]+")";

	tableData = document.createElement("td");
	
	tableData.style.width = cellSize.width + "px";
	tableData.style.height = cellSize.height + "px";
	tableData.style.backgroundColor = color;
	tableData.innerText="_";

	return tableData;
}


//This method find the max value in the entered values
function findMax(values){
	var max = values[0];

	for (var i = 1; i < values.length; i++) {
		if(max < values[i]){
			max = values[i];
		}
	}

	return max;
}


//Find the y-axis values depending on the max value.
function findYAxisValues(max){
 	max = Math.floor(max);
 	var topValue = max + (Math.floor(max/3));
 	var fourthValue = topValue - (Math.floor(topValue/3));
 	var middleValue = Math.floor(topValue / 2);
 	var secondValue = Math.floor(topValue / 4);
 	var lastValue = 0;

 	return [topValue, fourthValue, middleValue, secondValue, lastValue];
}


//Generate colors randomly for every bar.
function generateColors(numberOfValues){
	var colors = [];

	for(i = 0; i < numberOfValues; i++){
		colors[i] = [
		Math.floor(Math.random()*255),
		Math.floor(Math.random()*255),
		Math.floor(Math.random()*255)];
	}	

	return colors;
}


//Find the appropriate height for the cells.
//TODO I NEED TO THINK MORE ABOUT THE HEIGHT
function cellsSize(){
	/*
	the cell size I need to think more about it
	and how to generate it randomily
	
	Also the number of cells for the graph
	I mean how many cells and what is the size?
	*/

	//Number of rows(number of cells) = Math.floor(max/cellSize)
	return {width:100,height:10};
}


/*
	Give the number of cells For each bar.
	numberOfCells = Math.floor(value[i] / cellSize);
	for example:
	values = [10,100,50,33,40]
	cellSize = 10
	numberOfCellsOfEachBar = [1, 10, 5, 3, 4]
*/
function numberOfCells(values, cellHeight){
	var numberOfCells = [];

	for(i = 0; i < values.length; i++){
		numberOfCells[i] = Math.floor(values[i]/cellHeight);
	}

	return numberOfCells;
}