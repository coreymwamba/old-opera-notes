chrome.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT = 1;
chrome.contextMenus.create({
        title: "Copy to Note",
        contexts: ["selection"],
        onclick: copyToNote
});

function copyToNote(t){
var noteList = document.getElementById("notelist");
var newDate = new Date();
var noteId = "note-"+newDate.getTime();
var noteText = t.selectionText;
//first, store it
localStorage.setItem(noteId,noteText);
//then add it to the list
noteListItem = document.createElement("option");
noteListItem.setAttribute("id",noteId);
if (noteText.length > 25) {
noteListItem.innerHTML = noteText.substring(0,25)+"...";
}
else {
noteListItem.innerHTML = noteText;
}
noteList.appendChild(noteListItem);
}

