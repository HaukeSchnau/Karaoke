#!/bin/bash

source spleeter/env/bin/activate
spleeter separate -p spleeter:2stems -o audio/separated -p spleeter/base_config.json $1