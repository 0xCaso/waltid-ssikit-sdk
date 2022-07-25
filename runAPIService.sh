#!/bin/bash
docker rm $(docker stop $(docker ps -a -q --filter ancestor=waltid/ssikit --format="{{.ID}}"))
docker run -itv $(pwd)/data:/app/data -p 7000-7004:7000-7004 waltid/ssikit -v serve -b 0.0.0.0