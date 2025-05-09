import { ethers } from "ethers";

export const getProvider = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  return provider;
};
export const getSigner = () => {
  const provider = getProvider();
  const signer = provider.getSigner();
  return signer;
};
