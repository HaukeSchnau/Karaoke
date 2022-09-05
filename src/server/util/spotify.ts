import { env } from "@src/env/server.mjs";
import SpotifyWebApi from "spotify-web-api-node";
import type { Image } from "@src/types";

const spotifyApi = new SpotifyWebApi({
  clientId: env.SPOTIFY_CLIENT_ID,
  clientSecret: env.SPOTIFY_CLIENT_SECRET,
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
  } catch (e: any) {
    console.log(e.message);
  }
}

const getSize = (image: Image) => {
  if (image.width && image.height) return image.width * image.height;
  if (image.width) return image.width;
  if (image.height) return image.height;
  return 0;
};

function mapSong(song: SpotifyApi.TrackObjectFull) {
  const imgUrl = song.album.images.sort((a, b) => getSize(b) - getSize(a))[0]?.url;

  return {
    name: song.name,
    id: song.id,
    album: song.album.name,
    artists: song.artists.map((artist) => artist.name),
    releaseDate: song.album.release_date,
    durationMs: song.duration_ms,
    images: song.album.images,
    imgUrl,
  };
}

export default {
  search,
  getSongById,
};
