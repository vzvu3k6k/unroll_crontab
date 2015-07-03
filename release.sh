#!/bin/sh

DIR=dist
BRANCH=gh-pages

pushd $DIR
git init -q
git checkout -q -b $BRANCH
git add --all
git commit -m "Release $(git --git-dir ../.git rev-parse HEAD)"
git push -f git@github.com:$(git config --get user.name)/$(cd ..; basename $(pwd)).git $BRANCH
