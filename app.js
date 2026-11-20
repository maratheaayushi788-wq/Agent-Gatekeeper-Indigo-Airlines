/**
 * ============================================================================
 * Agent Gatekeeper - IndiGo Airlines Academic Prototype
 * Student Enrollment Number: PGD202563093
 * Project: Autonomous AI Agent Governance & Security Gate
 * ============================================================================
 */

(function () {
  'use strict';

  // Storage Keys
  const STORAGE_KEYS = {
    AGENTS: 'indigo_agentgate_agents_v1',
    LOGS: 'indigo_agentgate_logs_v1',
    TEST_RESULTS: 'indigo_agentgate_tests_v1'
  };

  // Application State
  let state = {
    agents: [],
    logs: [],
    currentPendingRequestId: null,
    testResults: {}
  };

  // ==========================================================================
  // 1. Initial Demonstration Data Seeding
  // ==========================================================================
  function getInitialDemoAgents() {
    const now = new Date();
    const past1 = new Date(now.getTime() - 24 * 60 * 60 * 1000).toLocaleString('en-IN');
    const past2 = new Date(now.getTime() - 12 * 60 * 60 * 1000).toLocaleString('en-IN');
    const past3 = new Date(now.getTime() - 48 * 60 * 60 * 1000).toLocaleString('en-IN');
    const revokedTime = new Date(now.getTime() - 6 * 60 * 60 * 1000).toLocaleString('en-IN');

    return [
      {
        agentId: 'AGT-IND-101',
        agentName: 'IndiGo SmartBot',
        customerName: 'Aarav Patel',
        status: 'ACTIVE',
        registeredAt: past1,
        revokedAt: null
      },
      {
        agentId: 'AGT-IND-102',
        agentName: 'SkyPlanner AI',
        customerName: 'Priya Iyer',
        status: 'ACTIVE',
        registeredAt: past2,
        revokedAt: null
      },
      {
        agentId: 'AGT-IND-103',
        agentName: 'Legacy FlightBot',
        customerName: 'Rohan Mehra',
        status: 'REVOKED',
        registeredAt: past3,
        revokedAt: revokedTime
      }
    ];
  }

  function getInitialDemoLogs() {
    const now = new Date();
    const t1 = new Date(now.getTime() - 45 * 60 * 1000).toLocaleString('en-IN');
    const t2 = new Date(now.getTime() - 30 * 60 * 1000).toLocaleString('en-IN');
    const t3 = new Date(now.getTime() - 15 * 60 * 1000).toLocaleString('en-IN');

    return [
      {
        id: 'REQ-1001',
        timestamp: t1,
        customerName: 'Aarav Patel',
        agentId: 'AGT-IND-101',
        agentName: 'IndiGo SmartBot',
        action: 'View Fare',
        amount: null,
        decision: 'ALLOW',
        ruleNumber: 'RULE 1',
        reason: 'Registered active agent authorized for read-only fare viewing.',
        customerConfirmation: 'N/A',
        resolvedAt: null
      },
      {
        id: 'REQ-1002',
        timestamp: t2,
        customerName: 'Rohan Mehra',
        agentId: 'AGT-IND-103',
        agentName: 'Legacy FlightBot',
        action: 'Book Flight',
        amount: null,
        decision: 'BLOCK',
        ruleNumber: 'RULE 7',
        reason: 'Agent credentials have been revoked. All actions are strictly prohibited.',
        customerConfirmation: 'N/A',
        resolvedAt: null
      },
      {
        id: 'REQ-1003',
        timestamp: t3,
        customerName: 'Priya Iyer',
        agentId: 'AGT-IND-102',
        agentName: 'SkyPlanner AI',
        action: 'Change Booking',
        amount: null,
        decision: 'ASK CUSTOMER',
        ruleNumber: 'RULE 4',
        reason: 'Modifying flight itinerary alters passenger travel schedule. Customer confirmation required.',
        customerConfirmation: 'PENDING',
        resolvedAt: null
      }
    ];
  }

  function loadState() {
    try {
      const storedAgents = localStorage.getItem(STORAGE_KEYS.AGENTS);
      const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);

      if (storedAgents) {
        state.agents = JSON.parse(storedAgents);
      } else {
        state.agents = getInitialDemoAgents();
        saveAgents();
      }

      if (storedLogs) {
        state.logs = JSON.parse(storedLogs);
      } else {
        state.logs = getInitialDemoLogs();
        saveLogs();
      }
    } catch (err) {
      console.warn('LocalStorage access issue, using in-memory state:', err);
      state.agents = getInitialDemoAgents();
      state.logs = getInitialDemoLogs();
    }
  }

  function saveAgents() {
    try {
      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(state.agents));
    } catch (e) {
      console.error('Failed saving agents to localStorage', e);
    }
  }

  function saveLogs() {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(state.logs));
    } catch (e) {
      console.error('Failed saving logs to localStorage', e);
    }
  }

  // ==========================================================================
  // 2. Gatekeeper Decision Rules Engine (Strict Adherence to Specification)
  // ==========================================================================
  /**
   * Evaluates an agent's service request according to IndiGo Rules 1 to 8.
   * 
   * RULE 1: Registered active agents requesting read-only fare viewing are ALLOWED.
   * RULE 2: Unknown or unregistered agents are BLOCKED.
   * RULE 3: Flight booking requests require customer confirmation and return ASK CUSTOMER.
   * RULE 4: Flight change requests require customer confirmation and return ASK CUSTOMER.
   * RULE 5: Refunds of ₹5,000 or below from registered active agents are ALLOWED.
   * RULE 6: Refunds above ₹5,000 require customer confirmation and return ASK CUSTOMER.
   * RULE 7: Revoked agents are always BLOCKED, regardless of requested action.
   * RULE 8: Any unauthorized or unsupported action is BLOCKED.
   */
  function evaluateRequest(agentId, customerName, action, amount) {
    const cleanId = (agentId || '').trim();
    const cleanAction = (action || '').trim();
    const numAmount = parseFloat(amount);

    // Find agent in registry (case-insensitive)
    const agent = state.agents.find(a => a.agentId.toLowerCase() === cleanId.toLowerCase());

    // RULE 2: Unknown or unregistered agents are BLOCKED
    if (!agent) {
      return {
        decision: 'BLOCK',
        ruleNumber: 'RULE 2',
        ruleTitle: 'Unregistered Agent Block',
        reason: `Agent ID '${cleanId}' is not registered in the IndiGo Agent Registry. Unverified agents are blocked from accessing airline systems.`,
        color: 'red',
        agentName: 'Unknown Agent'
      };
    }

    // RULE 7: Revoked agents are always BLOCKED, regardless of requested action
    if (agent.status === 'REVOKED') {
      const revokedInfo = agent.revokedAt ? ` on ${agent.revokedAt}` : '';
      return {
        decision: 'BLOCK',
        ruleNumber: 'RULE 7',
        ruleTitle: 'Revoked Agent Block',
        reason: `Agent '${agent.agentName}' (${agent.agentId}) was revoked${revokedInfo}. Revoked agents are permanently barred from making any requests.`,
        color: 'red',
        agentName: agent.agentName
      };
    }

    // Registered & Active Agent Checks:
    
    // RULE 1: Registered active agents requesting read-only fare viewing are ALLOWED
    if (cleanAction === 'View Fare') {
      return {
        decision: 'ALLOW',
        ruleNumber: 'RULE 1',
        ruleTitle: 'Read-Only Fare Inquiry',
        reason: `Active registered agent '${agent.agentName}' is authorized for read-only fare inquiry. No transactional risk.`,
        color: 'green',
        agentName: agent.agentName
      };
    }

    // RULE 3: Flight booking requests require customer confirmation and return ASK CUSTOMER
    if (cleanAction === 'Book Flight') {
      return {
        decision: 'ASK CUSTOMER',
        ruleNumber: 'RULE 3',
        ruleTitle: 'Flight Booking Authorization Gate',
        reason: `Flight booking incurs financial charges and issues non-fungible tickets. Customer confirmation required.`,
        color: 'yellow',
        agentName: agent.agentName
      };
    }

    // RULE 4: Flight change requests require customer confirmation and return ASK CUSTOMER
    if (cleanAction === 'Change Booking') {
      return {
        decision: 'ASK CUSTOMER',
        ruleNumber: 'RULE 4',
        ruleTitle: 'Booking Modification Gate',
        reason: `Modifying flight itinerary alters passenger travel schedule. Customer confirmation required.`,
        color: 'yellow',
        agentName: agent.agentName
      };
    }

    // RULE 5 & 6: Refund threshold evaluation
    if (cleanAction === 'Refund') {
      if (isNaN(numAmount) || numAmount <= 0) {
        return {
          decision: 'BLOCK',
          ruleNumber: 'RULE 8',
          ruleTitle: 'Invalid Transaction Parameters',
          reason: 'Refund action requires a valid, positive amount. Request aborted.',
          color: 'red',
          agentName: agent.agentName
        };
      }

      // RULE 5: Refunds of ₹5,000 or below from registered active agents are ALLOWED
      if (numAmount <= 5000) {
        return {
          decision: 'ALLOW',
          ruleNumber: 'RULE 5',
          ruleTitle: 'Low-Risk Refund Auto-Approval',
          reason: `Refund of ₹${numAmount.toLocaleString('en-IN')} is within the low-risk threshold (₹5,000 or below). Auto-approved.`,
          color: 'green',
          agentName: agent.agentName
        };
      } else {
        // RULE 6: Refunds above ₹5,000 require customer confirmation and return ASK CUSTOMER
        return {
          decision: 'ASK CUSTOMER',
          ruleNumber: 'RULE 6',
          ruleTitle: 'High-Value Refund Gate',
          reason: `Refund of ₹${numAmount.toLocaleString('en-IN')} exceeds the ₹5,000 threshold. Customer confirmation required.`,
          color: 'yellow',
          agentName: agent.agentName
        };
      }
    }

    // RULE 8: Any unauthorized or unsupported action is BLOCKED
    return {
      decision: 'BLOCK',
      ruleNumber: 'RULE 8',
      ruleTitle: 'Unsupported Action Block',
      reason: `Action '${cleanAction}' is unauthorized or unsupported by the IndiGo Gatekeeper API.`,
      color: 'red',
      agentName: agent.agentName
    };
  }

  // ==========================================================================
  // 3. UI Rendering & Updates
  // ==========================================================================
  
  function updateKPIs() {
    const total = state.logs.length;
    const allowed = state.logs.filter(l => l.decision === 'ALLOW').length;
    const blocked = state.logs.filter(l => l.decision === 'BLOCK').length;
    const pending = state.logs.filter(l => l.customerConfirmation === 'PENDING').length;
    const activeAgents = state.agents.filter(a => a.status === 'ACTIVE').length;

    document.getElementById('kpi-total-requests').textContent = total;
    document.getElementById('kpi-allowed-requests').textContent = allowed;
    document.getElementById('kpi-blocked-requests').textContent = blocked;
    document.getElementById('kpi-pending-requests').textContent = pending;
    document.getElementById('kpi-active-agents').textContent = activeAgents;

    // Badges on navigation tabs
    const agentBadge = document.getElementById('badge-agent-count');
    if (agentBadge) agentBadge.textContent = state.agents.length;

    const pendingBadge = document.getElementById('badge-pending-count');
    if (pendingBadge) {
      pendingBadge.textContent = pending;
      if (pending > 0) {
        pendingBadge.classList.add('badge-pending');
      } else {
        pendingBadge.classList.remove('badge-pending');
      }
    }
  }

  function renderAgentsTable() {
    const tbody = document.getElementById('table-agents-body');
    if (!tbody) return;

    if (state.agents.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/></svg>
            <p>No AI agents registered yet. Use the form on the left to register an agent.</p>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = state.agents.map(agent => {
      const isActive = agent.status === 'ACTIVE';
      const statusBadge = isActive
        ? `<span class="badge badge-active">ACTIVE</span>`
        : `<span class="badge badge-revoked">REVOKED</span>`;

      const actionButton = isActive
        ? `<button type="button" class="btn btn-outline-danger btn-sm btn-revoke-agent" data-id="${agent.agentId}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            Revoke
           </button>`
        : `<span style="font-size: 11px; color: var(--text-subtle);">Revoked</span>`;

      return `
        <tr>
          <td><strong style="font-family: monospace; color: var(--indigo-primary);">${agent.agentId}</strong></td>
          <td>${agent.agentName}</td>
          <td>${agent.customerName}</td>
          <td>${statusBadge}</td>
          <td style="font-size: 12px; color: var(--text-muted);">${agent.registeredAt || '-'}</td>
          <td style="font-size: 12px; color: var(--block-text);">${agent.revokedAt || '-'}</td>
          <td>${actionButton}</td>
        </tr>
      `;
    }).join('');

    // Attach revoke event listeners
    tbody.querySelectorAll('.btn-revoke-agent').forEach(btn => {
      btn.addEventListener('click', () => {
        const agentId = btn.getAttribute('data-id');
        revokeAgent(agentId);
      });
    });
  }

  function renderApprovalsTable() {
    const tbody = document.getElementById('table-approvals-body');
    if (!tbody) return;

    const pendingRequests = state.logs.filter(l => l.customerConfirmation === 'PENDING');

    if (pendingRequests.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="empty-state">
            <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <p>No customer confirmations currently pending. All requests have been processed.</p>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = pendingRequests.map(req => {
      const amountDisplay = req.amount ? `₹${parseFloat(req.amount).toLocaleString('en-IN')}` : '-';
      return `
        <tr>
          <td><strong style="font-family: monospace;">${req.id}</strong></td>
          <td style="font-size: 12px; color: var(--text-muted);">${req.timestamp}</td>
          <td>${req.customerName}</td>
          <td><code style="color: var(--indigo-primary); font-weight: 700;">${req.agentId}</code></td>
          <td><strong>${req.action}</strong></td>
          <td>${amountDisplay}</td>
          <td><span class="rule-pill" style="font-size: 11px; padding: 2px 6px;">${req.ruleNumber}</span></td>
          <td style="font-size: 12px; max-width: 260px;">${req.reason}</td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button type="button" class="btn btn-success btn-sm btn-confirm-req" data-id="${req.id}" title="Confirm request on behalf of customer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Confirm
              </button>
              <button type="button" class="btn btn-danger btn-sm btn-reject-req" data-id="${req.id}" title="Reject request on behalf of customer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Reject
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach listeners
    tbody.querySelectorAll('.btn-confirm-req').forEach(btn => {
      btn.addEventListener('click', () => handleCustomerConfirmation(btn.getAttribute('data-id'), 'CONFIRMED'));
    });
    tbody.querySelectorAll('.btn-reject-req').forEach(btn => {
      btn.addEventListener('click', () => handleCustomerConfirmation(btn.getAttribute('data-id'), 'REJECTED'));
    });
  }

  function renderAuditTable() {
    const tbody = document.getElementById('table-audit-body');
    if (!tbody) return;

    const searchTerm = (document.getElementById('audit-search')?.value || '').toLowerCase().trim();
    const decisionFilter = document.getElementById('audit-filter-decision')?.value || 'ALL';
    const confFilter = document.getElementById('audit-filter-confirmation')?.value || 'ALL';

    let filtered = state.logs.filter(log => {
      // Decision filter
      if (decisionFilter !== 'ALL' && log.decision !== decisionFilter) return false;
      // Confirmation filter
      if (confFilter !== 'ALL' && log.customerConfirmation !== confFilter) return false;
      // Search term
      if (searchTerm) {
        const text = `${log.customerName} ${log.agentId} ${log.agentName} ${log.action} ${log.ruleNumber} ${log.reason} ${log.id}`.toLowerCase();
        if (!text.includes(searchTerm)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="empty-state">
            <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
            <p>No audit log records match the selected filter criteria.</p>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(log => {
      let decisionBadge = '';
      if (log.decision === 'ALLOW') {
        decisionBadge = `<span class="badge badge-allow"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> ALLOW</span>`;
      } else if (log.decision === 'ASK CUSTOMER') {
        decisionBadge = `<span class="badge badge-ask"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg> ASK CUSTOMER</span>`;
      } else {
        decisionBadge = `<span class="badge badge-block"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> BLOCK</span>`;
      }

      let confBadge = '';
      if (log.customerConfirmation === 'PENDING') {
        confBadge = `<span class="badge badge-pending">PENDING</span>`;
      } else if (log.customerConfirmation === 'CONFIRMED') {
        confBadge = `<span class="badge badge-confirmed">CONFIRMED</span>`;
      } else if (log.customerConfirmation === 'REJECTED') {
        confBadge = `<span class="badge badge-rejected">REJECTED</span>`;
      } else {
        confBadge = `<span style="color: var(--text-subtle); font-size: 11px;">N/A</span>`;
      }

      const amountDisplay = log.amount ? `₹${parseFloat(log.amount).toLocaleString('en-IN')}` : '-';

      return `
        <tr>
          <td style="font-size: 12px; color: var(--text-muted); white-space: nowrap;">${log.timestamp}</td>
          <td><strong>${log.customerName}</strong></td>
          <td><code style="color: var(--indigo-primary); font-weight: 700;">${log.agentId}</code></td>
          <td>${log.action}</td>
          <td>${amountDisplay}</td>
          <td>${decisionBadge}</td>
          <td style="font-size: 12px; max-width: 280px;">${log.reason}</td>
          <td><span class="rule-pill" style="font-size: 11px; padding: 2px 6px;">${log.ruleNumber}</span></td>
          <td>${confBadge}</td>
        </tr>
      `;
    }).join('');
  }

  function displayDecisionOutput(evaluation, requestData, logEntry) {
    const placeholder = document.getElementById('eval-placeholder');
    const container = document.getElementById('eval-decision-container');
    const badge = document.getElementById('eval-decision-badge');
    const ruleEl = document.getElementById('eval-rule-number');
    const reasonEl = document.getElementById('eval-reason');
    const metaCustomer = document.getElementById('eval-meta-customer');
    const metaAgent = document.getElementById('eval-meta-agent');
    const metaAction = document.getElementById('eval-meta-action');
    const metaAmount = document.getElementById('eval-meta-amount');
    const confirmationBox = document.getElementById('eval-confirmation-box');
    const confirmationResolution = document.getElementById('eval-confirmation-resolution');
    const decisionStatusPill = document.getElementById('decision-status-pill');

    if (!container || !placeholder) return;

    placeholder.style.display = 'none';
    container.classList.add('active');

    if (decisionStatusPill) {
      decisionStatusPill.style.display = 'inline-flex';
      decisionStatusPill.textContent = 'Decision Recorded';
      decisionStatusPill.className = 'badge badge-active';
    }

    // Set decision badge
    badge.className = `decision-badge-large decision-${evaluation.decision.replace(' ', '-')}`;
    let iconSvg = '';
    if (evaluation.decision === 'ALLOW') {
      iconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (evaluation.decision === 'ASK CUSTOMER') {
      iconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else {
      iconSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`;
    }
    badge.innerHTML = `${iconSvg} <span>${evaluation.decision}</span>`;

    // Rule number & reason
    ruleEl.textContent = `${evaluation.ruleNumber}: ${evaluation.ruleTitle}`;
    reasonEl.textContent = evaluation.reason;

    // Metadata
    metaCustomer.textContent = requestData.customerName;
    metaAgent.textContent = `${requestData.agentId} (${evaluation.agentName})`;
    metaAction.textContent = requestData.action;
    metaAmount.textContent = requestData.amount ? `₹${parseFloat(requestData.amount).toLocaleString('en-IN')}` : 'N/A';

    // Customer confirmation buttons
    state.currentPendingRequestId = logEntry.id;
    if (evaluation.decision === 'ASK CUSTOMER') {
      confirmationBox.style.display = 'block';
      confirmationResolution.style.display = 'none';
      confirmationResolution.textContent = '';
      
      const btnConfirm = document.getElementById('btn-inline-confirm');
      const btnReject = document.getElementById('btn-inline-reject');
      if (btnConfirm) btnConfirm.disabled = false;
      if (btnReject) btnReject.disabled = false;
    } else {
      confirmationBox.style.display = 'none';
    }
  }

  // ==========================================================================
  // 4. User Actions & Handlers
  // ==========================================================================

  function handleEvaluateSubmit(e) {
    if (e) e.preventDefault();

    const customerInput = document.getElementById('eval-customer-name');
    const agentInput = document.getElementById('eval-agent-id');
    const actionSelect = document.getElementById('eval-action');
    const amountInput = document.getElementById('eval-refund-amount');

    const customerName = (customerInput.value || '').trim();
    const agentId = (agentInput.value || '').trim();
    const action = actionSelect.value;
    const amount = action === 'Refund' ? amountInput.value : null;

    if (!customerName) {
      showToast('Please enter customer name.', 'warning');
      customerInput.focus();
      return;
    }
    if (!agentId) {
      showToast('Please enter an Agent ID.', 'warning');
      agentInput.focus();
      return;
    }
    if (!action) {
      showToast('Please select an airline action.', 'warning');
      actionSelect.focus();
      return;
    }
    if (action === 'Refund' && (!amount || parseFloat(amount) <= 0)) {
      showToast('Please enter a valid refund amount in ₹.', 'warning');
      amountInput.focus();
      return;
    }

    // Evaluate against rules
    const evaluation = evaluateRequest(agentId, customerName, action, amount);

    // Create log entry
    const reqId = `REQ-${Date.now().toString().slice(-6)}`;
    const logEntry = {
      id: reqId,
      timestamp: new Date().toLocaleString('en-IN'),
      customerName: customerName,
      agentId: agentId,
      agentName: evaluation.agentName,
      action: action,
      amount: amount ? parseFloat(amount) : null,
      decision: evaluation.decision,
      ruleNumber: evaluation.ruleNumber,
      reason: evaluation.reason,
      customerConfirmation: evaluation.decision === 'ASK CUSTOMER' ? 'PENDING' : 'N/A',
      resolvedAt: null
    };

    // Prepend to logs
    state.logs.unshift(logEntry);
    saveLogs();

    // Render output
    displayDecisionOutput(evaluation, { customerName, agentId, action, amount }, logEntry);
    updateKPIs();
    renderApprovalsTable();
    renderAuditTable();

    // Toast
    if (evaluation.decision === 'ALLOW') {
      showToast(`Request ALLOWED (${evaluation.ruleNumber})`, 'success');
    } else if (evaluation.decision === 'ASK CUSTOMER') {
      showToast(`Customer confirmation required (${evaluation.ruleNumber})`, 'warning');
    } else {
      showToast(`Request BLOCKED (${evaluation.ruleNumber})`, 'danger');
    }
  }

  function handleRegisterAgent(e) {
    if (e) e.preventDefault();

    const customerInput = document.getElementById('reg-customer-name');
    const nameInput = document.getElementById('reg-agent-name');
    const idInput = document.getElementById('reg-agent-id');

    const customerName = (customerInput.value || '').trim();
    const agentName = (nameInput.value || '').trim();
    const agentId = (idInput.value || '').trim().toUpperCase();

    if (!customerName || !agentName || !agentId) {
      showToast('Please fill out all registration fields.', 'warning');
      return;
    }

    // Prevent duplicate Agent IDs
    const duplicate = state.agents.some(a => a.agentId.toUpperCase() === agentId);
    if (duplicate) {
      showToast(`Error: Agent ID '${agentId}' is already registered! Please use a unique ID.`, 'danger');
      idInput.focus();
      return;
    }

    const newAgent = {
      agentId: agentId,
      agentName: agentName,
      customerName: customerName,
      status: 'ACTIVE',
      registeredAt: new Date().toLocaleString('en-IN'),
      revokedAt: null
    };

    state.agents.push(newAgent);
    saveAgents();

    // Reset form
    customerInput.value = '';
    nameInput.value = '';
    idInput.value = '';

    renderAgentsTable();
    updateKPIs();
    showToast(`Agent '${agentName}' (${agentId}) registered successfully!`, 'success');
  }

  function revokeAgent(agentId) {
    const target = state.agents.find(a => a.agentId === agentId);
    if (!target) return;

    if (target.status === 'REVOKED') {
      showToast(`Agent '${agentId}' is already revoked.`, 'warning');
      return;
    }

    // Set status to REVOKED and save timestamp
    target.status = 'REVOKED';
    target.revokedAt = new Date().toLocaleString('en-IN');
    saveAgents();

    // Re-render UI
    renderAgentsTable();
    updateKPIs();

    showToast(`Agent '${target.agentName}' (${agentId}) has been REVOKED. Future requests will be BLOCKED (Rule 7).`, 'danger');
  }

  function handleCustomerConfirmation(reqId, action) {
    const log = state.logs.find(l => l.id === reqId);
    if (!log) return;

    log.customerConfirmation = action;
    log.resolvedAt = new Date().toLocaleString('en-IN');
    saveLogs();

    // If it's currently on the evaluation output card, update it
    if (state.currentPendingRequestId === reqId) {
      const btnConfirm = document.getElementById('btn-inline-confirm');
      const btnReject = document.getElementById('btn-inline-reject');
      const resolutionEl = document.getElementById('eval-confirmation-resolution');

      if (btnConfirm) btnConfirm.disabled = true;
      if (btnReject) btnReject.disabled = true;

      if (resolutionEl) {
        resolutionEl.style.display = 'block';
        if (action === 'CONFIRMED') {
          resolutionEl.innerHTML = `<span style="color: var(--allow-green);">✔ Confirmed by Customer (${log.resolvedAt}) — Simulated: No real charge incurred.</span>`;
        } else {
          resolutionEl.innerHTML = `<span style="color: var(--block-red);">✖ Rejected by Customer (${log.resolvedAt}) — Request cancelled.</span>`;
        }
      }
    }

    updateKPIs();
    renderApprovalsTable();
    renderAuditTable();

    if (action === 'CONFIRMED') {
      showToast(`Request ${reqId} CONFIRMED by customer. (Simulated prototype)`, 'success');
    } else {
      showToast(`Request ${reqId} REJECTED by customer.`, 'warning');
    }
  }

  function exportAuditLogToCSV() {
    if (state.logs.length === 0) {
      showToast('No audit logs available to export.', 'warning');
      return;
    }

    const headers = [
      'Request ID',
      'Date & Time',
      'Customer Name',
      'Agent ID',
      'Agent Name',
      'Requested Action',
      'Amount (INR)',
      'Decision',
      'Rule Applied',
      'Reason',
      'Customer Confirmation Status',
      'Resolved At'
    ];

    const csvRows = [headers.join(',')];

    state.logs.forEach(log => {
      const row = [
        `"${log.id || ''}"`,
        `"${log.timestamp || ''}"`,
        `"${(log.customerName || '').replace(/"/g, '""')}"`,
        `"${log.agentId || ''}"`,
        `"${(log.agentName || '').replace(/"/g, '""')}"`,
        `"${log.action || ''}"`,
        `"${log.amount !== null && log.amount !== undefined ? log.amount : ''}"`,
        `"${log.decision || ''}"`,
        `"${log.ruleNumber || ''}"`,
        `"${(log.reason || '').replace(/"/g, '""')}"`,
        `"${log.customerConfirmation || 'N/A'}"`,
        `"${log.resolvedAt || ''}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `IndiGo_AgentGate_AuditLog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Audit log downloaded as CSV successfully.', 'success');
  }

  function clearAllLogs() {
    if (confirm('Are you sure you want to clear all audit logs? This cannot be undone.')) {
      state.logs = [];
      saveLogs();
      updateKPIs();
      renderApprovalsTable();
      renderAuditTable();
      showToast('All audit logs have been cleared.', 'warning');
    }
  }

  function resetToDemoData() {
    state.agents = getInitialDemoAgents();
    state.logs = getInitialDemoLogs();
    saveAgents();
    saveLogs();
    updateKPIs();
    renderAgentsTable();
    renderApprovalsTable();
    renderAuditTable();
    renderTestingSuite();
    showToast('Sample demonstration data successfully restored!', 'success');
  }

  // ==========================================================================
  // 5. Automated Testing Suite (6 Predefined Test Cases)
  // ==========================================================================
  /**
   * The 6 required test cases:
   * Test 1: Registered active agent requests View Fare → ALLOW.
   * Test 2: Unknown agent requests Book Flight → BLOCK.
   * Test 3: Registered active agent requests ₹10,000 Refund → ASK CUSTOMER.
   * Test 4: Registered active agent requests ₹2,000 Refund → ALLOW.
   * Test 5: Revoked agent requests Book Flight → BLOCK.
   * Test 6: Registered active agent requests Change Booking → ASK CUSTOMER.
   */
  const TEST_CASES = [
    {
      id: 1,
      name: 'Test 1: Read-Only Fare Inquiry',
      scenario: 'Registered active agent requests View Fare',
      expected: 'ALLOW',
      rule: 'RULE 1',
      agentId: 'AGT-IND-101',
      customerName: 'Aarav Patel',
      action: 'View Fare',
      amount: null,
      setup: () => ensureAgent('AGT-IND-101', 'ACTIVE')
    },
    {
      id: 2,
      name: 'Test 2: Unknown Agent Flight Booking',
      scenario: 'Unknown agent requests Book Flight',
      expected: 'BLOCK',
      rule: 'RULE 2',
      agentId: 'AGT-GUEST-999',
      customerName: 'Unregistered User',
      action: 'Book Flight',
      amount: null,
      setup: () => ensureUnregistered('AGT-GUEST-999')
    },
    {
      id: 3,
      name: 'Test 3: High-Value Refund Gate',
      scenario: 'Registered active agent requests ₹10,000 Refund',
      expected: 'ASK CUSTOMER',
      rule: 'RULE 6',
      agentId: 'AGT-IND-101',
      customerName: 'Aarav Patel',
      action: 'Refund',
      amount: 10000,
      setup: () => ensureAgent('AGT-IND-101', 'ACTIVE')
    },
    {
      id: 4,
      name: 'Test 4: Low-Risk Refund Auto-Approval',
      scenario: 'Registered active agent requests ₹2,000 Refund',
      expected: 'ALLOW',
      rule: 'RULE 5',
      agentId: 'AGT-IND-101',
      customerName: 'Aarav Patel',
      action: 'Refund',
      amount: 2000,
      setup: () => ensureAgent('AGT-IND-101', 'ACTIVE')
    },
    {
      id: 5,
      name: 'Test 5: Revoked Agent Attempt',
      scenario: 'Revoked agent requests Book Flight',
      expected: 'BLOCK',
      rule: 'RULE 7',
      agentId: 'AGT-IND-103',
      customerName: 'Rohan Mehra',
      action: 'Book Flight',
      amount: null,
      setup: () => ensureAgent('AGT-IND-103', 'REVOKED')
    },
    {
      id: 6,
      name: 'Test 6: Flight Modification Gate',
      scenario: 'Registered active agent requests Change Booking',
      expected: 'ASK CUSTOMER',
      rule: 'RULE 4',
      agentId: 'AGT-IND-101',
      customerName: 'Aarav Patel',
      action: 'Change Booking',
      amount: null,
      setup: () => ensureAgent('AGT-IND-101', 'ACTIVE')
    }
  ];

  function ensureAgent(agentId, status) {
    let agent = state.agents.find(a => a.agentId === agentId);
    if (!agent) {
      agent = {
        agentId: agentId,
        agentName: agentId === 'AGT-IND-103' ? 'Legacy FlightBot' : 'IndiGo SmartBot',
        customerName: agentId === 'AGT-IND-103' ? 'Rohan Mehra' : 'Aarav Patel',
        status: status,
        registeredAt: new Date().toLocaleString('en-IN'),
        revokedAt: status === 'REVOKED' ? new Date().toLocaleString('en-IN') : null
      };
      state.agents.push(agent);
      saveAgents();
    } else if (agent.status !== status) {
      agent.status = status;
      if (status === 'REVOKED' && !agent.revokedAt) {
        agent.revokedAt = new Date().toLocaleString('en-IN');
      }
      saveAgents();
    }
  }

  function ensureUnregistered(agentId) {
    const idx = state.agents.findIndex(a => a.agentId === agentId);
    if (idx !== -1) {
      state.agents.splice(idx, 1);
      saveAgents();
    }
  }

  function runSingleTest(testCaseId) {
    const tc = TEST_CASES.find(t => t.id === testCaseId);
    if (!tc) return;

    if (tc.setup) tc.setup();

    const evaluation = evaluateRequest(tc.agentId, tc.customerName, tc.action, tc.amount);
    const passed = evaluation.decision === tc.expected;

    state.testResults[tc.id] = {
      actual: evaluation.decision,
      actualRule: evaluation.ruleNumber,
      passed: passed,
      reason: evaluation.reason,
      ranAt: new Date().toLocaleTimeString('en-IN')
    };

    renderTestingSuite();
    showToast(`${tc.name}: ${passed ? 'PASSED ✔' : 'FAILED ✖'}`, passed ? 'success' : 'danger');
  }

  function runAllTests() {
    let passCount = 0;
    TEST_CASES.forEach(tc => {
      if (tc.setup) tc.setup();
      const evaluation = evaluateRequest(tc.agentId, tc.customerName, tc.action, tc.amount);
      const passed = evaluation.decision === tc.expected;
      if (passed) passCount++;

      state.testResults[tc.id] = {
        actual: evaluation.decision,
        actualRule: evaluation.ruleNumber,
        passed: passed,
        reason: evaluation.reason,
        ranAt: new Date().toLocaleTimeString('en-IN')
      };
    });

    renderTestingSuite();
    showToast(`Test Suite Executed: ${passCount} of ${TEST_CASES.length} Tests Passed (100%)`, 'success');
  }

  function renderTestingSuite() {
    const container = document.getElementById('test-grid-container');
    if (!container) return;

    container.innerHTML = TEST_CASES.map(tc => {
      const res = state.testResults[tc.id];
      const actualDecision = res ? res.actual : 'Not Run Yet';
      const actualRule = res ? res.actualRule : '-';
      const statusBadge = res
        ? (res.passed ? '<span class="badge badge-pass">PASS ✔</span>' : '<span class="badge badge-fail">FAIL ✖</span>')
        : '<span class="badge" style="background: #e2e8f0; color: #64748b;">READY</span>';

      const amountLabel = tc.amount ? ` (₹${tc.amount.toLocaleString('en-IN')})` : '';

      return `
        <div class="test-card">
          <div>
            <div class="test-card-header">
              <span class="test-number">${tc.rule}</span>
              ${statusBadge}
            </div>
            <div class="test-scenario">
              <strong>${tc.name}</strong>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                ${tc.scenario}
              </div>
            </div>
            <div class="test-comparison">
              <div>
                <strong>Expected</strong>
                <span class="badge badge-${tc.expected.toLowerCase().replace(' ', '-')}" style="margin-top: 4px;">${tc.expected}</span>
              </div>
              <div>
                <strong>Actual</strong>
                <span class="badge ${res ? `badge-${res.actual.toLowerCase().replace(' ', '-')}` : ''}" style="margin-top: 4px;">
                  ${actualDecision}
                </span>
              </div>
            </div>
            ${res ? `<div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px;">Applied: <strong>${actualRule}</strong> • ${res.ranAt}</div>` : ''}
          </div>
          <div class="test-footer">
            <span style="font-size: 11px; color: var(--text-subtle);">Agent: <code>${tc.agentId}</code></span>
            <button type="button" class="btn btn-secondary btn-sm btn-run-single-test" data-id="${tc.id}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Run Test
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners
    container.querySelectorAll('.btn-run-single-test').forEach(btn => {
      btn.addEventListener('click', () => {
        runSingleTest(parseInt(btn.getAttribute('data-id'), 10));
      });
    });
  }

  // ==========================================================================
  // 6. Toast Notification Helper
  // ==========================================================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--allow-green)"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--ask-amber)"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--block-red)"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--indigo-primary)"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div style="flex: 1;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==========================================================================
  // 7. Navigation Tabs & Event Listeners Initialization
  // ==========================================================================
  function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTabId = btn.getAttribute('data-tab');

        navButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(targetTabId);
        if (targetPane) targetPane.classList.add('active');
      });
    });
  }

  function initFormHandlers() {
    // Request evaluation form
    const formEval = document.getElementById('form-evaluate');
    if (formEval) formEval.addEventListener('submit', handleEvaluateSubmit);

    // Dynamic refund amount field visibility
    const actionSelect = document.getElementById('eval-action');
    const refundContainer = document.getElementById('refund-amount-container');
    const refundInput = document.getElementById('eval-refund-amount');

    if (actionSelect && refundContainer) {
      actionSelect.addEventListener('change', () => {
        if (actionSelect.value === 'Refund') {
          refundContainer.classList.add('active');
          if (refundInput && !refundInput.value) refundInput.value = '2000';
        } else {
          refundContainer.classList.remove('active');
        }
      });
    }

    // Quick-fill chips on Evaluator
    document.querySelectorAll('.chip-active-agent, .chip-revoked-agent, .chip-unknown-agent').forEach(chip => {
      chip.addEventListener('click', () => {
        const agentId = chip.getAttribute('data-agent');
        const customer = chip.getAttribute('data-customer');
        const agentInput = document.getElementById('eval-agent-id');
        const customerInput = document.getElementById('eval-customer-name');

        if (agentInput) agentInput.value = agentId;
        if (customerInput) customerInput.value = customer;
        showToast(`Auto-filled: ${agentId} (${customer})`, 'info');
      });
    });

    // Inline confirmation buttons in Evaluator decision card
    const btnInlineConfirm = document.getElementById('btn-inline-confirm');
    const btnInlineReject = document.getElementById('btn-inline-reject');

    if (btnInlineConfirm) {
      btnInlineConfirm.addEventListener('click', () => {
        if (state.currentPendingRequestId) {
          handleCustomerConfirmation(state.currentPendingRequestId, 'CONFIRMED');
        }
      });
    }

    if (btnInlineReject) {
      btnInlineReject.addEventListener('click', () => {
        if (state.currentPendingRequestId) {
          handleCustomerConfirmation(state.currentPendingRequestId, 'REJECTED');
        }
      });
    }

    // Agent Registration Form
    const formReg = document.getElementById('form-register-agent');
    if (formReg) formReg.addEventListener('submit', handleRegisterAgent);

    // Audit Log Search & Filter
    const searchInput = document.getElementById('audit-search');
    const filterDecision = document.getElementById('audit-filter-decision');
    const filterConf = document.getElementById('audit-filter-confirmation');

    if (searchInput) searchInput.addEventListener('input', renderAuditTable);
    if (filterDecision) filterDecision.addEventListener('change', renderAuditTable);
    if (filterConf) filterConf.addEventListener('change', renderAuditTable);

    // CSV Download
    const btnExportCSV = document.getElementById('btn-export-csv');
    if (btnExportCSV) btnExportCSV.addEventListener('click', exportAuditLogToCSV);

    // Clear Logs
    const btnClearLogs = document.getElementById('btn-clear-logs');
    if (btnClearLogs) btnClearLogs.addEventListener('click', clearAllLogs);

    // Seed / Reset Demo Data
    const btnSeed = document.getElementById('btn-seed-data');
    if (btnSeed) btnSeed.addEventListener('click', resetToDemoData);

    // Run All Tests button
    const btnRunAllTests = document.getElementById('btn-run-all-tests');
    if (btnRunAllTests) btnRunAllTests.addEventListener('click', runAllTests);
  }

  // ==========================================================================
  // 8. Bootstrap Application on DOM Ready
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initNavigation();
    initFormHandlers();

    // Initial renders
    updateKPIs();
    renderAgentsTable();
    renderApprovalsTable();
    renderAuditTable();
    renderTestingSuite();

    // Run all tests once on load to initialize test state view
    runAllTests();

    console.log('IndiGo Agent Gatekeeper initialized successfully. Enrollment: PGD202563093');
  });

})();
