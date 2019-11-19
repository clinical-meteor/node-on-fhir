Meteor.methods({
    createNewNote: function(text){
        check(text, String);        
        console.log('createNewNote()', text);

        Notes.insert({
            resourceType: 'Note',
            note: text
        });
    }
});