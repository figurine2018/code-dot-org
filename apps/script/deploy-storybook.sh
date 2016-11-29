#!/bin/bash
set -e # Exit on error

echo "Going to build and deploy storybook to cdo-styleguide gh-pages repo"

DIR_TO_DEPLOY=storybook-deploy
SSH_REPO=git@github.com:code-dot-org/cdo-styleguide.git
SHA=`git rev-parse --verify HEAD`

# get rid of old build if it is still around for some reason
rm -rf $DIR_TO_DEPLOY

# fetch version of application.css that is generated by rails
echo "Compiling application.css using rails asset pipeline"
pushd ../dashboard
rails assets:precompile || true
cp public/assets/css/application-*.css ../apps/build/package/application.css
popd

# build the static storybook site
echo "Building the static storybook site"
build-storybook -o $DIR_TO_DEPLOY -s build/package/

# remove a bunch of crap we don't actually need.
echo "Removing some unused files"
pushd $DIR_TO_DEPLOY
rm -rf media
rm -rf js
popd

echo "Pushing to github... cloning gh-pages branch"
# Clone the gh-pages branch to /tmp/pages
rm -rf /tmp/pages
git clone --branch gh-pages --single-branch --depth 1 -- $SSH_REPO /tmp/pages

# Delete the old release
rm -rf /tmp/pages/*
# Copy in the new release
cp -R $DIR_TO_DEPLOY/* /tmp/pages
pushd /tmp/pages
# Quit if nothing has changed in this branch
CHANGED_FILES=`git status --porcelain`
if [ -z "$CHANGED_FILES" ]; then
  echo "No changes to push; skipping deploy."
  exit 0
fi

# Commit the changes to the gh-pages branch
git config user.name "Circle CI"
git config user.email "dev@code.org"
git add --all
git commit -m "Update GitHub Pages: $SHA"
# Push our updated gh-pages branch
echo "Pushing to github... pushing new gh-pages branch"
git push $SSH_REPO gh-pages

echo "cleaning up!"
# clean up after ourselves
popd
rm -rf $DIR_TO_DEPLOY

echo "if everything worked, your changes should be up on https://code-dot-org.github.io/cdo-styleguide/"
