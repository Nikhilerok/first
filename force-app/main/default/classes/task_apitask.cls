@RestResource(urlMapping='/api/insert')
global class task_apitask {

    @HttpPost
    global static String insertRecord(String name, String emailaddress) {
        
            // Check if the email address exists in any Contact object record ( unique email)
            List<Contact> matchingContacts = [SELECT Id FROM Contact WHERE Email = :emailaddress LIMIT 1];
            if (matchingContacts.isEmpty()) {
                return 'The provided email does not match any existing contact in the Salesforce org.';
            }

            // Check if the email address already exists in api_records__c  (error : already there in c)
            List<api_records__c> existingRecords = [SELECT Id FROM api_records__c WHERE Email_Address__c = :emailaddress];
            if (!existingRecords.isEmpty()) {
                return 'A record with this email already exists in the (api record) object.';
            }

            // Create a new record in api_records__c
            api_records__c newRecord = new api_records__c();
            newRecord.Name = name;
            newRecord.Email_Address__c = emailaddress;
            insert newRecord;

            return 'New email record inserted successfully.';
        } 
    }