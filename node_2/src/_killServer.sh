#!/bin/bash
kill -9 `ps -ef | grep node | grep _main.js | awk '{print $2}'`