
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateClientUiConfigInput {
    name: string;
    type: string;
    isFolder: boolean;
    items: Nullable<CreateClientUiConfigInput>[];
}

export interface ClientUiConfig {
    name?: Nullable<string>;
    type?: Nullable<string>;
    isFolder?: Nullable<boolean>;
    description?: Nullable<string>;
    items?: Nullable<Nullable<ClientUiConfig>[]>;
}

export interface IQuery {
    clientUiConfig(): Nullable<ClientUiConfig> | Promise<Nullable<ClientUiConfig>>;
}

export interface IMutation {
    createClientUiConfig(createClientUiConfigInput: CreateClientUiConfigInput): ClientUiConfig | Promise<ClientUiConfig>;
}

type Nullable<T> = T | null;
