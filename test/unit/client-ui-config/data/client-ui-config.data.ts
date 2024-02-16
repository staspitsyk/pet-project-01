import { ClientUiConfig } from 'src/modules/client-ui-config/client-ui-config.schema';
import { ClientUiConfigCandidate } from 'src/modules/client-ui-config/types';

export const clientUiConfigCandidateTemplate: ClientUiConfigCandidate = {
  name: '1',
  isFolder: true,
  type: 'DROP_DOWN',
  items: [
    {
      name: '2',
      isFolder: true,
      type: 'DROP_DOWN',
      items: [
        {
          name: '3',
          isFolder: true,
          type: 'DROP_DOWN',
          items: [
            {
              name: '4',
              type: 'BUTTON',
              isFolder: false,
              items: [],
            },
            {
              name: '5',
              type: 'BUTTON',
              isFolder: false,
              items: [],
            },
          ],
        },
        {
          name: '6',
          type: 'INPUT',
          isFolder: false,
          items: [],
        },
      ],
    },
    {
      name: '7',
      isFolder: true,
      type: 'DROP_DOWN',
      items: [
        {
          name: '8',
          type: 'INPUT',
          isFolder: false,
          items: [],
        },
        {
          name: '9',
          type: 'BUTTON',
          isFolder: false,
          items: [],
        },
      ],
    },
    {
      name: '10',
      type: 'RADIO_BUTTON',
      isFolder: false,
      items: [],
    },
  ],
};

export const clientUiConfigTemplate: ClientUiConfig = {
  _id: 'test-id',
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
  name: '1',
  isFolder: true,
  type: 'DROP_DOWN',
  items: [
    {
      name: '2',
      isFolder: true,
      type: 'DROP_DOWN',
      items: [
        {
          name: '3',
          isFolder: true,
          type: 'DROP_DOWN',
          items: [
            {
              name: '4',
              type: 'BUTTON',
              isFolder: false,
              items: [],
            },
            {
              name: '5',
              type: 'BUTTON',
              isFolder: false,
              items: [],
            },
          ],
        },
        {
          name: '6',
          type: 'INPUT',
          isFolder: false,
          items: [],
        },
      ],
    },
    {
      name: '7',
      isFolder: true,
      type: 'DROP_DOWN',
      items: [
        {
          name: '8',
          type: 'INPUT',
          isFolder: false,
          items: [],
        },
        {
          name: '9',
          type: 'BUTTON',
          isFolder: false,
          items: [],
        },
      ],
    },
    {
      name: '10',
      type: 'RADIO_BUTTON',
      isFolder: false,
      items: [],
    },
  ],
};
