import PageHeader from "../components/commonComponents/PageHeader";
import EditorCanvas from "../components/workflowComponents/editor-canvas";
import { ConnectionsProvider } from "../providers/connections-provider";
import EditorProvider from "../providers/editor-provider";


const Editor = () => {
  return (
    <>
      <PageHeader title="Editor" />
      <EditorProvider>
        <ConnectionsProvider>
          <div className="p-5">
            <EditorCanvas/>
          </div>
        </ConnectionsProvider>
      </EditorProvider>
    </>
  );
};

export default Editor;
