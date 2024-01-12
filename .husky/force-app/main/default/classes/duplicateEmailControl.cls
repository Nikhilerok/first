public with sharing class duplicateEmailControl {
      public static void preventDuplicateContact(List<Contact> contactRecList){
        Set<String> contactFirstName = new Set<String>();
        Set<String> contactLastName = new Set<String>();
        Set<String> contactEmail = new Set<String>();
        Map<String,Set<String>> conMapItem=new Map<String,Set<String>>();
        for(Contact conObjRec : contactRecList){
            contactFirstName.add(conObjRec.FirstName);
            contactLastName.add(conObjRec.LastName);
            contactEmail.add(conObjRec.Email);
        }
       List<Contact> duplicateContacts = [SELECT Id, FirstName,LastName,Email
                                             FROM Contact
                                             WHERE Email IN :contactEmail];
          for(Contact conObj : contactRecList){
            if(duplicateContacts.size()> 0){
                conObj.addError('Already existed contact');
           }
        }
    }
}