import { PartialType } from '@nestjs/swagger';
import { CreateWorkspaceBodyDto } from './create-workspace-body.dto';

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceBodyDto) {}
