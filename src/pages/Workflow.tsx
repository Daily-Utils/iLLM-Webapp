/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import PageHeader from "../components/commonComponents/PageHeader";
import { ScrollArea } from "../components/ui/scroll-area";
import CreateWorkflowButton from "../components/workflowComponents/create-workflow-button";
import Workflow from "../components/workflowComponents/workflow";
import { onGetWorkflows } from "../server";
import { useUser } from "@clerk/clerk-react";

const Workflows = () => {
  const [workflows, setWorkflows] = useState<any>([]);
  const { user } = useUser();

  async function fetchWorkFlow() {
    const resp:any = await onGetWorkflows(user?.id);
    return resp;
  }

  useEffect(() => {
    fetchWorkFlow().then((data) => {
      setWorkflows(data.data);
    });
  }, []);


  // console.log("workflows",workflows);
  

  return (
    <>
      <PageHeader title="Workflows" />
      <div className="p-5">
        <div className="flex items-center justify-end">
          <CreateWorkflowButton />
        </div>

        <div className="mt-5">
          <ScrollArea className="h-[80vh]">
            <div className="flex flex-col gap-2">
              {workflows?.length ? (
                workflows.map((flow:any) => <Workflow key={flow._id} id={flow._id} {...flow} />)
              ) : (
                <div className="mt-28 flex text-muted-foreground items-center justify-center">
                  No Workflows
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default Workflows;
