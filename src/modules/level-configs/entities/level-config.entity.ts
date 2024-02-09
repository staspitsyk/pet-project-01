import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity()
export class LevelConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  @Index()
  level: number;

  @Column({ type: 'bigint', nullable: false })
  startXp: string;

  @Column({ type: 'bigint', nullable: false })
  endXp: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
