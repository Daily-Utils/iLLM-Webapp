import React from "react"
import { Separator } from "../ui/separator"

interface PageHeaderProps {
    title:string
}

const PageHeader:React.FC<PageHeaderProps> = ({title}) => {
  return (
    <>
     <div className="flex items-center px-4 py-2 h-[56px]">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <Separator />
    </>
  )
}

export default PageHeader