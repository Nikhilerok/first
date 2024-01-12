@isTest
private class apitaskTest {
    @isTest
    static void testInsertRecord() {
        // Test data
        String testName = 'Test Name';
        String testEmail = 'test@example.com';

        // Create a new contact for the test
        Contact testContact = new Contact();
        testContact.FirstName = 'Test';
        testContact.LastName = 'Contact';
        testContact.Email = testEmail;
        insert testContact;

        // Test the insertRecord method
        Test.startTest();
        String result = apitask.insertRecord(testName, testEmail);
        Test.stopTest();

        // Verify the results
        System.assertEquals('New email record inserted successfully.', result);

        // Check if the record was inserted correctly
        List<api_records__c> insertedRecords = [SELECT Id, Name, Email_Address__c FROM api_records__c WHERE Email_Address__c = :testEmail];
        System.assertEquals(1, insertedRecords.size());
        System.assertEquals(testName, insertedRecords[0].Name);
        System.assertEquals(testEmail, insertedRecords[0].Email_Address__c);
    }
}