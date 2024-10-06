import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {Link} from 'react-router-dom'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import GoogelDrive from "../../assets/googleDrive.svg";
import Discord from "../../assets/discord.svg";
import Notion from "../../assets/notion.svg";
import { onFlowPublish } from '../../server';
import { toast } from 'sonner';


type Props = {
  name: string
  description: string
  id: string
  publish: boolean | null
}

const Workflow = ({ description, id, name, publish }: Props) => {

  const onPublishFlow = async (event: any) => {
    const response = await onFlowPublish(
      id,
      event.target.ariaChecked === 'false'
    )
    if (response) toast.message("Updated!")
  }

  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col gap-4">
        <Link to={`/workflows/editor/${id}`}>
          <div className="flex flex-row gap-2">
            <img
              src={GoogelDrive}
              alt="Google Drive"
              height={30}
              width={30}
              className="object-contain"
            />
            <img
              src={Notion}
              alt="Google Drive"
              height={30}
              width={30}
              className="object-contain"
            />
            <img
              src={Discord}
              alt="Google Drive"
              height={30}
              width={30}
              className="object-contain"
            />
          </div>
          <div className="">
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </Link>
      </CardHeader>
      <div className="flex flex-col items-center gap-2 p-4 mr-10">
        <Label
          htmlFor="airplane-mode"
          className="text-muted-foreground"
        >
          {publish! ? 'On' : 'Off'}
        </Label>
        <Switch
          id="airplane-mode"
          onClick={onPublishFlow}
          defaultChecked={publish!}
        />
      </div>
    </Card>
  )
}

export default Workflow