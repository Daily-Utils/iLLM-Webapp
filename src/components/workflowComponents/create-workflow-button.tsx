import { useModal } from "../../providers/modal-provider";
import CustomModal from "../commonComponents/custom-modal";
import Workflowform from "../commonComponents/workflow-form";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const CreateWorkflowButton = () => {
  const { setOpen } = useModal();

  async function handleClick() {
    setOpen(
      <CustomModal
        title="Create a Workflow Automation"
        subheading="Workflows are a powerfull that help you automate tasks."
      >
        <Workflowform/>
      </CustomModal>
    );
  }
  return (
    <Button onClick={handleClick}>
      <Plus className="mr-2 h-4 w-4" />
      Create Worflow
    </Button>
  );
};

export default CreateWorkflowButton;
