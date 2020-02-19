import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  UseGuards,

} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';

@Controller('api/ideas')
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
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createIdea (@User('id') user, @Body() idea: IdeaDTO) {
    return this.ideaService.create(user, idea);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  updateIdea (@Param('id') id: string, @User('id') user: string, @Body() idea: Partial<IdeaDTO>) {
    return this.ideaService.update(id, user, idea);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroyIdea (@Param('id') id: string, @User('id') user: string) {
    return this.ideaService.destroy(id, user);
  }
}
