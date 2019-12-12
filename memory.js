// credit to irman nazar for mmu, didnt feel like writing this. might rewrite my own later

memory = {
    _bios: [],
    _rom: [],
    _eram: [],
    _wram: [],
    _zram: [],

    _inbios: 1,

    initBios: () => {
        memory._bios = [
            0x31, 0xFE, 0xFF, 0xAF, 0x21, 0xFF, 0x9F, 0x32, 0xCB, 0x7C, 0x20, 0xFB, 0x21, 0x26, 0xFF, 0x0E, // 0x
            0x11, 0x3E, 0x80, 0x32, 0xE2, 0x0C, 0x3E, 0xF3, 0xE2, 0x32, 0x3E, 0x77, 0x77, 0x3E, 0xFC, 0xE0, // 1x
            0x47, 0x11, 0x04, 0x01, 0x21, 0x10, 0x80, 0x1A, 0xCD, 0x95, 0x00, 0xCD, 0x96, 0x00, 0x13, 0x7B, // 2x
            0xFE, 0x34, 0x20, 0xF3, 0x11, 0xD8, 0x00, 0x06, 0x08, 0x1A, 0x13, 0x22, 0x23, 0x05, 0x20, 0xF9, // 3x
            0x3E, 0x19, 0xEA, 0x10, 0x99, 0x21, 0x2F, 0x99, 0x0E, 0x0C, 0x3D, 0x28, 0x08, 0x32, 0x0D, 0x20, // 4x
            0xF9, 0x2E, 0x0F, 0x18, 0xF3, 0x67, 0x3E, 0x64, 0x57, 0xE0, 0x42, 0x3E, 0x91, 0xE0, 0x40, 0x04, // 5x
            0x1E, 0x02, 0x0E, 0x0C, 0xF0, 0x44, 0xFE, 0x90, 0x20, 0xFA, 0x0D, 0x20, 0xF7, 0x1D, 0x20, 0xF2, // 6x
            0x0E, 0x13, 0x24, 0x7C, 0x1E, 0x83, 0xFE, 0x62, 0x28, 0x06, 0x1E, 0xC1, 0xFE, 0x64, 0x20, 0x06, // 7x
            0x7B, 0xE2, 0x0C, 0x3E, 0x87, 0xF2, 0xF0, 0x42, 0x90, 0xE0, 0x42, 0x15, 0x20, 0xD2, 0x05, 0x20, // 8x
            0x4F, 0x16, 0x20, 0x18, 0xCB, 0x4F, 0x06, 0x04, 0xC5, 0xCB, 0x11, 0x17, 0xC1, 0xCB, 0x11, 0x17, // 9x
            0x05, 0x20, 0xF5, 0x22, 0x23, 0x22, 0x23, 0xC9, 0xCE, 0xED, 0x66, 0x66, 0xCC, 0x0D, 0x00, 0x0B, // ax
            0x03, 0x73, 0x00, 0x83, 0x00, 0x0C, 0x00, 0x0D, 0x00, 0x08, 0x11, 0x1F, 0x88, 0x89, 0x00, 0x0E, // bx
            0xDC, 0xCC, 0x6E, 0xE6, 0xDD, 0xDD, 0xD9, 0x99, 0xBB, 0xBB, 0x67, 0x63, 0x6E, 0x0E, 0xEC, 0xCC, // cx
            0xDD, 0xDC, 0x99, 0x9F, 0xBB, 0xB9, 0x33, 0x3E, 0x3c, 0x42, 0xB9, 0xA5, 0xB9, 0xA5, 0x42, 0x3C, // dx
            0x21, 0x04, 0x01, 0x11, 0xA8, 0x00, 0x1A, 0x13, 0xBE, 0x20, 0xFE, 0x23, 0x7D, 0xFE, 0x34, 0x20, // ex
            0xF5, 0x06, 0x19, 0x78, 0x86, 0x23, 0x05, 0x20, 0xFB, 0x86, 0x20, 0xFE, 0x3E, 0x01, 0xE0, 0x50  // fx
        ]
    },

    reset: function () {
        for (i = 0; i < 8192; i++) {
            memory._wram[i] = 0;
            memory._eram[i] = 0;
        }
        for (i = 0; i < 127; i++) {
            memory._zram[i] = 0;
        }
        memory._inbios = 1;
        memory._ie = 0;
        memory._if = 0;
    },

    load: function (file) {
        b = new BinFileReader(file);
        memory._rom = b.readString(b.getFileSize(), 0);
    },

    read8: function (addr) {
        switch (addr & 0xF000) {
            // ROM bank 0
            case 0x0000:
                if (memory._inbios) {
                    if (addr < 0x0100) return memory._bios[addr];
                    else if (cpu._registers.pc == 0x0100) {
                        console.log("out of bios");
                        memory._inbios = 0;
                    }
                } else {
                    return memory._rom[addr & 0x1FFF];
                }

                case 0x1000:
                case 0x2000:
                case 0x3000:
                    return memory._rom[addr & 0x1FFF];

                    // ROM bank 1
                case 0x4000:
                case 0x5000:
                case 0x6000:
                case 0x7000:
                    return memory._rom[addr & 0x1FFF];

                    // VRAM
                case 0x8000:
                case 0x9000:
                    return gpu._vram[addr & 0x1FFF];

                    // External RAM
                case 0xA000:
                case 0xB000:
                    return memory._eram[addr & 0x1FFF];

                    // Work RAM and echo
                case 0xC000:
                case 0xD000:
                case 0xE000:
                    return memory._wram[addr & 0x1FFF];

                    // Everything else
                case 0xF000:
                    switch (addr & 0x0F00) {
                        // Echo RAM
                        case 0x000:
                        case 0x100:
                        case 0x200:
                        case 0x300:
                        case 0x400:
                        case 0x500:
                        case 0x600:
                        case 0x700:
                        case 0x800:
                        case 0x900:
                        case 0xA00:
                        case 0xB00:
                        case 0xC00:
                        case 0xD00:
                            return memory._wram[addr & 0x1FFF];

                            // OAM
                        case 0xE00:
                            return ((addr & 0xFF) < 0xA0) ? gpu._oam[addr & 0xFF] : 0;


                            // Zeropage RAM, I/O
                        case 0xF00:
                            if (addr > 0xFF7F) {
                                return memory._zram[addr & 0x7F];
                            } else switch (addr & 0xF0) {
                                case 0x40:
                                case 0x50:
                                case 0x60:
                                case 0x70:
                                    return gpu.read8(addr);
                            }
                    }
        }
    },

    read16: function (addr) {
        return memory.read8(addr) + (memory.read8(addr + 1) << 8);
    },

    write8: function (addr, val) {
        switch (addr & 0xF000) {
            // ROM bank 0
            case 0x0000:
                if (memory._inbios && addr < 0x0100) return;
                // fall through
            case 0x1000:
            case 0x2000:
            case 0x3000:
                break;

                // ROM bank 1
            case 0x4000:
            case 0x5000:
            case 0x6000:
            case 0x7000:
                break;

                // VRAM
            case 0x8000:
            case 0x9000:
                gpu._vram[addr & 0x1FFF] = val;
                gpu.updateTile(addr & 0x1FFF, val);
                break;

                // External RAM
            case 0xA000:
            case 0xB000:
                memory._eram[addr & 0x1FFF] = val;
                break;

                // Work RAM and echo
            case 0xC000:
            case 0xD000:
            case 0xE000:
                memory._wram[addr & 0x1FFF] = val;
                break;

                // Everything else
            case 0xF000:
                switch (addr & 0x0F00) {
                    // Echo RAM
                    case 0x000:
                    case 0x100:
                    case 0x200:
                    case 0x300:
                    case 0x400:
                    case 0x500:
                    case 0x600:
                    case 0x700:
                    case 0x800:
                    case 0x900:
                    case 0xA00:
                    case 0xB00:
                    case 0xC00:
                    case 0xD00:
                        memory._wram[addr & 0x1FFF] = val;
                        break;

                        // OAM
                    case 0xE00:
                        if ((addr & 0xFF) < 0xA0) gpu._oam[addr & 0xFF] = val;
                        //gpu.updateoam(addr, val);
                        break;

                        // Zeropage RAM, I/O
                    case 0xF00:
                        if (addr > 0xFF7F) {
                            memory._zram[addr & 0x7F] = val;
                        } else switch (addr & 0xF0) {
                            case 0x40:
                            case 0x50:
                            case 0x60:
                            case 0x70:
                                gpu.write8(addr, val);
                                break;
                        }
                }
                break;
        }
    },

    write16: function (addr, val) {
        memory.write8(addr, val & 255);
        memory.write8(addr + 1, val >> 8);
    }
};

document.getElementById("initbutton").onclick = () => {
    memory.initBios();
}

let fileread = new FileReader;
let blue = document.getElementById("file").files[0];
let buffer = blue.arrayBuffer().then((res) => {
    memory._rom = new Uint8Array(res);
    console.log(memory._rom);
})