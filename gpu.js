gpu = {
    _vram: [],
    _oam: [],
    _mode: 0,
    _modeClock: 0,
    _line: 0,
    _canvasContext: {},
    _frameBuffer: {},
    _tileset: [],
    _pal: [],
    _switchbg: 0,
    _bgmap: 0,
    _bgtile: 0,
    _switchlcd: 0,
    _scy: 0,
    _scx: 0,
    reset: () => {
        let canvas = document.getElementById("entry");
        if (canvas && canvas.getContext) {
            gpu._canvasContext = canvas.getContext('2d');
            if (gpu._canvasContext.createImageData) {
                imageData = gpu._canvasContext.createImageData(160, 144);
                for (let i = 0; i < imageData.data.length; i += 4) {
                    imageData.data[i + 0] = 0;
                    imageData.data[i + 1] = 0;
                    imageData.data[i + 2] = 0;
                    imageData.data[i + 3] = 255;
                }
                gpu._frameBuffer = imageData;
            } else if (gpu._canvasContext.getImageData) {
                gpu._frameBuffer = gpu._canvasContext.getImageData(0, 0, 160, 144);
            } else {
                gpu._frameBuffer = {
                    'width': 160,
                    'height': 144,
                    'data': new Array(160 * 144 * 4)
                };
                for (var i = 0; i < 160 * 144 * 4; i++) {
                    gpu._frameBuffer.data[i] = 0;
                }
            }
            gpu._tileset = [];
            for (let i = 0; i < 512; i++) {
                gpu._tileset[i] = [];
                for (let j = 0; j < 8; j++) {
                    gpu._tileset[i][j] = [];
                    for (let k = 0; k < 8; k++) {
                        gpu._tileset[i][j][k] = 0;
                    }
                }
            }
            gpu._canvasContext.putImageData(gpu._frameBuffer, 0, 0);
        }
    },
    step: () => {
        gpu._modeClock += cpu._registers.m;
        switch (gpu._mode) {
            case 2:
                if (gpu._modeClock >= 20) {
                    gpu._modeClock = 0;
                    gpu._mode = 3;
                }
                break;

            case 3:
                if (gpu._modeClock >= 43) {
                    gpu._modeClock = 0;
                    gpu._mode = 0
                    gpu.renderscan();
                }
                break;
            case 0:
                if (gpu._modeClock >= 51) {
                    gpu._modeClock = 0;
                    gpu._line++;
                    if (gpu._line == 143) {
                        gpu._mode = 1;
                        gpu._canvasContext.putImageData(gpu._frameBuffer, 0, 0);
                    } else {
                        gpu._mode = 2;
                    }
                }
                break;
            case 1:
                if (gpu._modeClock >= 114) {
                    gpu._modeClock = 0;
                    gpu._line++;

                    if (gpu._line > 153) {
                        gpu._mode = 2;
                        gpu._line = 0;
                    }
                }
                break;
        }
    },
    updateTile: (addr, val) => {
        addr &= 0x1FFE;
        let tile = (addr >> 4) & 511;
        let y = (addr >> 1) & 7;

        let sx;

        for (let x = 0; x < 8; x++) {
            sx = 1 << (7 - x);
            gpu._tileset[tile][y][x] = ((gpu._vram[addr] & sx) ? 1 : 0) + ((gpu._vram[addr + 1] & sx) ? 2 : 0);
        }
    },
    renderscan: () => {
        // VRAM offset for the tile map
        var mapoffs = gpu._bgmap ? 0x1C00 : 0x1800;

        // Which line of tiles to use in the map
        mapoffs += ((gpu._line + gpu._scy) & 255) >> 3;

        // Which tile to start with in the map line
        var lineoffs = (gpu._scx >> 3);

        // Which line of pixels to use in the tiles
        var y = (gpu._line + gpu._scy) & 7;

        // Where in the tileline to start
        var x = gpu._scx & 7;

        // Where to render on the canvas
        var canvasoffs = gpu._line * 160 * 4;

        // Read tile index from the background map
        var colour;
        if (gpu._vram[mapoffs + lineoffs] == undefined) {
            return;
        }
        
        var tile = gpu._vram[mapoffs + lineoffs];

        // If the tile data set in use is #1, the
        // indices are signed; calculate a real tile offset
        if (gpu._bgtile == 1 && tile < 128) tile += 256;

        for (var i = 0; i < 160; i++) {
            if (gpu._pal[gpu._tileset[tile][y][x]] == undefined) {
                return;
            }
            // Re-map the tile pixel through the palette
            colour = gpu._pal[gpu._tileset[tile][y][x]];

            // Plot the pixel to canvas
            gpu._frameBuffer.data[canvasoffs + 0] = colour[0];
            gpu._frameBuffer.data[canvasoffs + 1] = colour[1];
            gpu._frameBuffer.data[canvasoffs + 2] = colour[2];
            gpu._frameBuffer.data[canvasoffs + 3] = colour[3];
            canvasoffs += 4;

            // When this tile ends, read another
            x++;
            if (x == 8) {
                x = 0;
                lineoffs = (lineoffs + 1) & 31;
                tile = gpu._vram[mapoffs + lineoffs];
                if (gpu._bgtile == 1 && tile < 128) tile += 256;
            }
        }
    },
    read8: (addr) => {
        console.log("gpu.read8")
        switch(addr) {
            case 0xFF00:
                return (
                (gpu._switchbg ? 0x01 : 0x00) | 
                (gpu._bgmap ? 0x08 : 0x00) | 
                (gpu._bgtile ? 0x10 : 0x00) |
                (gpu._switchlcd ? 0x80 : 0x00)
                )
            case 0xFF42:
                return gpu._scy;
            case 0xFF43:
                return gpu._scx;
            case 0xFF44:
                return gpu._line;
        }
    },
    write8: (addr, val) => {
        console.log("gpu.write8 at 0x" + addr.toString(16));
        switch(addr) {
            case 0xFF00:
            gpu._switchbg = (val & 0x01) ? 1 : 0;
            gpu._bgmap = (val & 0x08) ? 1 : 0;
            gpu._bgtile = (val & 0x10) ? 1 : 0;
            gpu._switchlcd = (val & 0x80) ? 1 : 0;
            break;
            case 0xFF42:
                gpu._scy = val;
                break;
            case 0xFF43:
                gpu._scx = val;
                break;
            case 0xFF47:
                for (let i = 0; i < 4; i++) {
                    switch((val >> (i * 2)) & 3) {
                        case 0: gpu._pal[i] = [255, 255, 255, 255]; break;
                        case 1: gpu._pal[i] = [192, 192, 192, 192]; break;
                        case 2: gpu._pal[i] = [96, 96, 96, 96]; break;
                        case 3: gpu._pal[i] = [0, 0, 0, 0]; break;
                    }
                }
                break;
        }
    }
}

document.getElementById("gpubutton").onclick = () => {
    gpu.reset();
}
document.getElementById("testbutton").onclick = () => {
    console.log("test")
    for (let i = 0; i < gpu._tileset.length; i++) {
        for (let j = 0; j < gpu._tileset[i].length; j++) {
            for (let k = 0; k < gpu._tileset[i][j].length; k++) {
                if (gpu._tileset[i][j][k] != 0) {
                    console.log("here")
                }
            }
        }
    }
}