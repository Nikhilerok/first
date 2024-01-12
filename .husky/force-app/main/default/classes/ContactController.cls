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


   /*

   
@AuraEnabled(cacheable=true)
public static List<Contact> getContactss(Integer pageNumber, Integer pageSize) {
    Integer offset = (pageNumber - 1) * pageSize;
    return [SELECT Id, Name, Email, Phone FROM Contact ORDER BY Name ASC LIMIT :pageSize OFFSET :offset];
}


}

// ContactController.cls
@AuraEnabled(cacheable=true)
public static List<Contact> getContactss(Integer pageNumber, Integer pageSize, String searchTerm, String sortBy, String sortDirection) {
    Integer offset = (pageNumber - 1) * pageSize;
    String searchQuery = '%' + searchTerm + '%'; // Add wildcards for partial search

    // Build the query dynamically based on sorting direction and field
    String query = 'SELECT Id, Name, Email, Phone FROM Contact ' +
                   'WHERE (FirstName LIKE :searchQuery OR LastName LIKE :searchQuery) ';
    
    if (sortDirection == 'asc') {
        query += 'ORDER BY ' + sortBy + ' ASC ';
    } else {
        query += 'ORDER BY ' + sortBy + ' DESC ';
    }

    query += 'LIMIT :pageSize OFFSET :offset';

    return Database.query(query);
}





*/



    // apex method to fetch contact records from salesforce database 
    @AuraEnabled(cacheable=true)
    public static list<Contact> fetchContacts(){        
            list<Contact> lstContact = new list<Contact>();
            for(Contact con : [SELECT id,name,email,phone,Account.Name, MailingStreet, MailingCity, MailingState, MailingPostalCode, Department FROM Contact LIMIT 5000]){
                lstContact.add(con);
            } 
            return lstContact;        
    }
    

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactss(Integer pageNumber, Integer pageSize, String searchTerm) {
        Integer offset = (pageNumber - 1) * pageSize;
        String searchQuery = '%' + searchTerm + '%'; // Add wildcards for partial search

        return [SELECT Id, Name, Email, Phone,Birthdate, MailingStreet, MailingCity, MailingState, MailingPostalCode,MailingAddress, Department ,Title
        FROM Contact
        WHERE 
         (FirstName LIKE :searchQuery OR LastName LIKE :searchQuery) 
                ORDER BY Name ASC 
                LIMIT 5000];
    }
}