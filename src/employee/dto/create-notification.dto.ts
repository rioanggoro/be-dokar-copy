export class CreateNotificationDto {
  token_auth: string;
  id_employee: number;
  notification_type: string;
  description: string;
  status: string;
}
