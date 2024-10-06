/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { EditorCanvasCardType, EditorNodeType } from "../../lib/types";
import { useEditor } from "../../providers/editor-provider";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  NodeChange,
  ReactFlowInstance,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
import { ConnectionLineType } from 'react-flow-renderer';
import "reactflow/dist/style.css";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { toast } from "sonner";
import EditorCanvasCardSingle from './editor-canvas-card-single';
import FlowInstance from './flow-instance'
import EditorCanvasSidebar from './editor-canvas-sidebar';
import { EditorCanvasDefaultCardTypes } from '../../lib/constants'
import { v4 } from 'uuid';
import { useLocation } from 'react-router-dom';
import { onGetNodesEdges } from "../../server";

const initialNodes: EditorNodeType[] = [];

const initialEdges: { id: string; source: string; target: string }[] = [];

const EditorCanvas = () => {
  const { dispatch, state } = useEditor();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isWorkFlowLoading, setIsWorkFlowLoading] = useState<boolean>(false);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
  const location = useLocation();
  const pathname = location.pathname;

  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      //@ts-expect-error
      setNodes((nds) => applyNodeChanges(changes, nds))
    },
    [setNodes]
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  )

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault()

      const type: EditorCanvasCardType['type'] = event.dataTransfer.getData(
        'application/reactflow'
      )

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return
      }

      const triggerAlreadyExists = state.editor.elements.find(
        (node) => node.type === 'Trigger'
      )

      if (type === 'Trigger' && triggerAlreadyExists) {
        toast('Only one trigger can be added to automations at the moment')
        return
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      if (!reactFlowInstance) return
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode = {
        id: v4(),
        type,
        position,
        data: {
          title: type,
          description: EditorCanvasDefaultCardTypes[type].description,
          completed: false,
          current: false,
          metadata: {},
          type: type,
        },
      }
      
      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, state]
  )

  const onDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [])

  const nodeTypes = useMemo(
    () => ({
      Action: (props:any) => <EditorCanvasCardSingle {...props} onDeleteNode={onDeleteNode} />,
      'PDF Input': (props:any) => <EditorCanvasCardSingle {...props} onDeleteNode={onDeleteNode} />,
      Trigger: (props:any) => <EditorCanvasCardSingle {...props} onDeleteNode={onDeleteNode} />,
      Email: (props:any) => <EditorCanvasCardSingle {...props} onDeleteNode={onDeleteNode} />,
      Condition: (props:any) => <EditorCanvasCardSingle {...props} onDeleteNode={onDeleteNode} />,
      AI: (props:any) => <EditorCanvasCardSingle {...props} onDeleteNode={onDeleteNode} />,
      Slack: (props:any) => <EditorCanvasCardSingle {...props} onDeleteNode={onDeleteNode} />,
      'Google Drive': (props:any) => <EditorCanvasCardSingle {...props} onDeleteNode={onDeleteNode} />,
      Notion: (props:any) => <EditorCanvasCardSingle {...props} onDeleteNode={onDeleteNode} />,
      Discord: (props:any) => <EditorCanvasCardSingle {...props} onDeleteNode={onDeleteNode} />,
      'Custom Webhook': (props:any) => <EditorCanvasCardSingle {...props} onDeleteNode={onDeleteNode} />,
      'Google Calendar': (props:any) => <EditorCanvasCardSingle {...props} onDeleteNode={onDeleteNode} />,
      Wait: (props:any) => <EditorCanvasCardSingle {...props} onDeleteNode={onDeleteNode} />,
    }),
    [onDeleteNode]
  );


  const handleClickCanvas = () => {
    dispatch({
      type: 'SELECTED_ELEMENT',
      payload: {
        element: {
          data: {
            completed: false,
            current: false,
            description: '',
            metadata: {},
            title: '',
            type: 'Trigger',
          },
          id: '',
          position: { x: 0, y: 0 },
          type: 'Trigger',
        },
      },
    })
  }


  const onGetWorkFlow = async () => {
    setIsWorkFlowLoading(true)
    const response = await onGetNodesEdges(pathname.split('/').pop()!)

    if (response && response.data && response.data[0]) {
      const resp = response.data[0];
      console.log("resp",resp);
      if (resp && resp.edges && resp.nodes) {
        setEdges(JSON.parse(resp?.edges))
        setNodes(JSON.parse(resp?.nodes))
      }
     
      setIsWorkFlowLoading(false)
    }
    setIsWorkFlowLoading(false)
  }
  useEffect(() => {
    dispatch({ type: 'LOAD_DATA', payload: { edges, elements: nodes } })
  }, [nodes, edges])
  
  useEffect(() => {
    onGetWorkFlow()
  }, [])


  return (
    <ResizablePanelGroup direction="horizontal">
    <ResizablePanel defaultSize={70}>
      <div className="flex items-center justify-center">
        <div
          style={{ width: '100%', height: '100vh' }}
          className="relative"
        >
          {isWorkFlowLoading ? (
            <div className="absolute flex h-full w-full items-center justify-center">
              <svg
                aria-hidden="true"
                className="inline h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          ) : (
            <ReactFlow
              className="w-[300px]"
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodes={state.editor.elements}
              onNodesChange={onNodesChange}
              edges={edges}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              fitView
              onClick={handleClickCanvas}
              nodeTypes={nodeTypes}
              connectionLineType={ConnectionLineType.SmoothStep}
            >
              <Controls position="top-left" />
              
              <Background
                gap={12}
                size={1}
              />
            </ReactFlow>
          )}
        </div>
      </div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel
      defaultSize={40}
      maxSize={40}
      minSize={10}
      className="relative sm:block"
    >
      {isWorkFlowLoading ? (
        <div className="absolute flex h-full w-full items-center justify-center">
          <svg
            aria-hidden="true"
            className="inline h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : (
        <FlowInstance
          edges={edges}
          nodes={nodes}
        >
          <EditorCanvasSidebar 
          nodes={nodes} 
          />
        </FlowInstance>
      )}
    </ResizablePanel>
  </ResizablePanelGroup>
  );
};

export default EditorCanvas;
