/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ThemeProvider } from "./providers/theme-provider";
import { TooltipProvider } from "./components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { cn } from "./lib/utils";
import { Separator } from "./components/ui/separator";
import { Nav } from "./components/commonComponents/Nav";
import Logo from "./assets/iworkflow-logo.png";
import Workflow from "./pages/Workflow";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
} from "@clerk/clerk-react";
// import ProfilePicture from "./components/commonComponents/ProfilePicture";
import { serverURL } from "./server";
import Connection from "./pages/Connection";
import { NavMenu } from "./lib/constants";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ModalProvider from "./providers/modal-provider";
import Editor from "./pages/Editor";
import axios from "axios";
import { onGetWorkflows } from "./server";



function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useUser();

  const [navState, setNavState] = useState(NavMenu)

  // Workflow count
    async function fetchWorkFlow() {
      if (user && user?.id) {
        const resp:any = await onGetWorkflows(user?.id);
        return resp;  
      }
      
    }
  
    useEffect(() => {
      if (user && user?.id) {
        fetchWorkFlow()
          .then((data) => {
            const workFlowCount = data?.data?.length || 0;
            setNavState((prevState) => {
              const updatedNavState = [...prevState];
              updatedNavState[1]["label"] = String(workFlowCount);
              return updatedNavState;
            });
          })
          .catch((error) => {
            console.log("Error in fetchWorkflow", error);
          });
      }
    }, [user]); 
    
    useEffect(() => {
      if (user) {
        const saveUserToBackend = async () => {
          try {
            const response = await axios.post(`${serverURL}/api/clerk-webhook`, {
              clerkId: user.id,
              email: user?.primaryEmailAddress?.emailAddress,
              fullName: user?.fullName,
              imageUrl: user?.imageUrl,
            });
    
            if (response.status !== 200) {
              console.error("Failed to save user credentials");
            }
          } catch (error) {
            console.error("Error sending user credentials to the backend:", error);
          }
        };
        saveUserToBackend();
      }
    }, [user]);
 


  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider delayDuration={0}>
          <SignedIn>
            <ModalProvider>
              <ResizablePanelGroup
                direction="horizontal"
                className="items-stretch"
                style={{
                  height: "100vh",
                }}
              >
                <ResizablePanel
                  collapsedSize={4}
                  collapsible={true}
                  minSize={15}
                  maxSize={18}
                  onCollapse={() => {
                    setIsCollapsed(true);
                  }}
                  onResize={() => {
                    setIsCollapsed(false);
                  }}
                  className={cn(
                    isCollapsed &&
                      "min-w-[50px] transition-all duration-300 ease-in-out"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-[56px] items-center justify-center",
                      isCollapsed ? "h-[56px]" : "p-2"
                    )}
                  >
                    <img src={Logo} className={isCollapsed ? "h-6" : "h-10"} />
                  </div>
                  <Separator />
                  <Nav isCollapsed={isCollapsed} links={navState} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel minSize={30}>
                  {/*  <----ROUTES----> */}
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/connections" element={<Connection />} />
                    <Route path="/workflows" element={<Workflow />} />
                    <Route path="/workflows/editor/:id" element={<Editor/>}/>
                  </Routes>

                  <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60"></div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ModalProvider>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
