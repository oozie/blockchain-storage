#!/bin/bash

curdir="$(dirname $0)"
contracts_dir=$curdir/../frontend/public/contracts
mkdir -p "$contracts_dir"
cp $curdir/build/contracts/*.json "$contracts_dir"
