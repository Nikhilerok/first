import { LightningElement, wire } from 'lwc';
import getAccountsAndOpportunitiesByCreatedDate from '@salesforce/apex/oppo2class.oppo2method';

const columns = [
    { label: 'Opportunity Name', fieldName: 'Name', type: 'text' },
    // Add more columns here as needed
];

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default class oppo2 extends LightningElement {
    opportunitiesByMonth;
    columns = columns;

    @wire(getAccountsAndOpportunitiesByCreatedDate)
    wiredOpportunities({ error, data }) {
        if (data) {
            // Group opportunities by month
            const opportunitiesByMonthMap = new Map();

            // Initialize the map with all the months
            months.forEach(month => {
                opportunitiesByMonthMap.set(month, []);
            });

            data.forEach(monthOpportunity => {
                const { month, opportunities } = monthOpportunity;
                if (month && opportunities) {
                    const formattedMonth = new Date(`2022-${month}-01`).toLocaleString('default', { month: 'long' });
                    opportunitiesByMonthMap.set(formattedMonth, opportunities);
                }
            });

            // Convert map to array
            this.opportunitiesByMonth = Array.from(opportunitiesByMonthMap).map(([month, opportunities]) => {
                return {
                    month,
                    opportunities,
                    isEmpty: opportunities.length === 0 // Add a flag to check if opportunities are empty for this month
                };
            });
        } else if (error) {
            console.error('Error retrieving data:', error);
        }
    }
}