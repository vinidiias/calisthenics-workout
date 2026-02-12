import { useAlert } from "./useAlert";

export const useResponseNotifier = () => {
  const { showAlert } = useAlert();

  function handleErrorResponse(res) {
    showAlert({
      typeSeverity: "error",
      message: res?.errorMessage ?? "It was not possible complete the action",
      isAutoHide: true,
    });
  }

  return { handleErrorResponse };
};
