import { Module } from "@nestjs/common";

import { RegistrationAttemptsController } from "./registration-attempts.controller";
import { RegistrationAttemptsService } from "./registration-attempts.service";

@Module({
  controllers: [RegistrationAttemptsController],
  providers: [RegistrationAttemptsService],
  exports: [RegistrationAttemptsService],
})
export class RegistrationAttemptsModule {}
