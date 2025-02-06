// smashggAPI.js
export const fetchTournaments = async (coordinates, radius) => {
    const query = {
      query: `
        query Tournaments($perPage: Int!, $coordinates: String!, $radius: String!) {
          tournaments(
            query: {
              perPage: $perPage
              filter: {
                location: {
                  distanceFrom: $coordinates
                  distance: $radius
                }
              }
            }
          ) {
            nodes {
              id
              name
              city
              venueAddress
              startAt
              images {
                url
              }
            }
          }
        }
      `,
      variables: {
        perPage: 10,
        coordinates,
        radius
      },
    };
  
    try {
      const response = await fetch("https://api.start.gg/gql/alpha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_SMASHGG_API_TOKEN}`
        },
        body: JSON.stringify(query)
      });
  
      if (!response.ok) {
        throw new Error(`Start.gg API error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      if (data.errors) {
        console.error("GraphQL errors:", JSON.stringify(data.errors, null, 2));
        // Return an empty array or handle errors as needed
        return [];
      }
  
      // Return the array of tournaments
      return data.data?.tournaments?.nodes || [];
    } catch (error) {
      console.error("Error fetching Start.gg data:", error);
      throw error;
    }
  };
  