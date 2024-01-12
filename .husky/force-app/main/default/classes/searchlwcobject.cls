public with sharing class searchlwcobject {
    @AuraEnabled(cacheable=true)
    public static List<Case> searchCases(String searchText) {
        String query = 'SELECT CaseNumber, Subject, Status, Priority FROM Case ';
        if (!String.isEmpty(searchText)) {
            String escapedSearchText = String.escapeSingleQuotes(searchText);
            query += 'WHERE CaseNumber LIKE \'%' + escapedSearchText + '%\' OR Subject LIKE \'%' + escapedSearchText + '%\' ';
        }
        query += 'LIMIT 10';
        
        return Database.query(query);
    }
}