public class task_batchapex implements Database.Batchable<api_records__c> {
    Set<Id> contactIds = new Set<Id>(); // Declare the contactIds variable here

    public Iterable<api_records__c> start(Database.BatchableContext context) {
        Set<String> emailSet = new Set<String>();

        // Retrieve distinct email addresses from api_records__c
        for (api_records__c record : [SELECT Email_Address__c FROM api_records__c]) {
            emailSet.add(record.Email_Address__c);
        }

        // Retrieve api_records__c records with matching email addresses in Contact
        return [SELECT Id, Email_Address__c FROM api_records__c WHERE Email_Address__c IN :emailSet];
    }

    public void execute(Database.BatchableContext context, List<api_records__c> lead) {
        Set<Id> caseIds = new Set<Id>();
        Set<Id> opportunityIds = new Set<Id>();
        Set<Id> taskIds = new Set<Id>(); // Add a Set to store Task record Ids

        for (api_records__c record : lead) {
            String email = record.Email_Address__c;

            // Retrieve associated Contact records
            List<Contact> contacts = [SELECT Id FROM Contact WHERE Email = :email];

            for (Contact contact : contacts) {
                // Retrieve associated Case, Opportunity, and Task records
                List<Case> cases = [SELECT Id FROM Case WHERE ContactId = :contact.Id];
                List<Opportunity> opportunities = [SELECT Id FROM Opportunity WHERE ContactId = :contact.Id];
                 List<Task> tasks = [SELECT Id FROM Task WHERE WhoId	 = :contact.Id];
                contactIds.add(contact.Id);

                for (Case caseRecord : cases) {
                    caseIds.add(caseRecord.Id);
                }
                for (Opportunity opportunity : opportunities) {
                    opportunityIds.add(opportunity.Id);
                }
                for (Task task : tasks) {
                    taskIds.add(task.Id); // Add Task Ids to the Set
                }
            }
        }

        // Delete associated Case, Opportunity, and Task records
        delete [SELECT Id FROM Case WHERE Id IN :caseIds];
        delete [SELECT Id FROM Opportunity WHERE Id IN :opportunityIds];
        delete [SELECT Id FROM Task WHERE Id IN :taskIds]; // Delete Task records

        // Delete Contact and api_records__c records
        delete [SELECT Id FROM Contact WHERE Id IN :contactIds];
        delete lead;
    }

    public void finish(Database.BatchableContext context) {
        System.debug('Batch deletion completed.');
    }
}