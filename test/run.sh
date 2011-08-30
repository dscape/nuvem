# sudo npm -g install vows
# TODO: http://benchmarkjs.com/docs
#!/bin/bash
NODE_ENV=production
for s in $(ls -d */);
do 
  for f in $s*.js; do echo $f; node $f; done;
done;
