# npm install vows
# TODO: http://benchmarkjs.com/docs
#!/bin/bash
for s in $(ls -d */);
do 
  for f in $s*.js; do echo $f; node $f; done;
done;