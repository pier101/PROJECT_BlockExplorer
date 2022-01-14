#!/bin/bash
kill -9 `ps -ef | grep node | grep main.js | awk '{print $2}'`
node main.js &