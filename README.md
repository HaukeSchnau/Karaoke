# Karaoke-App

Web App that allows searching for songs and plays them with synchronized lyrics.

Thanks to the folks at [Spleeter](https://github.com/deezer/spleeter) the user can also choose to lower the volume of the vocals.

## Setup

1. Run `npm i` in `frontend` and `backend` folders
2. Install Spleeter in `backend`: (requires Python 3.8, currently incompatible with Python 3.9)

```bash
cd backend
mkdir spleeter && cd spleeter
virtualenv --python=python3.8 env
source env/bin/activate
pip install spleeter
```

3. Create file `backend/config.ts` and insert your API keys:

```typescript
export default {
  googleApiKey: "YOUR_GOOGLE_API_KEY",
  spotifyClientId: "YOUR_SPOTIFY_CLIENT_ID",
  spotifyClientSecret: "YOUR_SPOTIFY_CLIENT_SECRET",
  musixmatchUserToken: "YOUR_MUSIXMATCH_USER_TOKEN",
};
```

## Run Dev Server

Execute `dev.sh` script which runs backend and frontend dev servers in parallel.

Alternatively, execute `npm run dev` in both `frontend` and `backend` folders
