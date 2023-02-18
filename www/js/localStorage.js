async function addElementToLocalstorageJSON(theLocalStorage, localStorageName, objectToAdd){
	
	//Parse JSON from localStorage
	var parsed = JSON.parse(theLocalStorage);
	
	//Push the object into the array
	parsed.push(objectToAdd);
	
	//Convert new array to JSON
	var newJson = JSON.stringify(parsed);
	
	//Save to localStorage
	localStorage.setItem(localStorageName, newJson);
}

//'key' is a key inside decoded JSON
async function removeElementToLocalStorageJSON(theLocalStorage, localStorageName, key, oldValueToSearch){
	
	//Parse JSON from localStorage
	var parsed = JSON.parse(theLocalStorage);
	
	for(var i=0; i <= parsed.length;i++){
		if(parsed[i][key] == oldValueToSearch){
			//Delete
			parsed.splice(i, 1);
			var deleted_index = i;
			break;
		}
	}
	
	//Convert new array to JSON
	var newJson = JSON.stringify(parsed);
	
	//Save to localStorage
	localStorage.setItem(localStorageName, newJson);
	
	return deleted_index;
}


function editElementToLocalstorageJSON(theLocalStorage, localStorageName, key, oldValueToSearch, objectToAdd){
	
	//Parse JSON from localStorage
	var parsed = JSON.parse(theLocalStorage);	
	var deleted_index_position = removeElementToLocalStorageJSON(theLocalStorage, localStorageName, key, oldValueToSearch);
	
	parsed.splice(deleted_index_position, 0, objectToAdd);
	
	//Convert new array to JSON
	var newJson = JSON.stringify(parsed);
	
	//Save to localStorage
	localStorage.setItem(localStorageName, newJson);

}