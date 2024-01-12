public with sharing class AccountController {
    /* 
    // other component 
     @AuraEnabled(cacheable=true)
    public static String getAccountName(String accountId) {
      Account account = [SELECT Name FROM Account WHERE Id = :accountId];
      return account.Name;
    }
  }      
  @AuraEnabled(cacheable=true)
  public static List<Account> getAccounts(){
      try {
          return [SELECT Id,Name,Type,Phone,Industry,Website FROM Account LIMIT 20];
      } catch (Exception e) {
          throw new AuraHandledException(e.getMessage());
      }
  }
  
  @AuraEnabled(cacheable=true)
  public static List<Contact> getContactsByAccountId(Id accountId) {
      return [SELECT Id, Name, Email FROM Contact WHERE AccountId = :accountId];
  }


  
@AuraEnabled
public static Account createAccount(Account acc) {
    try {
        // Existing record - perform insert
        insert acc;
        return acc; // Return the inserted account
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}


@AuraEnabled
public static List<Account> createAccounts(List<Account> accList) {
    try {
        insert accList;
        return accList; // Return the inserted accounts
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}

@AuraEnabled
public static Account createAccountss(Account acc) {
    try {
        if (acc.Id != null) {
            // Existing record - perform update
            Account existingAccount = [SELECT Id, Name, Industry, Phone FROM Account WHERE Id = :acc.Id LIMIT 1];
            existingAccount.Name = acc.Name;
            existingAccount.Industry = acc.Industry;
            existingAccount.Phone = acc.Phone;
            update existingAccount;
            return existingAccount; // Return the updated account
        } else {
            // New record - perform insert
            insert acc;
            return acc; // Return the inserted account
        }
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
}

 */

@AuraEnabled(cacheable=true)
public static List<Account> retrieveMatchingAccounts(String searchTerm) {
    return [SELECT Id, Name, Industry, Phone FROM Account WHERE Name LIKE :('%' + searchTerm + '%') LIMIT 10];
}

@AuraEnabled
public static Account retrieveAccountDetails(Id accountId) {
    try {
        return [SELECT Id, Name, Industry, Phone FROM Account WHERE Id = :accountId LIMIT 1][0];
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}



@AuraEnabled
public static List<Account> createOrUpdateAccount(List<Account> accList) {
    List<Account> updatedAccounts = new List<Account>();

    for (Account acc : accList) {
        if (String.isBlank(acc.Id)) {
            // If Id is blank, treat it as a new record  accountList
            List<Account> existingAccounts = [SELECT Id FROM Account WHERE Name = :acc.Name LIMIT 1];
            
            if (existingAccounts.isEmpty()) {
                // If no existing account with the same name, create a new one
                updatedAccounts.add(new Account(
                    Name = acc.Name,
                    Industry = acc.Industry,
                    Phone = acc.Phone
                ));
            } else {
                // If an existing account with the same name, update it
                Account existingAccount = existingAccounts[0];
                updatedAccounts.add(new Account(
                    Id = existingAccount.Id,
                    Name = acc.Name,
                    Industry = acc.Industry,
                    Phone = acc.Phone
                ));
            }
        } else {
            // If Id is provided, perform an update
            updatedAccounts.add(new Account(
                Id = acc.Id,
                Name = acc.Name,
                Industry = acc.Industry,
                Phone = acc.Phone
            ));
        }
    }
// Return the inserted/updated accounts

    upsert updatedAccounts;
    return updatedAccounts; 
}
}