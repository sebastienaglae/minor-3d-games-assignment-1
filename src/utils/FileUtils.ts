export abstract class FileUtils {
  // load a file from a url asynchronously with fetch
  public static async loadFile(url: string): Promise<any> {
    return await fetch(url)
      .then((response) => response.json())
      .catch((err) => console.log(err));
  }
}
