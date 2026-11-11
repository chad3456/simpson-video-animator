st () 
{ 
    rm -rf /tmp/claude-0/st;
    NODE_PATH=$(npm root -g) node tools/stills.mjs /tmp/claude-0/st "$@" 2>&1 | grep -v "^total";
    python3 tools/sheet.py /tmp/claude-0/st /tmp/claude-0/sheet.jpg
}
