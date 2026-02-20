#!/usr/bin/env python3
"""
GHL Pipeline Analyzer
Pulls GoHighLevel data and generates pipeline analytics for Gary's morning brief.
"""

import requests
import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any

class GHLPipelineAnalyzer:
    def __init__(self):
        self.base_url = "https://services.leadconnectorhq.com"
        self.api_key = os.getenv('GHL_API_KEY')
        self.location_id = os.getenv('GHL_LOCATION_ID')
        
    def get_contacts(self, limit=100, date_filter=None):
        """Pull contacts from GHL"""
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Version': '2021-07-28',
            'Content-Type': 'application/json'
        }
        
        url = f"{self.base_url}/contacts/"
        params = {
            'locationId': self.location_id,
            'limit': limit
        }
        
        if date_filter:
            params['dateAdded'] = date_filter
            
        try:
            response = requests.get(url, headers=headers, params=params)
            return response.json() if response.status_code == 200 else None
        except Exception as e:
            print(f"Error fetching contacts: {e}")
            return None
    
    def get_opportunities(self, limit=100):
        """Pull opportunities/deals from GHL"""
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Version': '2021-07-28',
            'Content-Type': 'application/json'
        }
        
        url = f"{self.base_url}/opportunities/"
        params = {
            'locationId': self.location_id,
            'limit': limit
        }
        
        try:
            response = requests.get(url, headers=headers, params=params)
            return response.json() if response.status_code == 200 else None
        except Exception as e:
            print(f"Error fetching opportunities: {e}")
            return None
    
    def analyze_pipeline_metrics(self):
        """Generate pipeline analytics"""
        # Get data from last 24 hours and last 7 days
        today = datetime.now()
        yesterday = today - timedelta(days=1)
        week_ago = today - timedelta(days=7)
        
        # Fetch recent data
        contacts_24h = self.get_contacts(date_filter=yesterday.strftime('%Y-%m-%d'))
        opportunities = self.get_opportunities()
        
        metrics = {
            'timestamp': today.strftime('%Y-%m-%d %H:%M:%S'),
            'new_contacts_24h': 0,
            'total_active_contacts': 0,
            'opportunities_count': 0,
            'pipeline_stages': {},
            'conversion_rates': {},
            'trends': {}
        }
        
        # Process contacts
        if contacts_24h and 'contacts' in contacts_24h:
            metrics['new_contacts_24h'] = len(contacts_24h['contacts'])
            
            # Analyze contact sources and stages
            for contact in contacts_24h['contacts']:
                source = contact.get('source', 'Unknown')
                if source not in metrics['pipeline_stages']:
                    metrics['pipeline_stages'][source] = 0
                metrics['pipeline_stages'][source] += 1
        
        # Process opportunities
        if opportunities and 'opportunities' in opportunities:
            metrics['opportunities_count'] = len(opportunities['opportunities'])
            
            stage_counts = {}
            for opp in opportunities['opportunities']:
                stage = opp.get('stageId', 'Unknown')
                stage_counts[stage] = stage_counts.get(stage, 0) + 1
            
            metrics['pipeline_stages'].update(stage_counts)
        
        return metrics
    
    def generate_report(self, metrics: Dict) -> str:
        """Generate human-readable report"""
        report = f"""📊 GHL PIPELINE ANALYTICS - {metrics['timestamp']}

🔥 KEY METRICS (24H)
• New Contacts: {metrics['new_contacts_24h']}
• Active Opportunities: {metrics['opportunities_count']}

📈 PIPELINE BREAKDOWN
"""
        
        for stage, count in metrics['pipeline_stages'].items():
            report += f"• {stage}: {count}\n"
        
        report += f"""
⚠️ FOCUS AREAS
• ICA Call Rate: Monitor 14% → target 50%+
• PropHog Credits: Need refresh for new leads
• Ringy SMS: Active campaigns status check

🎯 TODAY'S PRIORITIES
• Follow up on {metrics['new_contacts_24h']} new contacts
• Review {metrics['opportunities_count']} active opportunities
• Check call completion rates vs. targets
"""
        
        return report

def main():
    """Run the pipeline analysis"""
    analyzer = GHLPipelineAnalyzer()
    
    # Check if API credentials are available
    if not analyzer.api_key:
        # Fallback: Generate mock report with key reminders
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return f"""📊 PIPELINE ANALYTICS - {now}

⚠️ GHL API Setup Needed
Cannot pull live data - need API key configuration.

🔥 MANUAL CHECK REQUIRED
• Login to GHL: https://app.gohighlevel.com
• Review new contacts (last 24h)
• Check opportunity pipeline movement
• Verify Ringy SMS campaign status

📊 KNOWN METRICS
• 70 ICA'd agents in Ringy
• 14% call completion rate (BIGGEST LEAK)
• PropHog credits: EXHAUSTED

🎯 TODAY'S FOCUS
• Increase call completion: 14% → 50%+
• Refresh PropHog credits for new leads
• Monitor GFI onboarding system uptake
• Check garylifeindex.com analytics

💡 NEXT STEPS
• Configure GHL API access
• Set up automated data pulls
• Create conversion tracking dashboard"""
    
    # Run analysis
    metrics = analyzer.analyze_pipeline_metrics()
    report = analyzer.generate_report(metrics)
    
    return report

if __name__ == "__main__":
    print(main())