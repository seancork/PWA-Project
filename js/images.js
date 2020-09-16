if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
    
      console.log('ServiceWorker successful');
    }, function(err) {
 
      console.log('ServiceWorker failed: ', err);
    });
  });
}

async function deleteCache() {
  var breakUpString = '';

  const cache = await caches.open("PWACache"); //cache name
  const requestsOfCache = await cache.keys();

    var obj = {};
    var storageObject = localStorage.getItem('storage_images'); //get lastest images from storage, so not to delete from cache
    var res = storageObject.split(","); //split on ,

    Object.keys(res).forEach(function(key) {
     breakUpString +=   res[key].split("/")[4]; //get the name of the image, not full url

});

    const stripped = JSON.stringify(breakUpString).replace(/\\/g, '|') //replace \ with | for the regrex
     const stripped2 = stripped.replace(/"/g, '') //clean up string
    const stripped3 = stripped2.replace(/\]/g, '') //more clean up
      str = stripped3.slice(0, -1); //get rid of the last extra character, messing up regrex

//files not to delete from cache
var  appshell = "|index.html|styles.css|icons/error.png|images/sun.png|images/sun_small.png|/images/spinner.gif|images/very_small_sun.png|images/very_small_sun.png|icons/search.png|js/menu.js|fonts.googleapis.com"
  const deleteFilesFromCache = requestsOfCache.filter(request => request.url.match("^(?:(?!"+str+""+appshell+").)*$\r?\n?"));
  return Promise.all(deleteFilesFromCache.map(request => cache.delete(request))); //delete from cache
}



//search terms
 var searchTerms = [ 
  "Cats", 
  "Sheep", 
  "Plane"
 ];


//stores images from flickr
function FlickrImage(smallfilename, bigfilename, title)
{
  this.filename = smallfilename; 
  this.bigfilename = bigfilename; 
  this.title = title; 
}



FlickrImage.prototype.getImageObject = function() {
  return new Promise((resolve, reject) =>{
    var imageObject = new Image(); // create object


    imageObject.src = this.bigfilename; //downlaod if can

    imageObject.onload = () =>{ // detect when image is downloaded
      
      
      imageObject.onclick = () => {showLargeImage(this.bigfilename, this.title)}; //make it clickable

      // image has downloaded, we can resolve the promise     
      resolve(imageObject);
      
    }
    
    
    // Reject the Promise if we can't load the image.
    imageObject.onerror = () =>{ 
      
      
      imageObject.innerHTML = "Can't Load"; // add to html if can't load image
      
      // We reject the Promise
      reject(); 
      
    }
    
  }); 
  
} 


function getImages(searchTermText){

  localStorage.setItem('lastsearch', searchTermText) // store images in localStorage

  baseurl = "https://www.flickr.com/services/rest?";
  request = "method=flickr.photos.search";
  request += "&per_page=10";  
  request += "&api_key=a5817b1b570c7f239b5fc5c7670c02bb"; 

  request += "&text="+escape(searchTermText);
  
  request += "&format=json&jsoncallback=showImages";
   
  request += "&tag_mode=all";
    
  full = baseurl+request;
  var src = document.createElement("script");  
  src.setAttribute("src", full);
  document.querySelectorAll("head")[0].appendChild(src);

if(navigator.onLine == false){
  console(navigator.onLine)
    document.querySelector(".gif").innerHTML = "<div id = 'menu-flex'>Sorry can't access Flickr <br /> Try again later.</div>";

       var storageObject = localStorage.getItem('storage_images');

    getImagesfromStorage(JSON.parse(storageObject));
    enableButtons() //enable buttons if their is no interent

 }else{
  document.querySelector(".gif").innerHTML = "<div id = 'menu-flex'>Searching Flickr ...</div>";
  
  // Disable the buttons until the data has returned.
  disableButtons() 

}}
  
/* -------------------Handle Flickr Results ------------------*/  
function showImages(images){ 

  // Create a new blank array to store FlickrImage Objects 
  // representing each image in the results. 
  var flickrImageArray = [];
  
  // Remove the HTML content of the "pics" div.
  document.querySelector('.gif').innerHTML = "";
  
  
  // Check for error message in the results
  if (images.stat =='fail' ) 
  {
      document.querySelector('.gif').innerHTML  = "Error";
      
      // enable the buttons
      enableButtons()
  }
  else   // otherwise we can process the results 
  {
    // Store how many photos were returned
    var targetnr = images.photos.photo.length;

    if (targetnr ==0)
    {
      document.querySelector('.gif').innerHTML  = "No Results";
      
      // enable the buttons
      enableButtons()
    } 
    else // Otherwise we know there images in the data
    {
      
      // Loop through the photes creating the urls for the images
      //storge the images so they can be got from cache
      var storage_images = [];

      for (i = 0; i < images.photos.photo.length; i++ )
        {       

           var url = "https://farm" + images.photos.photo[i].farm ;
           var title;

           url += ".static.flickr.com/" ;
            
           url += images.photos.photo[i].server + "/";
           
           url += images.photos.photo[i].id + "_";
           
           url += images.photos.photo[i].secret;

           title = images.photos.photo[i].title; // get title for image to show it as a pop up
      
      
         // Create 2 different image urls based on the base url     
         var smallurl = url + "_s.jpg";
         var bigurl = url + ".jpg";
        
        storage_images[i] = bigurl; //add image to array 

        // Use these two image names  to create an 
        // instance of a flickrImage object 
        // and add this object to the flickrImage array. 
        flickrImageArray.push(new  FlickrImage(smallurl, bigurl,title));
          
        }
        localStorage.setItem("storage_images", JSON.stringify(storage_images));
      // Once the flickerImageArray function is filled we
        // can pass it to the createImages function inorder
        // to put them on the page        
      createImages(flickrImageArray);
        
      }        
  } 
  
} 


/* ------------------------ Put Images on the Page ------------ */

function getImagesfromStorage(flickr_array)
{

  for (var i = 0; i < flickr_array.length; i++ )
    {     
      // For each image create an element to place the small image in. 
        let divObj = document.createElement("div");
    divObj.className = "box1";
      
    // Create a loader image
    var loader = document.createElement("img");
    loader.src = flickr_array[i];
    loader.className = "loader";

    divObj.appendChild(loader);
  
    // Add the new div to the page
    document.querySelector('.gif').appendChild(divObj);
    
      
    }
  
  
}

// We pass an array of FlickrImage objects to this
// function so it can display them on the page
function createImages(flickr_array)
{

  // Create an array to store promises
  var promiseArray = [];
  
  // Loop through the array of FLickrImage objects 
  for (var i = 0; i < flickr_array.length; i++ )
    {     
      
      // For each image create an element to place the small image in. 
        let divObj = document.createElement("div");
    divObj.className = "box1";
      
    // Create a loader image
    var loader = document.createElement("img");
    loader.src = './/images//spinner.gif';
    loader.className = "loader";
        
    // Put the loader image in the divObj object we created above
    // (until the image is downloaded)
        
    divObj.appendChild(loader);
    
    var tempPromise = flickr_array[i].getImageObject();

    tempPromise.then(function(resolvedImage){ 
      console.log(resolvedImage);
                divObj.innerHTML = ""; 
                divObj.appendChild(resolvedImage)  
            }) .catch(function(){ 
              //if cant resolve, display error icon 
                divObj.innerHTML = ""; 
                var loader = document.createElement("img");
                loader.src = "icons/error.png";
                 divObj.appendChild(loader);
  
  });
    
    // Push the Promise onto a array of all the promises (i.e. for each image)
    promiseArray.push(tempPromise);
      
    // Add the new div to the page
    document.querySelector('.gif').appendChild(divObj);
    
      
    } 
Promise.all(promiseArray.map(p => p.catch(() => undefined))).then(() => enableButtons());

}


function showLargeImage(imgName, title)
{

 //for the modal popup
  document.getElementById('container').innerHTML = ("<p>%s</p>",title);
  document.getElementById('close').style.display='block'

  document.getElementById("loading").style.display = "block";
  
}

 window.addEventListener("load", init);

// go though search terms and add them to the navigation 
 function init(){
    for (let i = 0; i < searchTerms.length; i++){
    
      var newDiv = document.createElement("div"); //create a div

      var newNode = document.createTextNode(searchTerms[i]);
      newDiv.appendChild(newNode); 
      
      const element = document.querySelector("#menu-wrapper").appendChild(newDiv); // add to navigation on page
      element.classList.add('menu-flex'); // add class to div created
       
      newDiv.addEventListener("click", function() { 
              
      getImages(searchTerms[i]);

      });
    
    } 
    
    loadFromStorage(); // check local storage in the browser    
}

function loadFromStorage(){
  var lastsearchterms = localStorage.getItem("lastsearch");
   
  if (lastsearchterms != null) getImages(lastsearchterms); //check for search terms  
}

function enableButtons()
{ 
 document.getElementById("menu-wrapper").className = "on";

}

function disableButtons()
{
  document.getElementById("menu-wrapper").className = "off";
}

