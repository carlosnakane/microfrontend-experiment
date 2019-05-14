#!/bin/bash

sh -x build-containers.sh &
sh -x build-frontend.sh

wait