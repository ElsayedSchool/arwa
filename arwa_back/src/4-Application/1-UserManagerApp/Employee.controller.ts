import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { GetAllEmployeesHandler } from "./Queries/GetAllEmployee/getAllEmployees.Handler";
import { GetEmployeeDetailHandler } from "./Queries/GetEmployeeDetail/getEmployeeDetail.Handler";
import { DeactivateEmployeeHandler } from "./Commands/DeactivateEmployee/deactivateEmployee.Handler";
import { ChangeEmployeeRoleHandler } from "./Commands/ChangeEmployeeRole/changeEmployeeRole.Handler";
import { RemoveEmployeeHandler } from "./Commands/RemoveEmployee/removeEmployee.Handler";
import { GetEmployeeDetailQuery } from "./Queries/GetEmployeeDetail/getEmployeeDetail.Query";
import { DeactivateEmployeeCommand } from "./Commands/DeactivateEmployee/deactivateEmployee.Command";
import { RemoveEmployeeCommand } from "./Commands/RemoveEmployee/removeEmployee.Command";
import { ChangeEmployeeRoleCommand } from "./Commands/ChangeEmployeeRole/changeEmployeeRole.Command";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/1-Core/Guards/Roles.Guard";
import { Roles } from "src/3-Infrastructure/Authentication/Roles/Roles.Type";
import { ChangePasswordHandler } from "./Commands/ChangePasswordCommand/changePassword.Handler";
import { ChangePasswordCommand } from "./Commands/ChangePasswordCommand/changePassword.Command";
import { UpsertEmployeeCommand } from "./Commands/UpsertEmployee/upsertEmployee.Command";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UpsertEmployeeHandler } from "./Commands/UpsertEmployee/upsertEmployee.Handler";

@Controller("Employee")
export class EmployeeManagerController {
  constructor(
    private getAll: GetAllEmployeesHandler,
    private getDetail: GetEmployeeDetailHandler,
    private upsertEmployee: UpsertEmployeeHandler,
    private deactivate: DeactivateEmployeeHandler,
    private changeRole: ChangeEmployeeRoleHandler,
    private remove: RemoveEmployeeHandler,
    private changePasswordHandler: ChangePasswordHandler
  ) {}

  @Get("/all")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async getAllEmployees() {
    return await this.getAll.handle();
  }

  @Post("/detail")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async getEmployeeDetail(@Body() query: GetEmployeeDetailQuery) {
    return await this.getDetail.handle(query);
  }

  @Post()
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  @UseInterceptors(FilesInterceptor("photos", 1))
  async addEmployee(
    @Body() command: UpsertEmployeeCommand,
    @UploadedFiles() photos: Express.Multer.File[]
  ) {
    return await this.upsertEmployee.handle(command, photos);
  }

  @Post("/deactive")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async deactivateEmployee(
    @Body() command: DeactivateEmployeeCommand
  ): Promise<boolean> {
    return await this.deactivate.handle(command);
  }

  @Put("/remove")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async removeEmployee(
    @Body() command: RemoveEmployeeCommand
  ): Promise<boolean> {
    return await this.remove.handle(command);
  }

  @Post("/changerole")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async changeEmployeeRole(
    @Body() command: ChangeEmployeeRoleCommand
  ): Promise<boolean> {
    return await this.changeRole.handle(command);
  }

  //get Employee coins
  @Get("/getcoins")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin", "AddCoins")
  async getEmployeeCoins(@Req() req) {
    const EmployeeId = req.Employee.id;
    console.log("EmployeeId", EmployeeId);
    return await this.getDetail.handle({ id: EmployeeId });
  }

  @Put("/changepassword")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async changePassword(
    @Body() command: ChangePasswordCommand
  ): Promise<boolean> {
    return await this.changePasswordHandler.handle(command);
  }
}
