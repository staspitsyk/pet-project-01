export const clientUiConfigQuery = () => {
  return {
    query: `{
      clientUiConfig {
        name
        isFolder
        description
        type
        items {
          name
          isFolder
          description
          type
          items {
            name
            isFolder
            description
            type
            items {
              name
              isFolder
              description
              type
              items {
                name
                isFolder
                description
                type
                items {
                  name
                  isFolder
                  description
                  type
                }
              }
            }
          }
        }
      }
    }`,
  };
};
