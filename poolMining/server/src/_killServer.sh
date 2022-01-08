#!/bin/bash
kill -9 `ps -ef | grep node | grep p_main.js | awk '{print $2}'`