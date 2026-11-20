# Agent Gatekeeper — IndiGo Airlines
**Autonomous AI Agent Governance & Security Gate Prototype**  
**MBA Coursework Assignment:** "Agent Gatekeeper for a Real Company"  
**Student Enrollment Number:** `PGD202563093`  
**Company Case Study:** IndiGo Airlines (*Academic Prototype — Not officially affiliated with InterGlobe Aviation Ltd / IndiGo*)  

---

## 📌 Executive Summary

As commercial airlines integrate autonomous AI travel assistants, customer-facing AI agents (e.g., Siri, ChatGPT plugins, personal travel bots) can interact directly with airline APIs on behalf of passengers. Without a strict gatekeeper, an autonomous bot could accidentally book non-refundable tickets, reschedule flights without passenger consent, or incur massive cancellation charges.

**Agent Gatekeeper** is an intelligent, rule-based governance middleware deployed at the perimeter of IndiGo Airlines' service infrastructure. It intercepts all incoming requests from customer AI agents and evaluates them in real-time, categorizing each into one of three policy actions:
1. 🟢 **ALLOW**: Low-risk or read-only requests executed automatically.
2. 🟡 **ASK CUSTOMER**: High-impact or financial requests placed in a secure confirmation hold until explicit passenger authorization is granted.
3. 🔴 **BLOCK**: Unauthorized actions, unverified agents, or revoked credentials rejected immediately.

---

## 🏛️ System Architecture & Decision Rules Matrix

The gatekeeper enforces **8 strict governance rules** designed to balance customer convenience with risk management:

| Rule ID | Policy Description | Gatekeeper Decision | Risk Classification & Rationale |
| :--- | :--- | :---: | :--- |
| **RULE 1** | Registered active agent requesting read-only fare viewing | 🟢 **ALLOW** | **Zero Risk:** Read-only operation. Does not modify reservation status or commit funds. |
| **RULE 2** | Unknown or unregistered agent requesting any service | 🔴 **BLOCK** | **Critical Security Risk:** Unverified bots are rejected at the perimeter to prevent scraping and credential attacks. |
| **RULE 3** | Flight booking requests from registered active agents | 🟡 **ASK CUSTOMER** | **High Financial Risk:** Issues non-fungible passenger tickets and incurs credit charges. Requires human consent. |
| **RULE 4** | Flight change/modification requests from registered active agents | 🟡 **ASK CUSTOMER** | **High Itinerary Risk:** Alters passenger travel itinerary and may incur modification fees. Requires human consent. |
| **RULE 5** | Ticket refund requests of **₹5,000 or below** from registered active agents | 🟢 **ALLOW** | **Low Financial Risk:** Automated micro-refund threshold to accelerate customer service without manual friction. |
| **RULE 6** | Ticket refund requests **above ₹5,000** from registered active agents | 🟡 **ASK CUSTOMER** | **Medium-High Financial Risk:** High-value cancellations require human confirmation to prevent fraud or accidental cancellations. |
| **RULE 7** | Any request from a **REVOKED** agent (regardless of requested action) | 🔴 **BLOCK** | **Compromised Credential Risk:** Once revoked, the agent is permanently barred from accessing airline services. |
| **RULE 8** | Any unauthorized, malformed, or unsupported action | 🔴 **BLOCK** | **Perimeter Violation:** Principle of Least Privilege. Actions outside authorized endpoints are rejected. |

---

## 🚀 How to Run the Application (Zero Installation Required!)

This application was engineered using beginner-friendly, standard web technologies (**HTML5, CSS3, Modern JavaScript**). It requires **no external installations, no Node.js, no Python, no database setup, and no paid API keys**. It runs 100% locally and offline in any modern web browser.

### Option 1: Quick Double-Click (Easiest for Presentations)
1. Open your `AgentGate` folder on your desktop.
2. Double-click the file named **`index.html`** (or **`start.bat`** on Windows).
3. The dashboard will instantly open in your default browser (Google Chrome, Microsoft Edge, Firefox, or Safari).

### Option 2: Run via Local Web Server (Optional)
If you prefer running through a local HTTP server URL:
- **Using Python** (if installed):
  ```bash
  cd c:\Users\marat\OneDrive\Desktop\AgentGate
  python -m http.server 8000
  ```
  Then open `http://localhost:8000` in your browser.
- **Using Node/npx** (if installed):
  ```bash
  npx serve .
  ```

---

## 🎯 Key Features Walkthrough

### 1. Executive Dashboard & Live KPI Counters
- Displays **Project Name**, **IndiGo Airlines branding**, and **Enrollment Number: `PGD202563093`**.
- Five live KPI metrics:
  - **Total Requests**
  - **Allowed Requests** (Green)
  - **Pending Confirmations** (Amber)
  - **Blocked Requests** (Red)
  - **Active Registered Agents** (Sky Blue)

### 2. Request Evaluator (Interactive Gatekeeper Console)
- Input Customer Name, Agent ID, Requested Action (`View Fare`, `Book Flight`, `Change Booking`, `Refund`), and dynamic Refund Amount.
- Instant evaluation feedback with color-coded badges:
  - 🟢 **ALLOW** (Green)
  - 🟡 **ASK CUSTOMER** (Yellow/Orange)
  - 🔴 **BLOCK** (Red)
- Displays exact **Rule Applied**, **Detailed Reason**, and request metadata.
- For **ASK CUSTOMER** evaluations, an interactive authorization panel appears with **[Confirm Request]** and **[Reject Request]** buttons for instant simulation.
- Quick-fill helper chips are provided so you can click pre-set values quickly during your MBA presentation!

### 3. Agent Registry & Revocation Management
- **Register Agent Form**: Register new AI agents by providing Customer Name, Agent Name, and unique Agent ID.
- **Duplicate Prevention**: System automatically checks and blocks duplicate Agent IDs.
- **Agent Directory**: Table displaying Agent ID, Agent Name, Customer Name, Status (`ACTIVE` / `REVOKED`), Registration timestamp, and Revocation timestamp.
- **Revoke Button**: Active agents have a dedicated Revoke button. When clicked, their status permanently updates to `REVOKED` and the exact timestamp is recorded. Under **Rule 7**, revoked agents can never perform actions again.

### 4. Customer Approvals (Pending Confirmation Queue)
- Dedicated tab displaying all requests flagged with **ASK CUSTOMER**.
- Shows passenger details, agent ID, action, amount, and rule triggered.
- Features one-click **[Confirm]** and **[Reject]** buttons.
- Confirming marks the status as `CONFIRMED`; rejecting marks it as `REJECTED`.
- *(Simulated: No actual ticket booking or real money transfers occur).*

### 5. Audit Log & CSV Export
- Comprehensive, chronological ledger storing every evaluated request.
- Persistent storage using browser `localStorage` — data remains safe even after closing or refreshing the tab!
- Real-time search filter and dropdown filters for **Decision** (`ALLOW`, `ASK CUSTOMER`, `BLOCK`) and **Confirmation Status**.
- **Download CSV**: Generates a standard `.csv` file (`IndiGo_AgentGate_AuditLog.csv`) formatted for Excel or Google Sheets.
- **Clear Logs** & **Load Demo Data** buttons for effortless presentation resets.

### 6. Automated Testing Suite (6 Predefined Test Cases)
A dedicated test runner that executes the 6 academic test cases required for the assignment:
- **Test 1**: Registered active agent (`AGT-IND-101`) requests **View Fare** → Expected: `ALLOW` (Rule 1)
- **Test 2**: Unknown agent (`AGT-GUEST-999`) requests **Book Flight** → Expected: `BLOCK` (Rule 2)
- **Test 3**: Registered active agent (`AGT-IND-101`) requests **₹10,000 Refund** → Expected: `ASK CUSTOMER` (Rule 6)
- **Test 4**: Registered active agent (`AGT-IND-101`) requests **₹2,000 Refund** → Expected: `ALLOW` (Rule 5)
- **Test 5**: Revoked agent (`AGT-IND-103`) requests **Book Flight** → Expected: `BLOCK` (Rule 7)
- **Test 6**: Registered active agent (`AGT-IND-101`) requests **Change Booking** → Expected: `ASK CUSTOMER` (Rule 4)

Click **[Run All 6 Tests]** to watch all 6 test cases run and display glowing green **PASS ✔** badges with a **100% success rate**.

---

## 📂 Project Directory Structure

```text
AgentGate/
├── index.html        # Main dashboard interface with all tabs, forms, and tables
├── styles.css        # Aviation-themed responsive styling (IndiGo 6E color scheme)
├── app.js            # Core Gatekeeper rules engine, persistent storage, and test runner
├── start.bat         # 1-click Windows launcher for instant demo opening
├── README.md         # Comprehensive documentation & presentation guide (this file)
└── PROMPTS.md        # Exact record of the original user assignment prompt
```

---

## 🎤 Step-by-Step MBA Presentation Demo Script

Follow this 5-minute presentation script when demonstrating to your professor:

1. **Introduction (1 min):**
   - *"Good morning Professor. My name is [Your Name], Student Enrollment Number `PGD202563093`. Today I am presenting my MBA project: **Agent Gatekeeper for IndiGo Airlines**."*
   - *"As AI travel agents emerge, airlines must maintain perimeter security and customer financial protection. Our gatekeeper mediates between customer AI bots and IndiGo services using an 8-rule risk governance model."*

2. **Demonstrate Automated Testing Suite (1 min):**
   - Click on the **Testing Suite** tab.
   - Point out the 6 test cases required by the assignment.
   - Click the green **Run All 6 Tests** button.
   - *"As you can see, all 6 test cases execute against our rules engine and achieve 100% PASS rate, verifying Rule 1 through Rule 7."*

3. **Demonstrate Live Request Evaluation (1.5 min):**
   - Navigate to the **Request Evaluator** tab.
   - Click the quick-fill chip **`AGT-IND-101 (Active)`**.
   - Select **View Fare** and click **Evaluate Request**. Show the green **ALLOW** decision under Rule 1.
   - Change action to **Refund**, enter **₹10,000**, and click **Evaluate Request**. Show the amber **ASK CUSTOMER** decision under Rule 6.
   - Click **Confirm Request** right on the card to demonstrate customer consent capture.

4. **Demonstrate Agent Revocation & Security Enforcement (1 min):**
   - Switch to the **Agent Registry** tab.
   - Point out `AGT-IND-101` is currently active.
   - Click the red **Revoke** button next to `AGT-IND-101`.
   - Show how the status changes to `REVOKED` and the exact revocation timestamp is logged.
   - Return to the **Request Evaluator** tab and submit any request for `AGT-IND-101`.
   - Show how it is instantly **BLOCKED** under **Rule 7** (*Revoked agents are permanently barred*).

5. **Demonstrate Audit Log & CSV Export (30 sec):**
   - Navigate to the **Audit Log** tab.
   - Show how every single transaction has been recorded with timestamp, customer name, rule number, and confirmation status.
   - Click **Download CSV** and show the downloaded file in your browser's download bar.

---

## 🔒 Security & Privacy Notice
This software is an educational prototype developed solely for MBA academic coursework. It operates in an isolated browser sandbox and **does not connect to real airline booking mainframes, does not execute real financial transactions, and does not use paid third-party APIs**.
