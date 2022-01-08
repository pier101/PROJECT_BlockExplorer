#!/bin/bash
kill -9 `ps -ef | grep node | grep p_main.js | awk '{print $2}'`
node p_main.js &