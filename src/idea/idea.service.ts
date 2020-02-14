import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './ideas.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO } from './idea.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepositotry: Repository<IdeaEntity>,
  ) {}

  async showAll(): Promise<IdeaEntity[]> {
    return await this.ideaRepositotry.find();
  }

  async create(data: IdeaDTO): Promise<IdeaEntity> {
    const idea = await this.ideaRepositotry.create(data);
    await this.ideaRepositotry.save(idea);
    return idea;
  }

  async read(id: string): Promise<IdeaEntity> {
    return await this.ideaRepositotry.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<IdeaDTO>): Promise<IdeaEntity> {
    await this.ideaRepositotry.update({ id }, data);
    return await this.ideaRepositotry.findOne({ id });
  }

  async destroy(id: string) {
    await this.ideaRepositotry.delete({ id });
    return { deleted: true };
  }
}
