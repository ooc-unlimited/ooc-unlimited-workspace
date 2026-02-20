#!/usr/bin/env node

const axios = require('axios');

/**
 * Grand Opening Pipeline Monitor
 * Monitors Manus task progress and reports completion
 */

class GrandOpeningPipelineMonitor {
    constructor() {
        this.taskId = 'Qkrpt9AoUpgEv76dB2BT7H';
        this.apiKey = 'sk-oKCm4Ef2quc-qc0oeBIDpNTR9LaOaQfBqy94tX877Dzu3Et7Dur0-qPM9JAlDdcsHBaoA-NvkYdXEzdyg7wtRO-2JsaA';
        this.baseUrl = 'https://api.manus.ai/v1';
        this.checkInterval = 15000; // Check every 15 seconds
        this.maxChecks = 40; // Max 10 minutes of monitoring
        this.checksPerformed = 0;
    }

    async checkTaskStatus() {
        try {
            const response = await axios.get(`${this.baseUrl}/tasks/${this.taskId}`, {
                headers: {
                    'API_KEY': this.apiKey
                }
            });
            
            return response.data;
            
        } catch (error) {
            console.log(`❌ Error checking task status: ${error.message}`);
            return null;
        }
    }

    displayStatus(task) {
        const status = task.status;
        const title = task.metadata?.task_title || 'Unknown';
        const credits = task.credit_usage || 0;
        const lastUpdate = new Date(task.updated_at * 1000).toLocaleTimeString();
        
        console.log(`\n🔄 Grand Opening Pipeline Creation - Check #${this.checksPerformed}`);
        console.log(`📊 Status: ${status.toUpperCase()}`);
        console.log(`💰 Credits Used: ${credits}`);
        console.log(`🕐 Last Update: ${lastUpdate}`);
        console.log(`📝 Title: ${title}`);
        
        // Show output if available
        if (task.output && task.output.length > 0) {
            const lastOutput = task.output[task.output.length - 1];
            if (lastOutput.content && lastOutput.content[0]?.text) {
                const text = lastOutput.content[0].text;
                const preview = text.length > 200 ? text.substring(0, 200) + '...' : text;
                console.log(`📄 Latest Output: ${preview}`);
            }
        }
        
        return status;
    }

    async generateCompletionReport(task) {
        const report = `
# Grand Opening Pipeline - Manus Completion Report
Generated: ${new Date().toLocaleString()}

## Task Details
- **Task ID:** ${this.taskId}
- **Task URL:** https://manus.im/app/${this.taskId}
- **Status:** ${task.status}
- **Credits Used:** ${task.credit_usage}
- **Agent:** ${task.model}
- **Created:** ${new Date(task.created_at * 1000).toLocaleString()}
- **Completed:** ${new Date(task.updated_at * 1000).toLocaleString()}

## Task Output
${task.output ? task.output.map(output => {
    if (output.content && output.content[0]?.text) {
        return output.content[0].text;
    }
    return 'No text output';
}).join('\n\n') : 'No output available'}

## Pipeline Details
**Pipeline Name:** Grand Opening
**Stages Created:**
1. Event Planning
2. Invitations Sent  
3. RSVPs Received
4. Event Confirmed
5. Event Completed
6. Follow-up Complete

## Next Steps
1. Verify pipeline creation in GoHighLevel
2. Test pipeline functionality
3. Set up automation workflows
4. Begin using for Grand Opening event management

## Status
${task.status === 'completed' ? '✅ GRAND OPENING PIPELINE SUCCESSFULLY CREATED' : 
  task.status === 'error' ? '❌ PIPELINE CREATION FAILED' : 
  '🔄 PIPELINE CREATION IN PROGRESS'}
`;

        await require('fs').promises.writeFile(
            '/Users/donna/.openclaw/workspace/grand-opening-pipeline-report.md',
            report
        );
        
        return report;
    }

    async monitor() {
        console.log('🚀 MONITORING GRAND OPENING PIPELINE CREATION');
        console.log(`Task ID: ${this.taskId}`);
        console.log('Checking every 15 seconds for completion...\n');
        
        while (this.checksPerformed < this.maxChecks) {
            this.checksPerformed++;
            
            const task = await this.checkTaskStatus();
            if (!task) {
                console.log('⚠️ Could not retrieve task status, retrying...');
                await this.sleep(this.checkInterval);
                continue;
            }
            
            const status = this.displayStatus(task);
            
            if (status === 'completed') {
                console.log('\n🎉 PIPELINE CREATION COMPLETED!');
                await this.generateCompletionReport(task);
                console.log('📋 Completion report saved: grand-opening-pipeline-report.md');
                console.log('🔗 View full results: https://manus.im/app/' + this.taskId);
                return task;
            } else if (status === 'error') {
                console.log('\n❌ PIPELINE CREATION FAILED');
                await this.generateCompletionReport(task);
                console.log('📋 Error report saved: grand-opening-pipeline-report.md');
                return task;
            } else if (status === 'pending') {
                console.log('\n⏳ Task is pending user input - check the Manus interface');
            }
            
            // Wait before next check
            console.log(`⏱️  Waiting ${this.checkInterval/1000} seconds before next check...`);
            await this.sleep(this.checkInterval);
        }
        
        console.log('\n⌛ Monitoring timeout reached (10 minutes)');
        console.log('🔗 Check manually: https://manus.im/app/' + this.taskId);
        
        return null;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Execute monitoring
async function main() {
    const monitor = new GrandOpeningPipelineMonitor();
    
    try {
        await monitor.monitor();
    } catch (error) {
        console.error('💥 Monitoring error:', error.message);
    }
}

if (require.main === module) {
    main();
}

module.exports = GrandOpeningPipelineMonitor;