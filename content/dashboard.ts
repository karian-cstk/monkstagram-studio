// Live-pulled Jira snapshot for the /dashboard page. All widgets are
// scoped to project in (PD, UT, UE, PXD) — confirmed with the user
// 2026-08-19, same 4 boards as the leaderboard's all-time view.
//
// Status bucketing uses the same correction as the leaderboard (see
// content/leaderboard.ts header comment): "Selected for Development"
// counts as In Progress, "On Hold" counts as Backlog — not Jira's raw
// statusCategory, which misclassifies both.
//
// Unassigned (1,028) and stale (1,602) counts are large because these
// boards include contributors well beyond the 12 tracked designers
// (engineers, PMs, etc.) and go back to 2020 — that's real, not a bug.
// Lists below show only the oldest 15 of each for a manageable page.
//
// Reopened tickets: Jira has no field for "why was this reopened" —
// each `inferredReason` is Claude's read of the ticket's description
// and comments, not a Jira-native fact. Verify before treating as
// ground truth; some are honestly labeled "unclear" rather than guessed.

export type TopPerformerEntry = {
  accountId: string;
  name: string;
  done: number;
  inProgress: number;
  backlog: number;
  score: number;
};

export type UnassignedItem = {
  key: string;
  summary: string;
  status: string;
  project: string;
  created: string;
  webUrl: string;
};

export type StaleItem = {
  key: string;
  summary: string;
  status: string;
  project: string;
  created: string;
  assigneeName: string;
  webUrl: string;
};

export type ReopenedItem = {
  key: string;
  summary: string;
  project: string;
  status: string;
  inferredReason: string;
  classification: "new feature request" | "design/scope change" | "bug/defect" | "unclear";
  webUrl: string;
};

export const dashboardAsOf = "2026-08-19";

export const topPerformers30d: TopPerformerEntry[] = [
  { accountId: "5f3ccb51333edb0043b1c97b", name: "Vini Dhoka", done: 6, inProgress: 18, backlog: 4, score: 96 },
  { accountId: "633a96ff07a27ebeff17da61", name: "Srinivas Erupothu", done: 6, inProgress: 2, backlog: 0, score: 64 },
  { accountId: "712020:6d59d4a8-0137-4ef2-bfc9-71020a386892", name: "Sree Medapureddi", done: 5, inProgress: 1, backlog: 0, score: 52 },
  { accountId: "712020:1beabb0c-6447-4e64-af16-6e643fd6d828", name: "Nayanshree Gupta", done: 2, inProgress: 2, backlog: 0, score: 24 },
  { accountId: "712020:e176a500-b329-42d4-ab45-295db01b4238", name: "Muskan Kadam", done: 2, inProgress: 0, backlog: 1, score: 20 },
  { accountId: "62eb63c8ec6b328032f1b8ec", name: "Narendra Paidipati", done: 0, inProgress: 0, backlog: 8, score: 0 },
  { accountId: "712020:27e2f083-0158-4402-b0bb-47972d2faf1f", name: "Meenu Chauhan", done: 0, inProgress: 0, backlog: 0, score: 0 },
  { accountId: "5e96e91a7a06740c103b4f94", name: "Prashant Choudhary", done: 0, inProgress: 0, backlog: 0, score: 0 },
  { accountId: "712020:bbecfa2a-057c-42c4-b4ff-c2801b1243fd", name: "Kaustubh Gharat", done: 0, inProgress: 0, backlog: 0, score: 0 },
  { accountId: "712020:14b1b096-c0be-482f-a340-09f298916e5a", name: "Amiya Chaturvedi", done: 0, inProgress: 0, backlog: 0, score: 0 },
  { accountId: "712020:64b2f104-8704-4e3b-ab16-67a595eca0ff", name: "Vishal Lokare", done: 0, inProgress: 0, backlog: 1, score: 0 },
  { accountId: "629da9f69248fe006910af34", name: "George Karian", done: 0, inProgress: 0, backlog: 0, score: 0 },
];

export const unassignedOpen: { totalCount: number; listTruncatedTo: number; items: UnassignedItem[] } = {
  totalCount: 1028,
  listTruncatedTo: 15,
  items: [
    { key: "UE-5026", summary: "\"Scheduled Deployed\" is very confusing text in the publishing queue filters", status: "To Do", project: "UE", created: "2020-08-20T14:38:03.495-0700", webUrl: "https://contentstack.atlassian.net/browse/UE-5026" },
    { key: "UT-190", summary: "UX", status: "To Do", project: "UT", created: "2020-10-26T18:27:38.301-0700", webUrl: "https://contentstack.atlassian.net/browse/UT-190" },
    { key: "UT-191", summary: "UI", status: "To Do", project: "UT", created: "2020-10-26T18:27:46.197-0700", webUrl: "https://contentstack.atlassian.net/browse/UT-191" },
    { key: "UT-189", summary: "UX Empty state Landing page", status: "To Do", project: "UT", created: "2020-12-01T16:52:21.079-0800", webUrl: "https://contentstack.atlassian.net/browse/UT-189" },
    { key: "UE-2198", summary: "Able to Publish Entries with Empty Mandatory Fields in Global Fields set to Multiple", status: "To Do", project: "UE", created: "2021-01-20T02:12:58.266-0800", webUrl: "https://contentstack.atlassian.net/browse/UE-2198" },
    { key: "UT-6", summary: "Update Org Nav to reflect new \"Content\" menu item", status: "To Do", project: "UT", created: "2022-06-29T22:20:07.784-0700", webUrl: "https://contentstack.atlassian.net/browse/UT-6" },
    { key: "UE-3047", summary: "Ability to sort more columns on the entry list page.", status: "To Do", project: "UE", created: "2022-07-12T13:12:55.597-0700", webUrl: "https://contentstack.atlassian.net/browse/UE-3047" },
    { key: "UT-54", summary: "Entry editor integration/unit tests", status: "In Progress", project: "UT", created: "2022-07-19T05:54:05.911-0700", webUrl: "https://contentstack.atlassian.net/browse/UT-54" },
    { key: "UT-61", summary: "Venus UI | Drag and drop the components", status: "To Do", project: "UT", created: "2022-07-19T09:41:34.466-0700", webUrl: "https://contentstack.atlassian.net/browse/UT-61" },
    { key: "UT-9", summary: "[Usersnap] Need to be able to set more advanced validations on reference fields", status: "To Do", project: "UT", created: "2022-08-04T02:42:07.722-0700", webUrl: "https://contentstack.atlassian.net/browse/UT-9" },
    { key: "UE-213", summary: "Add test cases", status: "To Do", project: "UE", created: "2022-09-27T02:26:19.696-0700", webUrl: "https://contentstack.atlassian.net/browse/UE-213" },
    { key: "UE-206", summary: "Branches - Branch Scope disappears when switching between separate branches.", status: "To Do", project: "UE", created: "2022-10-11T11:02:45.585-0700", webUrl: "https://contentstack.atlassian.net/browse/UE-206" },
    { key: "UE-221", summary: "Venus Components do not work for NextJS projects", status: "To Do", project: "UE", created: "2022-10-17T00:05:08.548-0700", webUrl: "https://contentstack.atlassian.net/browse/UE-221" },
    { key: "UE-390", summary: "English-US shows as master language even stack create with different locale as master locale", status: "To Do", project: "UE", created: "2022-10-27T23:50:31.258-0700", webUrl: "https://contentstack.atlassian.net/browse/UE-390" },
    { key: "UT-48", summary: "UX Feedback for Entry List Enhancements", status: "To Do", project: "UT", created: "2022-11-02T03:24:51.412-0700", webUrl: "https://contentstack.atlassian.net/browse/UT-48" },
  ],
};

export const staleTickets20d: { totalCount: number; listTruncatedTo: number; items: StaleItem[] } = {
  totalCount: 1602,
  listTruncatedTo: 15,
  items: [
    { key: "UE-205", summary: "[Usersnap] In the RTE, I can't drag my cursor to highlight/select multiple characters", status: "To Do", project: "UE", created: "2021-07-20T07:42:05.771-0700", assigneeName: "Harshal Patel", webUrl: "https://contentstack.atlassian.net/browse/UE-205" },
    { key: "UE-171", summary: "Builder - Functional + UX bug fixes", status: "To Do", project: "UE", created: "2021-07-22T06:57:58.086-0700", assigneeName: "Gaurav Nirmal", webUrl: "https://contentstack.atlassian.net/browse/UE-171" },
    { key: "UT-74", summary: "[Usersnap] published does not work, I am trying to re-order menu items but an error occurs", status: "To Do", project: "UT", created: "2021-07-27T05:24:46.866-0700", assigneeName: "Harshal Patel", webUrl: "https://contentstack.atlassian.net/browse/UT-74" },
    { key: "UE-203", summary: "Assets: Assets list page, after selecting assets if, clicked on un-select option it selects all the assets.", status: "To Do", project: "UE", created: "2021-08-03T04:33:14.672-0700", assigneeName: "Rohan Naik", webUrl: "https://contentstack.atlassian.net/browse/UE-203" },
    { key: "UT-79", summary: "Change the release button text \"Deploy\"", status: "To Do", project: "UT", created: "2021-10-26T02:40:53.993-0700", assigneeName: "Sinal Pereira", webUrl: "https://contentstack.atlassian.net/browse/UT-79" },
    { key: "UE-169", summary: "Table min height and height override issue", status: "To Do", project: "UE", created: "2022-03-28T07:48:52.315-0700", assigneeName: "Amrendra Upadhyay", webUrl: "https://contentstack.atlassian.net/browse/UE-169" },
    { key: "UE-195", summary: "Stacks: While updating the stack name it is not reflected immediately on the active stack dropdown.", status: "To Do", project: "UE", created: "2022-04-05T23:21:57.444-0700", assigneeName: "Rutuja Patil", webUrl: "https://contentstack.atlassian.net/browse/UE-195" },
    { key: "UT-4", summary: "Add a \"singleton\" indicator on Select Content Type entry create modal", status: "To Do", project: "UT", created: "2022-04-07T00:42:11.372-0700", assigneeName: "Unassigned", webUrl: "https://contentstack.atlassian.net/browse/UT-4" },
    { key: "UE-5027", summary: "Image replacement for individual entry effecting inherited field references", status: "To Do", project: "UE", created: "2022-04-11T13:32:41.547-0700", assigneeName: "Unassigned", webUrl: "https://contentstack.atlassian.net/browse/UE-5027" },
    { key: "UT-29", summary: "Add an in-app push notification for the What's New section", status: "To Do", project: "UT", created: "2022-04-13T20:34:43.622-0700", assigneeName: "Unassigned", webUrl: "https://contentstack.atlassian.net/browse/UT-29" },
    { key: "UT-43", summary: "push notification for what's new", status: "In Progress", project: "UT", created: "2022-04-13T20:37:56.878-0700", assigneeName: "Raviraj Samant", webUrl: "https://contentstack.atlassian.net/browse/UT-43" },
    { key: "UT-24", summary: "Language Dropdown in Entry Editor needs Search", status: "To Do", project: "UT", created: "2022-04-26T14:00:44.730-0700", assigneeName: "Unassigned", webUrl: "https://contentstack.atlassian.net/browse/UT-24" },
    { key: "UE-268", summary: "Optimise images and SVG", status: "In Progress", project: "UE", created: "2022-04-28T01:25:12.237-0700", assigneeName: "Deepak Bulani", webUrl: "https://contentstack.atlassian.net/browse/UE-268" },
    { key: "UE-270", summary: "Import only specific component from Venus Components", status: "Review", project: "UE", created: "2022-04-28T01:31:42.960-0700", assigneeName: "Vivek Mengu", webUrl: "https://contentstack.atlassian.net/browse/UE-270" },
    { key: "UT-38", summary: "On the entries page, indicate when there are more columns off to the right of the screen", status: "To Do", project: "UT", created: "2022-04-29T12:53:13.870-0700", assigneeName: "Unassigned", webUrl: "https://contentstack.atlassian.net/browse/UT-38" },
  ],
};

export const reopenedTickets: { totalCount: number; items: ReopenedItem[] } = {
  totalCount: 7,
  items: [
    {
      key: "UE-5142",
      summary: "Error indication remains as it is even when we try to correct the start date and end date",
      project: "UE",
      status: "To Do",
      inferredReason: "Archived as a duplicate linked to an existing production issue, but its current status is back at To Do with no comment explaining the reopening.",
      classification: "unclear",
      webUrl: "https://contentstack.atlassian.net/browse/UE-5142",
    },
    {
      key: "UE-5104",
      summary: "If the system time zone is Australia/Adelaide, then we don't have option to select the timezone in the app",
      project: "UE",
      status: "To Do",
      inferredReason: "Like its sibling tickets, archived as a duplicate of an existing production issue, but sits at To Do again with no comment explaining the reopening.",
      classification: "unclear",
      webUrl: "https://contentstack.atlassian.net/browse/UE-5104",
    },
    {
      key: "UE-5102",
      summary: "UI - In CT builder, search time zone text field cuts when the drop down is clicked",
      project: "UE",
      status: "To Do",
      inferredReason: "Confirmed as reproducible in production, then archived as linked to an existing prod-issue ticket, yet currently sitting at To Do again with no comment explaining the transition back.",
      classification: "unclear",
      webUrl: "https://contentstack.atlassian.net/browse/UE-5102",
    },
    {
      key: "UE-3312",
      summary: "UI: The UI crashes when the user clicks the browser's Back button.",
      project: "UE",
      status: "Reopened",
      inferredReason: "Confirmed as reproducible on production and moved to the correct board — reopened because the underlying crash was verified as a genuine, still-present defect.",
      classification: "bug/defect",
      webUrl: "https://contentstack.atlassian.net/browse/UE-3312",
    },
    {
      key: "UE-3140",
      summary: "Allow Save (version increment) only when data is modified",
      project: "UE",
      status: "Reopened",
      inferredReason: "Effectively closed against an upcoming 'Auto Draft' feature for entries, but reopened after the customer clarified they needed the same behavior for Assets, which the original fix didn't cover.",
      classification: "design/scope change",
      webUrl: "https://contentstack.atlassian.net/browse/UE-3140",
    },
    {
      key: "UE-1954",
      summary: "Tahzoo: Revisit the publishing screen",
      project: "UE",
      status: "In Progress",
      inferredReason: "Marked done once the design/UX proposal was finished, but reopened after the team confirmed the change hadn't actually shipped to production yet.",
      classification: "unclear",
      webUrl: "https://contentstack.atlassian.net/browse/UE-1954",
    },
    {
      key: "PXD-171",
      summary: "Design Review",
      project: "PXD",
      status: "On Hold",
      inferredReason: "No description or comments exist on this ticket, so there's no basis to infer why it left a Done-family status.",
      classification: "unclear",
      webUrl: "https://contentstack.atlassian.net/browse/PXD-171",
    },
  ],
};
