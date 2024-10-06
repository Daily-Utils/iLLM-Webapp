import { UserButton } from "@clerk/clerk-react";


interface ProfilePictureProps {
    isCollapsed: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
}

  const ProfilePicture: React.FC<ProfilePictureProps> = ({isCollapsed,user}) => {
  return (
    // <section className="h-full w-full flex items-center justify-center flex-col">
     
      <div className="flex items-center gap-4">
        <UserButton /> {!isCollapsed && <p>{user?.fullName}</p>}
      </div>
    // </section>
  );
};

export default ProfilePicture;
