import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './ideas.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepositotry: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) { }

  private toResponseObject (idea: IdeaEntity): IdeaRO {
    return { ...idea, author: idea.author.toResponseObject(false) }
  }

  private ensureOwnerShip (idea: IdeaEntity, userId: string) {
    if (idea.author.id !== userId) {
      throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED)
    }
  }

  async showAll (): Promise<IdeaRO[]> {
    const ideas = await this.ideaRepositotry.find({ relations: ['author'] });
    return ideas.map(idea => this.toResponseObject(idea));
  }

  async create (userId: string, data: IdeaDTO): Promise<IdeaRO> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    const idea = this.ideaRepositotry.create({ ...data, author: user });
    await this.ideaRepositotry.save(idea);
    return this.toResponseObject(idea);
  }

  async read (id: string): Promise<IdeaRO> {
    const idea = await this.ideaRepositotry.findOne({ where: { id }, relations: ['author'] });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
    return this.toResponseObject(idea);
  }

  async update (id: string, userId: string, data: Partial<IdeaDTO>): Promise<IdeaRO> {
    let idea = await this.ideaRepositotry.findOne({ where: { id }, relations: ['author'] })
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
    this.ensureOwnerShip(idea, userId);
    await this.ideaRepositotry.update({ id }, data);
    idea = await this.ideaRepositotry.findOne({ where: { id }, relations: ['author'] })
    return this.toResponseObject(idea);
  }

  async destroy (id: string, userId: string): Promise<IdeaRO> {
    const idea = await this.ideaRepositotry.findOne({ where: { id }, relations: ['author'] })
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
    this.ensureOwnerShip(idea, userId);
    await this.ideaRepositotry.delete({ id });
    return this.toResponseObject(idea);
  }
}
