import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,

} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';

@Controller('idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) { }

  @Get()
  showAllIdeas () {
    return this.ideaService.showAll();
  }

  @Get(':id')
  readIdea (@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createIdea (@Body() idea: IdeaDTO) {
    return this.ideaService.create(idea);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateIdea (@Param('id') id: string, @Body() idea: Partial<IdeaDTO>) {
    return this.ideaService.update(id, idea);
  }

  @Delete(':id')
  destroyIdea (@Param('id') id: string) {
    return this.ideaService.destroy(id);
  }
}
