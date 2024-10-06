/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useUser } from "@clerk/clerk-react";
import PageHeader from "../components/commonComponents/PageHeader";
import ConnectionCard from "../components/connectionComponents/connection-card";
import { ScrollArea } from "../components/ui/scroll-area";
import { CONNECTIONS } from "../lib/constants";
import { useEffect,useState } from "react";
import {
  onDiscordConnect,
  onNotionConnect,
  onSlackConnect,
  getUserData,
} from "../server";

type Props = {
  searchParams?: { [key: string]: string | undefined };
};

const Connection = (props: Props) => {
  // const {
  //   webhook_id,
  //   webhook_name,
  //   webhook_url,
  //   guild_id,
  //   guild_name,
  //   channel_id,
  //   access_token,
  //   workspace_name,
  //   workspace_icon,
  //   workspace_id,
  //   database_id,
  //   app_id,
  //   authed_user_id,
  //   authed_user_token,
  //   slack_access_token,
  //   bot_user_id,
  //   team_id,
  //   team_name,
  // } = props.searchParams ?? {
  //   webhook_id: "",
  //   webhook_name: "",
  //   webhook_url: "",
  //   guild_id: "",
  //   guild_name: "",
  //   channel_id: "",
  //   access_token: "",
  //   workspace_name: "",
  //   workspace_icon: "",
  //   workspace_id: "",
  //   database_id: "",
  //   app_id: "",
  //   authed_user_id: "",
  //   authed_user_token: "",
  //   slack_access_token: "",
  //   bot_user_id: "",
  //   team_id: "",
  //   team_name: "",
  // };

  const searchParams = new URLSearchParams(window.location.search);
  const webhook_id = searchParams.get('webhook_id') || '';
  const webhook_name = searchParams.get('webhook_name') || '';
  const webhook_url = searchParams.get('webhook_url') || '';
  const guild_id = searchParams.get('guild_id') || '';
  const guild_name = searchParams.get('guild_name') || '';
  const channel_id = searchParams.get('channel_id') || '';
  const access_token = searchParams.get('access_token') || '';
  const workspace_name = searchParams.get('workspace_name') || '';
  const workspace_icon = searchParams.get('workspace_icon') || '';
  const workspace_id = searchParams.get('workspace_id') || '';
  const database_id = searchParams.get('database_id') || '';
  const app_id = searchParams.get('app_id') || '';
  const authed_user_id = searchParams.get('authed_user_id') || '';
  const authed_user_token = searchParams.get('authed_user_token') || '';
  const slack_access_token = searchParams.get('slack_access_token') || '';
  const bot_user_id = searchParams.get('bot_user_id') || '';
  const team_id = searchParams.get('team_id') || '';
  const team_name = searchParams.get('team_name') || '';


  const [connections, setConnections] = useState<any>({});
  const { user } = useUser();

  const onUserConnections = async () => {
    console.log("In connections");
    
    const connections: any = {};
    if (!user) {
      return;
    }

    console.log("user-->",user.id);
    
    const user_info = await getUserData(user.id);
    console.log("user_info",user_info);
    
    user_info?.data?.connections.forEach((connection:any) => {
      connections[connection.type] = true;
    });
    return { ...connections, "Google Drive": true };
  };



  const fetchAndConnectUser = async () => { 
    if (!user) {
      return;
    }
    
    
    await onDiscordConnect(
      channel_id!,
      webhook_id!,
      webhook_name!,
      webhook_url!,
      user.id,
      guild_name!,
      guild_id!
    );
    await onNotionConnect(
      access_token!,
      workspace_id!,
      workspace_icon!,
      workspace_name!,
      database_id!,
      user.id
    );
    await onSlackConnect(
      app_id!,
      authed_user_id!,
      authed_user_token!,
      slack_access_token!,
      bot_user_id!,
      team_id!,
      team_name!,
      user.id
    );

    const userConnections = await onUserConnections();
    setConnections(userConnections);
  };

  useEffect(() => {
    if (user) {
      fetchAndConnectUser();
    }
  }, [user]);

  console.log("connections",connections);
  

  if (!user) return null;

  return (
    <>
      <PageHeader title={"Connection"} />

      <div className="p-5">
        <div className="relative flex flex-col gap-4">
          <section className="text-muted-foreground">
            Connect all your apps directly from here. You may need to connect
            these apps regularly to refresh verification
            <ScrollArea className="h-[80vh] mt-5">
              <div className="flex flex-col gap-4">
                {CONNECTIONS.map((connection) => (
                  <ConnectionCard
                    key={connection.title}
                    description={connection.description}
                    title={connection.title}
                    icon={connection.image}
                    type={connection.title}
                    connected={connections}
                  />
                ))}
              </div>
            </ScrollArea>
          </section>
        </div>
      </div>
    </>
  );
};

export default Connection;
