# Agent Gatekeeper Project Overview

## Project Title
Agent Gatekeeper for IndiGo Airlines

## Company Selected
IndiGo Airlines

## Project Purpose
This project demonstrates how a company can control requests made by autonomous AI agents acting on behalf of customers.

## Problem Statement
Customers increasingly use AI agents to book flights, modify bookings, and request refunds. Companies need a system to verify agent identity, permissions, and request risk before allowing actions.

## Proposed Solution
The Agent Gatekeeper acts as a security layer between AI agents and company services. It evaluates every request and decides whether to ALLOW, ASK CUSTOMER, or BLOCK.

## Main Features
- AI Agent Registration
- Agent Identity Verification
- Request Evaluation
- Rule-Based Decisions
- Customer Confirmation
- Agent Revocation
- Audit Logging
- Automated Testing

## Decision Outcomes

### ALLOW
The request is permitted according to the security rules.

### ASK CUSTOMER
Customer confirmation is required before the request proceeds.

### BLOCK
The request is rejected because it violates security rules or the agent is unauthorized.

## Project Testing
The prototype was evaluated using six test cases covering read-only requests, unknown agents, refunds, revoked agents, and flight modifications.

## Student Details
Name: Aayushi Marathe

Enrollment Number: PGD202563093

Course: MBA Pharmaceutical & Healthcare Management

## Disclaimer
This is an academic prototype developed for educational purposes. It is not officially affiliated with IndiGo Airlines.
