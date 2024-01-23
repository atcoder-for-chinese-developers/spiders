ts-node --files --esm index.ts;

if [ -d $STATIC_DIR -a $STATIC_DIR ]; then
    \cp -r $STATIC_DIR/* dist
fi;
