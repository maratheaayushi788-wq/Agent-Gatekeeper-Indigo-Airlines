# Agent Gatekeeper – Testing Documentation

## Project
Agent Gatekeeper for IndiGo Airlines

## Purpose
The prototype was tested using six cases to verify whether AI agent requests are correctly allowed, blocked, or sent for customer confirmation according to the defined security rules.

## Test Cases

| Test | Scenario | Expected Result | Actual Result | Rule |
|---|---|---|---|---|
| Test 1 | Registered active agent requests read-only fare inquiry | ALLOW | ALLOW – Pass | Rule 1 |
| Test 2 | Unknown agent requests flight booking | BLOCK | BLOCK – Pass | Rule 2 |
| Test 3 | Active agent requests ₹10,000 refund | ASK CUSTOMER | ASK CUSTOMER – Pass | Rule 6 |
| Test 4 | Active agent requests ₹2,000 refund | ALLOW | ALLOW – Pass | Rule 5 |
| Test 5 | Revoked agent requests flight booking | BLOCK | BLOCK – Pass | Rule 7 |
| Test 6 | Active agent requests flight modification | ASK CUSTOMER | ASK CUSTOMER – Pass | Rule 4 |

## Testing Summary

- Total test cases: 6
- Tests passed: 6
- Tests failed: 0
- Overall result: 100% passed

## Conclusion

The testing suite verified that the Agent Gatekeeper prototype correctly applies its security rules to different AI agent requests. Registered agents can perform permitted low-risk actions, high-risk actions require customer confirmation, and unknown or revoked agents are blocked.

All six test cases passed successfully. Testing was performed using a simulated academic prototype. No actual airline bookings, payments, or refunds were processed.
