/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectionTypes } from "../../lib/types";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {Link} from "react-router-dom";

type Props = {
  type: ConnectionTypes;
  icon: string;
  title: ConnectionTypes;
  description: string;
  callback?: () => void;
  connected: any;
};

const ConnectionCard = ({
  description,
  type,
  icon,
  title,
  connected={},
}: Props) => {
  
  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <img
            src={icon}
            alt={title}
            height={30}
            width={30}
            className="object-contain"
          />
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <div className="flex flex-col items-center gap-2 p-4 mr-10">
        {connected[type] ? (
          <div className="border-bg-primary rounded-lg border-2 px-3 py-2 font-bold text-white">
            Connected
          </div>
        ) : (
          <div>
            <Link
              to={
                title == "Discord"
                  ? import.meta.env.NEXT_PUBLIC_DISCORD_REDIRECT!
                  : title == "Notion"
                  ? import.meta.env.NEXT_PUBLIC_NOTION_AUTH_URL!
                  : title == "Slack"
                  ? import.meta.env.NEXT_PUBLIC_SLACK_REDIRECT!
                  : "#"
                
              }
              className=" rounded-lg bg-primary p-2 font-bold text-primary-foreground"
            >
              Connect
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ConnectionCard;