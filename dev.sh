#!/bin/bash

tmux new-session -d -s karaoke-dev 'cd frontend && npm run dev'
tmux select-window -t karaoke-dev:0
tmux split-window -h 'cd backend && npm run dev'
tmux -2 attach-session -t karaoke-dev