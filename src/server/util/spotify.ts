import { env } from "@src/env/server.mjs";
import { getImgUrl } from "@src/utils/spotify";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: env.SPOTIFY_CLIENT_ID,
  clientSecret: env.SPOTIFY_CLIENT_SECRET,
});

async function getCredentials() {
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
}

export async function search(query: string) {
  if (!query.trim().length) return [];

  await getCredentials();

  const results = await spotifyApi.searchTracks(query);
  return results.body.tracks?.items.map(mapSong);
}

export const getPlaylist = async () => {
  await getCredentials();
  const playlistId = env.SPOTIFY_PLAYLIST_ID;

  const res = await spotifyApi.getPlaylist(playlistId);

  return res.body;
};

export async function getSongById(id: string) {
  await getCredentials();

  try {
    const results = await spotifyApi.getTrack(id);
    return mapSong(results.body);
  } catch (e: any) {
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
    imgUrl: getImgUrl(song.album.images),
  };
}

export default {
  search,
  getSongById,
  getPlaylist,
};
