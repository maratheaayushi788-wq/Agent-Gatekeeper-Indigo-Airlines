# Agent Gatekeeper - Security Rules

## Rule 1: Read-Only Requests
Registered and active agents can access read-only information such as viewing flight fares. These requests are allowed.

## Rule 2: Unknown Agents
Agents that are not registered in the system are blocked from performing any action.

## Rule 3: High-Value Refunds
Refund requests above ₹10,000 require customer confirmation before approval.

## Rule 4: Flight Modifications
Flight changes or booking modifications require customer confirmation.

## Rule 5: Low-Value Refunds
Refund requests of ₹2,000 or below from registered active agents are automatically allowed.

## Rule 6: Customer Confirmation
Requests requiring customer confirmation cannot proceed until the customer approves them.

## Rule 7: Revoked Agents
Agents whose access has been revoked are blocked from performing any action.
