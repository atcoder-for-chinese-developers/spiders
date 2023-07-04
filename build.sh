node index.js;

if [ -d $STATIC_DIR -a $STATIC_DIR ]; then
    \cp -r $STATIC_DIR/* dist
fi;
