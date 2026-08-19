export type IconEntry = {
  name: string;
  slug: string;
  category: string;
  path: string; // public path, e.g. "/icons/entry-fields/text.svg"
};

// Real icons exported from the Venus 2.1 RF Figma file (Icon Library page).
// This covers the small categories approved for immediate publish; the six
// large categories (Flags, Actions, Set-2,3, Text Editor, Files and
// Documents, Arrows — 686 icons) are handled separately in icons-extended.ts.
export const iconsCore: IconEntry[] = [
  // Entry Fields
  { name: "Global", slug: "global", category: "Entry Fields", path: "/icons/entry-fields/global.svg" },
  { name: "Single Line Textbox", slug: "single-line-textbox", category: "Entry Fields", path: "/icons/entry-fields/single-line-textbox.svg" },
  { name: "Markdown", slug: "markdown", category: "Entry Fields", path: "/icons/entry-fields/markdown.svg" },
  { name: "Boolean", slug: "boolean", category: "Entry Fields", path: "/icons/entry-fields/boolean.svg" },
  { name: "Reference", slug: "reference", category: "Entry Fields", path: "/icons/entry-fields/reference.svg" },
  { name: "Multiline Textbox", slug: "multiline-textbox", category: "Entry Fields", path: "/icons/entry-fields/multiline-textbox.svg" },
  { name: "Select", slug: "select", category: "Entry Fields", path: "/icons/entry-fields/select.svg" },
  { name: "Date", slug: "date", category: "Entry Fields", path: "/icons/entry-fields/date.svg" },
  { name: "Group", slug: "group", category: "Entry Fields", path: "/icons/entry-fields/group.svg" },
  { name: "Rich Text Editor", slug: "rich-text-editor", category: "Entry Fields", path: "/icons/entry-fields/rich-text-editor.svg" },
  { name: "JSON Rich Text Editor", slug: "json-rich-text-editor", category: "Entry Fields", path: "/icons/entry-fields/json-rich-text-editor.svg" },
  { name: "Modular Blocks", slug: "modular-blocks", category: "Entry Fields", path: "/icons/entry-fields/modular-blocks.svg" },
  { name: "File", slug: "file", category: "Entry Fields", path: "/icons/entry-fields/file.svg" },
  { name: "Custom", slug: "custom", category: "Entry Fields", path: "/icons/entry-fields/custom.svg" },
  { name: "Number", slug: "number", category: "Entry Fields", path: "/icons/entry-fields/number.svg" },
  { name: "URL", slug: "url", category: "Entry Fields", path: "/icons/entry-fields/url.svg" },
  { name: "Link", slug: "link", category: "Entry Fields", path: "/icons/entry-fields/link.svg" },
  { name: "Experience Container", slug: "experience-container", category: "Entry Fields", path: "/icons/entry-fields/experience-container.svg" },
  { name: "Single Content Type", slug: "single-content-type", category: "Entry Fields", path: "/icons/entry-fields/single-content-type.svg" },
  { name: "Multi Content Type", slug: "multi-content-type", category: "Entry Fields", path: "/icons/entry-fields/multi-content-type.svg" },

  // Developer
  { name: "Git", slug: "git", category: "Developer", path: "/icons/developer/git.svg" },
  { name: "Commit", slug: "commit", category: "Developer", path: "/icons/developer/commit.svg" },
  { name: "GitFork", slug: "git-fork", category: "Developer", path: "/icons/developer/git-fork.svg" },
  { name: "Code", slug: "code", category: "Developer", path: "/icons/developer/code.svg" },
  { name: "gitlab", slug: "gitlab", category: "Developer", path: "/icons/developer/gitlab.svg" },
  { name: "Terminal", slug: "terminal", category: "Developer", path: "/icons/developer/terminal.svg" },
  { name: "CodeSecondary", slug: "code-secondary", category: "Developer", path: "/icons/developer/code-secondary.svg" },
  { name: "git-branch", slug: "git-branch", category: "Developer", path: "/icons/developer/git-branch.svg" },
  { name: "github", slug: "github", category: "Developer", path: "/icons/developer/github.svg" },
  { name: "database", slug: "database", category: "Developer", path: "/icons/developer/database.svg" },
  { name: "Domain", slug: "domain", category: "Developer", path: "/icons/developer/domain.svg" },
  { name: "Resend invitation", slug: "resend-invitation", category: "Developer", path: "/icons/developer/resend-invitation.svg" },
  { name: "Save", slug: "save", category: "Developer", path: "/icons/developer/save.svg" },
  { name: "Environments", slug: "environments", category: "Developer", path: "/icons/developer/environments.svg" },
  { name: "Deployment History", slug: "deployment-history", category: "Developer", path: "/icons/developer/deployment-history.svg" },
  { name: "Upload", slug: "upload", category: "Developer", path: "/icons/developer/upload.svg" },
  { name: "View Details", slug: "view-details", category: "Developer", path: "/icons/developer/view-details.svg" },
  { name: "Open URL", slug: "open-url", category: "Developer", path: "/icons/developer/open-url.svg" },
  { name: "HTML", slug: "html", category: "Developer", path: "/icons/developer/html.svg" },
  { name: "Bit Bucket", slug: "bit-bucket", category: "Developer", path: "/icons/developer/bit-bucket.svg" },

  // Media
  { name: "Pause", slug: "pause", category: "Media", path: "/icons/media/pause.svg" },
  { name: "Play", slug: "play", category: "Media", path: "/icons/media/play.svg" },
  { name: "Forward", slug: "forward", category: "Media", path: "/icons/media/forward.svg" },
  { name: "Backward", slug: "backward", category: "Media", path: "/icons/media/backward.svg" },
  { name: "Mute", slug: "mute", category: "Media", path: "/icons/media/mute.svg" },
  { name: "Volume ON", slug: "volume-on", category: "Media", path: "/icons/media/volume-on.svg" },
  { name: "Closed Caption", slug: "closed-caption", category: "Media", path: "/icons/media/closed-caption.svg" },
  { name: "Playback Speed", slug: "playback-speed", category: "Media", path: "/icons/media/playback-speed.svg" },
  { name: "Next", slug: "next", category: "Media", path: "/icons/media/next.svg" },
  { name: "Previous", slug: "previous", category: "Media", path: "/icons/media/previous.svg" },

  // People
  { name: "UserSwitch", slug: "user-switch", category: "People", path: "/icons/people/user-switch.svg" },
  { name: "UsersThree", slug: "users-three", category: "People", path: "/icons/people/users-three.svg" },
  { name: "UsersFour", slug: "users-four", category: "People", path: "/icons/people/users-four.svg" },
  { name: "Users", slug: "users", category: "People", path: "/icons/people/users.svg" },
  { name: "UserPlus", slug: "user-plus", category: "People", path: "/icons/people/user-plus.svg" },
  { name: "UserMinus", slug: "user-minus", category: "People", path: "/icons/people/user-minus.svg" },
  { name: "UserList", slug: "user-list", category: "People", path: "/icons/people/user-list.svg" },
  { name: "UserCircle", slug: "user-circle", category: "People", path: "/icons/people/user-circle.svg" },
  { name: "User", slug: "user", category: "People", path: "/icons/people/user.svg" },

  // Alerts (from "Component 2" group)
  { name: "WarningOctagon", slug: "warning-octagon", category: "Alerts", path: "/icons/alerts/warning-octagon.svg" },
  { name: "WarningCircle", slug: "warning-circle", category: "Alerts", path: "/icons/alerts/warning-circle.svg" },
  { name: "informationCircle", slug: "information-circle", category: "Alerts", path: "/icons/alerts/information-circle.svg" },
  { name: "Warning", slug: "warning", category: "Alerts", path: "/icons/alerts/warning.svg" },
  { name: "Prohibit", slug: "prohibit", category: "Alerts", path: "/icons/alerts/prohibit.svg" },
  { name: "CheckCircle", slug: "check-circle", category: "Alerts", path: "/icons/alerts/check-circle.svg" },
  { name: "Close-Border", slug: "close-border", category: "Alerts", path: "/icons/alerts/close-border.svg" },

  // Personalization
  { name: "Events", slug: "events", category: "Personalization", path: "/icons/personalization/events.svg" },
  { name: "Audiences", slug: "audiences", category: "Personalization", path: "/icons/personalization/audiences.svg" },
  { name: "Experiences", slug: "experiences", category: "Personalization", path: "/icons/personalization/experiences.svg" },
  { name: "Attributes", slug: "attributes", category: "Personalization", path: "/icons/personalization/attributes.svg" },
  { name: "Segment Experience", slug: "segment-experience", category: "Personalization", path: "/icons/personalization/segment-experience.svg" },
  { name: "A/B Testing", slug: "ab-testing", category: "Personalization", path: "/icons/personalization/ab-testing.svg" },

  // Chevron
  { name: "Chevron Down", slug: "chevron-down", category: "Chevron", path: "/icons/chevron/down.svg" },
  { name: "Chevron Right", slug: "chevron-right", category: "Chevron", path: "/icons/chevron/right.svg" },
  { name: "Chevron Left", slug: "chevron-left", category: "Chevron", path: "/icons/chevron/left.svg" },
  { name: "Chevron Up", slug: "chevron-up", category: "Chevron", path: "/icons/chevron/up.svg" },

  // CMS Icons
  { name: "Stacks", slug: "stacks", category: "CMS Icons", path: "/icons/cms-icons/stacks.svg" },
  { name: "Content Model", slug: "content-model", category: "CMS Icons", path: "/icons/cms-icons/content-model.svg" },
  { name: "Entries", slug: "entries", category: "CMS Icons", path: "/icons/cms-icons/entries.svg" },

  // Super Admin
  { name: "Org Admin", slug: "org-admin", category: "Super Admin", path: "/icons/super-admin/org-admin.svg" },

  // Interaction States (default state of hover-enabled personalization icons)
  { name: "Events (state)", slug: "events-state", category: "Interaction States", path: "/icons/interaction-states/events.svg" },
  { name: "Audiences (state)", slug: "audiences-state", category: "Interaction States", path: "/icons/interaction-states/audiences.svg" },
  { name: "Attributes (state)", slug: "attributes-state", category: "Interaction States", path: "/icons/interaction-states/attributes.svg" },
  { name: "Experiences (state)", slug: "experiences-state", category: "Interaction States", path: "/icons/interaction-states/experiences.svg" },

  // Question
  { name: "Question (Text Editor)", slug: "question-text-editor", category: "Question", path: "/icons/question/question-text-editor.svg" },
  { name: "Question (System)", slug: "question-system", category: "Question", path: "/icons/question/question-system.svg" },

  // Standalone icons
  { name: "Add", slug: "add", category: "Standalone", path: "/icons/standalone/add.svg" },
  { name: "lock", slug: "lock", category: "Standalone", path: "/icons/standalone/lock.svg" },
  { name: "Warning", slug: "standalone-warning", category: "Standalone", path: "/icons/standalone/warning.svg" },
  { name: "WarningCircle", slug: "standalone-warning-circle", category: "Standalone", path: "/icons/standalone/warning-circle.svg" },
  { name: "CheckCircle", slug: "standalone-check-circle", category: "Standalone", path: "/icons/standalone/check-circle.svg" },
  { name: "Close-Border", slug: "standalone-close-border", category: "Standalone", path: "/icons/standalone/close-border.svg" },
  { name: "informationCircle", slug: "standalone-information-circle", category: "Standalone", path: "/icons/standalone/information-circle.svg" },
  { name: "Bold Check Mark", slug: "bold-check-mark", category: "Standalone", path: "/icons/standalone/bold-check-mark.svg" },
  { name: "CaretRight", slug: "caret-right", category: "Standalone", path: "/icons/standalone/caret-right.svg" },
  { name: "Caret/down", slug: "caret-down", category: "Standalone", path: "/icons/standalone/caret-down.svg" },
  { name: "Caret/left", slug: "caret-left", category: "Standalone", path: "/icons/standalone/caret-left.svg" },
  { name: "Caret/up", slug: "caret-up", category: "Standalone", path: "/icons/standalone/caret-up.svg" },
  { name: "Field resize", slug: "field-resize", category: "Standalone", path: "/icons/standalone/field-resize.svg" },
  { name: "CaretCircleDown", slug: "caret-circle-down", category: "Standalone", path: "/icons/standalone/caret-circle-down.svg" },
  { name: "CaretCircleUp", slug: "caret-circle-up", category: "Standalone", path: "/icons/standalone/caret-circle-up.svg" },
  { name: "Search", slug: "search", category: "Standalone", path: "/icons/standalone/search.svg" },
  { name: "Preferences", slug: "preferences", category: "Standalone", path: "/icons/standalone/preferences.svg" },
  { name: "CaretCircleLeft", slug: "caret-circle-left", category: "Standalone", path: "/icons/standalone/caret-circle-left.svg" },
  { name: "CaretCircleRight", slug: "caret-circle-right", category: "Standalone", path: "/icons/standalone/caret-circle-right.svg" },
  { name: "Add/block-right-unfilled", slug: "add-block-right-unfilled", category: "Standalone", path: "/icons/standalone/add-block-right-unfilled.svg" },
  { name: "Add/block-right-filled", slug: "add-block-right-filled", category: "Standalone", path: "/icons/standalone/add-block-right-filled.svg" },
  { name: "Add/block-down-filled", slug: "add-block-down-filled", category: "Standalone", path: "/icons/standalone/add-block-down-filled.svg" },
  { name: "DotsSixVertical", slug: "dots-six-vertical", category: "Standalone", path: "/icons/standalone/dots-six-vertical.svg" },
  { name: "DAM / Asset Types", slug: "dam-asset-types", category: "Standalone", path: "/icons/standalone/dam-asset-types.svg" },
  { name: "DAM / Assets", slug: "dam-assets", category: "Standalone", path: "/icons/standalone/dam-assets.svg" },
  { name: "DAM / Fields", slug: "dam-fields", category: "Standalone", path: "/icons/standalone/dam-fields.svg" },
  { name: "DAM / Import Folder from Space", slug: "dam-import-folder-from-space", category: "Standalone", path: "/icons/standalone/dam-import-folder-from-space.svg" },
  { name: "DAM / Import Files from Space", slug: "dam-import-files-from-space", category: "Standalone", path: "/icons/standalone/dam-import-files-from-space.svg" },
  { name: "DAM / Space", slug: "dam-space", category: "Standalone", path: "/icons/standalone/dam-space.svg" },
];
