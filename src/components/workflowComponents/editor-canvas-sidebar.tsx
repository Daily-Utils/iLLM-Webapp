import { useEffect } from "react";
import { Separator } from "../ui/separator";
import { CONNECTIONS, EditorCanvasDefaultCardTypes } from "../../lib/constants";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { EditorCanvasTypes, EditorNodeType } from "../../lib/types";
import { useNodeConnections } from "../../providers/connections-provider";
import { useEditor } from "../../providers/editor-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { onConnections, onDragStart } from "../../lib/editor-utils";
import RenderConnectionAccordion from "./render-connection-accordion";
import RenderOutputAccordion from "./render-output-accordian";
import EditorCanvasIconHelper from "./editor-canvas-card-icon-hepler";
import { useFuzzieStore } from "../../store";
import { useUser } from "@clerk/clerk-react";
import { fetchBotSlackChannels } from "../../server";
import MultiPDFUploader from "./pdf-uploader";

type Props = {
  nodes: EditorNodeType[];
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


  return (
    <>
      <aside>
        <Tabs defaultValue="actions" className="h-screen overflow-scroll pb-24">
          <TabsList className="bg-transparent">
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent value="actions" className="flex flex-col gap-4 p-4">
            {Object.entries(EditorCanvasDefaultCardTypes)
              .filter(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ([_, cardType]) =>
                  (!nodes?.length && cardType.type === "Trigger") ||
                  (nodes.length && cardType.type === "Action")
              )
              .map(([cardKey, cardValue]) => (
                <Card
                  key={cardKey}
                  draggable
                  className="w-full cursor-grab border-black bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
                  onDragStart={(event) =>
                    onDragStart(event, cardKey as EditorCanvasTypes)
                  }
                >
                  <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <EditorCanvasIconHelper
                      type={cardKey as EditorCanvasTypes}
                    />
                    <CardTitle className="text-md">
                      {cardKey}
                      <CardDescription>{cardValue.description}</CardDescription>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
          </TabsContent>
          <TabsContent value="settings" className="-mt-6">
            <div className="px-2 py-4 text-center text-xl font-bold">
              {state.editor.selectedNode.data.title}
            </div>

            {state.editor.selectedNode.data.type === "PDF Input" ? (
              <MultiPDFUploader/>
            ) : (
              <Accordion type="multiple">
                <AccordionItem value="Options" className="border-y-[1px] px-2">
                  <AccordionTrigger className="!no-underline">
                    Account
                  </AccordionTrigger>
                  <AccordionContent>
                    {CONNECTIONS.map((connection) => (
                      <RenderConnectionAccordion
                        key={connection.title}
                        state={state}
                        connection={connection}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="Expected Output" className="px-2">
                  <AccordionTrigger className="!no-underline">
                    Action
                  </AccordionTrigger>
                  <RenderOutputAccordion
                    state={state}
                    nodeConnection={nodeConnection}
                  />
                </AccordionItem>
              </Accordion>
            )}
          </TabsContent>
        </Tabs>
      </aside>
    </>
  );
};

export default EditorCanvasSidebar;
