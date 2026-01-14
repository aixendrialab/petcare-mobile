# Role Home – Spec (Parent Example)

---

## 3-Layer Design Model

If it were me designing this as the **“role home framework” (shell)** + **“role data config” (parent home)**, I’d treat the screen as 3 layers:

1. **Primary context (who + applies-to)**
2. **Primary actions (fast tasks)**
3. **State & next-best-actions (what needs attention, what’s happening, what changed)**

Below is how I’d plan it.

---

## 1) Layout: what I’d change

### A. Header becomes a real “status header”

Instead of only greeting + phone, I’d do:

- Hello, Ram 👋  
- small “Parent” badge  
- one-line “Today summary”:  
  “1 vaccine due • 1 delivery arriving • next appointment in 2 days”
- optional tiny bell/alerts icon later

**Why:** this turns the page into a dashboard, not a menu.

---

### B. Pets strip becomes “pet switcher + quick health status”

Keep your horizontal pet avatars, but add tiny status dots/badges per pet:

- green: all good  
- amber: due soon (vaccine / meds / appointment)  
- red: overdue (vaccine / follow-up)

Also: let tapping a pet filters the state sections to that pet (default “All pets”).

So the strip is both:

- navigation (pet profile)
- a filter control (scope the home)

---

### C. Tiles should not be 12 at once

**Row 1: Primary 4 (always visible)**

- Book Vet  
- Vaccines  
- Prescriptions  
- Shop (or Orders)

**Row 2: Secondary 4**

- Appointments  
- Upload Report  
- Televisit  
- Cart

And below tiles: a **“See all actions”** link that opens a full action grid screen.

This keeps home calm + still complete.

---

## 2) Tiles (Tasks): what I’d choose and how I’d group them

### A. I’d group tasks into 4 categories (mentally)

**Care**
- Book Vet
- Vaccines
- Prescriptions / Refill meds
- Upload report

**Appointments**
- Upcoming / Reschedule
- Televisit (only if enabled)

**Commerce**
- Shop
- Cart
- Orders

**Engagement**
- Rewards
- Events

---

### B. I’d also change some tiles into “smart tiles”

Instead of static “Orders”, make it:

- Orders (2 in transit)

Instead of “Vaccinations”:

- Vaccinations (1 due)

Instead of “Cart”:

- Cart (3 items)

This requires the tile state to depend on your fetched data.

---

## 3) “State sections”: what they should look like

Right now you have many sections, all same weight. I’d redesign into two tiers:

---

### Tier 1: “Urgent / Attention”

A dedicated card at top (below tiles) called:

**Attention**

- Bella: Rabies vaccine due in 3 days → “Schedule”
- Rocky: Refill meds in 2 days → “Refill”
- Order #123: arriving tomorrow → “Track”

This is the best part of a home screen: it tells me what to do next.

---

### Tier 2: “Timeline / Cards”

Then keep 3–4 core cards:

- Next appointment
- Recent visit
- Prescriptions
- Recent orders

Keep Rewards + Events, but visually deemphasize:

- either move them to the bottom
- or put them in a “Discover” accordion / collapsible section

---

## 4) How I’d structure state (data) in the app

### A. Treat home as an aggregator with a single “HomeViewModel”

Instead of many useEffects fetching independently, I’d represent home state as:

- scopePetId: number | null (null = all pets)
- loading: { pets, appt, vaccines, rx, orders, visits }
- data: { pets, nextAppt, dueItems, rx, orders, visits }
- derived: { attentionItems, tileBadges, summaryLine }
- lastUpdatedTs

---

### B. Derived state is the key

**AttentionItems** are derived from:

- vaccines due (due/overdue)
- rx refill soon (if you have “next refill date” or “days left”)
- next appointment soon
- orders in transit

**TileBadges** derived from:

- vaccinesDue.length
- orders.filter(inTransit).length
- cartCount
- rxActiveCount

---

### C. Scope filtering (per pet)

When user selects a pet in the strip:

- keep full lists in memory
- compute filteredVaccinesDue, filteredRx, filteredVisits, etc.
- sections render the filtered list

This avoids refetching and makes UX feel instant.

---

## 5) Concrete “my home layout” (final structure)

Order of sections on screen:

1. Header (greeting + summary line + role badge)
2. Pet strip (All + each pet + Add)
3. Primary actions (8 tiles max) + “See all”
4. Attention (one card with 0–5 items, each with CTA)
5. Next Appointment
6. Recent Visit
7. Prescriptions
8. Recent Orders
9. Discover (Rewards, Events)

---

## 6) If you want to keep your current code shape, easiest improvements

Without changing architecture too much:

- Add selectedPetId state and filter sections based on it.
- Add a derived summaryLine under greeting.
- Reduce visible tiles to 8 + “See all”.
- Add one new section “Attention” above others, derived from existing lists.
