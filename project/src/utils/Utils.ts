export class Utils {
  public static clamp(min: number, max: number, value: number) {
    return (value - min) / (max - min);
  }
}
