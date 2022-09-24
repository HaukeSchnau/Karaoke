import { env } from "@src/env/server.mjs";
import { getImgUrl } from "@src/utils/spotify";
import SpotifyWebApi from "spotify-web-api-node";

const scopes = ["playlist-modify-public", "playlist-modify-private"];
const state = "some-state-of-my-choice";

const spotifyApi = new SpotifyWebApi({
  clientId: env.SPOTIFY_CLIENT_ID,
  clientSecret: env.SPOTIFY_CLIENT_SECRET,
  redirectUri: "http://localhost:3000/api/login-callback",
});

async function getAuthorizeUrl() {
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  return authorizeURL;
}

async function getCredentials(code: string) {
  return spotifyApi.authorizationCodeGrant(code);
}

export async function search(query: string, accessToken: string) {
  if (!query.trim().length) return [];

  spotifyApi.setAccessToken(accessToken);

  const results = await spotifyApi.searchTracks(query);
  return results.body.tracks?.items.map(mapSong);
}

export const getPlaylist = async (accessToken: string) => {
  const playlistId = env.SPOTIFY_PLAYLIST_ID;

  spotifyApi.setAccessToken(accessToken);
  const res = await spotifyApi.getPlaylist(playlistId);

  return res.body;
};

export async function getSongById(id: string, accessToken: string) {
  try {
    spotifyApi.setAccessToken(accessToken);
    const results = await spotifyApi.getTrack(id);
    return mapSong(results.body);
  } catch (e: any) {
    console.log(e.message);
  }
}

function mapSong(song: SpotifyApi.TrackObjectFull) {
  const { name, id, artists, album, uri, duration_ms } = song;
  return {
    name: name,
    id: id,
    album: album.name,
    artists: artists.map((artist) => artist.name),
    releaseDate: album.release_date,
    durationMs: duration_ms,
    images: album.images,
    imgUrl: getImgUrl(album.images),
    uri: uri,
  };
}

async function removeTrack(uri: string, accessToken: string) {
  spotifyApi.setAccessToken(accessToken);
  return await spotifyApi.removeTracksFromPlaylist(env.SPOTIFY_PLAYLIST_ID, [
    { uri },
  ]);
}

export default {
  search,
  getSongById,
  getPlaylist,
  removeTrack,
  getAuthorizeUrl,
  getCredentials,
};
