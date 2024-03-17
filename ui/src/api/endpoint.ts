export const ENDPOINT = "http://127.0.0.1:8000/";
export const getUploadEndpoint = (propertyTitle: string) => {
  return "http://127.0.0.1:8000/property/" + propertyTitle + "/docs/";
};
