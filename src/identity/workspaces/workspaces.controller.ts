import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { CreateWorkspaceBodyDto } from './dto/create-workspace-body.dto';

@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  create(
    @Req() request: Request,
    @Body() createWorkspaceDto: CreateWorkspaceBodyDto,
  ) {
    return this.workspacesService.create(request, createWorkspaceDto);
  }

  @Get()
  findAll(@Req() request: Request) {
    return this.workspacesService.findAll(request);
  }

  @Get(':id')
  findOne(@Req() request: Request, @Param('id') id: string) {
    return this.workspacesService.findOne(request, id);
  }

  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(request, id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.workspacesService.remove(request, id);
  }
}
