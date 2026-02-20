/**
 * Grand Opening Automation System
 * Seamlessly connects website actions with GHL pipeline progression
 */

import { progressGrandOpeningStage, updateGrandOpeningValue } from './ghl-integration';

interface GrandOpeningEvent {
  id: string;
  agent_name: string;
  event_date: string;
  ghl_opportunity_id?: string;
}

interface AutomationAction {
  trigger: string;
  stage?: 'invitationsSent' | 'rsvpsReceived' | 'eventConfirmed' | 'eventCompleted' | 'followupComplete';
  notes?: string;
  value?: number;
}

class GrandOpeningAutomation {
  /**
   * AUTOMATION TRIGGER 1: When invitations are sent
   */
  async onInvitationsSent(event: GrandOpeningEvent, guestCount: number) {
    if (!event.ghl_opportunity_id) return;
    
    try {
      await progressGrandOpeningStage(
        event.ghl_opportunity_id,
        'invitationsSent',
        `Invitations sent to ${guestCount} potential attendees. Event promotion active.`
      );
      
      console.log(`✅ Auto-progression: ${event.agent_name}'s Grand Opening → Invitations Sent`);
      return { success: true, stage: 'Invitations Sent' };
      
    } catch (error) {
      console.error('Failed to progress to Invitations Sent:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * AUTOMATION TRIGGER 2: When first RSVP is received
   */
  async onFirstRSVP(event: GrandOpeningEvent, rsvpData: { name: string; email?: string }) {
    if (!event.ghl_opportunity_id) return;
    
    try {
      await progressGrandOpeningStage(
        event.ghl_opportunity_id,
        'rsvpsReceived',
        `First RSVP received from ${rsvpData.name}. Momentum building!`
      );
      
      console.log(`✅ Auto-progression: ${event.agent_name}'s Grand Opening → RSVPs Received`);
      return { success: true, stage: 'RSVPs Received' };
      
    } catch (error) {
      console.error('Failed to progress to RSVPs Received:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * AUTOMATION TRIGGER 3: When event is confirmed (minimum RSVPs reached)
   */
  async onEventConfirmed(event: GrandOpeningEvent, rsvpCount: number, confirmationDetails: any) {
    if (!event.ghl_opportunity_id) return;
    
    try {
      await progressGrandOpeningStage(
        event.ghl_opportunity_id,
        'eventConfirmed',
        `Event confirmed with ${rsvpCount} RSVPs! Final preparations underway.`
      );
      
      // Set expected value based on RSVP count and conversion estimates
      const estimatedValue = rsvpCount * 50; // $50 estimated value per attendee
      await updateGrandOpeningValue(
        event.ghl_opportunity_id,
        estimatedValue,
        `Estimated revenue potential: ${rsvpCount} attendees × $50 avg = $${estimatedValue}`
      );
      
      console.log(`✅ Auto-progression: ${event.agent_name}'s Grand Opening → Event Confirmed (${rsvpCount} RSVPs)`);
      return { success: true, stage: 'Event Confirmed', estimatedValue };
      
    } catch (error) {
      console.error('Failed to progress to Event Confirmed:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * AUTOMATION TRIGGER 4: When event date has passed
   */
  async onEventCompleted(event: GrandOpeningEvent, eventOutcome: {
    actualAttendees: number;
    leadsGenerated: number;
    appointmentsBooked: number;
    newClients?: number;
  }) {
    if (!event.ghl_opportunity_id) return;
    
    try {
      const { actualAttendees, leadsGenerated, appointmentsBooked, newClients = 0 } = eventOutcome;
      
      await progressGrandOpeningStage(
        event.ghl_opportunity_id,
        'eventCompleted',
        `Event completed successfully! 
📊 Results:
- Attendees: ${actualAttendees}
- Leads Generated: ${leadsGenerated}
- Appointments Booked: ${appointmentsBooked}
- New Clients: ${newClients}`
      );
      
      // Update value based on actual results
      const actualValue = (newClients * 2000) + (appointmentsBooked * 200); // $2K per client, $200 per appointment
      await updateGrandOpeningValue(
        event.ghl_opportunity_id,
        actualValue,
        `Actual revenue: ${newClients} clients × $2,000 + ${appointmentsBooked} appointments × $200 = $${actualValue}`
      );
      
      console.log(`✅ Auto-progression: ${event.agent_name}'s Grand Opening → Event Completed (${actualAttendees} attended)`);
      return { success: true, stage: 'Event Completed', actualValue };
      
    } catch (error) {
      console.error('Failed to progress to Event Completed:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * AUTOMATION TRIGGER 5: When follow-up activities are completed
   */
  async onFollowupCompleted(event: GrandOpeningEvent, followupResults: {
    contactsFollowedUp: number;
    additionalAppointments: number;
    referralsReceived: number;
  }) {
    if (!event.ghl_opportunity_id) return;
    
    try {
      const { contactsFollowedUp, additionalAppointments, referralsReceived } = followupResults;
      
      await progressGrandOpeningStage(
        event.ghl_opportunity_id,
        'followupComplete',
        `Follow-up completed! 
📞 Follow-up Results:
- Contacts Followed Up: ${contactsFollowedUp}
- Additional Appointments: ${additionalAppointments}
- Referrals Received: ${referralsReceived}
🎉 Grand Opening lifecycle complete!`
      );
      
      // Add follow-up value
      const followupValue = (additionalAppointments * 200) + (referralsReceived * 100);
      if (followupValue > 0) {
        await updateGrandOpeningValue(
          event.ghl_opportunity_id,
          followupValue,
          `Follow-up revenue: ${additionalAppointments} appointments × $200 + ${referralsReceived} referrals × $100 = $${followupValue}`
        );
      }
      
      console.log(`✅ Auto-progression: ${event.agent_name}'s Grand Opening → Follow-up Complete`);
      return { success: true, stage: 'Follow-up Complete', followupValue };
      
    } catch (error) {
      console.error('Failed to progress to Follow-up Complete:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * SMART AUTOMATION: Auto-detect which trigger to fire based on website activity
   */
  async handleWebsiteAction(action: string, event: GrandOpeningEvent, actionData: any) {
    console.log(`🤖 Smart Automation triggered: ${action} for ${event.agent_name}'s Grand Opening`);
    
    switch (action) {
      case 'invitations_bulk_sent':
        return await this.onInvitationsSent(event, actionData.guestCount);
        
      case 'first_rsvp_received':
        return await this.onFirstRSVP(event, actionData.rsvpData);
        
      case 'minimum_rsvps_reached':
        return await this.onEventConfirmed(event, actionData.rsvpCount, actionData);
        
      case 'event_date_passed':
        return await this.onEventCompleted(event, actionData.eventOutcome);
        
      case 'followup_completed':
        return await this.onFollowupCompleted(event, actionData.followupResults);
        
      default:
        console.warn(`Unknown automation action: ${action}`);
        return { success: false, error: 'Unknown action' };
    }
  }
}

// Export singleton instance
export const grandOpeningAutomation = new GrandOpeningAutomation();

// Helper functions for easy integration
export async function triggerInvitationsSent(event: GrandOpeningEvent, guestCount: number) {
  return await grandOpeningAutomation.onInvitationsSent(event, guestCount);
}

export async function triggerFirstRSVP(event: GrandOpeningEvent, rsvpData: any) {
  return await grandOpeningAutomation.onFirstRSVP(event, rsvpData);
}

export async function triggerEventConfirmed(event: GrandOpeningEvent, rsvpCount: number) {
  return await grandOpeningAutomation.onEventConfirmed(event, rsvpCount, {});
}

export async function triggerEventCompleted(event: GrandOpeningEvent, eventOutcome: any) {
  return await grandOpeningAutomation.onEventCompleted(event, eventOutcome);
}

export async function triggerFollowupCompleted(event: GrandOpeningEvent, followupResults: any) {
  return await grandOpeningAutomation.onFollowupCompleted(event, followupResults);
}

export async function handleSmartAutomation(action: string, event: GrandOpeningEvent, actionData: any) {
  return await grandOpeningAutomation.handleWebsiteAction(action, event, actionData);
}