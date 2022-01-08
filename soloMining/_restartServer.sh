#!/bin/bash
kill -9 `ps -ef | grep node | grep s_main.js | awk '{print $2}'`
node s_main.js &