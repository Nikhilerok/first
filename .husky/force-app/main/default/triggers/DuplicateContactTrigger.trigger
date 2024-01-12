trigger DuplicateContactTrigger on Contact (before insert) {
    if(Trigger.isBefore && Trigger.isInsert){
        duplicateEmailControl.preventDuplicateContact(Trigger.new);
}
}