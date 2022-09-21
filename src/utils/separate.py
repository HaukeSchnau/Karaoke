from spleeter.separator import Separator, STFTBackend
from spleeter.audio.adapter import AudioAdapter, Codec
import numpy as np
import json
from flask import Flask
from flask_cors import CORS, cross_origin

audio_adapter = AudioAdapter.default()
separator = Separator(
    "spleeter/base_config.json", MWF=False, stft_backend=STFTBackend.AUTO
)


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/<name>/<int:offset>/<int:duration>/<variant>")
@cross_origin()
def separate(name, offset, duration, variant):
    path = f"cache/audio/{name}"

    waveform, _ = audio_adapter.load(
        path,
        offset=offset,
        duration=duration,
    )
    sources = separator.separate(waveform)
    for instrument, data in sources.items():
        if instrument == variant:
            return json.dumps(data.tolist())

    return ""
