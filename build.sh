#!/bin/bash
zip -rj build.zip src/* && zip -ur build.zip node_modules
rc=$?

if [[ rc -eq 12 ]]; then
    exit 0
fi

exit $rc