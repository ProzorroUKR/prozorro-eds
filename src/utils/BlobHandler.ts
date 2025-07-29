export class BlobHandler {
  static toBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.replace(/^data:.+;base64,/, ""));
        }
        reject();
      };

      reader.readAsDataURL(blob);
    });
  }
}
