// Live-pulled Jira snapshot. `allTime` and `last90d` are deliberately
// scoped differently — confirmed with the user on 2026-08-19 after the
// numbers looked wrong at first:
//
// allTime: project in (PD, UT, UE, PXD) AND assignee = <id>
//   — current ownership only, within the 4 tracked design boards.
//
// last90d: assignee WAS <id> AND updated >= -90d, NO project filter
//   — anyone who was ever assignee on a ticket touched/resolved in the
//   last 90 days, anywhere in Jira. This matches what Jira's own search
//   returns for "how many tickets has X worked on in the last 90 days"
//   (verified: Narendra Paidipati -> exactly 19, matching Jira directly).
//   Backlog here means "To Do" tickets touched in the window, not tickets
//   created in the window.
//
// Why not use `assignee WAS` for allTime too: tested it, and it inflates
// wildly for some people (Narendra's Done count went 70 -> 219) because
// Jira's assignee-change history includes bulk/automated reassignment
// noise, not just genuine handoffs. Bounded to a 90-day window it's fine;
// unbounded it isn't, so allTime keeps the simpler `assignee =`.
//
// Net effect: last90d can include boards/activity that allTime doesn't,
// and a person's last90d total is not a subset of their allTime total.
// That's intentional, not a bug — see the caveats footnote on the page.
//
// BUCKETING OVERRIDE (found 2026-08-19, applies to BOTH allTime and
// last90d): Jira's own `statusCategory` field misclassifies two statuses
// relative to how this team actually uses them —
//   - "Selected for Development" has native statusCategory "To Do", but
//     is treated here as In Progress (it's been picked up, not untouched).
//   - "On Hold" has native statusCategory "In Progress" (indeterminate),
//     but is treated here as Backlog/To Do (paused work isn't active work).
// Every count below already has this override applied — i.e. it is NOT
// raw `statusCategory` counts, it's `statusCategory` with those two status
// names re-bucketed. Verified against a user-supplied Jira report for 6 of
// the 12 people; every number matched exactly once the override was
// applied. If you regenerate this data, you MUST apply the same override
// (see lib/jiraLive.ts, which encodes it for the live-refresh path) —
// querying by raw statusCategory alone will silently reintroduce this bug.
//
// `evidence` on each person is their 3 most-recently-updated Done tickets
// within the allTime scope — real Jira issues, not invented examples.
//
// Regenerate by re-running the Jira queries described above and pasting
// the counts back in — see the refresh footnote on the leaderboard page
// for why this isn't a live server-side query by default.

export type StatusBucket = {
  done: number;
  inProgress: number;
  backlog: number;
  total: number;
};

export type Evidence = {
  key: string;
  summary: string;
  webUrl: string;
};

export type LeaderboardPerson = {
  accountId: string;
  name: string;
  photo: string | null;
  allTime: StatusBucket;
  last90d: StatusBucket;
  evidence: Evidence[];
};

export const asOf = "2026-08-19";

export const scopedBoards = [
  { key: "PD", name: "Product Design" },
  { key: "UT", name: "UI/UX Team" },
  { key: "UE", name: "UX Experience" },
  { key: "PXD", name: "PX - Product Experience" },
];

export const scopedBoardKeys = scopedBoards.map((b) => b.key);

export const leaderboardPeople: LeaderboardPerson[] = [
  {
    accountId: "62eb63c8ec6b328032f1b8ec",
    name: "Narendra Paidipati",
    photo: "/leaderboard/narendra.png",
    allTime: { done: 70, inProgress: 10, backlog: 27, total: 107 },
    last90d: { done: 4, inProgress: 3, backlog: 12, total: 19 },
    evidence: [
      { key: "PXD-352", summary: "User Memory", webUrl: "https://contentstack.atlassian.net/browse/PXD-352" },
      { key: "PXD-272", summary: "RBAC - For CMS.", webUrl: "https://contentstack.atlassian.net/browse/PXD-272" },
      { key: "PXD-226", summary: "Coordinate Adoption Plan with Product Teams", webUrl: "https://contentstack.atlassian.net/browse/PXD-226" },
    ],
  },
  {
    accountId: "5f3ccb51333edb0043b1c97b",
    name: "Vini Dhoka",
    photo: "/leaderboard/Vini.png",
    allTime: { done: 70, inProgress: 23, backlog: 8, total: 101 },
    last90d: { done: 17, inProgress: 21, backlog: 7, total: 45 },
    evidence: [
      { key: "PXD-78", summary: "DAM: Design Review", webUrl: "https://contentstack.atlassian.net/browse/PXD-78" },
      { key: "PXD-501", summary: "Date Field - User Defined Field", webUrl: "https://contentstack.atlassian.net/browse/PXD-501" },
      { key: "PXD-257", summary: "Bulk Edit Metadata Inital Concepts", webUrl: "https://contentstack.atlassian.net/browse/PXD-257" },
    ],
  },
  {
    accountId: "633a96ff07a27ebeff17da61",
    name: "Srinivas Erupothu",
    photo: "/leaderboard/SrinivasErupothu.png",
    allTime: { done: 62, inProgress: 5, backlog: 10, total: 77 },
    last90d: { done: 11, inProgress: 2, backlog: 0, total: 13 },
    evidence: [
      { key: "PXD-321", summary: "Design Input & Output Icons for Agent OS - Execution Logs", webUrl: "https://contentstack.atlassian.net/browse/PXD-321" },
      { key: "PXD-316", summary: "We need the Polaris icon to glow or pulsate to signal an alert (default behavior).", webUrl: "https://contentstack.atlassian.net/browse/PXD-316" },
      { key: "PXD-315", summary: "Need an animation on center of the screen for when Polaris is generating or applying the content into the fields", webUrl: "https://contentstack.atlassian.net/browse/PXD-315" },
    ],
  },
  {
    accountId: "712020:27e2f083-0158-4402-b0bb-47972d2faf1f",
    name: "Meenu Chauhan",
    photo: "/leaderboard/Meenu.png",
    allTime: { done: 55, inProgress: 1, backlog: 2, total: 58 },
    last90d: { done: 29, inProgress: 2, backlog: 1, total: 32 },
    evidence: [
      { key: "PXD-456", summary: "Revised Email templates for all existing Contentstack Product emails", webUrl: "https://contentstack.atlassian.net/browse/PXD-456" },
      { key: "PXD-483", summary: "Log Targets - Multiple targets", webUrl: "https://contentstack.atlassian.net/browse/PXD-483" },
      { key: "PXD-468", summary: "Dashboard updates", webUrl: "https://contentstack.atlassian.net/browse/PXD-468" },
    ],
  },
  {
    accountId: "712020:6d59d4a8-0137-4ef2-bfc9-71020a386892",
    name: "Sree Medapureddi",
    photo: "/leaderboard/Sreemedupareddi.png",
    allTime: { done: 50, inProgress: 1, backlog: 1, total: 52 },
    last90d: { done: 13, inProgress: 1, backlog: 0, total: 14 },
    evidence: [
      { key: "PXD-497", summary: "Polaris Hi-fid- Skills", webUrl: "https://contentstack.atlassian.net/browse/PXD-497" },
      { key: "PXD-496", summary: "Polaris Hi-fid- Composer Menu", webUrl: "https://contentstack.atlassian.net/browse/PXD-496" },
      { key: "PXD-495", summary: "Polaris Hi-fid - Chat Conversations", webUrl: "https://contentstack.atlassian.net/browse/PXD-495" },
    ],
  },
  {
    accountId: "712020:e176a500-b329-42d4-ab45-295db01b4238",
    name: "Muskan Kadam",
    photo: "/leaderboard/Muskan.png",
    allTime: { done: 47, inProgress: 0, backlog: 2, total: 49 },
    last90d: { done: 5, inProgress: 0, backlog: 1, total: 6 },
    evidence: [
      { key: "PXD-492", summary: "Update Voice Profiles listing page to align with Venus 2.0", webUrl: "https://contentstack.atlassian.net/browse/PXD-492" },
      { key: "PXD-460", summary: "MD file based Brand Kits", webUrl: "https://contentstack.atlassian.net/browse/PXD-460" },
      { key: "PXD-428", summary: "Knowledge Vault - Sync", webUrl: "https://contentstack.atlassian.net/browse/PXD-428" },
    ],
  },
  {
    accountId: "5e96e91a7a06740c103b4f94",
    name: "Prashant Choudhary",
    photo: "/leaderboard/Prashant.png",
    allTime: { done: 34, inProgress: 3, backlog: 6, total: 43 },
    last90d: { done: 0, inProgress: 0, backlog: 0, total: 0 },
    evidence: [
      { key: "PXD-184", summary: "Publish Review UX update based on Technical feedback", webUrl: "https://contentstack.atlassian.net/browse/PXD-184" },
      { key: "PXD-196", summary: "Side bar options are getting cut in smaller screen", webUrl: "https://contentstack.atlassian.net/browse/PXD-196" },
      { key: "PXD-162", summary: "Content Type Version Compare Review", webUrl: "https://contentstack.atlassian.net/browse/PXD-162" },
    ],
  },
  {
    accountId: "712020:bbecfa2a-057c-42c4-b4ff-c2801b1243fd",
    name: "Kaustubh Gharat",
    photo: "/leaderboard/Kaustubh.png",
    allTime: { done: 22, inProgress: 1, backlog: 4, total: 27 },
    last90d: { done: 1, inProgress: 0, backlog: 4, total: 5 },
    evidence: [
      { key: "PXD-467", summary: "Import Entries", webUrl: "https://contentstack.atlassian.net/browse/PXD-467" },
      { key: "PXD-289", summary: "Plan based feature landing pages | Consistency", webUrl: "https://contentstack.atlassian.net/browse/PXD-289" },
      { key: "PXD-190", summary: "Branches support for Personalize and CMS Variants", webUrl: "https://contentstack.atlassian.net/browse/PXD-190" },
    ],
  },
  {
    accountId: "712020:1beabb0c-6447-4e64-af16-6e643fd6d828",
    name: "Nayanshree Gupta",
    photo: "/leaderboard/Nayanshree.png",
    allTime: { done: 17, inProgress: 2, backlog: 0, total: 19 },
    last90d: { done: 3, inProgress: 2, backlog: 2, total: 7 },
    evidence: [
      { key: "PXD-449", summary: "Design Review for Assets in CMS", webUrl: "https://contentstack.atlassian.net/browse/PXD-449" },
      { key: "PXD-254", summary: "External Sharing", webUrl: "https://contentstack.atlassian.net/browse/PXD-254" },
      { key: "PXD-47", summary: "DAM: Include relative date filtering", webUrl: "https://contentstack.atlassian.net/browse/PXD-47" },
    ],
  },
  {
    accountId: "712020:14b1b096-c0be-482f-a340-09f298916e5a",
    name: "Amiya Chaturvedi",
    photo: "/leaderboard/Amiya.png",
    allTime: { done: 8, inProgress: 5, backlog: 1, total: 14 },
    last90d: { done: 3, inProgress: 3, backlog: 0, total: 6 },
    evidence: [
      { key: "PXD-466", summary: "Removing UI limitation for Bulk Selection", webUrl: "https://contentstack.atlassian.net/browse/PXD-466" },
      { key: "PXD-463", summary: "Bulk Text Find & Replace", webUrl: "https://contentstack.atlassian.net/browse/PXD-463" },
      { key: "PXD-390", summary: "Release Rollback", webUrl: "https://contentstack.atlassian.net/browse/PXD-390" },
    ],
  },
  {
    accountId: "712020:64b2f104-8704-4e3b-ab16-67a595eca0ff",
    name: "Vishal Lokare",
    photo: "/leaderboard/Vishal.png",
    allTime: { done: 5, inProgress: 3, backlog: 1, total: 9 },
    last90d: { done: 0, inProgress: 1, backlog: 1, total: 2 },
    evidence: [
      { key: "PXD-212", summary: "Agent Builder – Configure Tools & Events for Connected Applications", webUrl: "https://contentstack.atlassian.net/browse/PXD-212" },
      { key: "PXD-216", summary: "Agent Builder – View Historical Execution Logs for Agent Runs", webUrl: "https://contentstack.atlassian.net/browse/PXD-216" },
      { key: "PXD-165", summary: "Polaris Ideation", webUrl: "https://contentstack.atlassian.net/browse/PXD-165" },
    ],
  },
  {
    accountId: "629da9f69248fe006910af34",
    name: "George Karian",
    photo: null,
    allTime: { done: 0, inProgress: 0, backlog: 7, total: 7 },
    last90d: { done: 0, inProgress: 0, backlog: 0, total: 0 },
    evidence: [],
  },
];

export function score(bucket: StatusBucket): number {
  return bucket.done * 10 + bucket.inProgress * 2;
}
