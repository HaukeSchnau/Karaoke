import SpotifyWebApi from "spotify-web-api-node";
import config from "./config";

type Song = {
  name: string;
  id: string;
  album: string;
  artists: string[];
  releaseDate: string;
  durationMs: number;
  images: any[];
};

const spotifyApi = new SpotifyWebApi({
  clientId: config.spotifyClientId,
  clientSecret: config.spotifyClientSecret,
});

export async function search(query: string) {
  if (!query.trim().length) return [];

  await spotifyApi.clientCredentialsGrant().then(
    function (data) {
      console.log("The access token expires in " + data.body["expires_in"]);
      console.log("The access token is " + data.body["access_token"]);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body["access_token"]);
    },
    function (err) {
      console.log("Something went wrong when retrieving an access token", err);
    }
  );

  const results = await spotifyApi.searchTracks(query);
  return results.body.tracks?.items.map(mapSong);
}

export async function getSongById(id: string) {
  await spotifyApi.clientCredentialsGrant().then(
    function (data) {
      console.log("The access token expires in " + data.body["expires_in"]);
      console.log("The access token is " + data.body["access_token"]);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body["access_token"]);
    },
    function (err) {
      console.log("Something went wrong when retrieving an access token", err);
    }
  );

  try {
    const results = await spotifyApi.getTrack(id);
    return mapSong(results.body);
  } catch (e) {
    console.log(e.message);
  }
}

function mapSong(song: SpotifyApi.TrackObjectFull) {
  return {
    name: song.name,
    id: song.id,
    album: song.album.name,
    artists: song.artists.map((artist) => artist.name),
    releaseDate: song.album.release_date,
    durationMs: song.duration_ms,
    images: song.album.images,
  };
}

export default {
  search,
  getSongById,
};
