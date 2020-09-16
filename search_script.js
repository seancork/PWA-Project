/* This script is used to search  movieObj.js */
onmessage = function(e){  
	searchTerm  = e.data;  

	importScripts("movieObj.js");

 } 

 function processFilms(data) {
console.log("test" +searchTerm);

  for (var key in data) {

  	if(data[key]["title"].includes(searchTerm) == true){
		var regex = new RegExp(searchTerm);
		var text = data[key]["title"];
	newText = text.replace(regex , '<mark>$&</mark>');

  	var dataJSON = {
    'title':newText,
    'link':data[key]["link"],
    'number':data[key]["scrape_id"],
    'finsihed':false
};
   postMessage(JSON.stringify(dataJSON));

}

 	}
  //send this back, to tell that the script has finished searching
    var dataJSON = {
    'title':'',
    'link':'',
    'number':0,
    'finsihed':true
};
   postMessage(JSON.stringify(dataJSON));

}



