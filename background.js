chrome.contextMenus.create({
	title: "Copy to Note",
        contexts: ["selection"],
        onclick: copyToNote
});

function copyToNote(info) {
  var newDate = new Date();
  var noteId = "note-"+newDate.getTime();
  var noteText = info.selectionText;
  //first, store it
  localStorage.setItem(noteId,noteText);
  //send message to panel script to update it
  chrome.runtime.sendMessage({"actionItem": "update"}, function(response) {
    console.log('sent message to update list');
  });

}
