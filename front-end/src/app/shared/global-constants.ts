export class GlobalConstants{
  //message
  public static genricError: string = "Something went wrong. Please try again later";

  public static unauthroized: string = "You are not authorized person to access this page";

  //Regex
  public static nameRegex: string = "[a-zA-Z0-9 ]*";

  public static emailRegex: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

  public static contactNumberRegex: string = "^[e0-9]{8,8}$";

 // public static passwordRegex : string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$";

  //Variable
  public static error: string = "error";
}
