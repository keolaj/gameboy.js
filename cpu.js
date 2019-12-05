const cpu = {
    execute: true,
    _clock: {
        m: 0,
        t: 0
    },
    _registers: {
        a: 0, // 8 bit registers   
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,

        pc: 0, // 16 bit registers
        sp: 0,

        m: 0,
        t: 0
    },
    _opImplementation: {
        // load from register to register
        LDrrb_b: () => {
            cpu._registers.b = cpu._registers.b;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrb_c: () => {
            cpu._registers.b = cpu._registers.c;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrb_d: () => {
            cpu._registers.b = cpu._registers.d;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrb_e: () => {
            cpu._registers.b = cpu._registers.e;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrb_h: () => {
            cpu._registers.b = cpu._registers.h;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrb_l: () => {
            cpu._registers.b = cpu._registers.l;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrb_a: () => {
            cpu._registers.b = cpu._registers.a;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        LDrrc_b: () => {
            cpu._registers.c = cpu._registsers.b;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrc_c: () => {
            //cpu.registers.c = cpu._registers.c;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrc_d: () => {
            cpu.registers.c = cpu._registers.d;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrc_e: () => {
            cpu._registers.c = cpu._registers.e;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        LDrn_a : () => {
            cpu._registers.a = cpu.registers.pc;
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_b : () => {
            cpu._registers.b = cpu.registers.pc;
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_c : () => {
            cpu._registers.c = cpu.registers.pc;
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_d : () => {
            cpu._registers.d = cpu.registers.pc;
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_e : () => {
            cpu._registers.e = cpu.registers.pc;
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_h : () => {
            cpu._registers.h = cpu.registers.pc;
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_l : () => {
            cpu._registers.l = cpu.registers.pc;
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },

        // 16 bit load
        LDhl_nn: () => {
            cpu._registers.h = memory.read8(cpu._registers.pc);
            cpu._registers.l = memory.read8(cpu._registers.pc + 1);
            cpu._registers.pc += 2;
            cpu._registers.m = 3;
        },
        LDsp_nn: () => {
            cpu._registers.sp = memory.read16(cpu._registers.pc);
            cpu._registers.pc += 2;
            cpu._registers.m = 3;
        },

        LDhl_aDecHl: () => {
            memory.write8(((cpu._registers.h << 8) + cpu._registers.l), cpu._registers.a);
            cpu._registers.l = (cpu._registers.l - 1) & 255;
            if (cpu._registers.l == 255) {
                cpu._registers.h = (cpu._registers.h - 1) & 255;
            }
            cpu._registers.m = 2;
        },

        LDHn_a : () => {
            memory.write8(cpu._registers.pc + 0xFF00, cpu._registers.a);
            cpu._registers.pc++;
            cpu._registers.m = 3;
            cpu._registers.t = 12;
        },

        // jumps
        JRNZn: () => {
            let jumpOffset = memory.read8(cpu._registers.pc); // store jump offset
            if (jumpOffset > 127) {
                jumpOffset = -((~jumpOffset + 1) & 255); // sign jump offset byte
            }
            cpu._registers.pc++;
            cpu._registers.m = 2;
            if ((cpu._registers.f & 0x80) == 0) {
                cpu._registers.pc += jumpOffset; // set program counter to perform jump 
                cpu._registers.m++; // imcrement clock because of jump
            }
        },

        // add value from register to register A
        ADDra_e: () => {
            cpu._registers.a += cpu._registers.e;
            cpu._helpers.setFlags(cpu._registers.a);
            cpu._registers.a &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        // bitwise operations
        XORa: () => {
            cpu._registers.a ^= cpu._registers.a;
            cpu._helpers.setFlags(cpu._registers.a);
            cpu._registers.a &= 255;
            cpu._registers.m = 1;
        },

        // test bits
        BIT7b: () => {
            cpu._registers.f &= 0x1F;
            cpu._registers.f |= 0x20;
            cpu._registers.f = (cpu._registers.b & 0x80) ? 0 : 0x80;
            cpu._registers.m = 2;
        },
        BIT7c: () => {
            cpu._registers.f &= 0x1F;
            cpu._registers.f |= 0x20;
            cpu._registers.f = (cpu._registers.c & 0x80) ? 0 : 0x80;
            cpu._registers.m = 2;
        },
        BIT7d: () => {
            cpu._registers.f &= 0x1F;
            cpu._registers.f |= 0x20;
            cpu._registers.f = (cpu._registers.d & 0x80) ? 0 : 0x80;
            cpu._registers.m = 2;
        },
        BIT7e: () => {
            cpu._registers.f &= 0x1F;
            cpu._registers.f |= 0x20;
            cpu._registers.f = (cpu._registers.e & 0x80) ? 0 : 0x80;
            cpu._registers.m = 2;
        },
        BIT7h: () => {
            cpu._registers.f &= 0x1F;
            cpu._registers.f |= 0x20;
            cpu._registers.f = (cpu._registers.h & 0x80) ? 0 : 0x80;
            cpu._registers.m = 2;
        },
        BIT7l: () => {
            cpu._registers.f &= 0x1F;
            cpu._registers.f |= 0x20;
            cpu._registers.f = (cpu._registers.l & 0x80) ? 0 : 0x80;
            cpu._registers.m = 2;
        },
        BIT7a: () => {
            cpu._registers.f &= 0x1F;
            cpu._registers.f |= 0x20;
            cpu._registers.f = (cpu._registers.a & 0x80) ? 0 : 0x80;
            cpu._registers.m = 2;
        },

        // no operation
        NOP: () => {
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        // not implemented
        notImplemented: () => {
            //console.log("not implemented");
        }
    },
    _helpers: {
        setFlags: (register, isSubOperation) => {
            cpu._registers.f = 0;
            if (!(register & 255)) { // check for if zero
                cpu._registers.f |= 0x80;
                // } else if (register > 15) {
                //     cpu._registers.f |= 0x20; //check for lower bit carry
            }
            if (register > 15) {
                // check for half carry
                cpu._registers.f |= 0x20;
            }
            if (register > 255) {
                cpu._registers.f |= 0x10 // check for carry
            }
            cpu._registers.f |= isSubOperation ? 0x40 : 0; // if substitution operation set substitution flag
        },
        useCBMap: () => {
            let op = memory.read8(cpu._registers.pc);
            cpu._registers.pc++;
            cpu._registers.pc &= 65535;
            if (cpu._cbmap[op]) {
                cpu._cbmap[op]();
            } else {
                //console.log("cb instruction not implemented: " + op.toString(16));
            }
        }
    },
    _map: [],
    _cbmap: [],

    dispatcher: () => {
        memory.initBios();

        while (cpu.execute) {
            let op = memory.read8(cpu._registers.pc++);
            if (cpu._map[op]) {
                cpu._map[op]();
            } else {
                console.log("unimplemented instruction: 0x" + op.toString(16));
                console.log(memory._mem);
                cpu.execute = false;
            }
            cpu._registers.pc & 65535;
            cpu._clock.m += cpu._registers.m;
        }
        // cpu.cpuInterval = setInterval(() => {
        //     let op = cpu._map[memory.read8(cpu._registers.pc++)];
        //     //console.log(memory.read8(cpu._registers.pc).toString(16));
        //     op();
        //     cpu._registers.pc & 65535;
        //     cpu._clock.m += cpu._registers.m;
        // }, 10)
    }
}
cpu._map = [
    cpu._opImplementation.NOP,
];

cpu._map[0x31] = cpu._opImplementation.LDsp_nn;
cpu._map[0xAF] = cpu._opImplementation.XORa;
cpu._map[0x21] = cpu._opImplementation.LDhl_nn;
cpu._map[0x32] = cpu._opImplementation.LDhl_aDecHl;
cpu._map[0xcb] = cpu._helpers.useCBMap;
cpu._map[0x20] = cpu._opImplementation.JRNZn;
cpu._map[0xE] = cpu._opImplementation.LDHn_a;

cpu._cbmap[0x7c] = cpu._opImplementation.BIT7h;

document.getElementById("stepbutton").onclick = () => {
    cpu.execute = false;
    console.log("executing opcode: 0x" + memory.read8(cpu._registers.pc).toString(16));
    let op = memory.read8(cpu._registers.pc++);
    cpu._map[op]();
    cpu._registers.pc & 65535;
    cpu._clock.m += cpu._registers.m;
}

document.getElementById("resetbutton").onclick = () => {
    cpu.execute = false;
    cpu._registers = {
        a: 0, // 8 bit registers   
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,

        pc: 0, // 16 bit registers
        sp: 0,

        m: 0,
        t: 0
    }
    memory._mem = [];
}

document.getElementById("runbutton").onclick = cpu.dispatcher;