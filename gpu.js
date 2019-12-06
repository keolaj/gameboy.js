gpu = {
    _vram: [],
    _mode: 0,
    _modeClock: 0,
    _line: 0,
    _canvasContext: {},
    _screen: {},
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
                gpu._screen = imageData;
            } else if (gpu._canvasContext.getImageData) {
                gpu._screen = gpu._canvasContext.getImageData(0, 0, 160, 144);
            } else {
                gpu._screen = {
                    'width': 160,
                    'height': 144,
                    'data': new Array(160 * 144 * 4)
                };
                for (var i = 0; i < 160 * 144 * 4; i++) {
                    gpu._screen.data[i] = 0;
                }
            }
            gpu._canvasContext.putImageData(gpu._screen, 0, 0);
        }
    },
    step: () => {
        gpu._modeClock += cpu._registers.t;

        switch(gpu._mode) {
            case 2:
                if (gpu._modeClock >= 80) {
                    gpu._modeClock = 0;
                    cpu._mode = 3;
                }
                break;

            case 3:
                if (gpu._modeClock >= 172) {
                    gpu._modeClock = 0;
                    gpu._mode = 0
                    gpu.renderscan();
                }
                break;
            case 0:
                if (gpu._modeClock >= 204) {
                    gpu._modeClock = 0;
                    gpu._line++;

                    if (gpu._line == 143) {
                        gpu._mode = 1;
                        gpu._canvasContext.putImageData(gpu._screen, 0, 0);
                    } else {
                        gpu._mode = 2;
                    } 
                }
                break;
            case 1:
                if (gpu._modeClock >= 456) {
                    gpu._modeClock = 0;
                    gpu._line++;

                    if (gpu._line > 153) {
                        gpu._mode = 2;
                        cpu._line = 0;
                    }
                }
                break;
        }
    }
}

document.getElementById("gpubutton").onclick = () => {
    gpu.reset();
}