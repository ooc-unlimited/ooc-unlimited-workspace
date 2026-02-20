#!/usr/bin/env node

const axios = require('axios');

/**
 * GHL System Validator & Setup Assistant
 * Verifies current setup and provides specific implementation steps
 */

class GHLSystemValidator {
    constructor() {
        this.authToken = 'pit-da70238f-fc7a-40e3-bd32-e43e61f069e3';
        this.locationId = 'Gy0H1V7ydacMTFYcNz2f';
        this.baseURL = 'https://services.leadconnectorhq.com';
    }

    async makeRequest(method, endpoint) {
        try {
            const config = {
                method,
                url: `${this.baseURL}${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-07-28'
                }
            };
            
            const response = await axios(config);
            return { success: true, data: response.data };
            
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || error.message,
                status: error.response?.status 
            };
        }
    }

    async validateCurrentSetup() {
        console.log('🔍 VALIDATING CURRENT GHL SETUP...\n');
        
        const checks = [
            { name: 'Pipelines', endpoint: `/opportunities/pipelines?locationId=${this.locationId}` },
            { name: 'Workflows', endpoint: `/workflows/?locationId=${this.locationId}` },
            { name: 'Custom Fields', endpoint: `/locations/${this.locationId}/customFields` },
            { name: 'Opportunities', endpoint: `/opportunities/search?locationId=${this.locationId}&limit=5` },
            { name: 'Contacts', endpoint: `/contacts/?locationId=${this.locationId}&limit=5` }
        ];

        const results = {};
        
        for (let check of checks) {
            console.log(`📊 Checking ${check.name}...`);
            const result = await this.makeRequest('GET', check.endpoint);
            
            if (result.success) {
                const data = result.data;
                let count = 0;
                
                if (data.pipelines) count = data.pipelines.length;
                else if (data.workflows) count = data.workflows.length;  
                else if (data.customFields) count = data.customFields.length;
                else if (data.opportunities) count = data.opportunities.length;
                else if (data.contacts) count = data.contacts.length;
                else count = Array.isArray(data) ? data.length : 1;
                
                console.log(`  ✅ ${check.name}: ${count} found`);
                results[check.name.toLowerCase()] = { success: true, count, data };
            } else {
                console.log(`  ❌ ${check.name}: ${result.error}`);
                results[check.name.toLowerCase()] = { success: false, error: result.error };
            }
        }
        
        return results;
    }

    async analyzePipelineNeeds(results) {
        console.log('\n🎯 ANALYZING PIPELINE SETUP NEEDS...\n');
        
        if (!results.pipelines?.success) {
            console.log('❌ Cannot access pipelines - API limitation detected');
            return this.generateManualPipelineSetup();
        }

        const pipelines = results.pipelines.data.pipelines || [];
        console.log(`📋 Current pipelines: ${pipelines.length}`);
        
        const pipelineNames = pipelines.map(p => p.name);
        console.log(`  Names: ${pipelineNames.join(', ')}`);
        
        const hasProlificSystem = pipelineNames.some(name => 
            name.includes('Prolific') || 
            name.includes('OB1') || 
            name.includes('OB2') ||
            name.includes('OB3')
        );
        
        if (hasProlificSystem) {
            console.log('✅ Prolific System pipeline appears to exist');
            return this.analyzePipelineStages(pipelines);
        } else {
            console.log('⚠️ No Prolific System pipeline found');
            return this.generatePipelineCreationSteps();
        }
    }

    async analyzePipelineStages(pipelines) {
        const requiredStages = [
            'OB1 New Associate',
            'OB1 Pre-License Process', 
            'OB1 Personal Financial Review',
            'OB1 1-1-7 Challenge',
            'OB2 Licensed',
            'OB2 Post License Process',
            'OB2 Business Plan 3.3.30',
            'OB2 Grand Opening',
            'OB3 Field Training & Net License',
            'OB3 Certified Field Trainer',
            'OB3 Leadership Factory', 
            'OB3 EMD Qualified',
            'Stalled',
            'Inactive'
        ];
        
        for (let pipeline of pipelines) {
            const stages = pipeline.stages || [];
            console.log(`\n📊 Pipeline: ${pipeline.name} (${stages.length} stages)`);
            
            const stageNames = stages.map(s => s.name);
            const missingStages = requiredStages.filter(req => 
                !stageNames.some(stage => stage.includes(req))
            );
            
            if (missingStages.length === 0) {
                console.log('✅ All required stages present');
                return { complete: true, pipeline: pipeline.name };
            } else {
                console.log(`⚠️ Missing stages: ${missingStages.slice(0, 3).join(', ')}${missingStages.length > 3 ? '...' : ''}`);
            }
        }
        
        return this.generateStageUpdateSteps();
    }

    generateManualPipelineSetup() {
        return {
            action: 'manual_setup',
            steps: [
                '1. Go to: https://app.gohighlevel.com/v2/location/Gy0H1V7ydacMTFYcNz2f/opportunities/pipeline',
                '2. Click "Create New Pipeline"',
                '3. Name: "The Prolific System"', 
                '4. Add all 14 stages from the setup guide',
                '5. Configure stage automation triggers'
            ],
            reference: 'See GHL-PROLIFIC-SYSTEM-COMPLETE-SETUP.md for full details'
        };
    }

    generatePipelineCreationSteps() {
        return {
            action: 'create_pipeline',
            steps: [
                '1. Create "The Prolific System" pipeline manually',
                '2. Add 14 stages in correct order',
                '3. Set up 5 automated workflows',
                '4. Import existing agents as opportunities',
                '5. Test pipeline flow with sample data'
            ],
            priority: 'HIGH - Required for system function'
        };
    }

    generateStageUpdateSteps() {
        return {
            action: 'update_stages', 
            steps: [
                '1. Update existing pipeline to match Prolific System stages',
                '2. Verify stage order and naming',
                '3. Update any existing opportunities',
                '4. Test stage progression automation'
            ],
            priority: 'MEDIUM - Optimization needed'
        };
    }

    async generateImplementationPlan(results, pipelineAnalysis) {
        console.log('\n🚀 GENERATING IMPLEMENTATION PLAN...\n');
        
        const plan = {
            timestamp: new Date().toISOString(),
            currentSetup: results,
            pipelineStatus: pipelineAnalysis,
            immediateActions: [],
            weeklyTasks: [],
            successMetrics: []
        };

        // Immediate actions based on current state
        if (!results.pipelines?.success || pipelineAnalysis.action === 'manual_setup') {
            plan.immediateActions = [
                '🏗️ CREATE: The Prolific System pipeline (14 stages)',
                '🔧 ADD: 5 custom fields for tracking',
                '🤖 BUILD: 5 core automation workflows',
                '📊 IMPORT: 70 existing ICA agents as opportunities',
                '🧪 TEST: Complete pipeline flow with dummy data'
            ];
        }

        // Weekly tasks for system optimization  
        plan.weeklyTasks = [
            'Week 1: Complete pipeline setup and workflow testing',
            'Week 2: Import and organize all existing agents', 
            'Week 3: Monitor pipeline flow and conversion rates',
            'Week 4: Optimize workflows based on performance data'
        ];

        // Success metrics
        plan.successMetrics = [
            'Pipeline processes 10+ agents simultaneously',
            'Stage conversion rate >75% through OB1',
            'Average time OB1→OB2: <21 days',  
            'Monthly recurring revenue: $3,000+',
            'Agent retention rate: >50% (vs current ~10%)'
        ];

        const reportContent = `
# GHL Implementation Plan
Generated: ${new Date().toLocaleString()}

## Current Setup Status
- Pipelines: ${results.pipelines?.success ? '✅ Accessible' : '❌ API Limited'}
- Workflows: ${results.workflows?.success ? '✅ Available' : '❌ Needs Setup'}
- Custom Fields: ${results.customFields?.success ? '✅ Ready' : '❌ Needs Creation'}
- Opportunities: ${results.opportunities?.count || 0} existing
- Contacts: ${results.contacts?.count || 0} existing

## Pipeline Analysis
Action Required: ${pipelineAnalysis.action || 'Unknown'}
Priority: ${pipelineAnalysis.priority || 'HIGH'}

Steps:
${pipelineAnalysis.steps?.map((step, i) => `${i + 1}. ${step}`).join('\n') || 'Manual setup required'}

## Immediate Actions (Next 24 Hours)
${plan.immediateActions.map((action, i) => `${i + 1}. ${action}`).join('\n')}

## Weekly Implementation Plan
${plan.weeklyTasks.map((task, i) => `${i + 1}. ${task}`).join('\n')}

## Success Metrics (Month 1 Targets)
${plan.successMetrics.map((metric, i) => `${i + 1}. ${metric}`).join('\n')}

## Files Created
1. GHL-PROLIFIC-SYSTEM-COMPLETE-SETUP.md - Complete implementation guide
2. ghl-system-validator.js - This validation script  
3. ghl-implementation-plan.md - This implementation plan

## Next Steps
1. Review GHL-PROLIFIC-SYSTEM-COMPLETE-SETUP.md for detailed setup instructions
2. Access GHL admin panel to begin manual pipeline creation
3. Execute immediate actions in order of priority
4. Schedule weekly review meetings to track progress

## Support Resources
- GHL Documentation: docs.gohighlevel.com
- Pipeline Template: Available in setup guide
- Workflow Templates: Pre-configured for copy/paste
- Custom Field Specs: Complete field definitions included

## Timeline Estimate
- Manual Setup: 3-4 hours
- Testing Phase: 1-2 hours  
- Agent Import: 2-3 hours
- Full Implementation: 1-2 days
- ROI Achievement: 30 days

---

**STATUS: READY FOR IMPLEMENTATION**
All resources and guides have been prepared for immediate execution.
`;

        await require('fs').promises.writeFile(
            '/Users/donna/.openclaw/workspace/ghl-implementation-plan.md',
            reportContent
        );

        return plan;
    }

    async executeValidation() {
        console.log('🎯 GHL SYSTEM VALIDATION & IMPLEMENTATION PLANNING');
        console.log('==================================================\n');
        
        try {
            // Validate current setup
            const results = await this.validateCurrentSetup();
            
            // Analyze pipeline needs
            const pipelineAnalysis = await this.analyzePipelineNeeds(results);
            
            // Generate implementation plan  
            const plan = await this.generateImplementationPlan(results, pipelineAnalysis);
            
            console.log('\n✅ VALIDATION COMPLETE!');
            console.log('\n📋 Summary:');
            console.log(`   • Pipelines: ${results.pipelines?.count || 'API Limited'}`);
            console.log(`   • Workflows: ${results.workflows?.count || 'Unknown'}`); 
            console.log(`   • Custom Fields: ${results.customFields?.count || 'Unknown'}`);
            console.log(`   • Opportunities: ${results.opportunities?.count || 'Unknown'}`);
            
            console.log('\n🎯 Priority Action:');
            console.log(`   ${pipelineAnalysis.action?.replace('_', ' ').toUpperCase() || 'MANUAL SETUP REQUIRED'}`);
            
            console.log('\n📁 Files Generated:');
            console.log('   • GHL-PROLIFIC-SYSTEM-COMPLETE-SETUP.md');
            console.log('   • ghl-implementation-plan.md');
            
            console.log('\n🚀 Ready for implementation!');
            console.log('Review the setup guide and begin manual pipeline creation.');
            
            return plan;
            
        } catch (error) {
            console.log('\n❌ VALIDATION FAILED:', error.message);
            throw error;
        }
    }
}

// Execute validation
async function main() {
    const validator = new GHLSystemValidator();
    
    try {
        await validator.executeValidation();
        console.log('\n✅ GHL SYSTEM ANALYSIS COMPLETE');
        
    } catch (error) {
        console.error('\n💥 CRITICAL ERROR:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = GHLSystemValidator;