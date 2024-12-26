import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';

@EntityModel('system_config', { schema: 'house' })
export class SystemConfig {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', {
    name: 'verification_entry',
    nullable: true,
    comment: '实名认证的入口（1开启，0关闭）',
  })
  verificationEntry: number | null;

  @Column('int', {
    name: 'registry_entry',
    nullable: true,
    comment: '注册的入口（1开启，0关闭）',
  })
  registryEntry: number | null;
}
