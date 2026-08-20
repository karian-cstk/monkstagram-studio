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

export type AgeBucket = { label: string; count: number };
export type ProjectCount = { project: string; count: number };

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

export type OngoingItem = {
  key: string;
  summary: string;
  status: string;
  assignee: string;
  project: string;
  webUrl: string;
};

export const dashboardAsOf = "2026-08-19";

// "Ongoing" = currently active work, same corrected bucketing as
// everywhere else: JQL `((statusCategory = "In Progress" AND status !=
// "On Hold") OR status = "Selected for Development")`, across PD/UT/UE/PXD,
// any assignee (not just the 12 tracked designers — this is "what's
// currently moving on these boards," matching the unassigned/stale
// widgets' scope). Verified count: 155.
export const ongoingTickets: OngoingItem[] = [
  { key: "PXD-122", summary: "Top Nav - New layout for Developer Hub and Marketplace", status: "Review", assignee: "Raviraj Samant", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-122" },
  { key: "PXD-130", summary: "Explore possibility of flexing the layout for wider screen", status: "Selected for Development", assignee: "Prashant Choudhary", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-130" },
  { key: "PXD-167", summary: "Guide based App", status: "In Progress", assignee: "narendra.paidipati", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-167" },
  { key: "PXD-168", summary: "Design and build the dashboard widget UI", status: "Review", assignee: "Raviraj Samant", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-168" },
  { key: "PXD-235", summary: "Sorting throughout the Contenstack UI is inconsistent", status: "Review", assignee: "Raviraj Samant", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-235" },
  { key: "PXD-236", summary: "Stack Organization Update", status: "In Progress", assignee: "Amiya Chaturvedi", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-236" },
  { key: "PXD-237", summary: "Bulk Operations", status: "In Progress", assignee: "Amiya Chaturvedi", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-237" },
  { key: "PXD-238", summary: "Update Information Pills on Content Models page", status: "In Progress", assignee: "Amiya Chaturvedi", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-238" },
  { key: "PXD-253", summary: "Asset Level Sharing", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-253" },
  { key: "PXD-256", summary: "Asset Validation - File Size and Dimension", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-256" },
  { key: "PXD-258", summary: "Workflows", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-258" },
  { key: "PXD-259", summary: "Field Workspace References", status: "In Progress", assignee: "nayanshree.gupta", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-259" },
  { key: "PXD-260", summary: "Product Level Analytics", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-260" },
  { key: "PXD-262", summary: "Use Assets in other providers", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-262" },
  { key: "PXD-283", summary: "Updates on Analytics", status: "Review", assignee: "narendra.paidipati", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-283" },
  { key: "PXD-291", summary: "Improved URL Management", status: "Review", assignee: "Raviraj Samant", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-291" },
  { key: "PXD-327", summary: "Plan setting - Org admin", status: "In Progress", assignee: "srinivas.erupothu", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-327" },
  { key: "PXD-329", summary: "Self-Service", status: "In Progress", assignee: "narendra.paidipati", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-329" },
  { key: "PXD-330", summary: "Signup", status: "Review", assignee: "narendra.paidipati", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-330" },
  { key: "PXD-331", summary: "Email Verification", status: "In Progress", assignee: "narendra.paidipati", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-331" },
  { key: "PXD-332", summary: "Login", status: "In Progress", assignee: "narendra.paidipati", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-332" },
  { key: "PXD-333", summary: "Forgot Password", status: "In Progress", assignee: "narendra.paidipati", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-333" },
  { key: "PXD-334", summary: "Reset Password", status: "In Progress", assignee: "narendra.paidipati", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-334" },
  { key: "PXD-335", summary: "ACCEPT INVITE", status: "In Progress", assignee: "narendra.paidipati", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-335" },
  { key: "PXD-336", summary: "Profile Setup", status: "In Progress", assignee: "narendra.paidipati", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-336" },
  { key: "PXD-337", summary: "Create First Stack", status: "In Progress", assignee: "srinivas.erupothu", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-337" },
  { key: "PXD-347", summary: "Billing Dashboard", status: "In Progress", assignee: "srinivas.erupothu", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-347" },
  { key: "PXD-381", summary: "Dropdown for Top nav in Argus.", status: "In Progress", assignee: "srinivas.erupothu", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-381" },
  { key: "PXD-383", summary: "Enhance Execution Logs UI with Retry Capability, Path Support, and Code Visualization Improvements", status: "Selected for Development", assignee: "Vishal Lokare", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-383" },
  { key: "PXD-384", summary: "Implement Retry Action for Failed Executions in Logs", status: "In Progress", assignee: "Unassigned", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-384" },
  { key: "PXD-385", summary: "Visualize Conditional and Repeat Paths in Execution Logs", status: "In Progress", assignee: "Unassigned", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-385" },
  { key: "PXD-386", summary: "Refactor Input/Output Sections for Persistent Visibility and add distinct input/output icons to each section", status: "In Progress", assignee: "Unassigned", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-386" },
  { key: "PXD-387", summary: "Define UX for RBAC Framework in Agent OS (Product-Level Roles & Permissions)", status: "In Progress", assignee: "Vishal Lokare", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-387" },
  { key: "PXD-392", summary: "Additional onboarding tip: Create a sample asset that showcases DAM capabilities for AM1.0 users.", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-392" },
  { key: "PXD-4", summary: "RTE: Embedded assets within RTE should auto-update", status: "Selected for Development", assignee: "Prashant Choudhary", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-4" },
  { key: "PXD-430", summary: "Notifications for Launch<->CDP", status: "In Progress", assignee: "Meenu Chauhan", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-430" },
  { key: "PXD-432", summary: "Remove folder prioritization from search results and default tables", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-432" },
  { key: "PXD-458", summary: "Changes to Move Modal", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-458" },
  { key: "PXD-464", summary: "Bulk Field Level Update", status: "Review", assignee: "Amiya Chaturvedi", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-464" },
  { key: "PXD-465", summary: "Bulk Cloning", status: "In Progress", assignee: "Amiya Chaturvedi", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-465" },
  { key: "PXD-469", summary: "Changes to AI Settings - Include Tag and Alt Text Global Settings", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-469" },
  { key: "PXD-471", summary: "New Components in Storybook", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-471" },
  { key: "PXD-472", summary: "Select Component", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-472" },
  { key: "PXD-473", summary: "Button Component", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-473" },
  { key: "PXD-474", summary: "Checkbox Component", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-474" },
  { key: "PXD-475", summary: "Hyperlink Component", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-475" },
  { key: "PXD-476", summary: "Input Field Component", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-476" },
  { key: "PXD-477", summary: "Radio Button Component", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-477" },
  { key: "PXD-478", summary: "Scrollbar Component", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-478" },
  { key: "PXD-479", summary: "Slider Component", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-479" },
  { key: "PXD-480", summary: "Text Area Component", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-480" },
  { key: "PXD-482", summary: "Space Card", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-482" },
  { key: "PXD-490", summary: "Background handling for image asset previews - PNG, SVG, GIF, and Lottie", status: "Review", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-490" },
  { key: "PXD-50", summary: "DAM: Asset Details Page Sidebar Expansion", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-50" },
  { key: "PXD-502", summary: "Image Editor - UX Review (Text/Shape/Image Overlays)", status: "Review", assignee: "nayanshree.gupta", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-502" },
  { key: "PXD-503", summary: "Polaris application final review by Mayank", status: "In Progress", assignee: "Sree Medapureddi", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-503" },
  { key: "PXD-514", summary: "On demand trigger configuration - Review", status: "In Progress", assignee: "Muskan Kadam", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-514" },
  { key: "PXD-515", summary: "Super Admin AI settings", status: "In Progress", assignee: "Muskan Kadam", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-515" },
  { key: "PXD-55", summary: "DAM: Scope Based Search", status: "Selected for Development", assignee: "Vini Dhoka", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-55" },
  { key: "PXD-69", summary: "Automate Trigger Based on Subscription Utilization", status: "Selected for Development", assignee: "Vishal Lokare", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-69" },
  { key: "PXD-71", summary: "Monthly Utilization Webhook", status: "Selected for Development", assignee: "srinivas.erupothu", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-71" },
  { key: "PXD-83", summary: "Improve Un-publishing Modal to Prevent Accidental Master Locale Unpublishing", status: "Selected for Development", assignee: "Prashant Choudhary", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-83" },
  { key: "PXD-86", summary: "Design debt of 'show localised only' task", status: "Selected for Development", assignee: "Kaustubh Gharat", project: "PXD", webUrl: "https://contentstack.atlassian.net/browse/PXD-86" },
  { key: "UE-1001", summary: "Venus component new Bundling", status: "Review", assignee: "Harshal Patel", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1001" },
  { key: "UE-1002", summary: "Building new build per component", status: "In Progress", assignee: "Vivek Mengu", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1002" },
  { key: "UE-1029", summary: "Adding data-test-id for the existing locators", status: "In Progress", assignee: "Mahesh Reddy Chilumula", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1029" },
  { key: "UE-1088", summary: "Update Selenium locators with data-test-id", status: "In Progress", assignee: "Kritika Poojari", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1088" },
  { key: "UE-120", summary: "Feature Flag Brainstrom", status: "Review", assignee: "Vivek Mengu", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-120" },
  { key: "UE-1298", summary: "Some of the items are not truncated in audit log for the title column : Audit Logs", status: "QA", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1298" },
  { key: "UE-1351", summary: "Type change of Table component causing build to fail", status: "Review", assignee: "Manoj Muduli", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1351" },
  { key: "UE-1358", summary: "Updating Storybook 7 in venus components", status: "Review", assignee: "Vivek Mengu", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1358" },
  { key: "UE-1371", summary: "Tooltip UI should be similar to other tooltip as we have three tooltips on Entries list page", status: "QA", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1371" },
  { key: "UE-140", summary: "For Languages only single language filter is getting applied", status: "In Progress", assignee: "Amrendra Upadhyay", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-140" },
  { key: "UE-1414", summary: "Edit Entry: Is there any meaning for focus below icons. And also extra padding is there.", status: "QA", assignee: "Sagar Kamble", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1414" },
  { key: "UE-1417", summary: "In Publish Queue module, under the bulk section, async loader is always seen and doesn't go away in the title column.", status: "QA", assignee: "Sinal Pereira", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1417" },
  { key: "UE-1420", summary: "No result found Message should come in Publish Queue Environment search. Same issue exists on language field.", status: "QA", assignee: "Sinal Pereira", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1420" },
  { key: "UE-1454", summary: "Locators For ContentType List Page", status: "In Progress", assignee: "Ranjita Nayak", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1454" },
  { key: "UE-1456", summary: "Locators For Content Type Builder Page", status: "In Progress", assignee: "Ranjita Nayak", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1456" },
  { key: "UE-1506", summary: "Integrate Semantic release for new build", status: "Review", assignee: "Vivek Mengu", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1506" },
  { key: "UE-1507", summary: "Create Doc for reference of this ticket", status: "Review", assignee: "Vivek Mengu", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1507" },
  { key: "UE-1508", summary: "Create separate build command for individual component", status: "Review", assignee: "Vivek Mengu", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1508" },
  { key: "UE-1621", summary: "QA Task: UI Single stage sanity Task", status: "In Progress", assignee: "Ranjita Nayak", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1621" },
  { key: "UE-1778", summary: "Bulk Action Panel disappears when closing unpublish modal on entry list page", status: "In Progress", assignee: "Abhijit Turate", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1778" },
  { key: "UE-1780", summary: "Bug bash (August 2023)", status: "QA", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1780" },
  { key: "UE-1781", summary: "Asset details & entry edit footer CTAs needs to be updated with v2 design.", status: "QA", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1781" },
  { key: "UE-1782", summary: "Skeleton loader needs to be updated for Asset Detail page", status: "QA", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1782" },
  { key: "UE-1789", summary: "Modular block break when we click on new blocks", status: "QA", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1789" },
  { key: "UE-1790", summary: "The text is not truncated and chopped off on asset detail page", status: "QA", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1790" },
  { key: "UE-1791", summary: "asset detail page, if we replace image and save the asset, the abort cta on the image, icon is not present for that cta", status: "QA", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1791" },
  { key: "UE-1792", summary: "Size of help icon in header looks too tiny as compared to title and rest other icons, causes misalignment.", status: "QA", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1792" },
  { key: "UE-1820", summary: "Entry List: New Entry Modal", status: "QA", assignee: "Sinal Pereira", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1820" },
  { key: "UE-1829", summary: "Final review signoff from ux for each the modules of content manager persona", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1829" },
  { key: "UE-1850", summary: "Environments: Environment's URL see more modal should have footer with cancel button.", status: "QA", assignee: "Sinal Pereira", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1850" },
  { key: "UE-1851", summary: "Environments: Environment's URL see more modal should have footer with cancel button.", status: "QA", assignee: "Sinal Pereira", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1851" },
  { key: "UE-1852", summary: "Entry list: Buttons under publish modal is not of new version like of unpublish modal", status: "QA", assignee: "Sinal Pereira", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1852" },
  { key: "UE-1859", summary: "Add test cases", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1859" },
  { key: "UE-1867", summary: "Languages: Spacing issue", status: "QA", assignee: "Sinal Pereira", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1867" },
  { key: "UE-1876", summary: "The field instance can not be deleted if the field limit is exceeded", status: "QA", assignee: "Rohan Naik", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1876" },
  { key: "UE-1921", summary: "Css issue on compare version screen", status: "QA", assignee: "Mahesh Reddy Chilumula", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1921" },
  { key: "UE-1925", summary: "Assets were getting saved though the char limit for title and description exceeded", status: "Review", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1925" },
  { key: "UE-1954", summary: "Tahzoo: Revisit the publishing screen", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-1954" },
  { key: "UE-2141", summary: "Optimize and Stabilize Full UI Sanity", status: "In Progress", assignee: "Harshal Patel", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2141" },
  { key: "UE-2368", summary: "Multiple data test id is displayed for CS logo.", status: "QA", assignee: "Kritika Poojari", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2368" },
  { key: "UE-2461", summary: "CONTENT TYPES - Data test id missing for name, description, type on content type list page.", status: "QA", assignee: "Kritika Poojari", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2461" },
  { key: "UE-247", summary: "Reduce the time to run unit tests in pipeline", status: "Review", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-247" },
  { key: "UE-2675", summary: "Data test id naming convention for bulk publish header is not as per standard practice.", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2675" },
  { key: "UE-2676", summary: "Data test id naming convention for publish references expand and collapse is not as per standard practice.", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2676" },
  { key: "UE-2679", summary: "Data test id naming convention for publish references language carousel is not as per standard practice.", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2679" },
  { key: "UE-268", summary: "Optimise images and SVG", status: "In Progress", assignee: "deepak bulani", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-268" },
  { key: "UE-270", summary: "Import only specific component from Venus Components", status: "Review", assignee: "Vivek Mengu", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-270" },
  { key: "UE-271", summary: "Remove build from the component path while importing", status: "Review", assignee: "Vivek Mengu", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-271" },
  { key: "UE-272", summary: "Icon component refactor", status: "Review", assignee: "Vivek Mengu", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-272" },
  { key: "UE-273", summary: "Replace Icon2 to Icon and Remove Icon Component", status: "Review", assignee: "Vivek Mengu", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-273" },
  { key: "UE-2730", summary: "The non-localize option is not present in the advanced settings of the File-Field.", status: "QA", assignee: "Kritika Poojari", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2730" },
  { key: "UE-2731", summary: "The text entered in the \"Allow images type\" input box disappears after saving the entry.", status: "QA", assignee: "Mahesh Reddy Chilumula", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2731" },
  { key: "UE-2732", summary: "The functionality of the \"Add choices\" button is not working as expected.", status: "QA", assignee: "Rohan Naik", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2732" },
  { key: "UE-2789", summary: "not getting fieldtypeselector under the modularblock having global field with modular block in it", status: "QA", assignee: "Meenakshi V", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2789" },
  { key: "UE-2790", summary: "Data test id missing for branch name on list page.", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2790" },
  { key: "UE-2810", summary: "Data test id missing for taxonomy menu on stack settings page.", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2810" },
  { key: "UE-2811", summary: "Data test id missing for taxonomy kebab menu list (edit, delete, copy).", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2811" },
  { key: "UE-2812", summary: "Data test id for delete taxonomy input box is not according to the standard practice.", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2812" },
  { key: "UE-2813", summary: "Data test id is missing for delete button on Delete modal for taxonomy.", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2813" },
  { key: "UE-2814", summary: "Data test id is missing for taxonomy list.", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2814" },
  { key: "UE-2883", summary: "UX Design | Sprint to 100", status: "In Progress", assignee: "Harshal Patel", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2883" },
  { key: "UE-2905", summary: "venus component integrity verification, deploy on dev-public and venus-public", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-2905" },
  { key: "UE-3279", summary: "Variant | Compare version", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-3279" },
  { key: "UE-3578", summary: "UI Enhancements: FY25Q3", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-3578" },
  { key: "UE-3778", summary: "Workflow Stag title not visible in audit log for variant entry workflow stag update", status: "QA", assignee: "Sagar Kamble", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-3778" },
  { key: "UE-3797", summary: "Incorrect Data Displayed After Selecting 'Base Entry' in the LHS of Compare Version for Variant Entry", status: "QA", assignee: "Sagar Kamble", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-3797" },
  { key: "UE-3804", summary: "Variants Changes | GA", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-3804" },
  { key: "UE-3861", summary: "Variants GA (UI)", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-3861" },
  { key: "UE-3862", summary: "Customer Bugs FY25Q4", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-3862" },
  { key: "UE-3878", summary: "[Dev2] Columns are not displaying the required data.", status: "QA", assignee: "Kritika Poojari", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-3878" },
  { key: "UE-3963", summary: "UI: When opening entries from the \"Publish Queue,\" the ${contentTypeUid} should not appear in the \"Save Views\" button", status: "In Progress", assignee: "Sagar Kamble", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-3963" },
  { key: "UE-400", summary: "Publish Queue not showing entries which are Bulk Published when system time is set after 12AM", status: "In Progress", assignee: "Sagar Kamble", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-400" },
  { key: "UE-4071", summary: "Make entry editor more intuitive (esp for read-only pages)", status: "Review", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-4071" },
  { key: "UE-4462", summary: "Combined onboarding for Nested Global Fields AND Non-localizable fields within MB & Group Multiple", status: "In Progress", assignee: "Harshal Patel", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-4462" },
  { key: "UE-4623", summary: "UI Tech Debt FY26Q2", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-4623" },
  { key: "UE-4727", summary: "UX improvements for URL field", status: "Review", assignee: "Raviraj Samant", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-4727" },
  { key: "UE-4735", summary: "Field Visibilty Rules Support for all fields.", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-4735" },
  { key: "UE-5532", summary: "'Product ID' Field Value Not Displaying in Entry Editor UI", status: "Awaiting CSE Input", assignee: "Ashwini Rathod", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-5532" },
  { key: "UE-5767", summary: "Widespread UI Issues: Blank screens, slow responses, and intermittent \"Something went wrong\" errors across Administration and Entries screens", status: "Review", assignee: "Kunal Sharma", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-5767" },
  { key: "UE-577", summary: "UI : Vertical Scroll bar is hidden in Webhook Logs Page", status: "QA", assignee: "Rohan Naik", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-577" },
  { key: "UE-789", summary: "Design System 2.0", status: "In Progress", assignee: "Harshal Patel", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-789" },
  { key: "UE-791", summary: "Accessibility 2.0", status: "In Progress", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-791" },
  { key: "UE-897", summary: "Table 2.0", status: "In Progress", assignee: "renuka.reddy", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-897" },
  { key: "UE-905", summary: "No able to select Date in Date Field", status: "QA", assignee: "Sagar Kamble", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-905" },
  { key: "UE-963", summary: "UI Packages upgrade Q2", status: "In Progress", assignee: "renuka.reddy", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-963" },
  { key: "UE-964", summary: "venus components build for individual components", status: "Review", assignee: "Unassigned", project: "UE", webUrl: "https://contentstack.atlassian.net/browse/UE-964" },
  { key: "UT-151", summary: "OAuth + Permissions Updates - Marketplace UX Changes", status: "In Progress", assignee: "Raviraj Samant", project: "UT", webUrl: "https://contentstack.atlassian.net/browse/UT-151" },
  { key: "UT-188", summary: "UX Automations Landing Page", status: "In Progress", assignee: "George Dcruz", project: "UT", webUrl: "https://contentstack.atlassian.net/browse/UT-188" },
  { key: "UT-43", summary: "push notification for what's new", status: "In Progress", assignee: "Raviraj Samant", project: "UT", webUrl: "https://contentstack.atlassian.net/browse/UT-43" },
  { key: "UT-54", summary: "Entry editor integration/unit tests", status: "In Progress", assignee: "Unassigned", project: "UT", webUrl: "https://contentstack.atlassian.net/browse/UT-54" },
  { key: "UT-55", summary: "Add test cases for Entry page", status: "In Progress", assignee: "Vivek Mengu", project: "UT", webUrl: "https://contentstack.atlassian.net/browse/UT-55" },
  { key: "UT-57", summary: "TestCases: Publish UnPublish Modal", status: "Design/Eng Review", assignee: "Vivek Mengu", project: "UT", webUrl: "https://contentstack.atlassian.net/browse/UT-57" },
];

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

export const unassignedByProject: ProjectCount[] = [
  { project: "PD", count: 4 },
  { project: "UT", count: 34 },
  { project: "UE", count: 952 },
  { project: "PXD", count: 38 },
];

export const staleAgeBuckets: AgeBucket[] = [
  { label: "20-90d", count: 29 },
  { label: "90-180d", count: 81 },
  { label: "180d-1yr", count: 130 },
  { label: "1-2yr", count: 263 },
  { label: "2yr+", count: 1099 },
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
