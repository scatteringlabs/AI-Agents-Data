import makeBlockie from "ethereum-blockies-base64";

const Blockie = ({ address }: { address?: string }) => {
  return address ? <img src={makeBlockie(address)} alt="Blockie" /> : null;
};

export default Blockie;
