#!/bin/bash

source spleeter/env/bin/activate
spleeter separate -p spleeter:2stems -o seperated -p spleeter/base_config.json $1