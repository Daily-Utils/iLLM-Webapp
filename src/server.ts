/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty */
import axios from "axios";

export const serverURL = "http://localhost:4000";

export const onDiscordConnect = async (
  channel_id: string,
  webhook_id: string,
  webhook_name: string,
  webhook_url: string,
  id: string,
  guild_name: string,
  guild_id: string
) => {
  const res = await axios.post(`${serverURL}/connection/discord/connect`, {
    channel_id,
    webhook_id,
    webhook_name,
    webhook_url,
    id,
    guild_name,
    guild_id,
  });
  return res;
};

export const onNotionConnect = async (
  access_token: string,
  workspace_id: string,
  workspace_icon: string,
  workspace_name: string,
  database_id: string,
  id: string
) => {
  const res = await axios.post(`${serverURL}/connection/notion/connect`, {
    access_token,
    workspace_id,
    workspace_icon,
    workspace_name,
    database_id,
    id,
  });
  console.log("res", res);
  return res;
};

export const onSlackConnect = async (
  app_id: string,
  authed_user_id: string,
  authed_user_token: string,
  slack_access_token: string,
  bot_user_id: string,
  team_id: string,
  team_name: string,
  user_id: string
) => {
  const res = await axios.post(`${serverURL}/connection/slack/connect`, {
    app_id,
    authed_user_id,
    authed_user_token,
    slack_access_token,
    bot_user_id,
    team_id,
    team_name,
    user_id,
  });
  console.log("res", res);
  return res;
};

export const getUserData = async (id: string) => {
  const res = await axios.get(`${serverURL}/connection/user/${id}`);
  return res;
};

export const onCreateNodesEdges = async (
  flowId: string,
  nodes: string,
  edges: string,
  flowPath: string
) => {
  const res = await axios.put(`${serverURL}/workflows/nodes-edges`, {
    flowId,
    nodes,
    edges,
    flowPath,
  });
  return res;
};

export const onCreateWorkflow = async (
  id: string,
  name: string,
  description: string
) => {
  const res = await axios.post(`${serverURL}/workflows/create-workflow`, {
    id,
    name,
    description,
  });
  return res;
};

export const onFlowPublish = async (workflowId: string, state: boolean) => {
  const res = await axios.post(`${serverURL}/workflows/publish`, {
    workflowId,
    state
  });
  return res;
};

export const onFileUpload = async (type: string, payload: any) => {
  console.log(payload);
  
  const res = await axios.post(`${serverURL}/upload/pdfs`, payload,{
    headers:{
      'Content-Type': 'multipart/form-data',
    }
  });
  return res;
};

export const onGetWorkflows = async (clerkId: string) => {
  const res = await axios.get(`${serverURL}/workflows/get-flows/${clerkId}`);
  return res;
};

export const onGetNodesEdges = async (flowId: string) => {
  const res = await axios.get(`${serverURL}/workflows/get-nodes-edges/${flowId}`);
  return res;
}


export const getDiscordConnectionUrl =async (userId:string) => {
  const res = await axios.get(`${serverURL}/connection/discord/connection-url/${userId}`);
  return res;
}

export const getNotionConnection =async (userId:string) => {
  const res = await axios.get(`${serverURL}/connection/notion/connection/${userId}`);
  return res;
}


export const getNotionDatabase =async (databaseId:string,accessToken:string) => {
  const res = await axios.post(`${serverURL}/connection/notion/database`,{
    databaseId,
    accessToken
  });
  return res;
}
export const getSlackConnection =async (userId:string) => {
  const res = await axios.get(`${serverURL}/connection/slack/connection/${userId}`);
  return res;
}


export const fetchBotSlackChannels = async (
  token: string,
  setSlackChannels: (slackChannels:any) => void
) => {
  await listBotChannels(token)?.then((channels) => setSlackChannels(channels))
}


export async function listBotChannels(
  slackAccessToken: string
): Promise<any> {
  const url = `https://slack.com/api/conversations.list?${new URLSearchParams({
    types: 'public_channel,private_channel',
    limit: '200',
  })}`

  try {
    const { data } = await axios.get(url, {
      headers: { Authorization: `Bearer ${slackAccessToken}` },
    })

    console.log(data)

    if (!data.ok) throw new Error(data.error)

    if (!data?.channels?.length) return []

    return data.channels
      .filter((ch: any) => ch.is_member)
      .map((ch: any) => {
        return { label: ch.name, value: ch.id }
      })
  } catch (error: any) {
    console.error('Error listing bot channels:', error.message)
    throw error
  }
}



