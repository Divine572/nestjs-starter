import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;
}
