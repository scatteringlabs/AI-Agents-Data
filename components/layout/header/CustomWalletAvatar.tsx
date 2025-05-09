import Blockie from "@/components/blockie";
import { AvatarComponent } from "@rainbow-me/rainbowkit";
const CustomWalletAvatar: AvatarComponent = ({ address }) => {
  return <Blockie address={address} />;
};

export default CustomWalletAvatar;
