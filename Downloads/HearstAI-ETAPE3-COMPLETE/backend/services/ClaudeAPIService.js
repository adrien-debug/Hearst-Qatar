// Claude API Service
// Handles communication with Anthropic Claude API

const https = require('https');

class ClaudeAPIService {
    constructor() {
        // IMPORTANT: Set your API key in environment variable
        this.apiKey = process.env.ANTHROPIC_API_KEY || 'YOUR_API_KEY_HERE';
        this.apiUrl = 'api.anthropic.com';
        this.model = 'claude-sonnet-4-20250514';
        this.maxTokens = 4000;
    }

    /**
     * Execute a job with Claude
     */
    async executeJob(job, promptProfile = null) {
        try {
            // Build the prompt
            const systemPrompt = promptProfile?.system_prompt || this.getDefaultSystemPrompt();
            const userPrompt = this.buildUserPrompt(job);

            // Call Claude API
            const response = await this.callClaudeAPI(systemPrompt, userPrompt);

            return {
                success: true,
                output: response.content[0].text,
                usage: {
                    input_tokens: response.usage.input_tokens,
                    output_tokens: response.usage.output_tokens
                }
            };
        } catch (error) {
            console.error('Claude API error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Call Claude API
     */
    callClaudeAPI(systemPrompt, userPrompt) {
        return new Promise((resolve, reject) => {
            const postData = JSON.stringify({
                model: this.model,
                max_tokens: this.maxTokens,
                system: systemPrompt,
                messages: [
                    {
                        role: 'user',
                        content: userPrompt
                    }
                ]
            });

            const options = {
                hostname: this.apiUrl,
                port: 443,
                path: '/v1/messages',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            resolve(JSON.parse(data));
                        } catch (e) {
                            reject(new Error('Failed to parse API response'));
                        }
                    } else {
                        reject(new Error(`API returned status ${res.statusCode}: ${data}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.write(postData);
            req.end();
        });
    }

    /**
     * Build user prompt from job
     */
    buildUserPrompt(job) {
        const context = JSON.parse(job.context_data || '{}');
        
        let prompt = `# JOB TYPE: ${job.type.toUpperCase()}\n\n`;
        
        if (context.files) {
            prompt += `## FILES TO WORK ON:\n${context.files.join(', ')}\n\n`;
        }
        
        prompt += `## INSTRUCTIONS:\n${job.input_prompt}\n\n`;
        
        if (context.current_code) {
            prompt += `## CURRENT CODE:\n\`\`\`\n${context.current_code}\n\`\`\`\n\n`;
        }
        
        prompt += `Please execute this ${job.type} task and provide the solution.`;
        
        return prompt;
    }

    /**
     * Get default system prompt
     */
    getDefaultSystemPrompt() {
        return `You are an expert software developer assistant. 
Your task is to help with code by following these principles:
- Code protégé: Never break existing working code
- Zero casse: Make minimal changes
- Zero doublon: No code duplication
- Always explain your changes
- Provide clean, production-ready code

When debugging, identify the root cause first.
When patching, make the smallest change possible.
When refactoring, improve code quality while maintaining functionality.`;
    }

    /**
     * Check if API key is configured
     */
    isConfigured() {
        return this.apiKey && this.apiKey !== 'YOUR_API_KEY_HERE';
    }

    /**
     * Simulate job execution (for testing without API key)
     */
    async simulateJob(job) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            success: true,
            output: `[SIMULATED] Job "${job.type}" completed successfully.\n\nInstructions received: ${job.input_prompt}\n\nThis is a simulated response. Configure ANTHROPIC_API_KEY to use real Claude API.`,
            usage: {
                input_tokens: 100,
                output_tokens: 50
            }
        };
    }
}

module.exports = new ClaudeAPIService();
