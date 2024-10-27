/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Separator } from "../ui/separator";
import { EditorCanvasDefaultCardTypes } from "../../lib/constants";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { EditorCanvasTypes, EditorNodeType } from "../../lib/types";
import { useNodeConnections } from "../../providers/connections-provider";
import { useEditor } from "../../providers/editor-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { onConnections, onDragStart } from "../../lib/editor-utils";
import EditorCanvasIconHelper from "./editor-canvas-card-icon-hepler";
import { useFuzzieStore } from "../../store";
import { useUser } from "@clerk/clerk-react";
import { fetchBotSlackChannels } from "../../server";
import MultiPDFUploader from "./pdf-uploader";
import DefaultAccordianCanvas from "./defaultAccordianCanvas";
import AiChatComponent from "./ai-chat-component";


interface Props {
  nodes: EditorNodeType[];
}

interface ActionCardProps {
  cardKey: string;
  cardValue: {
    type: string;
    description: string;
  };
}

// Helper Components
const ActionCard = ({ cardKey, cardValue }: ActionCardProps) => (
  <Card
    draggable
    className="w-full cursor-grab border-black bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
    onDragStart={(event) => onDragStart(event, cardKey as EditorCanvasTypes)}
  >
    <CardHeader className="flex flex-row items-center gap-4 p-4">
      <EditorCanvasIconHelper type={cardKey as EditorCanvasTypes} />
      <CardTitle className="text-md">
        {cardKey}
        <CardDescription>{cardValue.description}</CardDescription>
      </CardTitle>
    </CardHeader>
  </Card>
);

const SettingsContent = ({ nodeData, state, nodeConnection }:{
  nodeData:any,
  state:any,
  nodeConnection:any
}) => {
  switch (nodeData.type) {
    case "PDF Input":
      return <MultiPDFUploader />;
    
    case "AI":
      return (
       <AiChatComponent/>
      );
    
    default:
      return (
        <DefaultAccordianCanvas 
          state={state} 
          nodeConnection={nodeConnection}
        />
      );
  }
};

const EditorCanvasSidebar = ({ nodes }: Props) => {
  const { state } = useEditor();
  const { nodeConnection } = useNodeConnections();
  const { googleFile, setSlackChannels } = useFuzzieStore();
  const { user } = useUser();

  useEffect(() => {
    if (state && user) {
      onConnections(nodeConnection, state, googleFile, user.id);
    }
  }, [state]);

  useEffect(() => {
    if (nodeConnection.slackNode.slackAccessToken) {
      fetchBotSlackChannels(
        nodeConnection.slackNode.slackAccessToken,
        setSlackChannels
      );
    }
  }, [nodeConnection]);

  const filteredCardTypes = Object.entries(EditorCanvasDefaultCardTypes)
    .filter(([_, cardType]) =>
      (!nodes?.length && cardType.type === "Trigger") ||
      (nodes.length && cardType.type === "Action")
    );

  return (
    <aside>
      <Tabs defaultValue="actions" className="h-screen overflow-scroll pb-24">
        <TabsList className="bg-transparent">
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <Separator />
        
        <TabsContent value="actions" className="flex flex-col gap-4 p-4">
          {filteredCardTypes.map(([cardKey, cardValue]) => (
            <ActionCard 
              key={cardKey}
              cardKey={cardKey}
              cardValue={cardValue}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="settings" className="-mt-6">
          
          <SettingsContent 
            nodeData={state.editor.selectedNode.data}
            state={state}
            nodeConnection={nodeConnection}
          />
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default EditorCanvasSidebar;