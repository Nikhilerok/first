@IsTest
public class BatchApexTaskTest {
    @IsTest
    static void testBatchApexTask() {

        List<api_records__c> apiRecords = new List<api_records__c>();
        for (Integer i = 0; i < 10; i++) {
            api_records__c record = new api_records__c(Email_Address__c = 'test@example' + i +'.com');
            apiRecords.add(record);
        }
        insert apiRecords;

        List<Contact> contacts = new List<Contact>();
        for (Integer i = 0; i < 5; i++) {
            Contact contact = new Contact(FirstName = 'Test', LastName = 'User' + i, Email = 'test@example' + i +'.com');
            contacts.add(contact);
        }
        insert contacts;

        List<Case> cases = new List<Case>();
        for (Contact contact : contacts) {
            Case caseRecord = new Case(ContactId = contact.Id, Subject = 'Test Case', Status = 'New', Origin = 'Phone');
            cases.add(caseRecord);
        }
        insert cases;

        List<Opportunity> opportunities = new List<Opportunity>();
        for (Contact contact : contacts) {
            Opportunity opportunity = new Opportunity(ContactId = contact.Id, Name = 'Test Opportunity', StageName = 'Prospecting', CloseDate = Date.today());
            opportunities.add(opportunity);
        }
        insert opportunities;

        List<Task> tasks = new List<Task>();
        for (Contact contact : contacts) {
            Task task = new Task(WhoId = contact.Id, Subject = 'Test Task', Status = 'Not Started');
            tasks.add(task);
        }
        insert tasks;

        // Start the batch process
        Test.startTest();
        batchapex_task batch = new batchapex_task();
        Database.executeBatch(batch);
        Test.stopTest();

        // Display a message
        System.debug('Batch deletion completed.');
    }
}