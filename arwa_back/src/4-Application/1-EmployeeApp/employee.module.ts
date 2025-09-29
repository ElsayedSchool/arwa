import { Module } from "@nestjs/common";
import { winstonLoggerConfig } from "src/3-Infrastructure/Logger/logger.config";
import { EmployeeController } from "./employee.controller";
import { InfrastructureModule } from "src/3-Infrastructure/Infrastructure.Module";
import { ChangePasswordHandler } from "./Commands/ChangePasswordCommand/changePassword.Handler";
import { GetAllEmployeesHandler } from "./Queries/GetAllEmployee/getAllEmployees.Handler";
import { ChangeEmployeeRoleHandler } from "./Commands/ChangeEmployeeRole/changeEmployeeRole.Handler";
import { DeactivateEmployeeHandler } from "./Commands/DeactivateEmployee/deactivateEmployee.Handler";
import { RemoveEmployeeHandler } from "./Commands/RemoveEmployee/removeEmployee.Handler";
import { GetEmployeeDetailHandler } from "./Queries/GetEmployeeDetail/getEmployeeDetail.Handler";
import { AuthService } from "../0-AuthenticationApp/auth.service";
import { UpsertEmployeeHandler } from "./Commands/UpsertEmployee/upsertEmployee.Handler";

@Module({
  imports: [InfrastructureModule],
  providers: [
    {
      provide: "Logger", // Provide a token or identifier for the logger
      useValue: winstonLoggerConfig, // Use the logger instance from your winstonLoggerConfig
    },
    AuthService,
    ChangePasswordHandler,
    GetAllEmployeesHandler,
    ChangeEmployeeRoleHandler,
    UpsertEmployeeHandler,
    DeactivateEmployeeHandler,
    RemoveEmployeeHandler,
    GetEmployeeDetailHandler,
  ],
  controllers: [EmployeeController],
  exports: [],
})
export class EmployeeModule {}
