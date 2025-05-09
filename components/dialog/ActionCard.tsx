import "@dialectlabs/blinks/index.css";
import { ActionsRegistry, Blink, Action } from "@dialectlabs/blinks";
import { useEffect, useState } from "react";
// import { useAction } from "@dialectlabs/blinks/dist/react/index";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
const ActionUrl = "https://scattering.io/collection/sol/yeehaw1";
const ActionCard = () => {
  const reg = ActionsRegistry.getInstance();
  const { connection } = useConnection();
  const [action, setAction] = useState<Action | null>(null);
  const [actionState, setactionState] = useState<Action | null>(null);
  // const { action } = useAction(ActionUrl, { rpcUrlOrConnection: connection });
  useEffect(() => {
    setactionState(action);
  }, [action]);
  useEffect(() => {
    setAction(null);
    Action.fetch(ActionUrl)
      .then(setAction)
      .catch((e) => {
        console.error("Failed to fetch action", e);
        setAction(null);
      });
  }, []);
  return (
    <Blink
      action={actionState as Action}
      websiteText={new URL(ActionUrl).hostname}
      stylePreset="custom"
    />
  );
};

export default ActionCard;
