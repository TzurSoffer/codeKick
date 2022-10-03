const clipboardy = require("clipboardy");
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function combineLists(lists){
    /**
	 * 
	 */
	let newLists = []
    for(let i1 = 0; i1 < lists.length; i1++){
		let list = lists[i1];
		console.log(i1);
		//console.log(lists.length-1);
		for(let i2 = 0; i2 < list.length; i2++){
			let objects = list[i2];
			for(let i3 = 0; i3 < objects.length; i3++){
				let object = objects[i3];
				//console.log(object.category);
				newLists.push(object);
			}
			
		}
	}
	return(newLists);
}

function combineImports(imports){
	if(imports === undefined){return("")}
	let importsCombined = ""
	for(let i = 0; i < imports.length; i++){
		importsCombined += imports[i] + "\n";
	}
	return(importsCombined)
}



var filesData = [];
var data = [];
const dirPath = path.join(__dirname, '/data')
fs.readdir(dirPath, function(err, files){
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
	files.forEach(function(file){
		filesData.push(require("./data/"+file));
	});
	data = combineLists(filesData);
});


/*
readDirectory(dirPath).then(() => {
	
    console.log("all done");
	console.log(filesData);
}).catch(err => {
    console.log(err);
});
*/

/*
filesData.push(require("./data/dataDefOrganized.json"));
filesData.push(require("./data/dataMathOrganized.json"));
filesData.push(require("./data/dataMatrixOrganized.json"));
filesData.push(require("./data/dataNumpyOrganized.json"));
filesData.push(require("./data/dataPandasOrganized.json"));
filesData.push(require("./data/dataSympyOrganized.json"));
*/


/**
 * @param {vscode.ExtensionContext} context
 */

console.log("after");

function activate(context) {
	let disposable = vscode.commands.registerCommand(
		'codeKick.findFunc',
		async function () {
		console.log(filesData);
		var pick = await vscode.window.showQuickPick(data.map
		(l => ({
			label: l.name,
			detail: l.description,
			description: l.category,
			data: l.data,
			imports: l.imports
		})),
		{matchOnDetail: true,
		matchOnDescription: true
		})
		if(pick != undefined){
		clipboardy.writeSync(combineImports(pick.imports)+"\n"+pick.data)
	    }
	});
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}