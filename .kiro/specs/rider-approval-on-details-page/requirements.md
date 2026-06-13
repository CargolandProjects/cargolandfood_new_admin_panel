# Requirements Document

## Introduction

This feature adds Approve and Decline action buttons to the rider (delivery personnel) details page at `/delivery_management/personnel-list/[riderId]`. Currently, admins can only approve or decline riders from the requests list table. This feature mirrors the existing pattern on the restaurant details page, giving admins the ability to take approval action directly from the rider's detail view — streamlining the review workflow without navigating back to the list.

## Glossary

- **DetailsPage**: The rider details page at `/delivery_management/personnel-list/[riderId]/page.tsx`
- **ApproveButton**: The icon button that triggers an APPROVE action for a rider
- **DeclineButton**: The icon button that triggers a REJECT action for a rider
- **RiderApprovalAPI**: The `approveOrRejectRider(riderId, action)` function from `/lib/api/riders.ts`
- **AdminApproved**: The `adminApproved` field on the `Rider` object with possible values: `"PENDING"`, `"APPROVE"`, or `"REJECT"`
- **PersonnelListPage**: The page at `/delivery_management/personnel-list`

---

## Requirements

### Requirement 1: Display Approve and Decline Buttons for Pending Riders

**User Story:** As an admin, I want to see Approve and Decline buttons on the rider details page when a rider is pending, so that I can take approval action without navigating back to the requests list.

#### Acceptance Criteria

1. WHEN the DetailsPage renders a rider whose `AdminApproved` value is `"PENDING"`, THE DetailsPage SHALL display both the ApproveButton and the DeclineButton in the page header area, to the right of the rider's name and status badge.
2. IF the DetailsPage renders a rider whose `AdminApproved` value is `"APPROVE"`, THEN THE DetailsPage SHALL NOT render the ApproveButton or the DeclineButton.
3. IF the DetailsPage renders a rider whose `AdminApproved` value is `"REJECT"`, THEN THE DetailsPage SHALL NOT render the ApproveButton or the DeclineButton.
4. IF no rider data is available (rider not found in cache), THEN THE DetailsPage SHALL NOT render the ApproveButton or the DeclineButton.
5. WHEN the DetailsPage displays the ApproveButton and DeclineButton, THE buttons SHALL be rendered as a pair, grouped together immediately to the right of the rider's status badge.

---

### Requirement 2: Button Visual Design

**User Story:** As an admin, I want the Approve and Decline buttons to be visually consistent with the restaurant details page pattern, so that the UI is predictable and coherent.

#### Acceptance Criteria

1. WHEN the ApproveButton is displayed, THE ApproveButton SHALL be rendered as a 40×40px square icon button with a green background that darkens on hover, containing an approve icon image.
2. WHEN the DeclineButton is displayed, THE DeclineButton SHALL be rendered as a 40×40px square icon button with a red background that darkens on hover, containing a decline icon image.
3. THE ApproveButton SHALL have an accessible `title` attribute with the value `"Approve"`.
4. THE DeclineButton SHALL have an accessible `title` attribute with the value `"Decline"`.
5. WHILE an API call is in progress, THE button that initiated the action SHALL replace its icon with an animated loading spinner; the other button SHALL retain its icon but SHALL appear visually dimmed (reduced opacity).

---

### Requirement 3: Approve Action

**User Story:** As an admin, I want to click the Approve button to approve a pending rider, so that the rider's application is accepted.

#### Acceptance Criteria

1. WHEN the DetailsPage renders a rider whose `AdminApproved` value is `"PENDING"`, THE DetailsPage SHALL display the ApproveButton in an enabled, interactive state.
2. WHEN an admin clicks the ApproveButton, THE DetailsPage SHALL call `RiderApprovalAPI` with the current `riderId` and action `"APPROVE"`.
3. WHILE the `RiderApprovalAPI` call is in progress for an APPROVE action, THE ApproveButton SHALL display a spinner in place of its icon.
4. WHILE the `RiderApprovalAPI` call is in progress for an APPROVE action, BOTH the ApproveButton and the DeclineButton SHALL be disabled and non-interactive.
5. WHEN the `RiderApprovalAPI` call succeeds after an APPROVE action, THE DetailsPage SHALL redirect the admin to the PersonnelListPage.
6. IF the `RiderApprovalAPI` call fails during an APPROVE action, THEN THE DetailsPage SHALL display an error alert using the error message returned by the API.
7. IF the `RiderApprovalAPI` call fails during an APPROVE action, THEN THE DetailsPage SHALL NOT redirect and SHALL re-enable both the ApproveButton and the DeclineButton.

---

### Requirement 4: Decline Action

**User Story:** As an admin, I want to click the Decline button to decline a pending rider, so that the rider's application is rejected.

#### Acceptance Criteria

1. WHEN the DetailsPage renders a rider whose `AdminApproved` value is `"PENDING"`, THE DetailsPage SHALL display the DeclineButton in an enabled, interactive state.
2. WHEN an admin clicks the DeclineButton, THE DetailsPage SHALL call `RiderApprovalAPI` with the current `riderId`, action `"REJECT"`, and an empty string as `rejectionReason` unless a reason is otherwise provided.
3. WHILE the `RiderApprovalAPI` call is in progress for a REJECT action, THE DeclineButton SHALL display a spinner in place of its icon.
4. WHILE the `RiderApprovalAPI` call is in progress for a REJECT action, BOTH the DeclineButton and the ApproveButton SHALL be disabled and non-interactive.
5. WHEN the `RiderApprovalAPI` call succeeds after a REJECT action, THE DetailsPage SHALL redirect the admin to the PersonnelListPage.
6. IF the `RiderApprovalAPI` call fails during a REJECT action, THEN THE DetailsPage SHALL display an error alert using the error message returned by the API.
7. IF the `RiderApprovalAPI` call fails during a REJECT action, THEN THE DetailsPage SHALL NOT redirect and SHALL re-enable both the DeclineButton and the ApproveButton.

---

### Requirement 5: Prevent Concurrent Actions

**User Story:** As an admin, I want to be prevented from triggering multiple simultaneous approval actions, so that the system does not submit conflicting requests.

#### Acceptance Criteria

1. WHILE an approval or rejection API call is in progress, THE DetailsPage SHALL disable both the ApproveButton and the DeclineButton, preventing further clicks until the call resolves (succeeds or fails).
2. WHILE an approval or rejection API call is in progress, THE DetailsPage SHALL render a loading spinner inside the button that initiated the action, replacing the button's icon for the duration of the call.
3. WHEN an API call completes (either successfully or with an error), THE DetailsPage SHALL restore both buttons to their enabled interactive state, except in the case of a successful action where the page redirects away.
