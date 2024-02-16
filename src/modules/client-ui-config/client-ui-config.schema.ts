import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ClientUiConfigCandidate } from './types';

export type ClientUiConfigDocument = HydratedDocument<ClientUiConfig>;

class ClientUiConfigNested {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: Boolean })
  isFolder: boolean;

  @Prop({ required: true, type: String })
  type: string;

  @Prop({ required: false, type: Array })
  items: ClientUiConfigCandidate[];
}

@Schema({ collection: 'client-ui-configs', timestamps: true, optimisticConcurrency: true })
export class ClientUiConfig {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: Boolean })
  isFolder: boolean;

  @Prop({ required: true, type: String })
  type: string;

  @Prop({ required: true, type: [ClientUiConfigNested] })
  items: ClientUiConfigCandidate[];

  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export const ClientUiConfigSchema = SchemaFactory.createForClass(ClientUiConfig);
