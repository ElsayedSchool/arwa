import { IsEnum, IsNotEmpty, IsNumber, Min } from "class-validator";

export class UpdateProfileCommand {
  firstName: string;

  lastName: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: "من فضلك ارسل رقم التيشرت المفضل لديك" }
  )
  shirtNumber: number;

  @IsNotEmpty({ message: "من فضلك ارسل الاسم المسجل على التيشرت " })
  shirtName: string;

  birthDate: Date;

  phoneNumber: string;

  countryId: number;
}

export class ChangeLanguageCommand {
  @IsEnum(["ar", "en", "es", "po"], { message: "من فضلك ارسل اللغة المطلوبة" })
  language: string;
}
