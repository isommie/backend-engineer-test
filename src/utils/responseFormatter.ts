export const formatResponse = (
    success: boolean,
    data: any = null,
    message: string = ''
  ) => {
    return {
      success,
      data,
      message,
    };
  };
  