# sudo npm -g install vows
# TODO: http://benchmarkjs.com/docs
#!/bin/bash
tests=$(dirname $0)
for s in $(ls -d $tests/*/);
do 
  for f in $s*.js; do echo $f; node $f; done;
done;
