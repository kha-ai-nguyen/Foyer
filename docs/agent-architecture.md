# Fete Agent Architecture

_How AI agents coordinate workflow automation on both sides of the platform_

---

## Overview

Fete's automation relies on three interconnected agent systems:

1. **Outbound Voice Agent** (11 Labs) — Calls venues to collect proposals
2. **Email Agent** (Claude API) — Drafts initial outreach and processes inbound responses
3. **Lead Intelligence Agent** (Claude API) — Scores leads, suggests follow-ups, generates content

These agents work in parallel and log results back to the unified conversation thread, so both bookers and venues see real-time progress.

---

## 1. Outbound Voice Agent (11 Labs)

### Trigger
Booker clicks "Blast Outreach" on an event. Fete queues calls to all targeted venues during configured time window (e.g., 9am–5pm UK time).

### Flow

```
Booker creates event → Fete collects venue contact list → 11 Labs initiates call
         ↓
[11 Labs AI answers call] → "Hi, this is Fete calling about a private event enquiry"
         ↓
[Venue manager picks up] → AI asks 5 key questions:
  1. Is [DATE] available?
  2. Can you accommodate [HEADCOUNT] guests?
  3. What's your rate per head for this type of event?
  4. What's included (catering, AV, setup)?
  5. Who should we send the formal enquiry to?
         ↓
AI transcribes responses → Stores in conversation_messages (message_type: 'voice_call')
         ↓
Extracts structured data (availability: yes/no, price_range: £50-75, included_services: [...])
         ↓
Logs back to conversation thread + conversation table (status: 'contacted')
         ↓
Booker sees update in real-time: "Morchella—Called 2:15pm—Available May 15—£78/head"
```

### Key Details

**11 Labs Configuration:**
- Voice model: UK English, neutral/professional tone
- Message duration: 2–4 mins max
- Success metric: Connected to decision-maker
- Fallback: If no answer, leave voicemail with call-back number

**What happens if:**
- Venue doesn't answer → Log "no answer" + retry next day
- Venue says "not available" → Log explicitly, mark as declined
- Venue says "send details" → Transition to email agent (Stage 2)

**Data Extraction Logic:**
- Parse transcription with Claude API
- Extract: date (availability), headcount fit, price range, included services, contact person
- Store in conversation table + proposal_draft table (auto-populate proposal with extracted data)

**Compliance:**
- Call recording disclosure: "This call is being recorded. Do you consent?" (auto-compliance)
- Only call during business hours (9am–5pm venue local time)
- Respect opt-out lists (venue can request "email only" via settings)

---

## 2. Email Agent (Claude API)

### Trigger
Simultaneously with voice calls, or when booker sends initial enquiry to venues not yet contacted.

### Outbound Flow (Booker → Venue)

```
Booker blasts event → Email Agent drafts initial enquiry
         ↓
Claude generates context-aware email:
  Subject: "Private Event Enquiry – [EVENT_TYPE] – [DATE] – [HEADCOUNT] pax"
  Body: Warm, clear, specific
    - Event type + date + headcount + budget
    - What you're looking for
    - Contact: [booker email] + [optional callback number]
         ↓
Email sent via Fete from noreply@fete.co (can reply directly)
         ↓
Logged in conversation_messages (message_type: 'email', sender: 'fete_agent')
         ↓
Booker sees: "Email sent to [venue] 2:10pm"
```

**Email Template (Claude-generated, per event):**
```
Hi [Venue Manager],

I'm reaching out because I'm planning a [EVENT_TYPE] for [HEADCOUNT] guests on [DATE] in [LOCATION].

We're looking for a space that can accommodate [SPECIFIC_NEEDS]. Your venue looks like a great fit based on [REASON: capacity, aesthetic, vibe].

Quick details:
- Date: [DATE]
- Guests: [HEADCOUNT]
- Budget: [BUDGET]/head
- What we need: [CATERING/AV/SETUP/etc.]

Would this work for you? Happy to jump on a call if you'd like to discuss.

Best,
[Booker Name]
Fete Platform
[contact info]
```

### Inbound Flow (Venue → Booker)

```
Venue replies to email → Email Parser captures message
         ↓
Email is parsed (via Gmail API or email forwarding)
         ↓
Claude extracts key data:
  - Availability: yes/no/partial
  - Price: £X/head (or range)
  - What's included: [menu, AV, setup, etc.]
  - Decision timeline: "need answer by Friday"
  - Contact person: [name, phone, email]
  - Objections: "Can't do that date, but we can do X"
         ↓
Auto-log in conversation_messages (message_type: 'email', sender: 'venue')
         ↓
Create/update proposal_draft from extracted data:
  {
    conversation_id: ...,
    price_per_head: 75,
    total_estimate: 4500,
    included_services: ['menu', 'wine', 'setup'],
    availability: 'available',
    decision_timeline: '2026-04-20'
  }
         ↓
Lead Scoring Agent reviews + scores lead (hot/warm/cold)
         ↓
Venue manager sees in task inbox:
  "Morchella – Email reply – £75/head – [lead score] – [extract summary]"
         ↓
Venue manager clicks → views full email thread + auto-drafted response suggestion
```

### Email Parsing Logic

**Extraction targets:**
- **Availability**: Regex + Claude for date ranges ("available after May 15", "weekends only")
- **Price**: Regex for £X/head or total quote
- **Services**: Keyword matching (menu, catering, AV, setup, bar, décor)
- **Decision timeline**: Extract dates/language ("by Friday", "need to know in 2 weeks")
- **Contact**: Extract name, phone, email from signature block
- **Sentiment**: Is venue enthusiastic, hesitant, or declining?

**Accuracy threshold**: 90%+ for key fields. If <90%, surface to human for review before logging.

---

## 3. Lead Intelligence Agent (Claude API)

### Lead Scoring

Runs after every communication (call, email) to update lead temperature.

**Scoring factors:**
- **Event value** (40% weight): budget × headcount × likelihood of high-margin event
- **Responsiveness** (30% weight): Time to first response (same day = hot, 3+ days = cold)
- **Fit** (20% weight): Can venue actually accommodate event? (capacity, date, services)
- **Decision timeline** (10% weight): Urgent events (< 2 weeks) = hot; far future = warm

**Scoring rules:**
```
Hot (🔥):
  - Responded within 4 hours
  - Event value > £5k
  - Date available
  - All required services available

Warm (🌡️):
  - Responded within 24 hours
  - Event value £2k–£5k
  - Minor conflicts (e.g., need to check catering)

Cold (❄️):
  - No response in 3+ days
  - Explicitly declined
  - Doesn't meet requirements
  - Far future (6+ months out)
```

**Score update logic:**
```python
def score_lead(conversation):
    base_score = 50  # Start neutral
    
    # Responsiveness
    time_to_response = (conversation.last_message_at - conversation.created_at).days
    if time_to_response == 0:
        base_score += 30  # Same day response
    elif time_to_response <= 1:
        base_score += 20
    elif time_to_response >= 3:
        base_score -= 20
    
    # Event value
    event = conversation.event
    value = event.budget * event.headcount
    if value > 5000:
        base_score += 20
    elif value < 1000:
        base_score -= 15
    
    # Fit
    if conversation.venue_can_accommodate:
        base_score += 15
    else:
        base_score -= 25
    
    # Timeline
    days_until = (event.date - today()).days
    if days_until < 14:
        base_score += 10
    elif days_until > 180:
        base_score -= 10
    
    # Map to hot/warm/cold
    if base_score >= 70:
        return 'hot'
    elif base_score >= 40:
        return 'warm'
    else:
        return 'cold'
```

### Proactive Follow-Up Suggestions

Runs nightly to surface cold leads that need attention.

```
For each cold lead with no communication in 2+ days:
  → Generate nudge: "Respond to [Venue] in 24h or escalate"
  → In-app notification + email alert to venue manager
  → Suggest templated follow-up email (Claude-drafted)
  
Venue manager can:
  - Click "Send follow-up" (uses auto-drafted email)
  - Click "Customize" (edits before sending)
  - Click "Archive" (dead lead)
  - Click "Call them" (logs intention)
```

### Custom Content Generation

Runs post-acceptance to create event-specific communication.

**1. Run-of-Show (Timeline)**
```
Input: event details (type, catering, headcount, date, special requests)

Claude generates:
  14:00 - Guests arrive, welcome drinks & canapés
  14:30 - Seated for main course
  15:15 - Toasts & speeches
  16:00 - Dessert & coffee
  17:00 - Event ends

Output: Shared with venue + booker via email
```

**2. Personalized Welcome Email (to booker)**
```
Input: Accepted proposal, venue name, event type

Claude generates:
  Hi Emma,

  So excited for your rehearsal dinner at Morchella on May 15!

  Here's what you need to know:
  - **Arrival**: 2pm (door on left, ask for Marco)
  - **Parking**: Limited on-street; full car park address: [...]
  - **Menu**: We've pre-selected [menu options]; any dietary changes by May 10?
  - **Setup**: 50-70 seated, private room, AV available
  - **Contact**: Marco [phone/email] – reach out with any questions

  We're excited to host you!

Output: Sent to booker 1 week before event
```

**3. Dynamic Pricing Recommendations (for venue)**
```
Input: Venue's historical proposals + win/loss data

Claude analyzes:
  - "You're winning 40% of wedding enquiries at £85/head, 60% at £75/head"
  - "Corporate events win at £60–70/head but you're quoting £80"
  - "Recommend: drop weekend rate to £78 to match market"

Output: Dashboard alert + recommendation card
```

---

## 4. Conversation Thread Integration

All agents log to a **single unified conversation thread** so both sides see everything.

### Data Model

```sql
-- Main conversation record
conversations:
  id
  event_id
  venue_id
  status: 'new' | 'contacted' | 'proposal_sent' | 'confirmed' | 'declined'
  lead_score: 'hot' | 'warm' | 'cold'
  last_message_at
  created_at

-- All messages (emails, calls, in-app)
conversation_messages:
  id
  conversation_id
  sender: 'booker' | 'venue' | 'fete_agent'
  message_type: 'email' | 'voice_call' | 'in_app'
  body: text
  email_from
  email_to
  created_at

-- Proposals extracted from conversations
proposals:
  id
  conversation_id
  price_per_head
  total_estimate
  included_services: JSON
  extracted_from_email: boolean
  status: 'draft' | 'sent' | 'accepted' | 'declined'
  docusign_url
  created_at

-- Extracted structured data from emails/calls
extracted_data:
  id
  conversation_id
  key: 'availability' | 'price' | 'contact_name' | 'timeline' | 'objections'
  value: string
  confidence: 0.0–1.0
  created_at
```

### Example Thread View (Booker Side)

```
Event: Rehearsal Dinner – May 15 – 60 pax – £75/head

📞 Fete Agent (2:10pm)
  "Called Morchella – Available May 15 – £78/head – Seats 50–70"
  [extracted data: availability=yes, price=£78, capacity=50-70]

✉️ Fete Agent (2:10pm)
  "Email sent to Morchella"
  [automatic follow-up to confirm call discussion]

✉️ Venue: Marco @ Morchella (2:47pm)
  "Yes, available! Our Private Dining room is perfect. £78/head all-in with wine, setup, AV. Who should I send the proposal to?"
  [extracted: price=£78, included_services=[wine, setup, AV], contact=Marco]

📋 Proposal Generated (2:50pm)
  Price: £78/head = £4,680 total
  Includes: Wine, setup, AV, staffing
  Decision timeline: Marco needs answer by May 1

[BOOKER CLICKS ACCEPT]

✅ Accepted (3:15pm)
  "Emma accepted Morchella's proposal"
  Docusign contract sent to both parties
  Marco notified in his task inbox: "Confirmed ✅"
```

### Example Thread View (Venue Side)

```
Lead: Emma's Rehearsal Dinner – May 15 – 60 pax – 🔥 HOT

📞 Fete Agent (2:10pm)
  "Fete called asking about May 15 event"
  You said: "Available, £78/head"

📋 Auto-Generated Proposal (2:50pm)
  Based on your call response:
  - Date: May 15
  - Headcount: 60
  - Price: £78/head = £4,680 total
  - Your included services (from call)
  [BUTTON: Send via Docusign]

✅ Accepted (3:15pm)
  Emma accepted your proposal
  Next steps auto-generated in task inbox:
  - T-4 weeks: Collect dietary restrictions
  - T-2 weeks: Confirm final headcount
  - T-1 week: Send setup guide + parking
```

---

## 5. Error Handling & Fallbacks

### Voice Call Failures

| Scenario | Fallback |
|----------|----------|
| No answer | Voicemail + email follow-up next day |
| Hung up | Classified as "not interested" |
| Transcription error (low confidence) | Email follow-up to confirm |
| "Call back later" | Schedule retry 24 hours later |

### Email Parsing Failures

| Scenario | Handling |
|----------|----------|
| Email not received | Retry once after 1 hour |
| Extraction confidence <90% | Surface to venue manager for review |
| Spam/bounce | Mark as undeliverable |
| No response in 5 days | Auto-send follow-up or escalate |

### Lead Score Edge Cases

| Scenario | Rule |
|----------|------|
| Venue said "maybe" or "let me check" | Warm, not cold |
| Event date is 6+ months away | Warm/cold (venue unlikely to commit early) |
| No budget specified | Estimate based on headcount + event type |
| Venue is unresponsive but fit is perfect | Wait 1 week, then escalate to human |

---

## 6. Prompt Engineering (Claude)

### Email Drafting Prompt

```
You are Fete, an AI assistant for event coordination. 
You're drafting an initial enquiry email to a venue on behalf of a booker.

Venue: {venue_name}, {venue_type}
Event: {event_type} for {headcount} guests on {date}
Budget: {budget}/head
Tone: Warm, professional, specific
Include: Event type, date, headcount, budget, 1–2 specific requirements

Write a 100–150 word email that's likely to get a response.
Subject line first, then body.
Do not include pricing offers or commitments.
Signature: [Booker Name] via Fete
```

### Lead Scoring Prompt

```
You are analyzing an event lead for a venue manager.

Venue: {venue_name}
Booker message: {message}
Event: {event_type}, {headcount} pax, {date}, {budget}

Rate the lead as:
- 🔥 HOT: Respond today. High-value, urgent, good fit.
- 🌡️ WARM: Respond within 48h. Medium value or minor conflicts.
- ❄️ COLD: Archive or slow-track. Low value, poor fit, or unresponsive.

Explain your reasoning in 1 sentence.
```

### Content Generation Prompt

```
You are creating event-specific content for {venue_name}.

Confirmed event: {event_type}, {date}, {headcount} pax
Booker: {name}
Setup: {room_type}, {special_requests}

Generate a brief run-of-show (timeline) that's realistic for this venue and event.
Format: HH:MM - [Activity]. Keep to 5–7 key moments. Assume {duration} hour event.
```

---

## 7. Monitoring & Debugging

### Key Metrics to Track

- **Voice call success rate**: % of calls that reached decision-maker
- **Email response rate**: % of emails that got replies within 24h
- **Extraction accuracy**: % of key fields extracted with confidence >90%
- **Lead score agreement**: % of venue managers who agree with hot/warm/cold score
- **False positives**: Leads marked "hot" that don't convert
- **Agent latency**: Time from event creation → first call made / email sent

### Logging

All agent actions logged to `agent_logs` table:
```sql
agent_logs:
  id
  agent_type: 'voice' | 'email_draft' | 'email_parse' | 'scoring'
  conversation_id
  input: JSON
  output: JSON
  success: boolean
  error: string
  latency_ms: integer
  created_at
```

---

## 8. Future Enhancements (Phase 2+)

- **Multi-language support**: Agents draft/parse in Italian, Spanish, French (for EU expansion)
- **Venue context**: Agents know venue history (previous events, preferences, negotiation patterns)
- **Dynamic pricing**: Agents negotiate pricing based on demand + venue's margin targets
- **Calendar integration**: Agents check venue calendar before proposing dates
- **Call recording**: Full call recordings stored + transcribed (already in Phase 1, enhanced in Phase 2)

---

_This architecture is designed for scale: agents work in parallel, leverage Claude for reasoning, and keep humans in the loop where judgment matters._
