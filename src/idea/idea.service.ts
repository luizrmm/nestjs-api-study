import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './ideas.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO } from './idea.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepositotry: Repository<IdeaEntity>,
  ) { }

  async showAll (): Promise<IdeaEntity[]> {
    return await this.ideaRepositotry.find();
  }

  async create (data: IdeaDTO): Promise<IdeaEntity> {
    const idea = this.ideaRepositotry.create(data);
    await this.ideaRepositotry.save(idea);
    return idea;
  }

  async read (id: string): Promise<IdeaEntity> {
    const idea = await this.ideaRepositotry.findOne({ where: { id } });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
    return idea;
  }

  async update (id: string, data: Partial<IdeaDTO>): Promise<IdeaEntity> {
    let idea = await this.ideaRepositotry.findOne({ where: { id } })
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
    await this.ideaRepositotry.update({ id }, data);
    idea = await this.ideaRepositotry.findOne({ where: { id } })
    return idea;
  }

  async destroy (id: string) {
    const idea = await this.ideaRepositotry.findOne({ where: { id } })
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
    await this.ideaRepositotry.delete({ id });
    return idea;
  }
}
