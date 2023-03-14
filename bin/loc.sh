#!/bin/bash
# npm install -g ddate
# npm install -g sloc

# Lines of code is a terrible signifier of progress, but it's something
# I like to watch.
# Also: git ls-files | xargs wc -l

echo
ddate
date
sloc client/ data/ engine/ spec/
