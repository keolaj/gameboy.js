const get16 = (reg1, reg2) => {
    let higher = reg1;
    let lower = reg2;
    higher << 8;
    reg2 &= 255;
    return higher + lower;
}

const cpu = {
    execute: true,
    cpuInterval: 0,
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
        LDrrc_a: () => {
            cpu._registers.c = cpu._registers.a;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrc_b: () => {
            cpu._registers.c = cpu._registers.b;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrc_c: () => {
            //cpu.registers.c = cpu._registers.c;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrc_d: () => {
            cpu._registers.c = cpu._registers.d;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDrrc_e: () => {
            cpu._registers.c = cpu._registers.e;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },
        LDMEMa_de: () => {
            cpu._registers.a = memory.read8(get16(cpu._registers.d, cpu._registers.e));
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },

        LDrn_a : () => {
            cpu._registers.a = cpu._registers.pc;
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_b : () => {
            cpu._registers.b = cpu._registers.pc;
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_c : () => {
            cpu._registers.c = cpu._registers.pc;
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_d : () => {
            cpu._registers.d = cpu._registers.pc;
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_e : () => {
            cpu._registers.e = cpu._registers.pc;
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_h : () => {
            cpu._registers.h = cpu._registers.pc;
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        LDrn_l : () => {
            cpu._registers.l = cpu._registers.pc;
            cpu._registers.pc++;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },

        LDHa_n: () => {
            cpu._registers.a = memory.read8(cpu._registers.pc + 0xFF00);
            cpu._registers.pc++;
            cpu._registers.m = 3;
            cpu._registers.t = 12;
        },

        LDHn_a : () => {
            memory.write8(memory.read8(cpu._registers.pc + 0xFF00), cpu._registers.a);
            cpu._registers.pc++;
            cpu._registers.m = 3;
            cpu._registers.t = 12;
        },

        // 16 bit load
        LDhl_nn: () => {
            cpu._registers.h = memory.read8(cpu._registers.pc);
            cpu._registers.l = memory.read8(cpu._registers.pc + 1);
            cpu._registers.pc += 2;
            cpu._registers.m = 3;
        },
        LDde_nn: () => {
            cpu._registers.d = memory.read8(cpu._registers.pc);
            cpu._registers.e = memory.read8(cpu._registers.pc + 1);
            cpu._registers.pc += 2;
            cpu._registers.m = 3;
        },
        LDsp_nn: () => {
            cpu._registers.sp = memory.read16(cpu._registers.pc);
            cpu._registers.pc += 2;
            cpu._registers.m = 3;
        },
        LDMEMhl_a : () => {
            memory.write8(get16(cpu._registers.h, cpu._registers.l), cpu._registers.a);
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },

        LDhl_aDecHl: () => {
            memory.write8(((cpu._registers.h << 8) + cpu._registers.l), cpu._registers.a);
            cpu._registers.l = (cpu._registers.l - 1) & 255;
            if (cpu._registers.l == 255) {
                cpu._registers.h = (cpu._registers.h - 1) & 255;
            }
            cpu._registers.m = 2;
        },
        LDhl_aIncHl: () => {
            memory.write8((cpu._registers.h << 8) + cpu._registers.l, cpu._registers.a);
            if (cpu._registers.l == 255) {
                cpu._registers.h++;
                cpu._registers.l = 0;
                
            } else {
                cpu._registers.l++;
            }
            cpu._registers.h &= 255;
            cpu._registers.l &= 255;
            cpu._registers.m = 2;
        },

        LDHcandff00_a : () => {
            memory.write8(cpu._registers.c + 0xFF00, cpu._registers.a);
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },

        INChl: () => {
            if (cpu._registers.l == 255) {
                cpu._registers.l = 0;
                cpu._registers.h++;
            } else {
                cpu._registers.l++;
            }
            cpu._registers.h &= 255;
            cpu._registers.l &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
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

        // calls
        CALLnn: () => {
            cpu._registers.sp -=2;
            memory.write16(cpu._registers.sp, cpu._registers.pc + 2);
            cpu._registers.pc = memory.read16(cpu._registers.pc);
            cpu._registers.m = 5;
            cpu._registers.t = 20;
        },
        CALLNZnn: () => {
            cpu._registers.m = 3;
            cpu._registers.t = 12;
            if (cpu._registers.f & 0x80 == 0) {
                cpu._registers.sp -= 2;
                memory.write16(cpu._registers.sp, cpu._registers.pc + 2);
                cpu._registers.m = 5;
                cpu._registers.t = 20;
            }
        },

        // stack
        PUSHbc: () => {
            cpu._registers.sp--;
            memory.write8(cpu._registers.sp, cpu._registers.b);
            cpu._registers.sp--;
            memory.write8(cpu._registers.sp, cpu._registers.c);
            cpu._registers.m = 3;
            cpu._registers.t = 12;
        },

        POPbc: () => {
            cpu._registers.c = memory.read8(cpu._registers.sp);
            cpu._registers.sp++;
            cpu._registers.b = memory.read8(cpu._registers.sp);
            cpu._registers.sp++;
            cpu._registers.m = 3;
            cpu._registers.t = 12;
        },

        // add value from register to register A
        ADDra_e: () => {
            cpu._registers.a += cpu._registers.e;
            cpu._helpers.setFlags(cpu._registers.a);
            cpu._registers.a &= 255;
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        DECr_b: () => {
            cpu._registers.b--;
            cpu._helpers.setFlags(cpu._registers.b);
            cpu._registers.b &= 255;
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

        // Returns
        RET: () => {
            cpu._registers.pc = memory.read16(cpu._registers.sp);
            cpu._registers.sp += 2;
            cpu._registers.m = 3;
            cpu._registers.t = 12;
        },

        RETNZ: () => {
            cpu._registers.m = 1;
            cpu._registers.t = 4;
            if (cpu._registers.f & 0x80 == 0) {
                cpu._registers.pc = memory.read16(cpu._registers.sp);
                cpu._registers.sp += 2;
                cpu._registers.m = 2;
                cpu._registers.t = 8;
            }
        },

        // rotates
        RLr_a: () => {
            let i = cpu._registers.f & 0x10 ? 1 : 0;
            let carry = cpu._registers.a & 0x80 ? 0x10 : 0;
            cpu._registers.a << 1;
            cpu._registers.a += i;
            cpu._helpers.setFlags(cpu._registers.a);
            cpu._registers.f &= 0xEF + carry;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },
        RLr_c: () => {
            let i = cpu._registers.f & 0x10 ? 1 : 0;
            let carry = cpu._registers.c & 0x80 ? 0x10 : 0;
            cpu._registers.c << 1;
            cpu._registers.c += i;
            cpu._helpers.setFlags(cpu._registers.c);
            cpu._registers.f &= 0xEF + carry;
            cpu._registers.m = 2;
            cpu._registers.t = 8;
        },

        // no operation
        NOP: () => {
            cpu._registers.m = 1;
            cpu._registers.t = 4;
        },

        // not implemented
        notImplemented: () => {
            console.log("not implemented");
            cpu.execute = false;
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
                console.log("cb instruction not implemented: 0x" + op.toString(16));
                cpu.execute = false;
            }
        }
    },
    _map: [],
    _cbmap: [],

    dispatcher: () => {
        while (cpu.execute) {
            let op = memory.read8(cpu._registers.pc++);
            if (cpu._map[op]) {
                cpu._map[op]();
            } else {
                console.log("unimplemented instruction: 0x" + op.toString(16));
                console.log(memory._bios);
                console.log(cpu._registers);
                cpu.execute = false;
            }
            cpu._registers.pc & 65535;
            cpu._clock.m += cpu._registers.m;
            if (cpu._registers.b < 0) {
                console.log("weird register from instruction: 0x" + op.toString(16));
                cpu.execute = false;
            }
            gpu.step();
        }
        // cpu.cpuInterval = setInterval(() => {
        //     let op = memory.read8(cpu._registers.pc++);
        //     console.log(memory.read8(cpu._registers.pc).toString(16));
        //     if(cpu._map[op]) {
        //         cpu._map[op]();
        //     } else {
        //         console.log("unimplemented instruction: 0x" + op.toString(16));
        //         console.log(memory._mem);
        //         console.log(cpu._registers);
        //         clearInterval(cpu.cpuInterval);
        //     }
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
cpu._map[0xE] = cpu._opImplementation.LDrn_c;
cpu._map[0xF] = cpu._opImplementation.LDHa_n;
cpu._map[0x3E] = cpu._opImplementation.LDrn_a;
cpu._map[0xE2] = cpu._opImplementation.LDHcandff00_a;
cpu._map[0xC] = cpu._opImplementation.RETNZ;
cpu._map[0x77] = cpu._opImplementation.LDMEMhl_a;
cpu._map[0xE0] = cpu._opImplementation.LDHn_a;
cpu._map[0x11] = cpu._opImplementation.LDde_nn;
cpu._map[0x1A] = cpu._opImplementation.LDMEMa_de;
cpu._map[0xCD] = cpu._opImplementation.CALLnn;
cpu._map[0x4f] = cpu._opImplementation.LDrrc_a;
cpu._map[0x6] = cpu._opImplementation.LDrn_c;
cpu._map[0xC4] = cpu._opImplementation.CALLNZnn;
cpu._map[0xC5] = cpu._opImplementation.PUSHbc;
cpu._map[0x17] = cpu._opImplementation.RLr_a;
cpu._map[0xC1] = cpu._opImplementation.POPbc;
cpu._map[0x5] = cpu._opImplementation.DECr_b;
cpu._map[0x22] = cpu._opImplementation.LDhl_aIncHl;
cpu._map[0x23] = cpu._opImplementation.INChl;
cpu._map[0xC9] = cpu._opImplementation.RET;


cpu._cbmap[0x7c] = cpu._opImplementation.BIT7h;
cpu._cbmap[0x11] = cpu._opImplementation.RLr_c;

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
    clearInterval(cpu.cpuInterval);
    console.log(cpu._registers);
    console.log(memory._mem);
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