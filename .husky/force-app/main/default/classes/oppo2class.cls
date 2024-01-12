public with sharing class oppo2class {

    @AuraEnabled(cacheable=true)
    public static List<MonthOpportunityWrapper> oppo2method() {
        Map<String, List<OpportunityWrapper>> opportunitiesByMonthMap = new Map<String, List<OpportunityWrapper>>();
        for (Opportunity opp : [
            SELECT Id, Name,  CreatedDate
            FROM Opportunity 
            WHERE CreatedDate > 2020-01-01T00:00:00Z
            ORDER BY CreatedDate DESC
            LIMIT 25
        ]) {
            String monthKey = opp.CreatedDate.year() + '-' + opp.CreatedDate.month();
            if (!opportunitiesByMonthMap.containsKey(monthKey)) {
                opportunitiesByMonthMap.put(monthKey, new List<OpportunityWrapper>());
            }
            OpportunityWrapper wrapItemFld = new OpportunityWrapper();
            wrapItemFld.Id = opp.Id;
            wrapItemFld.Name = opp.Name;
            opportunitiesByMonthMap.get(monthKey).add(wrapItemFld);
        }

        List<MonthOpportunityWrapper> opportunitiesByMonthList = new List<MonthOpportunityWrapper>();
        for (String monthKey : opportunitiesByMonthMap.keySet()) {
            List<OpportunityWrapper> monthOpportunities = opportunitiesByMonthMap.get(monthKey);
            String month = monthKey.split('-')[1];
            String year = monthKey.split('-')[0];
            MonthOpportunityWrapper monthOpportunityWrapper = new MonthOpportunityWrapper(month, year, monthOpportunities);
            opportunitiesByMonthList.add(monthOpportunityWrapper);
        }

        return opportunitiesByMonthList;
    }

    public class OpportunityWrapper {
        @AuraEnabled
        public Id Id;
        @AuraEnabled
        public String Name;
       
    }

    public class MonthOpportunityWrapper {
        @AuraEnabled
        public String month;
        @AuraEnabled
        public String year;
        @AuraEnabled
        public List<OpportunityWrapper> opportunities;

        public MonthOpportunityWrapper(String month, String year, List<OpportunityWrapper> opportunities) {
            this.month = month;
            this.year = year;
            this.opportunities = opportunities;
        }
    }
}