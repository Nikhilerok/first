public class update_account_type {

  @InvocableMethod
  public static void updateAccountType(List<Account> accounts) {
    // Loop through the list of accounts passed from the flow
    for (Account acc : accounts) {
      Boolean allOpportunitiesClosedLost = true;
      
      // Query for related opportunities and check their status
      List<Opportunity> opps = [SELECT Id, StageName FROM Opportunity WHERE AccountId = :acc.Id];
      for (Opportunity opp : opps) {
        if (opp.StageName != 'Closed Lost') {       
          allOpportunitiesClosedLost = false;
          break;
        }
      }
      
      // Update the account type field based on the opportunity status
      if (allOpportunitiesClosedLost) {
        acc.Account_Type__c = 'Former Prospect';
      } else {
        acc.Account_Type__c = 'None';
      }
      
      // Save the updated account record
      update acc;
    }
  }
}

 //Account_Type__c    Former Prospect  Current Prospect  Customer
 // // StageName  Closed Won   Closed Lost