public with sharing class opportunitiescontroller {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities() {
        return [SELECT Id, Name, CloseDate FROM Opportunity LIMIT 10]; 
    }
    @AuraEnabled (cacheable=true)
    public static List<Opportunity>  accountopportunities(String accountId){
     return[SELECT Id,Name,CloseDate FROM Opportunity WHERE AccountId =:accountId limit 15];
    }
}

/* 


public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [ SELECT Id, Name, Email FROM Contact ] ;
    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> findContactByAccountId(String accountId) {      
        return [
            SELECT Id, FirstName,LastName,Email,Phone  
            FROM Contact 
            WHERE AccountId=:accountId 

            LIMIT 10];
    }
}
*/