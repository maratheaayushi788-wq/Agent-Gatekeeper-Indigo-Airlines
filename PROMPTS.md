# Initial User Prompt

The following prompt was used to initiate the development of the **Agent Gatekeeper** application prototype for IndiGo Airlines:

```markdown
I am a beginner student working on my MBA assignment titled "Agent Gatekeeper for a Real Company."

Build a beginner-friendly, fully working web application prototype for an airline company called IndiGo Airlines.

Project name: Agent Gatekeeper
Student Enrollment Number: PGD202563093

PURPOSE:
The application should act as a gatekeeper between a customer's AI agent and an airline's services. It should evaluate requests from AI agents and decide whether to ALLOW, ASK CUSTOMER, or BLOCK the request based on predefined rules.

DESIGN:
Create a modern, clean, professional dashboard with a blue and white airline-inspired theme. It should be easy for a student to demonstrate during a presentation. Make the interface simple and attractive.

FEATURES REQUIRED:

1. Dashboard
- Show project name: Agent Gatekeeper.
- Show company: IndiGo Airlines (academic prototype, not officially affiliated).
- Display enrollment number PGD202563093.
- Show total requests, allowed requests, blocked requests, and pending customer confirmations.

2. Agent Registration
- Allow users to register an AI agent.
- Fields: Customer Name, Agent Name, Agent ID.
- Provide a Register Agent button.
- Show registered agents and their active/revoked status.
- Prevent duplicate Agent IDs.

3. Request Evaluation
Create a form containing:
- Customer Name
- Agent ID
- Action dropdown: View Fare, Book Flight, Change Booking, Refund
- Refund Amount field when Refund is selected
- Submit Request button

The gatekeeper must evaluate requests according to these rules:

RULE 1: Registered active agents requesting read-only fare viewing are ALLOWED.

RULE 2: Unknown or unregistered agents are BLOCKED.

RULE 3: Flight booking requests require customer confirmation and return ASK CUSTOMER.

RULE 4: Flight change requests require customer confirmation and return ASK CUSTOMER.

RULE 5: Refunds of ₹5,000 or below from registered active agents are ALLOWED.

RULE 6: Refunds above ₹5,000 require customer confirmation and return ASK CUSTOMER.

RULE 7: Revoked agents are always BLOCKED, regardless of requested action.

RULE 8: Any unauthorized or unsupported action is BLOCKED.

Display the decision clearly using green for ALLOW, yellow/orange for ASK CUSTOMER, and red for BLOCK.

For every decision, display:
- Decision
- Reason
- Rule number applied

4. Customer Confirmation
For ASK CUSTOMER requests, provide a Confirm and Reject button.
If the customer confirms, record the request as confirmed.
If rejected, record it as rejected.
Do not perform any real booking, payment, or refund.

5. Agent Revocation
- Add a Revoke button beside every active registered agent.
- When revoked, change agent status to REVOKED.
- Automatically save the revocation date and time.
- Revoked agents must never be allowed to make requests again.
- Display revocation timestamp.

6. Audit Log
Store every request in an audit log.
Include:
- Date and time
- Customer name
- Agent ID
- Requested action
- Amount if applicable
- Decision
- Reason
- Rule number
- Customer confirmation status

The audit log should be visible in a table and downloadable as CSV.

7. Testing
Create a section where the user can easily run these six test cases:

Test 1: Registered active agent requests View Fare → ALLOW.
Test 2: Unknown agent requests Book Flight → BLOCK.
Test 3: Registered active agent requests ₹10,000 Refund → ASK CUSTOMER.
Test 4: Registered active agent requests ₹2,000 Refund → ALLOW.
Test 5: Revoked agent requests Book Flight → BLOCK.
Test 6: Registered active agent requests Change Booking → ASK CUSTOMER.

Show expected decision and actual decision for every test, along with PASS or FAIL.

TECHNICAL REQUIREMENTS:
- Build a working application, not just a static design.
- Use a beginner-friendly technology stack.
- Store registered agents and audit logs persistently using local storage or a simple local database so data remains after refreshing.
- Provide clear instructions to run the application.
- Make sure all buttons and forms actually work.
- Do not use paid APIs or require API keys.
- Do not perform real transactions or connect to an actual airline.
- Include a README file explaining the project, rules, features, and how to run it.
- Include a PROMPTS.md file that records this initial prompt.

Please build the complete project inside the currently open AgentGate folder.

After building it, explain in simple language:
1. What files you created.
2. How I can run the application.
3. How I can test each feature.
4. How the decision rules work.

I am a beginner, so guide me step by step and do not assume I know coding.
```
