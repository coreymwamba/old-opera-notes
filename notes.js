// variables
var blocksq = document.getElementsByTagName("blockquote");
var bq = blocksq[0];
var newNote = document.getElementById("newnote");
var noteList = document.getElementById("notelist");
bq.addEventListener("keyup",saveNote,true);
bq.addEventListener("focus",createNote,true);
newNote.addEventListener("click",createNoteByClick,true);
noteList.addEventListener("keydown",deleteNote,true);
noteList.addEventListener("change",displayNote,true);
//display note
function displayNote() {
var selectedListItem = noteList.options[noteList.selectedIndex];
var e = selectedListItem.value;
var j = selectedListItem.id;
bq.setAttribute("id",e);
bq.innerHTML = localStorage.getItem(j);
}

//delete notes with delete key

function deleteNote(d){
var selectedListItem = noteList.options[noteList.selectedIndex];
if (d.keyCode == 46) {
var j = selectedListItem.value;
var deletedNode = document.getElementById("note-"+j);
localStorage.removeItem("note-"+j);
var sbq = document.getElementById(j);
sbq.innerHTML = "";
sbq.removeAttribute("id");
while (noteList.lastChild) {
   noteList.removeChild(noteList.lastChild);
}
displayListNotes();
}
}



// create a new note, inserting
// a blockquote with an id
// FUTURE plan: if the copied text
// is from a web page, add the 
// URL into the cite attribute 
// [how will this work with localStorage??]


function createNoteByClick() {
var newDate = new Date();
var noteId = newDate.getTime();
bq.setAttribute("id",noteId);
bq.innerHTML = null;
localStorage.setItem("note-"+noteId,"");
bq.focus();
}

function createNote() {
if (bq.hasAttribute("id") == false) {
var newDate = new Date();
var noteId = newDate.getTime();
bq.setAttribute("id",noteId);
localStorage.setItem("note-"+noteId,"");
}
}
//

function saveNote() {
var noteList = document.getElementById("notelist");
prevNoteId = "note-"+bq.id; 
var alreadyThere = document.getElementById(prevNoteId); 
prevNoteText = localStorage.getItem(prevNoteId); 
noteListItem = document.createElement("option");
summaryText = bq.innerHTML;
if (summaryText.length > 25) { 
noteListItem.innerHTML = summaryText.substring(0,25)+"...";
}
else {
noteListItem.innerHTML = summaryText;
}
noteListItem.setAttribute("id",prevNoteId); 
if (alreadyThere) { 
noteList.replaceChild(noteListItem,alreadyThere);
}
else {
noteList.appendChild(noteListItem);
}
localStorage.setItem(prevNoteId,bq.innerHTML);
}


//display list of notes
function displayListNotes(){
var i = 0; 
var noteItems = localStorage.length-1;
for (i = 0; i <= noteItems; i++) { 
var noteKey = localStorage.key(i); 
var noteValue = localStorage.getItem(noteKey); 
var noteTitle;
if(noteValue.length > 25) {
 noteTitle = noteValue.substring(0,25)+"...";
}
else { 
noteTitle = noteValue;
} 
noteListItem = document.createElement("option"); 
noteListItem.innerHTML = noteTitle; 
noteListItem.setAttribute("id",noteKey);
noteListItemValue = noteKey.replace("note-",""); 
noteListItem.setAttribute("value",noteListItemValue);
noteList.appendChild(noteListItem);
}

}
window.onload = displayListNotes();

