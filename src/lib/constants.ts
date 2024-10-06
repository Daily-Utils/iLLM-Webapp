import { Connection } from "./types"
import GoogleDrive from "../assets/googleDrive.svg"
import Discord from "../assets/discord.svg"
import Notion from "../assets/notion.svg"
import Slack from "../assets/slack.svg"
import { Archive, LayoutDashboard, Cable, Network, Trash2  } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

export const CONNECTIONS: Connection[] = [
    {
      title: 'Google Drive',
      description: 'Connect your google drive to listen to folder changes',
      image: GoogleDrive,
      connectionKey: 'googleNode',
      alwaysTrue: true,
    },
    {
      title: 'Discord',
      description: 'Connect your discord to send notification and messages',
      image: Discord,
      connectionKey: 'discordNode',
      accessTokenKey: 'webhookURL',
    },
    {
      title: 'Notion',
      description: 'Create entries in your notion dashboard and automate tasks.',
      image: Notion,
      connectionKey: 'notionNode',
      accessTokenKey: 'accessToken',
    },
    {
      title: 'Slack',
      description:
        'Use slack to send notifications to team members through your own custom bot.',
      image: Slack,
      connectionKey: 'slackNode',
      accessTokenKey: 'slackAccessToken',
      slackSpecial: true,
    },
];

export const NavMenu = [
  {
    title: "Dashboard",
    label: "",
    icon: LayoutDashboard,
    variant: "default",
    link:"/"
  },
  {
    title: "Workflows",
    label: "",
    icon: Network,
    variant: "ghost",
    link:"/workflows"
  },
  {
    title: "Connections",
    label: "",
    icon: Cable,
    variant: "ghost",
    link:"/connections"
  },
  {
    title: "Trash",
    label: "",
    icon: Trash2,
    variant: "ghost",
    link:"/"
  },
  {
    title: "Archive",
    label: "",
    icon: Archive,
    variant: "ghost",
    link:"/"
  },
  {
    title: "Profile",
    label: "",
    icon: UserButton,
  },
]

export const EditorCanvasDefaultCardTypes = {
  // Email: { description: 'Send and email to a user', type: 'Action' },
  // Condition: {
  //   description: 'Boolean operator that creates different conditions lanes.',
  //   type: 'Action',
  // },
  AI: {
    description:
      'Use the power of AI to summarize, respond, create and much more.',
    type: 'Action',
  },
  Slack: { description: 'Send a notification to slack', type: 'Action' },
  Notion: { description: 'Create entries directly in notion.', type: 'Action' },
  // 'Custom Webhook': {
  //   description:
  //     'Connect any app that has an API key and send data to your applicaiton.',
  //   type: 'Action',
  // },
  Discord: {
    description: 'Post messages to your discord server',
    type: 'Action',
  },
  // 'Google Calendar': {
  //   description: 'Create a calendar invite.',
  //   type: 'Action',
  // },
  'PDF Input': {
    description: 'Upload PDF, that starts the workflow.',
    type: 'Trigger',
  },
  Trigger: {
    description: 'An event that starts the workflow.',
    type: 'Trigger',
  },
  'Google Drive': {
    description:
      'Connect with Google drive to trigger actions or to create files and folders.',
    type: 'Trigger',
  },
  // Action: {
  //   description: 'An event that happens after the workflow begins',
  //   type: 'Action',
  // },
  // Wait: {
  //   description: 'Delay the next action step by using the wait timer.',
  //   type: 'Action',
  // },
}

