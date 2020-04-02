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
	3. The length of all the cells must equal the bar hight
	|-------|
	|  20px |
	|-------|	= 40px bar hight
	|  20px |
	|-------|
	4. Every bar has a title that added as a cell in the x-axis.

	Algorithm:
	1. The values are entered as an array.
	2. number of rows = Math.floor(max/cellSize)
	3. number of columns = valuesArrayLength + (cell(valuesArrayLength/2)+1)(number of empty column to make a seperation)
*/

function main(){
	let values = [10,60,50,33,40,10,5];
	let titles = ["val1", "val2", "val3", "val4", "val5"];
	
	var max = findMax(values);
	var yAxisValues;

	var initialWindowHeight = window.innerHeight;
	
	generateColors(values.length)

	//If the max value is less than half the window height.
	//half the window size is the fixed (initital) value.
	if(initialWindowHeight/2 >= max){
		yAxisValues = findYAxisValues(initialWindowHeight/2);
	}
	else{
		yAxisValues = findYAxisValues(max);
	}

	drawBarChart(yAxisValues, values, max);
}

function drawBarChart(yAxisValues, values, max){
	//var table = document.getElementById("table");
	var bars = [];
	
	var colors = generateColors(values.length);
	var cellsSize = cellSize();
	
	var numberOfRows = Math.floor(max/cellsSize);
	var numberOfColumns = values.length;

	var numberOfCellsForEachBar = numberOfCells(values, cellsSize);

	for(rows = 0; rows < numberOfRows; rows++){
		row = document.createElement("tr");
		row.setAttribute("id", rows);

		for(columns = 0; columns < numberOfColumns; columns++){
			color = "rgb("+colors[columns][0]+","+colors[columns][1]+","+colors[columns][2]+")";
			tableData = document.createElement("td");
			tableData.style.width = cellsSize + "px";
			tableData.style.backgroundColor = color;
			tableData.innerText="_";

			emptyTableData = document.createElement("td");
			emptyTableData.style.width = cellsSize + "px";
			emptyTableData.innerText = " ";

			//Insert tableData if the number of cells for this specific bar 
			//is not less than 0
			if(numberOfCellsForEachBar[columns] > 0){
				row.appendChild(tableData);

				/*//Insert the bars with seperatino columns
				if(columns != numberOfColumns - 1){
					row.appendChild(tableData);
					row.appendChild(emptyTableData);
				}
				//Insert the last bar without a seperation column
				else{
					row.appendChild(tableData);
				}*/

				numberOfCellsForEachBar[columns] = numberOfCellsForEachBar[columns] - 1;
			}
			//Insert emptyTableData if the number of cells for this specific bar
			//reach zero
			else{
				row.appendChild(emptyTableData)
			}
		}
		bars[rows] = row;
		//table.appendChild(row);
	}

	inverseTheDiagram(bars);
}

function inverseTheDiagram(bars){
	var table = document.getElementById("table");
	var numberOfChilds = bars.length; 

	for(i = numberOfChilds - 1; i >= 0; i--){
		console.log(numberOfChilds);
		table.appendChild(bars[i]);
	}
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

//
function findYAxisValues(max){
 	max = Math.floor(max);
 	var topValue = max + (Math.floor(max/3));
 	var fourthValue = topValue - (Math.floor(topValue/3));
 	var middleValue = Math.floor(topValue / 2);
 	var secondValue = Math.floor(topValue / 4);
 	var lastValue = 0;

 	return [topValue, fourthValue, middleValue, secondValue, lastValue];
}

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

function cellSize(){
	/*
	the cell size I need to think more about it
	and how to generate it randomily
	
	Also the number of cells for the graph
	I mean how many cells and what is the size?
	*/

	//Number of rows(number of cells) = Math.floor(max/cellSize)
	return 5;
}

/*
	Give the number of cells For each bar.
	numberOfCells = Math.floor(value[i] / cellsSize);
	for example:
	values = [10,100,50,33,40]
	cellsSize = 10
	#cells = [1, 10, 5, 3, 4]
*/
function numberOfCells(values, cellsSize){
	var numberOfCells = [];

	for(i = 0; i < values.length; i++){
		numberOfCells[i] = Math.floor(values[i]/cellsSize);
	}

	return numberOfCells;
}

