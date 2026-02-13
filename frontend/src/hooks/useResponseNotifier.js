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

  function handleApiResult(res) {
    if(res?.data) {
      showAlert({
        typeSeverity: "success",
        message: "Action successfully completed.",
        isAutoHide: true,
      });

      return;
    }

    if(res?.errorMessage) {
      handleErrorResponse(res);
    }
  }

  return { handleApiResult, handleErrorResponse };
};
