/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { CONNECTIONS } from "../../lib/constants";
import RenderConnectionAccordion from "./render-connection-accordion";
import RenderOutputAccordion from "./render-output-accordian";

const DefaultAccordianCanvas = ({
    state,nodeConnection
}:{
    state:any,
    nodeConnection:any
}) => {
  return (
    <Accordion type="multiple">
      <AccordionItem value="Options" className="border-y-[1px] px-2">
        <AccordionTrigger className="!no-underline">Account</AccordionTrigger>
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
        <AccordionTrigger className="!no-underline">Action</AccordionTrigger>
        <RenderOutputAccordion state={state} nodeConnection={nodeConnection} />
      </AccordionItem>
    </Accordion>
  );
};

export default DefaultAccordianCanvas;
