
import { IsNotEmpty , IsString} from 'class-validator';

export class UploadProfileDto {
  @IsNotEmpty()
  @IsString()

  adminid: string;

}
