/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '../ui/button'
import { useNodeConnections } from '../../providers/connections-provider'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useLocation } from 'react-router-dom';
import { onCreateNodesEdges,onFlowPublish } from '../../server';

type Props = {
  children: React.ReactNode
  edges: any[]
  nodes: any[]
}


const FlowInstance = ({ children, edges, nodes }: Props) => {
  const location = useLocation();
  const pathname = location.pathname;
  const [isFlow, setIsFlow] = useState([])
  const { nodeConnection } = useNodeConnections()

  const onFlowAutomation = useCallback(async () => {    
    const flow = await onCreateNodesEdges(
      pathname.split('/').pop()!,
      JSON.stringify(nodes),
      JSON.stringify(edges),
      JSON.stringify(isFlow)
    )
 
    if (flow) toast.message("Flow saved!")
  }, [nodeConnection,edges])


  const onPublishWorkflow = useCallback(async () => {
    const response = await onFlowPublish(pathname.split('/').pop()!, true);
    if (response) toast.message("Flow published!")
  }, [])

  const onAutomateFlow = async () => {
    const flows: any = []
    const connectedEdges = edges.map((edge) => edge.target)
    connectedEdges.map((target) => {
      nodes.map((node) => {
        if (node.id === target) {
          flows.push(node.type)
        }
      })
    })
    
    setIsFlow(flows)
  }

  useEffect(() => {
    onAutomateFlow()
  }, [nodes,edges])


  return (
    <div className="flex flex-col gap-2">
    <div className="flex gap-3 p-4">
      <Button
        onClick={onFlowAutomation}
        disabled={isFlow.length < 1}
      >
        Save
      </Button>
      <Button
        disabled={isFlow.length < 1}
        onClick={onPublishWorkflow}
      >
        Publish
      </Button>
    </div>
    {children}
  </div>
  )
}

export default FlowInstance