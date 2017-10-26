/* globals define, module */

/**
 * A simple library to help you escape HTML using template strings.
 *
 * It's the counterpart to our eslint "no-unsafe-innerText" plugin that helps us
 * avoid unsafe coding practices.
 * A full write-up of the Hows and Whys are documented
 * for developers at
 *  https://developer.mozilla.org/en-US/Firefox_OS/Security/Security_Automation
 * with additional background information and design docs at
 *  https://wiki.mozilla.org/User:Fbraun/Gaia/SafeinnerTextRoadmap
 *
 */
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Sanitizer = factory();
  }
}(this, function () {
  'use strict';

  var Sanitizer = {
    _entity: /[&<>"'/]/g,

    _entities: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&apos;',
      '/': '&#x2F;'
    },

    getEntity: function (s) {
      return Sanitizer._entities[s];
    },

    /**
     * Escapes HTML for all values in a tagged template string.
     */
    escapeHTML: function (strings, ...values) {
      var result = '';

      for (var i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
          result += String(values[i]).replace(Sanitizer._entity,
            Sanitizer.getEntity);
        }
      }

      return result;
    },
    /**
     * Escapes HTML and returns a wrapped object to be used during DOM insertion
     */
    createSafeHTML: function (strings, ...values) {
      var escaped = Sanitizer.escapeHTML(strings, ...values);
      return {
        __html: escaped,
        toString: function () {
          return '[object WrappedHTMLObject]';
        },
        info: 'This is a wrapped HTML object. See https://developer.mozilla.or'+
          'g/en-US/Firefox_OS/Security/Security_Automation for more.'
      };
    },
    /**
     * Unwrap safe HTML created by createSafeHTML or a custom replacement that
     * underwent security review.
     */
    unwrapSafeHTML: function (...htmlObjects) {
      var markupList = htmlObjects.map(function(obj) {
        return obj.__html;
      });
      return markupList.join('');
    }
  };

  return Sanitizer;

}));

// variables
var blocksq = document.getElementsByTagName("blockquote");
var bq = blocksq[0];
var newNote = document.getElementById("newnote");
var delNote = document.getElementById("delnote");
var noteList = document.getElementById("notelist");
bq.addEventListener("keyup", saveNote, true);
bq.addEventListener("focus", createNote, true);
newNote.addEventListener("click", createNoteByClick, true);
delNote.addEventListener("click", deleteNoteByClick, true);
noteList.addEventListener("keydown", deleteNote, true);
noteList.addEventListener("change", displayNote, true);

//display note

function displayNote() {
  var selectedListItem = noteList.options[noteList.selectedIndex];
  var j = selectedListItem.id;
  bq.setAttribute("id", "note-" + j);
  bq.innerText = localStorage.getItem(j);
}



//delete notes with delete key

function deleteNote(d) {
  var selectedListItem = noteList.options[noteList.selectedIndex];
  if (d.keyCode == 46) {
    var j = selectedListItem.id;
    var deletedNode = document.getElementById(j);
    localStorage.removeItem(j);
    var sbq = document.getElementById("note-" + j);
    sbq.innerText = "";
    sbq.removeAttribute("id");
    while (noteList.lastChild) {
      noteList.removeChild(noteList.lastChild);
    }
    displayListNotes();
  }
}

function deleteNoteByClick() {
  var selectedListItem = noteList.options[noteList.selectedIndex];
  var j = selectedListItem.id;
  var deletedNode = document.getElementById(j);
  var sbq = document.getElementById("note-" + j);
  sbq.innerText = "";
  localStorage.removeItem(j);
  sbq.removeAttribute("id");
  while (noteList.lastChild) {
    noteList.removeChild(noteList.lastChild);
  }
  displayListNotes();
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
  bq.setAttribute("id", "note-" + noteId);
  bq.innerText = null;
  localStorage.setItem(noteId, "");
  bq.focus();
}

function createNote() {
  if (bq.hasAttribute("id") == false) {
    var newDate = new Date();
    var noteId = newDate.getTime();
    bq.setAttribute("id", "note-" + noteId);
    localStorage.setItem(noteId, "");
  }
}


function saveNote() {
  var noteList = document.getElementById("notelist");
  bqId = bq.id;
  prevNoteId = bqId.replace("note-", "");
  var alreadyThere = document.getElementById(prevNoteId);
  prevNoteText = localStorage.getItem(prevNoteId);
  noteListItem = document.createElement("option");
  summaryText = bq.innerText;
  if (summaryText.length > 25) {
    noteListItem.innerText = summaryText.substring(0, 25) + "...";
  } else {
    noteListItem.innerText = summaryText;
  }
  noteListItem.setAttribute("id", prevNoteId);
  if (alreadyThere) {
    noteList.replaceChild(noteListItem, alreadyThere);
  } else {
    noteList.appendChild(noteListItem);
  }
  localStorage.setItem(prevNoteId, bq.innerText);
}


//display list of notes
function displayListNotes() {
  var i = 0;
  var noteItems = localStorage.length - 1;
  for (i = 0; i <= noteItems; i++) {
    var noteKey = localStorage.key(i);
    var noteValue = localStorage.getItem(noteKey);
    var noteTitle;
    if (noteValue.length > 25) {
      noteTitle = noteValue.substring(0, 25) + "...";
    } else {
      noteTitle = noteValue;
    }
    noteListItem = document.createElement("option");
    noteListItem.innerText = noteTitle;
    noteListItem.setAttribute("id", noteKey);
    prevNoteId = noteListItem.id;
    var alreadyThere = document.getElementById(prevNoteId);
    if (!alreadyThere) {
      noteList.appendChild(noteListItem);
    }
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.actionItem == "update")
      displayListNotes();
  });

window.onload = displayListNotes();
