/**
 * GoHighLevel Integration for Grand Opening Factory
 * Seamlessly connects website events with GHL pipeline
 */

interface GHLOpportunity {
  name: string;
  pipelineId: string;
  pipelineStageId: string;
  assignedTo?: string;
  status: 'open' | 'won' | 'lost' | 'abandoned';
  monetaryValue?: number;
  notes?: string;
  source?: string;
}

class GHLIntegration {
  private authToken = 'pit-da70238f-fc7a-40e3-bd32-e43e61f069e3';
  private locationId = 'Gy0H1V7ydacMTFYcNz2f';
  private baseURL = 'https://services.leadconnectorhq.com';
  
  // Grand Opening Pipeline ID and Stage IDs (from API response)
  private pipelineId = 'YRjgjhK7s27bABskJnvB';
  private stages = {
    eventPlanning: 'b61e8b6b-cafb-4450-8dca-2042bbd5d43c',
    invitationsSent: '78990b1c-c07d-4266-8b05-8c1ff63de64f',
    rsvpsReceived: '0b3f9045-4e62-47e1-ae75-e8820501a666',
    eventConfirmed: 'afd4f75a-0bd6-48ba-98d8-09bea26a9bab',
    eventCompleted: '11f72f78-b7ef-400e-87ea-83b511801232',
    followupComplete: '56b5c3d5-3a20-442a-99f7-d0d19a21dbe1'
  };

  private async makeGHLRequest(method: string, endpoint: string, data?: any) {
    try {
      const config: RequestInit = {
        method,
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28'
        }
      };
      
      if (data) {
        config.body = JSON.stringify(data);
      }
      
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`GHL API Error: ${response.status} - ${error}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('GHL Integration Error:', error);
      throw error;
    }
  }

  /**
   * STEP 1: Create GHL Opportunity when Grand Opening is created
   */
  async createGrandOpeningOpportunity(eventData: {
    agent_name: string;
    event_date: string;
    event_time: string;
    target_guests: number;
    agent_email?: string;
    agent_phone?: string;
    zoom_link?: string;
  }) {
    const opportunity: GHLOpportunity = {
      name: `${eventData.agent_name}'s Grand Opening - ${eventData.event_date}`,
      pipelineId: this.pipelineId,
      pipelineStageId: this.stages.eventPlanning, // Start in "Event Planning"
      status: 'open',
      monetaryValue: 0, // Could track expected revenue from event
      notes: `Grand Opening Event Details:
Date: ${eventData.event_date} at ${eventData.event_time}
Target Guests: ${eventData.target_guests}
Zoom Link: ${eventData.zoom_link || 'TBD'}
Agent Contact: ${eventData.agent_email || 'N/A'}`,
      source: 'Grand Opening Factory Website'
    };

    const result = await this.makeGHLRequest('POST', '/opportunities/', {
      ...opportunity,
      locationId: this.locationId
    });

    console.log(`✅ GHL Opportunity created: ${result.id} for ${eventData.agent_name}`);
    return result;
  }

  /**
   * STEP 2: Move opportunity through stages based on website actions
   */
  async moveOpportunityToStage(opportunityId: string, stage: keyof typeof this.stages, notes?: string) {
    const stageId = this.stages[stage];
    
    const updateData: any = {
      pipelineStageId: stageId
    };
    
    if (notes) {
      updateData.notes = notes;
    }

    const result = await this.makeGHLRequest('PUT', `/opportunities/${opportunityId}`, updateData);
    
    const stageNames = {
      eventPlanning: 'Event Planning',
      invitationsSent: 'Invitations Sent', 
      rsvpsReceived: 'RSVPs Received',
      eventConfirmed: 'Event Confirmed',
      eventCompleted: 'Event Completed',
      followupComplete: 'Follow-up Complete'
    };
    
    console.log(`✅ Moved opportunity ${opportunityId} to: ${stageNames[stage]}`);
    return result;
  }

  /**
   * STEP 3: Add RSVP guests as contacts in GHL
   */
  async addRSVPAsContact(guestData: {
    name: string;
    email?: string;
    phone?: string;
    rsvp_status: string;
    event_id: string;
    agent_name: string;
  }) {
    const contact = {
      locationId: this.locationId,
      firstName: guestData.name.split(' ')[0] || guestData.name,
      lastName: guestData.name.split(' ').slice(1).join(' ') || '',
      email: guestData.email || '',
      phone: guestData.phone || '',
      source: `${guestData.agent_name}'s Grand Opening`,
      tags: ['grand-opening-rsvp', `rsvp-${guestData.rsvp_status.toLowerCase()}`],
      customFields: {
        'grand_opening_event_id': guestData.event_id,
        'rsvp_status': guestData.rsvp_status,
        'event_agent': guestData.agent_name
      }
    };

    const result = await this.makeGHLRequest('POST', '/contacts/', contact);
    console.log(`✅ Added RSVP contact: ${guestData.name} (${guestData.rsvp_status})`);
    return result;
  }

  /**
   * STEP 4: Get opportunity by custom criteria  
   */
  async findOpportunityByEvent(agentName: string, eventDate: string) {
    const searchQuery = `${agentName}'s Grand Opening - ${eventDate}`;
    const result = await this.makeGHLRequest('GET', 
      `/opportunities/search?locationId=${this.locationId}&query=${encodeURIComponent(searchQuery)}`
    );
    
    return result.opportunities?.[0] || null;
  }

  /**
   * STEP 5: Update opportunity value based on outcomes
   */
  async updateOpportunityValue(opportunityId: string, monetaryValue: number, notes?: string) {
    const updateData: any = {
      monetaryValue
    };
    
    if (notes) {
      updateData.notes = notes;
    }

    const result = await this.makeGHLRequest('PUT', `/opportunities/${opportunityId}`, updateData);
    console.log(`✅ Updated opportunity ${opportunityId} value: $${monetaryValue}`);
    return result;
  }
}

// Export singleton instance
export const ghlIntegration = new GHLIntegration();

// Helper functions for common Grand Opening workflows
export async function createGrandOpeningInGHL(eventData: any) {
  return await ghlIntegration.createGrandOpeningOpportunity(eventData);
}

export async function progressGrandOpeningStage(
  opportunityId: string, 
  stage: 'invitationsSent' | 'rsvpsReceived' | 'eventConfirmed' | 'eventCompleted' | 'followupComplete',
  notes?: string
) {
  return await ghlIntegration.moveOpportunityToStage(opportunityId, stage, notes);
}

export async function addGrandOpeningRSVP(guestData: any) {
  return await ghlIntegration.addRSVPAsContact(guestData);
}

export async function findGrandOpeningOpportunity(agentName: string, eventDate: string) {
  return await ghlIntegration.findOpportunityByEvent(agentName, eventDate);
}

export async function updateGrandOpeningValue(opportunityId: string, value: number, notes?: string) {
  return await ghlIntegration.updateOpportunityValue(opportunityId, value, notes);
}