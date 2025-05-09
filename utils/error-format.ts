import { toast } from "react-toastify";

export function handleTransactionError(error: any) {
  const errorMessage =
    error.reason ||
    error.message ||
    (error.error && error.error.message) ||
    "Transaction failed, please try again!";
  toast.error(errorMessage);
}
